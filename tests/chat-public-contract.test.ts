import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  APIConnectionTimeoutError,
  APIError,
} from "@anthropic-ai/sdk";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import {
  AIServiceError,
  applyChatOutputPolicy,
  createChatCompletion,
  mapProviderError,
} from "../src/lib/ai";
import { POST as chatPost } from "../src/app/api/chat/route";
import {
  canonicalProviderMessages,
  shouldOfferLeadCapture,
} from "../src/features/chat/server/chat-policy";
import { parseChatRequest } from "../src/app/api/chat/route-helpers";
import { parseChatLeadRequest } from "../src/app/api/chat/lead/route-helpers";
import { parseRecommendationRequest } from "../src/app/api/recommend/route-helpers";
import { parsePersonalisationRequest } from "../src/app/api/personalisation/route-helpers";
import { safeApiErrorMessage } from "../src/lib/chat-client-contract";

const SESSION_ID = "11111111-1111-4111-8111-111111111111";
const MESSAGE_ID = "22222222-2222-4222-8222-222222222222";

afterEach(() => vi.unstubAllEnvs());

describe("original chatbot request-order regression", () => {
  it("never forwards the decorative assistant greeting as the first provider turn", () => {
    const providerMessages = canonicalProviderMessages(
      [
        { role: "assistant", content: "Decorative greeting" },
        { role: "user", content: "Earlier question" },
        { role: "assistant", content: "Earlier answer" },
      ],
      "Current question",
    );

    expect(providerMessages).toEqual([
      { role: "user", content: "Earlier question" },
      { role: "assistant", content: "Earlier answer" },
      { role: "user", content: "Current question" },
    ]);
    expect(providerMessages[0]?.role).toBe("user");
  });

  it("defensively rejects any server-constructed assistant-first request before configuration/network", async () => {
    await expect(
      createChatCompletion({
        system: "test",
        messages: [{ role: "assistant", content: "invalid first turn" }],
      }),
    ).rejects.toMatchObject({
      code: "AI_PROVIDER_REQUEST_REJECTED",
      retryable: false,
    });
  });

  it("does not move deterministic lead capture one turn early on an idempotent retry", () => {
    const twoStoredTurns = [
      { role: "user" as const, content: "one" },
      { role: "assistant" as const, content: "answer one" },
      { role: "user" as const, content: "two" },
      { role: "assistant" as const, content: "answer two" },
    ];
    expect(shouldOfferLeadCapture(twoStoredTurns, "two", true)).toBe(false);
    expect(shouldOfferLeadCapture(twoStoredTurns, "three", false)).toBe(true);
  });

  it("does not re-offer capture after the conversation already owns a durable lead", () => {
    const messages = [
      { role: "user" as const, content: "Please contact me" },
      { role: "assistant" as const, content: "I can show the request form." },
    ];
    expect(shouldOfferLeadCapture(messages, "Please contact me", true, true)).toBe(false);
  });
});

describe("public runtime schemas", () => {
  it("keeps App Router modules limited to supported route exports", async () => {
    const [chat, chatLead, recommendation, personalisation] = await Promise.all([
      import("../src/app/api/chat/route"),
      import("../src/app/api/chat/lead/route"),
      import("../src/app/api/recommend/route"),
      import("../src/app/api/personalisation/route"),
    ]);

    for (const route of [chat, chatLead, recommendation, personalisation]) {
      expect(Object.keys(route)).toEqual(["POST"]);
    }
  });

  it("requires chat UUID idempotency and rejects fabricated client history", () => {
    expect(
      parseChatRequest({ message: "hello", sessionId: SESSION_ID, messageId: MESSAGE_ID }),
    ).toEqual({ message: "hello", sessionId: SESSION_ID, messageId: MESSAGE_ID });
    expect(() =>
      parseChatRequest({
        message: "hello",
        sessionId: SESSION_ID,
        messageId: MESSAGE_ID,
        history: [{ role: "assistant", content: "fabricated" }],
      }),
    ).toThrow();
  });

  it("keeps HTTP ownership in the route and orchestration in server-only feature modules", () => {
    const route = readFileSync(
      join(process.cwd(), "src/app/api/chat/route.ts"),
      "utf8",
    );
    const service = readFileSync(
      join(process.cwd(), "src/features/chat/server/chat-service.ts"),
      "utf8",
    );
    const repository = readFileSync(
      join(
        process.cwd(),
        "src/features/chat/server/conversation-repository.ts",
      ),
      "utf8",
    );

    expect(route).toContain("@/features/chat/server/chat-service");
    expect(route).not.toContain("@/lib/prisma");
    expect(route).not.toContain("createChatCompletion");
    expect(route).not.toContain("persistConversationExchange");
    expect(service).toContain('import "server-only"');
    expect(repository).toContain('import "server-only"');
    expect(service).not.toContain("@/app/");
    expect(repository).not.toContain("@/app/");
  });

  it("maps missing database configuration before any database/provider call", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("RATE_LIMIT_IDENTITY_SECRET", "");
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("DIRECT_URL", "");
    const response = await chatPost(
      new Request("https://example.test/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "203.0.113.44",
        },
        body: JSON.stringify({
          message: "hello",
          sessionId: SESSION_ID,
          messageId: MESSAGE_ID,
        }),
      }) as never,
    );
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "CHAT_DATABASE_NOT_CONFIGURED", retryable: false },
    });
  });

  it("bounds chat lead fields and recommendation/personalisation enums", () => {
    expect(() =>
      parseChatLeadRequest({
        sessionId: SESSION_ID,
        idempotencyKey: MESSAGE_ID,
        name: "A".repeat(101),
        email: "person@example.com",
      }),
    ).toThrow();
    expect(() =>
      parseRecommendationRequest({
        currentSlug: "ai-knowledge-copilot",
        segment: "injected segment",
      }),
    ).toThrow();
    expect(() =>
      parsePersonalisationRequest({
        eventId: MESSAGE_ID,
        segment: "general",
        source: "direct",
        intent: "low",
        path: "https://attacker.example/path",
      }),
    ).toThrow();
  });
});

describe("typed provider failure classification", () => {
  it.each([
    [401, "AI_PROVIDER_AUTH", false],
    [403, "AI_PROVIDER_AUTH", false],
    [404, "AI_PROVIDER_MODEL_UNAVAILABLE", false],
    [429, "AI_PROVIDER_QUOTA", true],
    [500, "AI_PROVIDER_UNAVAILABLE", true],
  ])("maps provider HTTP %s without exposing provider detail", (status, code, retryable) => {
    const providerError = APIError.generate(
      status,
      { type: "error", error: { type: "test_error", message: "sensitive provider detail" } },
      undefined,
      new Headers(),
    );
    const mapped = mapProviderError(providerError);
    expect(mapped).toMatchObject({ code, retryable });
    expect(mapped.message).not.toContain("sensitive provider detail");
  });

  it("maps explicit deadlines to retryable timeout", () => {
    expect(mapProviderError(new APIConnectionTimeoutError())).toMatchObject({
      code: "AI_PROVIDER_TIMEOUT",
      status: 504,
      retryable: true,
    });
    expect(mapProviderError(new AIServiceError({
      code: "AI_PROVIDER_INVALID_RESPONSE",
      status: 502,
      retryable: true,
      diagnostic: "bounded test diagnostic",
    }))).toMatchObject({ code: "AI_PROVIDER_INVALID_RESPONSE" });
  });
});

describe("deterministic provider-output policy", () => {
  it("replaces booking, receipt, and response-time claims", () => {
    for (const unsafe of [
      "Your meeting is booked for tomorrow.",
      "We've received your details and will be in touch.",
      "Perfect — I've noted that down.",
      "I have your details.",
      "That's noted.",
      "Our team will contact you within 24 hours.",
      "I’ve booked you in.",
      "Your meeting is all set.",
      "We'll reach out.",
      "You'll hear from us in 24 hours.",
    ]) {
      const result = applyChatOutputPolicy(unsafe);
      expect(result.replaced).toBe(true);
      expect(result.text).not.toBe(unsafe);
      expect(result.text).toContain("does not book a meeting");
    }
  });

  it("leaves ordinary bounded service guidance unchanged", () => {
    const safe = "We build analytics dashboards and AI copilots for business teams.";
    expect(applyChatOutputPolicy(safe)).toEqual({ text: safe, replaced: false });
  });
});

describe("truthful failure-preserving UI contract", () => {
  const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

  it("checks durable chat-lead success before hiding the form or confirming receipt", () => {
    const widget = source("src/components/ui/ChatWidget.tsx");
    const capture = source("src/components/ui/ChatLeadCapture.tsx");
    expect(widget).toContain("if (!response.ok || data.success !== true)");
    expect(widget.indexOf("setShowLeadCapture(false)")).toBeGreaterThan(
      widget.indexOf("if (!response.ok || data.success !== true)"),
    );
    expect(capture).toContain("const result = await onSubmit");
    expect(capture).toContain("setSubmitError");
    expect(widget).not.toContain("within 24 hours");
    expect(capture).not.toContain("Book a Call");
    const conversationDetail = source("src/app/admin/conversations/[id]/page.tsx");
    expect(conversationDetail).not.toContain("This visitor booked a call");
    expect(conversationDetail).toContain("Legacy follow-up flag");
  });

  it("never renders native network or malformed-JSON exception detail", () => {
    const widget = source("src/components/ui/ChatWidget.tsx");
    const fallback = "Chat is temporarily unavailable. Please try again.";

    expect(safeApiErrorMessage(undefined, fallback)).toBe(fallback);
    expect(safeApiErrorMessage({ error: { message: "" } }, fallback)).toBe(fallback);
    expect(safeApiErrorMessage({ error: { message: "x".repeat(241) } }, fallback)).toBe(fallback);
    expect(
      safeApiErrorMessage({ error: { message: "Safe service message." } }, fallback),
    ).toBe("Safe service message.");
    expect(widget).not.toContain("error.message");
    expect(widget).not.toContain("Failed to fetch");
    expect(widget).not.toContain("Unexpected end of JSON input");
  });

  it("preserves contact values on failure and labels the flow as a request", () => {
    const contact = source("src/features/contact/components/ContactForm.tsx");
    const action = source("src/features/contact/server/action.ts");
    expect(contact).toContain("defaultValue={values.email");
    expect(contact).toContain("defaultValue={values.bottleneck");
    expect(contact).toContain("Request a Strategy Call");
    expect(contact).not.toContain("Book a Strategy Call");
    expect(action).toContain("values,");
    expect(action).not.toContain('honeypot) {\n    return {\n      status: "success"');
  });
});

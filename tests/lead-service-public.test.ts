import { readFileSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  LeadServiceError,
  createLead,
  validateContactFormEnvelope,
} from "../src/lib/lead-service";
import { submitContactForm } from "../src/app/contact/actions";
import { initialContactFormState } from "../src/app/contact/form-state";

const IDEMPOTENCY_KEY = "11111111-1111-4111-8111-111111111111";
const TRACE_ID = "22222222-2222-4222-8222-222222222222";

function contactInput() {
  return {
    source: "CONTACT" as const,
    idempotencyKey: IDEMPOTENCY_KEY,
    traceId: TRACE_ID,
    fullName: " Ada  Lovelace ",
    email: " ADA@EXAMPLE.COM ",
    company: "Example",
    phone: "+44 1234",
    need: "AI Copilots & LLMs",
    bottleneck: "Manual research",
    preferredDate: "2026-08-20",
    preferredTime: "10:30",
    notes: "Please email",
  };
}

function fakeDatabase() {
  let stored:
    | {
        id: string;
        idempotencyKey: string;
        conversationId: string | null;
        requestFingerprint: string;
        source: string;
        fullName: string;
        email: string;
        notifications: Array<{ status: string }>;
      }
    | null = null;
  const leadFindUnique = vi.fn(
    async ({ where }: { where: { idempotencyKey?: string; conversationId?: string } }) => {
      if (!stored) return null;
      if (where.idempotencyKey && where.idempotencyKey !== stored.idempotencyKey) return null;
      if (where.conversationId && where.conversationId !== stored.conversationId) return null;
      return stored;
    },
  );
  type LeadCreateInput = {
    data: Record<string, unknown> & {
      requestFingerprint: unknown;
      notifications: { create: { status: unknown } };
    };
  };
  type ConversationUpdateInput = { data: Record<string, unknown> };
  const leadCreate = vi.fn(async ({ data }: LeadCreateInput) => {
    stored = {
      id: "lead_1",
      idempotencyKey: String(data.idempotencyKey),
      conversationId:
        typeof data.conversationId === "string" ? data.conversationId : null,
      requestFingerprint: String(data.requestFingerprint),
      source: String(data.source),
      fullName: String(data.fullName),
      email: String(data.email),
      notifications: [{ status: String(data.notifications.create.status) }],
    };
    return { id: "lead_1" };
  });
  const conversationUpdate = vi.fn(async (input: ConversationUpdateInput) => {
    void input;
    return { id: "conversation_1" };
  });
  const notificationUpdate = vi.fn(async () => ({ id: "notification_1" }));
  const transaction = vi.fn(async (callback: (transaction: unknown) => unknown) =>
    callback({
      lead: { create: leadCreate },
      conversation: { update: conversationUpdate },
    }),
  );

  return {
    db: {
      lead: { findUnique: leadFindUnique },
      leadNotification: { update: notificationUpdate },
      $transaction: transaction,
    },
    leadFindUnique,
    leadCreate,
    conversationUpdate,
    notificationUpdate,
    transaction,
  };
}

describe("contact envelope protection", () => {
  it("has a raw Server Action request ceiling before FormData parsing", () => {
    const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
    expect(config).toContain('bodySizeLimit: "32kb"');
  });

  it("rejects unknown, duplicate, file, and actual decoded UTF-8 excess", () => {
    const unknown = new FormData();
    unknown.set("unexpected", "value");
    expect(validateContactFormEnvelope(unknown)).toEqual({
      valid: false,
      reason: "unsupported",
    });

    const duplicate = new FormData();
    duplicate.append("email", "one@example.com");
    duplicate.append("email", "two@example.com");
    expect(validateContactFormEnvelope(duplicate)).toEqual({
      valid: false,
      reason: "unsupported",
    });

    const file = new FormData();
    file.append("notes", new Blob(["data"]), "note.txt");
    expect(validateContactFormEnvelope(file)).toEqual({
      valid: false,
      reason: "unsupported",
    });

    const oversized = new FormData();
    oversized.set("notes", "😀".repeat(4_100));
    expect(validateContactFormEnvelope(oversized)).toEqual({
      valid: false,
      reason: "oversized",
    });
  });

  it("byte-counts but permits framework-owned Server Action metadata", () => {
    const form = new FormData();
    form.set("$ACTION_ID_synthetic", "framework-metadata");
    form.set("email", "visitor@example.test");
    expect(validateContactFormEnvelope(form)).toEqual({ valid: true });
  });

  it("returns bounded submitted values on an envelope failure", async () => {
    const form = new FormData();
    form.set("email", "visitor@example.com");
    form.set("bottleneck", "Keep this visitor-authored text available");
    form.set("unexpected", "rejected");
    const state = await submitContactForm(initialContactFormState, form);
    expect(state).toMatchObject({
      status: "error",
      values: {
        email: "visitor@example.com",
        bottleneck: "Keep this visitor-authored text available",
      },
    });
    expect(state.values).not.toHaveProperty("website");
    expect(state.values).not.toHaveProperty("unexpected");
  });

  it("never reports durable success for a honeypot rejection", async () => {
    const form = new FormData();
    form.set("website", "bot-filled.example");
    form.set("email", "visitor@example.test");
    const state = await submitContactForm(initialContactFormState, form);
    expect(state).toMatchObject({
      status: "error",
      values: { email: "visitor@example.test" },
    });
  });
});

describe("shared durable lead service", () => {
  it("normalizes once and makes duplicate retries idempotent", async () => {
    const fake = fakeDatabase();
    const dependencies = {
      db: fake.db as never,
      webhook: { status: "disabled" as const },
      validateDatabase: () => undefined,
    };

    const first = await createLead(contactInput(), dependencies);
    const retry = await createLead(contactInput(), dependencies);

    expect(first).toMatchObject({ leadId: "lead_1", duplicate: false });
    expect(retry).toMatchObject({ leadId: "lead_1", duplicate: true });
    expect(fake.transaction).toHaveBeenCalledTimes(1);
    const createData = fake.leadCreate.mock.calls[0]?.[0].data;
    expect(createData).toMatchObject({
      source: "CONTACT",
      fullName: "Ada Lovelace",
      email: "ada@example.com",
    });
    expect(createData).not.toHaveProperty("meetingBooked");
  });

  it("preserves the conflict when one idempotency key is reused for different input", async () => {
    const fake = fakeDatabase();
    const dependencies = {
      db: fake.db as never,
      webhook: { status: "disabled" as const },
      validateDatabase: () => undefined,
    };

    await createLead(contactInput(), dependencies);
    await expect(
      createLead({ ...contactInput(), email: "different@example.com" }, dependencies),
    ).rejects.toMatchObject({ code: "LEAD_IDEMPOTENCY_CONFLICT", retryable: false });
    expect(fake.transaction).toHaveBeenCalledTimes(1);
  });

  it("persists the lead before recording notification failure", async () => {
    const fake = fakeDatabase();
    const fetchImpl = vi.fn(async () => new Response("unavailable", { status: 503 }));
    const receipt = await createLead(contactInput(), {
      db: fake.db as never,
      fetchImpl: fetchImpl as typeof fetch,
      webhook: { status: "configured", url: "https://hooks.example.test/leads" },
      validateDatabase: () => undefined,
    });

    expect(receipt).toMatchObject({ duplicate: false, notificationStatus: "FAILED" });
    expect(fake.leadCreate).toHaveBeenCalledTimes(1);
    expect(fake.notificationUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "FAILED" }) }),
    );
  });

  it.each([
    [Object.assign(new Error("synthetic network failure"), { name: "Error" }), "NETWORK"],
    [Object.assign(new Error("synthetic timeout"), { name: "AbortError" }), "TIMEOUT"],
  ])("records rejected notification delivery as %s", async (failure, expectedCode) => {
    const fake = fakeDatabase();
    const fetchImpl = vi.fn(async () => {
      throw failure;
    });

    const receipt = await createLead(contactInput(), {
      db: fake.db as never,
      fetchImpl: fetchImpl as typeof fetch,
      webhook: { status: "configured", url: "https://hooks.example.test/leads" },
      validateDatabase: () => undefined,
    });

    expect(receipt).toMatchObject({ duplicate: false, notificationStatus: "FAILED" });
    expect(fake.notificationUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "FAILED",
          lastErrorCode: expectedCode,
        }),
      }),
    );
  });

  it("distinguishes invalid notification configuration from intentional omission", async () => {
    const fake = fakeDatabase();
    await createLead(contactInput(), {
      db: fake.db as never,
      webhook: { status: "invalid" },
      validateDatabase: () => undefined,
    });
    expect(fake.leadCreate.mock.calls[0]?.[0].data.notifications.create).toMatchObject({
      status: "FAILED",
      lastErrorCode: "WEBHOOK_CONFIGURATION_INVALID",
    });
  });

  it("maps database preflight and receipt lookup outages deliberately", async () => {
    const fake = fakeDatabase();
    await expect(
      createLead(contactInput(), {
        db: fake.db as never,
        webhook: { status: "disabled" },
        validateDatabase: () => {
          throw new Error("missing");
        },
      }),
    ).rejects.toMatchObject({ code: "LEAD_PERSISTENCE_FAILED", retryable: false });

    fake.leadFindUnique.mockRejectedValueOnce(new Error("database unavailable") as never);
    await expect(
      createLead(contactInput(), {
        db: fake.db as never,
        webhook: { status: "disabled" },
        validateDatabase: () => undefined,
      }),
    ).rejects.toMatchObject({ code: "LEAD_PERSISTENCE_FAILED", retryable: true });
  });

  it("links chat leads without claiming a booking", async () => {
    const fake = fakeDatabase();
    await createLead(
      {
        source: "CHAT",
        idempotencyKey: IDEMPOTENCY_KEY,
        traceId: TRACE_ID,
        conversationId: "conversation_1",
        fullName: "Grace Hopper",
        email: "grace@example.com",
      },
      {
        db: fake.db as never,
        webhook: { status: "disabled" },
        validateDatabase: () => undefined,
      },
    );
    expect(fake.leadCreate.mock.calls[0]?.[0].data).toMatchObject({
      source: "CHAT",
      conversationId: "conversation_1",
    });
    const conversationData = fake.conversationUpdate.mock.calls[0]?.[0].data;
    expect(conversationData).toEqual({
      leadName: "Grace Hopper",
      leadEmail: "grace@example.com",
    });
    expect(conversationData).not.toHaveProperty("bookedCall");
  });

  it("returns the existing chat lead when repeat capture uses a new key", async () => {
    const fake = fakeDatabase();
    const dependencies = {
      db: fake.db as never,
      webhook: { status: "disabled" as const },
      validateDatabase: () => undefined,
    };
    const first = await createLead(
      {
        source: "CHAT",
        idempotencyKey: IDEMPOTENCY_KEY,
        traceId: TRACE_ID,
        conversationId: "conversation_1",
        fullName: "Grace Hopper",
        email: "grace@example.com",
      },
      dependencies,
    );
    const repeat = await createLead(
      {
        source: "CHAT",
        idempotencyKey: "33333333-3333-4333-8333-333333333333",
        traceId: "44444444-4444-4444-8444-444444444444",
        conversationId: "conversation_1",
        fullName: "Grace Hopper",
        email: "grace@example.com",
      },
      dependencies,
    );

    expect(first).toMatchObject({ leadId: "lead_1", duplicate: false });
    expect(repeat).toMatchObject({ leadId: "lead_1", duplicate: true });
    expect(fake.transaction).toHaveBeenCalledTimes(1);
    expect(fake.leadCreate).toHaveBeenCalledTimes(1);
    expect(fake.notificationUpdate).not.toHaveBeenCalled();
  });

  it("rejects a new chat key when the conversation already stores different details", async () => {
    const fake = fakeDatabase();
    const dependencies = {
      db: fake.db as never,
      webhook: { status: "disabled" as const },
      validateDatabase: () => undefined,
    };
    await createLead(
      {
        source: "CHAT",
        idempotencyKey: IDEMPOTENCY_KEY,
        traceId: TRACE_ID,
        conversationId: "conversation_1",
        fullName: "Grace Hopper",
        email: "grace@example.com",
      },
      dependencies,
    );

    await expect(
      createLead(
        {
          source: "CHAT",
          idempotencyKey: "33333333-3333-4333-8333-333333333333",
          traceId: "44444444-4444-4444-8444-444444444444",
          conversationId: "conversation_1",
          fullName: "Grace Hopper",
          email: "corrected@example.com",
        },
        dependencies,
      ),
    ).rejects.toMatchObject({ code: "LEAD_IDEMPOTENCY_CONFLICT", retryable: false });

    expect(fake.leadCreate).toHaveBeenCalledTimes(1);
    expect(fake.conversationUpdate).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid runtime fields before touching persistence", async () => {
    const fake = fakeDatabase();
    await expect(
      createLead(
        { ...contactInput(), email: "not-an-email" },
        {
          db: fake.db as never,
          webhook: { status: "disabled" },
          validateDatabase: () => undefined,
        },
      ),
    ).rejects.toBeInstanceOf(LeadServiceError);
    expect(fake.leadFindUnique).not.toHaveBeenCalled();
  });
});

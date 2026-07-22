import "server-only";

import Anthropic, {
  APIConnectionError,
  APIConnectionTimeoutError,
  APIUserAbortError,
  AuthenticationError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  PermissionDeniedError,
  RateLimitError,
  UnprocessableEntityError,
} from "@anthropic-ai/sdk";

import {
  EnvironmentConfigurationError,
  getAnthropicConfiguration,
} from "@/lib/env";

export const CHAT_PROVIDER_TIMEOUT_MS = 12_000;
export const RECOMMEND_PROVIDER_TIMEOUT_MS = 6_000;
const MAX_CONCURRENT_AI_REQUESTS = 4;

declare global {
  var __activeInsideDopamineAIRequests: number | undefined;
}

type ProviderMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AIServiceErrorCode =
  | "AI_MISSING_CONFIGURATION"
  | "AI_PROVIDER_AUTH"
  | "AI_PROVIDER_MODEL_UNAVAILABLE"
  | "AI_PROVIDER_QUOTA"
  | "AI_PROVIDER_TIMEOUT"
  | "AI_PROVIDER_UNAVAILABLE"
  | "AI_PROVIDER_REQUEST_REJECTED"
  | "AI_PROVIDER_INVALID_RESPONSE"
  | "AI_OVERLOADED"
  | "AI_INTERNAL_ERROR";

export class AIServiceError extends Error {
  readonly code: AIServiceErrorCode;
  readonly status: number;
  readonly retryable: boolean;
  readonly providerStatus?: number;

  constructor(options: {
    code: AIServiceErrorCode;
    status: number;
    retryable: boolean;
    diagnostic: string;
    providerStatus?: number;
  }) {
    super(options.diagnostic);
    this.name = "AIServiceError";
    this.code = options.code;
    this.status = options.status;
    this.retryable = options.retryable;
    this.providerStatus = options.providerStatus;
  }
}

export function mapProviderError(error: unknown): AIServiceError {
  if (error instanceof AIServiceError) return error;
  if (error instanceof EnvironmentConfigurationError) {
    return new AIServiceError({
      code: "AI_MISSING_CONFIGURATION",
      status: 503,
      retryable: false,
      diagnostic: "Anthropic configuration is missing or invalid.",
    });
  }
  if (error instanceof AuthenticationError || error instanceof PermissionDeniedError) {
    return new AIServiceError({
      code: "AI_PROVIDER_AUTH",
      status: 502,
      retryable: false,
      diagnostic: "The provider rejected server authentication or authorization.",
      providerStatus: error.status,
    });
  }
  if (error instanceof NotFoundError) {
    return new AIServiceError({
      code: "AI_PROVIDER_MODEL_UNAVAILABLE",
      status: 503,
      retryable: false,
      diagnostic: "The configured provider model is unavailable.",
      providerStatus: error.status,
    });
  }
  if (error instanceof RateLimitError) {
    return new AIServiceError({
      code: "AI_PROVIDER_QUOTA",
      status: 503,
      retryable: true,
      diagnostic: "The provider quota or rate limit was reached.",
      providerStatus: error.status,
    });
  }
  if (
    error instanceof APIConnectionTimeoutError ||
    error instanceof APIUserAbortError ||
    (error instanceof Error && error.name === "AbortError")
  ) {
    return new AIServiceError({
      code: "AI_PROVIDER_TIMEOUT",
      status: 504,
      retryable: true,
      diagnostic: "The provider request exceeded its deadline.",
    });
  }
  if (error instanceof APIConnectionError || error instanceof InternalServerError) {
    return new AIServiceError({
      code: "AI_PROVIDER_UNAVAILABLE",
      status: 502,
      retryable: true,
      diagnostic: "The provider network or service failed.",
      providerStatus: "status" in error ? error.status : undefined,
    });
  }
  if (error instanceof BadRequestError || error instanceof UnprocessableEntityError) {
    return new AIServiceError({
      code: "AI_PROVIDER_REQUEST_REJECTED",
      status: 502,
      retryable: false,
      diagnostic: "The provider rejected the server-constructed request.",
      providerStatus: error.status,
    });
  }

  return new AIServiceError({
    code: "AI_INTERNAL_ERROR",
    status: 500,
    retryable: true,
    diagnostic: "An unclassified AI integration failure occurred.",
  });
}

async function withAIRequest<T>(
  timeoutMs: number,
  execute: (client: Anthropic, model: string, signal: AbortSignal) => Promise<T>,
) {
  const active = global.__activeInsideDopamineAIRequests ?? 0;
  if (active >= MAX_CONCURRENT_AI_REQUESTS) {
    throw new AIServiceError({
      code: "AI_OVERLOADED",
      status: 503,
      retryable: true,
      diagnostic: "The bounded AI concurrency budget is full.",
    });
  }

  global.__activeInsideDopamineAIRequests = active + 1;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const { apiKey, model } = getAnthropicConfiguration();
    const client = new Anthropic({ apiKey, maxRetries: 0, timeout: timeoutMs });
    return await execute(client, model, controller.signal);
  } catch (error) {
    throw mapProviderError(error);
  } finally {
    clearTimeout(timeout);
    global.__activeInsideDopamineAIRequests = Math.max(
      0,
      (global.__activeInsideDopamineAIRequests ?? 1) - 1,
    );
  }
}

type FAQ = {
  question: string;
  answer: string;
  category: string;
};

export function buildSystemPrompt(faqs: FAQ[]): string {
  const grouped = faqs.slice(0, 50).reduce<Record<string, FAQ[]>>((acc, faq) => {
    const category = faq.category.slice(0, 80);
    (acc[category] ??= []).push(faq);
    return acc;
  }, {});

  const faqBlock = Object.entries(grouped)
    .map(([category, items]) => {
      const entries = items
        .map((f) => `Q: ${f.question.slice(0, 300)}\nA: ${f.answer.slice(0, 1_200)}`)
        .join("\n\n");
      return `## ${category}\n\n${entries}`;
    })
    .join("\n\n---\n\n");

  return `You are Dopamine, the AI assistant for Inside Dopamine — a premium B2B agency that builds BI dashboards, AI copilots, data platforms, and high-performance web products.

Your job is to help potential clients understand what Inside Dopamine does, how we work, and whether we're the right fit for their project.

---

## Rules

1. Answer ONLY using the FAQs provided below. Do not invent services, timelines, prices, or capabilities that aren't in the FAQs.
2. If a question isn't covered by the FAQs, respond with: "That's a great question for our team directly — they'll give you the most accurate answer. You can reach them at insidedopamine.com/contact."
3. Keep every response to 2–4 sentences maximum. Be conversational, not robotic.
4. When useful, offer to help the visitor send the team a contact or call request. Do not claim that a meeting has been booked.
5. Never promise a response time or say details were received until the application confirms durable receipt. The on-page form, not the conversation text, collects contact details.
6. Never mention Claude, Anthropic, or any underlying AI technology.
7. Never break character. You are Dopamine — warm, confident, and premium.
8. If the user is rude or asks unrelated questions, gently redirect: "I'm here to help with anything related to Inside Dopamine and your project needs."

---

## Tone

- Confident but not arrogant
- Warm but not overly casual
- Premium — like talking to a senior consultant, not a support bot
- Never use filler phrases like "Certainly!", "Of course!", "Absolutely!", or "Great question!"

---

## FAQ Knowledge Base

${faqBlock.slice(0, 40_000)}`;
}

const CHAT_OPERATIONAL_POLICY_RESPONSE =
  "I can help explain Inside Dopamine's services and process. To request a follow-up, use the contact form; sending a request does not book a meeting or guarantee a response time.";

const prohibitedOperationalClaims = [
  /\b(?:your|the|a)\s+(?:call|meeting|appointment)\s+(?:is|has been|was)\s+(?:booked|scheduled|confirmed|all set)\b/i,
  /\b(?:(?:i|we)(?:\s+(?:have|has)|'(?:ve|s))|(?:our team|the team)\s+(?:have|has))\s+(?:booked|scheduled|confirmed)\s+(?:you(?:\s+in)?|your|a|the)(?:\s+(?:call|meeting|appointment))?\b/i,
  /\b(?:(?:i|we)(?:\s+(?:have|has)|'(?:ve|s))|(?:our team|the team)\s+(?:have|has))\s+(?:received|saved|recorded)\s+(?:your|the)\s+(?:details|request|information)\b/i,
  /\b(?:your|the)\s+(?:details|request|information)\s+(?:(?:have|has)\s+been|was|were)\s+(?:received|saved|recorded)\b/i,
  /\b(?:i|we)(?:\s+have|'ve)\s+your\s+(?:details|request|information)\b/i,
  /\b(?:(?:i|we)(?:\s+(?:have|has)|'(?:ve|s))\s+|(?:i|we)\s+)(?:noted|recorded|saved)\s+(?:that|this|your\s+(?:details|request|information))(?:\s+down)?\b/i,
  /\b(?:that|this)(?:\s+is|'s)\s+(?:noted|recorded|saved)\b/i,
  /\b(?:(?:we|i)(?:\s+will|'ll)|(?:our team|the team|someone|a team member)\s+will)\s+(?:contact|call|email|reply|respond|get back(?: to you)?|be in touch(?: with you)?|reach out(?: to you)?)\b/i,
  /\byou(?:\s+will|'ll)\s+(?:hear from|be contacted by)\s+(?:us|our team|the team)\b/i,
  /\b(?:contact|call|email|reply|respond|get back|be in touch)[^.!?]{0,40}\b(?:within|in)\s+\d+\s*(?:business\s*)?(?:hours?|days?)\b/i,
  /\b(?:within|in)\s+\d+\s*(?:business\s*)?(?:hours?|days?)[^.!?]{0,40}\b(?:contact|call|email|reply|respond|get back|be in touch)\b/i,
];

export function applyChatOutputPolicy(responseText: string) {
  const comparable = responseText.normalize("NFKC").replaceAll("’", "'");
  const replaced = prohibitedOperationalClaims.some((pattern) => pattern.test(comparable));
  return {
    text: replaced ? CHAT_OPERATIONAL_POLICY_RESPONSE : responseText,
    replaced,
  } as const;
}

function validateProviderMessages(messages: readonly ProviderMessage[]) {
  if (messages.length < 1 || messages.length > 10 || messages[0]?.role !== "user") {
    throw new AIServiceError({
      code: "AI_PROVIDER_REQUEST_REJECTED",
      status: 500,
      retryable: false,
      diagnostic: "Server-constructed chat history did not begin with a user turn.",
    });
  }

  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index];
    const expectedRole = index % 2 === 0 ? "user" : "assistant";
    if (
      !message ||
      message.role !== expectedRole ||
      message.content.length < 1 ||
      message.content.length > 4_000
    ) {
      throw new AIServiceError({
        code: "AI_PROVIDER_REQUEST_REJECTED",
        status: 500,
        retryable: false,
        diagnostic: "Server-constructed chat history was invalid or non-alternating.",
      });
    }
  }
}

export async function createChatCompletion(options: {
  system: string;
  messages: readonly ProviderMessage[];
}) {
  validateProviderMessages(options.messages);

  return withAIRequest(CHAT_PROVIDER_TIMEOUT_MS, async (client, model, signal) => {
    const completion = await client.messages.create(
      {
        model,
        max_tokens: 300,
        system: options.system,
        messages: [...options.messages],
      },
      { signal },
    );
    const responseText = completion.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (responseText.length < 1 || responseText.length > 4_000) {
      throw new AIServiceError({
        code: "AI_PROVIDER_INVALID_RESPONSE",
        status: 502,
        retryable: true,
        diagnostic: "The provider returned no usable bounded text content.",
      });
    }
    return responseText;
  });
}

export async function createRecommendationCompletion(options: {
  system: string;
  prompt: string;
}) {
  return withAIRequest(RECOMMEND_PROVIDER_TIMEOUT_MS, async (client, model, signal) => {
    const completion = await client.messages.create(
      {
        model,
        max_tokens: 150,
        temperature: 0,
        system: options.system,
        messages: [{ role: "user", content: options.prompt }],
      },
      { signal },
    );
    const responseText = completion.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();
    if (responseText.length < 1 || responseText.length > 2_000) {
      throw new AIServiceError({
        code: "AI_PROVIDER_INVALID_RESPONSE",
        status: 502,
        retryable: true,
        diagnostic: "The recommendation provider response was empty or oversized.",
      });
    }
    return responseText;
  });
}

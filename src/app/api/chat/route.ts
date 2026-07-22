import { Prisma } from "@prisma/client";
import { type NextRequest } from "next/server";

import {
  AIServiceError,
  applyChatOutputPolicy,
  buildSystemPrompt,
  createChatCompletion,
} from "@/lib/ai";
import { getDatabaseConfiguration } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  PublicApiError,
  createRequestId,
  invalidRequest,
  isUuid,
  logPublicApiFailure,
  logPublicApiWarning,
  publicErrorResponse,
  publicJsonResponse,
  readBoundedJson,
  requireStrictObject,
} from "@/lib/public-api";
import { checkPublicRateLimit, rateLimitError } from "@/lib/rate-limit";

const CHAT_BODY_LIMIT_BYTES = 8 * 1_024;
const MAX_MESSAGE_LENGTH = 500;
const MAX_PROVIDER_MESSAGES = 9;
const MAX_STORED_MESSAGES = 50;

type ChatRequest = {
  message: string;
  sessionId: string;
  messageId: string;
};

type StoredMessage = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  replyToId?: string;
  createdAt?: string;
};

type ConversationSnapshot = {
  id: string;
  version: number;
  messages: Prisma.JsonValue;
  lead: { id: string } | null;
};

export function parseChatRequest(value: unknown): ChatRequest {
  const body = requireStrictObject(value, ["message", "sessionId", "messageId"]);
  if (
    typeof body.message !== "string" ||
    body.message.trim().length < 1 ||
    body.message.length > MAX_MESSAGE_LENGTH
  ) {
    throw invalidRequest(
      "Chat message was missing or outside its length bound.",
      "Please enter a message using 500 characters or fewer.",
    );
  }
  if (typeof body.sessionId !== "string" || !isUuid(body.sessionId)) {
    throw invalidRequest("Chat session identifier was invalid.");
  }
  if (typeof body.messageId !== "string" || !isUuid(body.messageId)) {
    throw invalidRequest("Chat message idempotency identifier was invalid.");
  }

  return {
    message: body.message.trim(),
    sessionId: body.sessionId,
    messageId: body.messageId,
  };
}

function storedMessages(value: Prisma.JsonValue): StoredMessage[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (
      entry === null ||
      typeof entry !== "object" ||
      Array.isArray(entry) ||
      (entry.role !== "user" && entry.role !== "assistant") ||
      typeof entry.content !== "string" ||
      entry.content.length < 1 ||
      entry.content.length > 4_000
    ) {
      return [];
    }
    return [{
      id: typeof entry.id === "string" && isUuid(entry.id) ? entry.id : undefined,
      role: entry.role,
      content: entry.content,
      replyToId:
        typeof entry.replyToId === "string" && isUuid(entry.replyToId)
          ? entry.replyToId
          : undefined,
      createdAt: typeof entry.createdAt === "string" ? entry.createdAt : undefined,
    }];
  });
}

function existingReply(messages: readonly StoredMessage[], messageId: string) {
  return messages.find(
    (message) => message.role === "assistant" && message.replyToId === messageId,
  )?.content;
}

function assertMessageIdMatches(
  messages: readonly StoredMessage[],
  messageId: string,
  userText: string,
) {
  const existing = messages.find(
    (message) => message.role === "user" && message.id === messageId,
  );
  if (existing && existing.content !== userText) {
    throw new PublicApiError({
      code: "CHAT_IDEMPOTENCY_CONFLICT",
      status: 409,
      retryable: false,
      userMessage: "That message retry did not match the original request.",
      diagnostic: "A chat message id was reused with different normalized text.",
    });
  }
}

export function canonicalProviderMessages(
  messages: readonly StoredMessage[],
  currentMessage: string,
) {
  const completePairs: Array<[StoredMessage, StoredMessage]> = [];
  for (let index = 0; index < messages.length - 1; index += 1) {
    const user = messages[index];
    const assistant = messages[index + 1];
    if (user?.role === "user" && assistant?.role === "assistant") {
      completePairs.push([user, assistant]);
      index += 1;
    }
  }

  const prior = completePairs
    .slice(-Math.floor((MAX_PROVIDER_MESSAGES - 1) / 2))
    .flatMap(([user, assistant]) => [
      { role: "user" as const, content: user.content },
      { role: "assistant" as const, content: applyChatOutputPolicy(assistant.content).text },
    ]);
  return [...prior, { role: "user" as const, content: currentMessage }];
}

function boundedTranscript(messages: readonly StoredMessage[]) {
  const bounded = messages.slice(-MAX_STORED_MESSAGES);
  const firstUser = bounded.findIndex((message) => message.role === "user");
  return firstUser < 0 ? [] : bounded.slice(firstUser);
}

function persistenceFailure() {
  return new PublicApiError({
    code: "CHAT_PERSISTENCE_FAILED",
    status: 503,
    retryable: true,
    userMessage:
      "Chat is temporarily unavailable. Please try again or use the contact form.",
    diagnostic: "Conversation persistence failed.",
  });
}

async function loadConversation(sessionId: string) {
  try {
    return await prisma.conversation.findUnique({
      where: { sessionId },
      select: {
        id: true,
        version: true,
        messages: true,
        lead: { select: { id: true } },
      },
    });
  } catch {
    throw persistenceFailure();
  }
}

function isUniqueConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

async function persistExchange(options: {
  snapshot: ConversationSnapshot | null;
  sessionId: string;
  messageId: string;
  userText: string;
  assistantText: string;
}) {
  const now = new Date().toISOString();
  const exchange: StoredMessage[] = [
    { id: options.messageId, role: "user", content: options.userText, createdAt: now },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: options.assistantText,
      replyToId: options.messageId,
      createdAt: now,
    },
  ];
  let snapshot = options.snapshot;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const currentMessages = snapshot ? storedMessages(snapshot.messages) : [];
    assertMessageIdMatches(currentMessages, options.messageId, options.userText);
    const reply = existingReply(currentMessages, options.messageId);
    if (reply) return reply;
    const nextMessages = boundedTranscript([...currentMessages, ...exchange]);

    try {
      if (!snapshot) {
        await prisma.conversation.create({
          data: {
            sessionId: options.sessionId,
            messages: nextMessages as Prisma.InputJsonValue,
          },
          select: { id: true },
        });
        return options.assistantText;
      }

      const updated = await prisma.conversation.updateMany({
        where: { id: snapshot.id, version: snapshot.version },
        data: {
          messages: nextMessages as Prisma.InputJsonValue,
          version: { increment: 1 },
        },
      });
      if (updated.count === 1) return options.assistantText;
    } catch (error) {
      if (!isUniqueConflict(error)) throw persistenceFailure();
    }

    snapshot = await loadConversation(options.sessionId);
  }

  throw persistenceFailure();
}

function mapAIError(error: AIServiceError) {
  const codeMap: Record<AIServiceError["code"], string> = {
    AI_MISSING_CONFIGURATION: "CHAT_NOT_CONFIGURED",
    AI_PROVIDER_AUTH: "CHAT_PROVIDER_AUTH",
    AI_PROVIDER_MODEL_UNAVAILABLE: "CHAT_PROVIDER_MODEL_UNAVAILABLE",
    AI_PROVIDER_QUOTA: "CHAT_PROVIDER_QUOTA",
    AI_PROVIDER_TIMEOUT: "CHAT_PROVIDER_TIMEOUT",
    AI_PROVIDER_UNAVAILABLE: "CHAT_PROVIDER_UNAVAILABLE",
    AI_PROVIDER_REQUEST_REJECTED: "CHAT_PROVIDER_REQUEST_REJECTED",
    AI_PROVIDER_INVALID_RESPONSE: "CHAT_PROVIDER_INVALID_RESPONSE",
    AI_OVERLOADED: "CHAT_OVERLOADED",
    AI_INTERNAL_ERROR: "CHAT_INTERNAL_ERROR",
  };
  return new PublicApiError({
    code: codeMap[error.code],
    status: error.status,
    retryable: error.retryable,
    userMessage:
      "Chat is temporarily unavailable. Please try again or use the contact form.",
    diagnostic: error.message,
  });
}

export function shouldOfferLeadCapture(
  messages: readonly StoredMessage[],
  currentMessage: string,
  currentMessageIsStored = false,
  conversationHasLead = false,
) {
  if (conversationHasLead) return false;

  const userTurns =
    messages.filter((message) => message.role === "user").length +
    (currentMessageIsStored ? 0 : 1);
  return (
    userTurns >= 3 ||
    /\b(book|call|contact|meeting|speak|talk)\b/i.test(currentMessage)
  );
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  const startedAt = Date.now();
  let retryAfterSeconds: number | undefined;

  try {
    const input = parseChatRequest(await readBoundedJson(request, CHAT_BODY_LIMIT_BYTES));
    const quota = await checkPublicRateLimit(request.headers, {
      scope: "chat",
      ipLimit: 20,
      windowMs: 10 * 60 * 1_000,
      session: { id: input.sessionId, limit: 12 },
    });
    if (!quota.allowed) {
      retryAfterSeconds = quota.retryAfterSeconds;
      throw rateLimitError();
    }

    try {
      getDatabaseConfiguration();
    } catch {
      throw new PublicApiError({
        code: "CHAT_DATABASE_NOT_CONFIGURED",
        status: 503,
        retryable: false,
        userMessage: "Chat is temporarily unavailable. Please use the contact form.",
        diagnostic: "Database configuration is missing or invalid for chat.",
      });
    }

    const snapshot = await loadConversation(input.sessionId);
    const messages = snapshot ? storedMessages(snapshot.messages) : [];
    assertMessageIdMatches(messages, input.messageId, input.message);
    const duplicateReply = existingReply(messages, input.messageId);
    if (duplicateReply) {
      const duplicatePolicy = applyChatOutputPolicy(duplicateReply);
      if (duplicatePolicy.replaced) {
        logPublicApiWarning("api/chat", requestId, {
          code: "CHAT_STORED_OPERATIONAL_CLAIM_BLOCKED",
          dependency: "database",
          retryable: false,
        });
      }
      return publicJsonResponse(
        {
          response: duplicatePolicy.text,
          leadCaptureTriggered: shouldOfferLeadCapture(
            messages,
            input.message,
            true,
            Boolean(snapshot?.lead),
          ),
          duplicate: true,
        },
        requestId,
      );
    }

    let faqs;
    try {
      faqs = await prisma.faq.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 50,
        select: { question: true, answer: true, category: true },
      });
    } catch {
      throw persistenceFailure();
    }

    const providerMessages = canonicalProviderMessages(messages, input.message);
    // Regression invariant: the decorative client greeting is never provider
    // history, and the provider request always begins with a real user turn.
    if (providerMessages[0]?.role !== "user") {
      throw new PublicApiError({
        code: "CHAT_INTERNAL_ERROR",
        status: 500,
        retryable: false,
        userMessage: "Chat is temporarily unavailable. Please use the contact form.",
        diagnostic: "Canonical chat context did not start with a user message.",
      });
    }

    let responseText: string;
    try {
      const providerResponse = await createChatCompletion({
        system: buildSystemPrompt(faqs),
        messages: providerMessages,
      });
      const policyResult = applyChatOutputPolicy(providerResponse);
      responseText = policyResult.text;
      if (policyResult.replaced) {
        logPublicApiWarning("api/chat", requestId, {
          code: "CHAT_PROVIDER_OPERATIONAL_CLAIM_BLOCKED",
          dependency: "anthropic",
          retryable: false,
        });
      }
    } catch (error) {
      if (error instanceof AIServiceError) throw mapAIError(error);
      throw error;
    }

    const persistedResponse = await persistExchange({
      snapshot,
      sessionId: input.sessionId,
      messageId: input.messageId,
      userText: input.message,
      assistantText: responseText,
    });
    const persistedPolicy = applyChatOutputPolicy(persistedResponse);
    if (persistedPolicy.replaced) {
      logPublicApiWarning("api/chat", requestId, {
        code: "CHAT_STORED_OPERATIONAL_CLAIM_BLOCKED",
        dependency: "database",
        retryable: false,
      });
    }

    return publicJsonResponse(
      {
        response: persistedPolicy.text,
        leadCaptureTriggered: shouldOfferLeadCapture(
          messages,
          input.message,
          false,
          Boolean(snapshot?.lead),
        ),
        duplicate: false,
      },
      requestId,
    );
  } catch (error) {
    let failure =
      error instanceof PublicApiError
        ? error
        : new PublicApiError({
            code: "CHAT_INTERNAL_ERROR",
            status: 500,
            retryable: true,
            userMessage:
              "Chat is temporarily unavailable. Please try again or use the contact form.",
            diagnostic: "An unclassified chat route failure occurred.",
          });
    const chatCodeMap: Record<string, string> = {
      INVALID_REQUEST: "CHAT_INVALID_REQUEST",
      PAYLOAD_TOO_LARGE: "CHAT_PAYLOAD_TOO_LARGE",
      UNSUPPORTED_MEDIA_TYPE: "CHAT_UNSUPPORTED_MEDIA_TYPE",
      RATE_LIMITED: "CHAT_RATE_LIMITED",
      RATE_LIMIT_UNAVAILABLE: "CHAT_RATE_LIMIT_UNAVAILABLE",
    };
    if (chatCodeMap[failure.code]) {
      failure = new PublicApiError({
        code: chatCodeMap[failure.code],
        status: failure.status,
        retryable: failure.retryable,
        userMessage: failure.userMessage,
        diagnostic: failure.diagnostic,
      });
    }
    if (failure.status >= 500) {
      logPublicApiFailure("api/chat", requestId, {
        code: failure.code,
        dependency:
          failure.code.includes("PROVIDER") || failure.code === "CHAT_NOT_CONFIGURED"
            ? "anthropic"
            : failure.code.includes("PERSISTENCE") || failure.code.includes("DATABASE")
              ? "database"
              : failure.code.includes("RATE_LIMIT")
                ? "rate-limit"
              : undefined,
        durationMs: Date.now() - startedAt,
        status: failure.status,
        retryable: failure.retryable,
      });
    }
    return publicErrorResponse(
      failure,
      requestId,
      retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined,
    );
  }
}

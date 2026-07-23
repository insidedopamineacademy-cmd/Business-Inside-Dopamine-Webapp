import "server-only";

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
  logPublicApiWarning,
} from "@/lib/server/public-api-core";
import { checkPublicRateLimit, rateLimitError } from "@/lib/rate-limit";
import {
  canonicalProviderMessages,
  shouldOfferLeadCapture,
} from "./chat-policy";
import {
  assertMessageIdMatches,
  conversationPersistenceError,
  findExistingReply,
  loadConversation,
  persistConversationExchange,
  storedChatMessages,
} from "./conversation-repository";
import {
  ChatServiceError,
  type ChatServiceFailure,
  type ChatServiceInput,
  type ChatServiceResult,
} from "./chat-types";

const CHAT_RATE_LIMIT = {
  scope: "chat",
  ipLimit: 20,
  windowMs: 10 * 60 * 1_000,
} as const;

function mapAIError(error: AIServiceError): ChatServiceFailure {
  const codeMap: Record<AIServiceError["code"], ChatServiceFailure["code"]> = {
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

  return {
    code: codeMap[error.code],
    status: error.status,
    retryable: error.retryable,
    userMessage:
      "Chat is temporarily unavailable. Please try again or use the contact form.",
    diagnostic: error.message,
  };
}

function mapPublicApiError(error: PublicApiError): ChatServiceFailure {
  const code =
    error.code === "RATE_LIMITED"
      ? "CHAT_RATE_LIMITED"
      : "CHAT_RATE_LIMIT_UNAVAILABLE";

  return {
    code,
    status: error.status,
    retryable: error.retryable,
    userMessage: error.userMessage,
    diagnostic: error.diagnostic,
  };
}

function resultFromError(error: unknown): ChatServiceResult {
  if (error instanceof ChatServiceError) {
    return { ok: false, error: error.failure };
  }
  if (error instanceof AIServiceError) {
    return { ok: false, error: mapAIError(error) };
  }
  if (error instanceof PublicApiError) {
    return { ok: false, error: mapPublicApiError(error) };
  }

  return {
    ok: false,
    error: {
      code: "CHAT_INTERNAL_ERROR",
      status: 500,
      retryable: true,
      userMessage:
        "Chat is temporarily unavailable. Please try again or use the contact form.",
      diagnostic: "An unclassified chat service failure occurred.",
    },
  };
}

export async function runChatService(
  input: ChatServiceInput,
): Promise<ChatServiceResult> {
  try {
    const quota = await checkPublicRateLimit(input.requestHeaders, {
      ...CHAT_RATE_LIMIT,
      session: { id: input.sessionId, limit: 12 },
    });
    if (!quota.allowed) {
      return {
        ok: false,
        error: mapPublicApiError(rateLimitError()),
        retryAfterSeconds: quota.retryAfterSeconds,
      };
    }

    try {
      getDatabaseConfiguration();
    } catch {
      throw new ChatServiceError({
        code: "CHAT_DATABASE_NOT_CONFIGURED",
        status: 503,
        retryable: false,
        userMessage: "Chat is temporarily unavailable. Please use the contact form.",
        diagnostic: "Database configuration is missing or invalid for chat.",
      });
    }

    const snapshot = await loadConversation(input.sessionId);
    const messages = snapshot ? storedChatMessages(snapshot.messages) : [];
    assertMessageIdMatches(messages, input.messageId, input.message);
    const duplicateReply = findExistingReply(messages, input.messageId);
    if (duplicateReply) {
      const duplicatePolicy = applyChatOutputPolicy(duplicateReply);
      if (duplicatePolicy.replaced) {
        logPublicApiWarning("api/chat", input.requestId, {
          code: "CHAT_STORED_OPERATIONAL_CLAIM_BLOCKED",
          dependency: "database",
          retryable: false,
        });
      }

      return {
        ok: true,
        data: {
          response: duplicatePolicy.text,
          leadCaptureTriggered: shouldOfferLeadCapture(
            messages,
            input.message,
            true,
            Boolean(snapshot?.lead),
          ),
          duplicate: true,
        },
      };
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
      throw conversationPersistenceError();
    }

    const providerMessages = canonicalProviderMessages(messages, input.message);
    // The decorative client greeting is never provider history. Every provider
    // request begins with a real user turn constructed by the server.
    if (providerMessages[0]?.role !== "user") {
      throw new ChatServiceError({
        code: "CHAT_INTERNAL_ERROR",
        status: 500,
        retryable: false,
        userMessage: "Chat is temporarily unavailable. Please use the contact form.",
        diagnostic: "Canonical chat context did not start with a user message.",
      });
    }

    const providerResponse = await createChatCompletion({
      system: buildSystemPrompt(faqs),
      messages: providerMessages,
    });
    const policyResult = applyChatOutputPolicy(providerResponse);
    const responseText = policyResult.text;
    if (policyResult.replaced) {
      logPublicApiWarning("api/chat", input.requestId, {
        code: "CHAT_PROVIDER_OPERATIONAL_CLAIM_BLOCKED",
        dependency: "anthropic",
        retryable: false,
      });
    }

    const persistedResponse = await persistConversationExchange({
      snapshot,
      sessionId: input.sessionId,
      messageId: input.messageId,
      userText: input.message,
      assistantText: responseText,
    });
    const persistedPolicy = applyChatOutputPolicy(persistedResponse);
    if (persistedPolicy.replaced) {
      logPublicApiWarning("api/chat", input.requestId, {
        code: "CHAT_STORED_OPERATIONAL_CLAIM_BLOCKED",
        dependency: "database",
        retryable: false,
      });
    }

    return {
      ok: true,
      data: {
        response: persistedPolicy.text,
        leadCaptureTriggered: shouldOfferLeadCapture(
          messages,
          input.message,
          false,
          Boolean(snapshot?.lead),
        ),
        duplicate: false,
      },
    };
  } catch (error) {
    return resultFromError(error);
  }
}

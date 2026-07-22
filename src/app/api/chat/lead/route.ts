import { type NextRequest } from "next/server";

import { getDatabaseConfiguration } from "@/lib/env";
import { createLead, LeadServiceError } from "@/lib/lead-service";
import { prisma } from "@/lib/prisma";
import {
  PublicApiError,
  createRequestId,
  invalidRequest,
  isUuid,
  logPublicApiFailure,
  publicErrorResponse,
  publicJsonResponse,
  readBoundedJson,
  requireStrictObject,
} from "@/lib/public-api";
import { checkPublicRateLimit, rateLimitError } from "@/lib/rate-limit";

const CHAT_LEAD_BODY_LIMIT_BYTES = 4 * 1_024;

type ChatLeadRequest = {
  sessionId: string;
  idempotencyKey: string;
  name: string;
  email: string;
};

export function parseChatLeadRequest(value: unknown): ChatLeadRequest {
  const body = requireStrictObject(value, ["sessionId", "idempotencyKey", "name", "email"]);
  if (typeof body.sessionId !== "string" || !isUuid(body.sessionId)) {
    throw invalidRequest("Chat lead session identifier was invalid.");
  }
  if (typeof body.idempotencyKey !== "string" || !isUuid(body.idempotencyKey)) {
    throw invalidRequest("Chat lead idempotency identifier was invalid.");
  }
  if (typeof body.name !== "string" || body.name.trim().length < 1 || body.name.length > 100) {
    throw invalidRequest("Chat lead name was outside its length bound.");
  }
  if (
    typeof body.email !== "string" ||
    body.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
  ) {
    throw invalidRequest("Chat lead email was invalid.");
  }

  return {
    sessionId: body.sessionId,
    idempotencyKey: body.idempotencyKey,
    name: body.name,
    email: body.email,
  };
}

function mapLeadError(error: LeadServiceError) {
  const status =
    error.code === "LEAD_INVALID_REQUEST"
      ? 400
      : error.code === "LEAD_IDEMPOTENCY_CONFLICT"
        ? 409
        : error.code === "LEAD_CONVERSATION_NOT_FOUND"
          ? 400
          : 503;
  return new PublicApiError({
    code: error.code,
    status,
    retryable: error.retryable,
    userMessage:
      status < 500
        ? "Please check your details and try again."
        : "We couldn't save your request right now. Please retry or use the contact page.",
    diagnostic: error.message,
  });
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  let retryAfterSeconds: number | undefined;

  try {
    const input = parseChatLeadRequest(
      await readBoundedJson(request, CHAT_LEAD_BODY_LIMIT_BYTES),
    );
    const quota = await checkPublicRateLimit(request.headers, {
      scope: "chat-lead",
      ipLimit: 3,
      windowMs: 10 * 60 * 1_000,
      session: { id: input.sessionId, limit: 2 },
    });
    if (!quota.allowed) {
      retryAfterSeconds = quota.retryAfterSeconds;
      throw rateLimitError();
    }

    try {
      getDatabaseConfiguration();
    } catch {
      throw new PublicApiError({
        code: "LEAD_NOT_CONFIGURED",
        status: 503,
        retryable: false,
        userMessage: "Follow-up requests are temporarily unavailable. Please use the contact page.",
        diagnostic: "Database configuration is missing or invalid for chat lead capture.",
      });
    }

    let conversation: { id: string; messages: unknown } | null;
    try {
      conversation = await prisma.conversation.findUnique({
        where: { sessionId: input.sessionId },
        select: { id: true, messages: true },
      });
    } catch {
      throw new PublicApiError({
        code: "LEAD_PERSISTENCE_FAILED",
        status: 503,
        retryable: true,
        userMessage:
          "We couldn't save your request right now. Please retry or use the contact page.",
        diagnostic: "Chat lead conversation lookup failed.",
      });
    }
    const hasVisitorMessage =
      conversation &&
      Array.isArray(conversation.messages) &&
      conversation.messages.some(
        (message) =>
          message !== null &&
          typeof message === "object" &&
          !Array.isArray(message) &&
          "role" in message &&
          message.role === "user",
      );
    if (!conversation || !hasVisitorMessage) {
      throw new PublicApiError({
        code: "LEAD_CONVERSATION_NOT_FOUND",
        status: 400,
        retryable: false,
        userMessage: "Please send a chat message before requesting a follow-up.",
        diagnostic: "Chat lead referenced a nonexistent conversation.",
      });
    }

    let receipt;
    try {
      receipt = await createLead({
        source: "CHAT",
        idempotencyKey: input.idempotencyKey,
        traceId: requestId,
        conversationId: conversation.id,
        fullName: input.name,
        email: input.email,
      });
    } catch (error) {
      if (error instanceof LeadServiceError) throw mapLeadError(error);
      throw error;
    }

    return publicJsonResponse(
      {
        success: true,
        received: true,
        duplicate: receipt.duplicate,
      },
      requestId,
      receipt.duplicate ? 200 : 201,
    );
  } catch (error) {
    const failure =
      error instanceof PublicApiError
        ? error
        : new PublicApiError({
            code: "LEAD_INTERNAL_ERROR",
            status: 500,
            retryable: true,
            userMessage:
              "We couldn't save your request right now. Please retry or use the contact page.",
            diagnostic: "An unclassified chat lead failure occurred.",
          });
    if (failure.status >= 500) {
      logPublicApiFailure("api/chat/lead", requestId, {
        code: failure.code,
        dependency: failure.code.includes("RATE_LIMIT") ? "rate-limit" : "database",
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

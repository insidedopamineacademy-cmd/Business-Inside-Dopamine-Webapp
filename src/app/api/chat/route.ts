import { type NextRequest } from "next/server";

import { runChatService } from "@/features/chat/server/chat-service";
import type { ChatServiceFailure } from "@/features/chat/server/chat-types";
import {
  publicErrorResponse,
  publicJsonResponse,
  readBoundedJson,
} from "@/lib/public-api";
import {
  PublicApiError,
  createRequestId,
  logPublicApiFailure,
} from "@/lib/server/public-api-core";
import { parseChatRequest } from "./route-helpers";

const CHAT_BODY_LIMIT_BYTES = 8 * 1_024;

function mapRouteError(error: unknown) {
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

  return failure;
}

function publicApiErrorFromService(failure: ChatServiceFailure) {
  return new PublicApiError(failure);
}

function dependencyForFailure(code: string) {
  if (code.includes("PROVIDER") || code === "CHAT_NOT_CONFIGURED") {
    return "anthropic";
  }
  if (code.includes("PERSISTENCE") || code.includes("DATABASE")) {
    return "database";
  }
  if (code.includes("RATE_LIMIT")) {
    return "rate-limit";
  }
  return undefined;
}

function respondWithFailure(options: {
  failure: PublicApiError;
  requestId: string;
  startedAt: number;
  retryAfterSeconds?: number;
}) {
  if (options.failure.status >= 500) {
    logPublicApiFailure("api/chat", options.requestId, {
      code: options.failure.code,
      dependency: dependencyForFailure(options.failure.code),
      durationMs: Date.now() - options.startedAt,
      status: options.failure.status,
      retryable: options.failure.retryable,
    });
  }

  return publicErrorResponse(
    options.failure,
    options.requestId,
    options.retryAfterSeconds
      ? { "Retry-After": String(options.retryAfterSeconds) }
      : undefined,
  );
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  const startedAt = Date.now();

  try {
    const parsedRequest = parseChatRequest(
      await readBoundedJson(request, CHAT_BODY_LIMIT_BYTES),
    );
    const result = await runChatService({
      ...parsedRequest,
      requestId,
      requestHeaders: request.headers,
    });

    if (!result.ok) {
      return respondWithFailure({
        failure: publicApiErrorFromService(result.error),
        requestId,
        startedAt,
        retryAfterSeconds: result.retryAfterSeconds,
      });
    }

    return publicJsonResponse(result.data, requestId);
  } catch (error) {
    return respondWithFailure({
      failure: mapRouteError(error),
      requestId,
      startedAt,
    });
  }
}

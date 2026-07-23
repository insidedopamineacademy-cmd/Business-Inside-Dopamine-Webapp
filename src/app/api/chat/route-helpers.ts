import "server-only";

import type { ChatServiceInput } from "@/features/chat/server/chat-types";
import {
  invalidRequest,
  isUuid,
  requireStrictObject,
} from "@/lib/server/public-api-core";

const MAX_MESSAGE_LENGTH = 500;

export type ChatRequest = Pick<
  ChatServiceInput,
  "message" | "sessionId" | "messageId"
>;

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

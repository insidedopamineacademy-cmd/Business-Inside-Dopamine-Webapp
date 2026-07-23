import "server-only";

import {
  invalidRequest,
  isUuid,
  requireStrictObject,
} from "@/lib/server/public-api-core";

export type ChatLeadRequest = {
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

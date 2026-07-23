import "server-only";

import {
  invalidRequest,
  isUuid,
  requireStrictObject,
} from "@/lib/server/public-api-core";

const SEGMENTS = ["ai", "dashboard", "platform", "enterprise", "general"] as const;
const SOURCES = ["linkedin", "google", "direct", "referral", "other"] as const;
const INTENTS = ["high", "medium", "low"] as const;

export type PersonalisationRequest = {
  eventId: string;
  segment: (typeof SEGMENTS)[number];
  source: (typeof SOURCES)[number];
  intent: (typeof INTENTS)[number];
  path: string;
};

export function parsePersonalisationRequest(value: unknown): PersonalisationRequest {
  const body = requireStrictObject(value, ["eventId", "segment", "source", "intent", "path"]);
  if (typeof body.eventId !== "string" || !isUuid(body.eventId)) {
    throw invalidRequest("Personalisation event id was invalid.");
  }
  if (
    typeof body.segment !== "string" ||
    !SEGMENTS.includes(body.segment as (typeof SEGMENTS)[number])
  ) {
    throw invalidRequest("Personalisation segment was not allowlisted.");
  }
  if (
    typeof body.source !== "string" ||
    !SOURCES.includes(body.source as (typeof SOURCES)[number])
  ) {
    throw invalidRequest("Personalisation source was not allowlisted.");
  }
  if (
    typeof body.intent !== "string" ||
    !INTENTS.includes(body.intent as (typeof INTENTS)[number])
  ) {
    throw invalidRequest("Personalisation intent was not allowlisted.");
  }
  if (
    typeof body.path !== "string" ||
    body.path.length < 1 ||
    body.path.length > 256 ||
    !/^\/(?!\/)[^?#]*$/.test(body.path)
  ) {
    throw invalidRequest("Personalisation path was not a bounded same-origin pathname.");
  }
  return body as PersonalisationRequest;
}

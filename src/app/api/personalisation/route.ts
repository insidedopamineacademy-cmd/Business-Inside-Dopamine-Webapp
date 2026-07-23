import { type NextRequest } from "next/server";

import { getDatabaseConfiguration } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  publicErrorResponse,
  publicJsonResponse,
  readBoundedJson,
} from "@/lib/public-api";
import { checkPublicRateLimit, rateLimitError } from "@/lib/rate-limit";
import {
  PublicApiError,
  createRequestId,
  logPublicApiFailure,
} from "@/lib/server/public-api-core";
import {
  parsePersonalisationRequest,
  type PersonalisationRequest,
} from "./route-helpers";

const PERSONALISATION_BODY_LIMIT_BYTES = 2 * 1_024;

function isUniqueConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

function persistenceError() {
  return new PublicApiError({
    code: "PERSONALISATION_PERSISTENCE_FAILED",
    status: 503,
    retryable: true,
    userMessage: "This request couldn't be recorded right now.",
    diagnostic: "Personalisation event persistence failed.",
  });
}

function eventMatches(
  existing: { segment: string; source: string; intent: string; path: string },
  input: PersonalisationRequest,
) {
  return (
    existing.segment === input.segment &&
    existing.source === input.source &&
    existing.intent === input.intent &&
    existing.path === input.path
  );
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  let retryAfterSeconds: number | undefined;

  try {
    const input = parsePersonalisationRequest(
      await readBoundedJson(request, PERSONALISATION_BODY_LIMIT_BYTES),
    );
    const quota = await checkPublicRateLimit(request.headers, {
      scope: "personalisation",
      ipLimit: 30,
      windowMs: 10 * 60 * 1_000,
    });
    if (!quota.allowed) {
      retryAfterSeconds = quota.retryAfterSeconds;
      throw rateLimitError();
    }

    try {
      getDatabaseConfiguration();
    } catch {
      throw new PublicApiError({
        code: "PERSONALISATION_NOT_CONFIGURED",
        status: 503,
        retryable: false,
        userMessage: "This request couldn't be recorded right now.",
        diagnostic: "Database configuration is missing or invalid for personalisation.",
      });
    }

    try {
      const existing = await prisma.segmentEvent.findUnique({
        where: { eventId: input.eventId },
        select: { segment: true, source: true, intent: true, path: true },
      });
      if (existing) {
        if (!eventMatches(existing, input)) {
          throw new PublicApiError({
            code: "PERSONALISATION_IDEMPOTENCY_CONFLICT",
            status: 409,
            retryable: false,
            userMessage: "That event retry did not match the original request.",
            diagnostic: "A personalisation event id was reused with different fields.",
          });
        }
        return publicJsonResponse({ success: true, duplicate: true }, requestId);
      }
      await prisma.segmentEvent.create({
        data: input,
        select: { id: true },
      });
    } catch (error) {
      if (isUniqueConflict(error)) {
        try {
          const raced = await prisma.segmentEvent.findUnique({
            where: { eventId: input.eventId },
            select: { segment: true, source: true, intent: true, path: true },
          });
          if (raced && eventMatches(raced, input)) {
            return publicJsonResponse({ success: true, duplicate: true }, requestId);
          }
          if (raced) {
            throw new PublicApiError({
              code: "PERSONALISATION_IDEMPOTENCY_CONFLICT",
              status: 409,
              retryable: false,
              userMessage: "That event retry did not match the original request.",
              diagnostic: "A raced event id was reused with different fields.",
            });
          }
          throw persistenceError();
        } catch (lookupError) {
          if (lookupError instanceof PublicApiError) throw lookupError;
          throw persistenceError();
        }
      }
      if (error instanceof PublicApiError) throw error;
      throw persistenceError();
    }

    return publicJsonResponse({ success: true, duplicate: false }, requestId, 201);
  } catch (error) {
    const failure =
      error instanceof PublicApiError
        ? error
        : new PublicApiError({
            code: "PERSONALISATION_INTERNAL_ERROR",
            status: 500,
            retryable: true,
            userMessage: "This request couldn't be recorded right now.",
            diagnostic: "An unclassified personalisation failure occurred.",
          });
    if (failure.status >= 500) {
      logPublicApiFailure("api/personalisation", requestId, {
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

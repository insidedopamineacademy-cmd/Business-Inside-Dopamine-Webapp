import { type NextRequest } from "next/server";

import { caseStudies } from "@/data/caseStudies";
import { AIServiceError, createRecommendationCompletion } from "@/lib/ai";
import {
  publicErrorResponse,
  publicJsonResponse,
  readBoundedJson,
} from "@/lib/public-api";
import { checkPublicRateLimit, rateLimitError } from "@/lib/rate-limit";
import {
  PublicApiError,
  createRequestId,
  isPlainObject,
  logPublicApiFailure,
} from "@/lib/server/public-api-core";
import { parseRecommendationRequest } from "./route-helpers";

const RECOMMEND_BODY_LIMIT_BYTES = 2 * 1_024;

function mapAIError(error: AIServiceError) {
  return new PublicApiError({
    code: `RECOMMEND_${error.code}`,
    status: error.status,
    retryable: error.retryable,
    userMessage: "A recommendation isn't available right now. Please try again later.",
    diagnostic: error.message,
  });
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  let retryAfterSeconds: number | undefined;

  try {
    const input = parseRecommendationRequest(
      await readBoundedJson(request, RECOMMEND_BODY_LIMIT_BYTES),
    );
    const quota = await checkPublicRateLimit(request.headers, {
      scope: "recommend",
      ipLimit: 20,
      windowMs: 10 * 60 * 1_000,
    });
    if (!quota.allowed) {
      retryAfterSeconds = quota.retryAfterSeconds;
      throw rateLimitError();
    }

    const allStudies = Object.values(caseStudies);
    const currentStudy = allStudies.find((study) => study.slug === input.currentSlug)!;
    const remaining = allStudies.filter((study) => study.slug !== input.currentSlug);

    if (remaining.length === 1) {
      const only = remaining[0]!;
      return publicJsonResponse(
        {
          slug: only.slug,
          title: only.hero.title,
          reason: "Related work you might find interesting.",
        },
        requestId,
      );
    }

    const studyList = remaining
      .map(
        (study) =>
          `- slug: "${study.slug}" | title: "${study.hero.title}" | description: "${study.hero.subtitle}"`,
      )
      .join("\n");

    let raw: string;
    try {
      raw = await createRecommendationCompletion({
        system:
          "You are a content recommendation engine. Return only a JSON object, without markdown.",
        prompt: `A visitor interested in ${input.segment} services just read "${currentStudy.hero.title}". Choose one item from this list:\n${studyList}\nReturn { "slug": string, "reason": string } with one short reason.`,
      });
    } catch (error) {
      if (error instanceof AIServiceError) throw mapAIError(error);
      throw error;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.replace(/```[a-z]*\n?/gi, "").trim()) as unknown;
    } catch {
      throw new PublicApiError({
        code: "RECOMMEND_PROVIDER_INVALID_RESPONSE",
        status: 502,
        retryable: true,
        userMessage: "A recommendation isn't available right now. Please try again later.",
        diagnostic: "Recommendation provider output was not JSON.",
      });
    }
    if (
      !isPlainObject(parsed) ||
      Object.keys(parsed).some((key) => key !== "slug" && key !== "reason")
    ) {
      throw new PublicApiError({
        code: "RECOMMEND_PROVIDER_INVALID_RESPONSE",
        status: 502,
        retryable: true,
        userMessage: "A recommendation isn't available right now. Please try again later.",
        diagnostic: "Recommendation provider output was not a strict object.",
      });
    }
    const result = parsed;
    const matched =
      typeof result.slug === "string"
        ? remaining.find((study) => study.slug === result.slug)
        : undefined;
    if (
      !matched ||
      typeof result.reason !== "string" ||
      result.reason.trim().length < 1 ||
      result.reason.length > 240
    ) {
      throw new PublicApiError({
        code: "RECOMMEND_PROVIDER_INVALID_RESPONSE",
        status: 502,
        retryable: true,
        userMessage: "A recommendation isn't available right now. Please try again later.",
        diagnostic: "Recommendation provider fields failed output validation.",
      });
    }

    return publicJsonResponse(
      {
        slug: matched.slug,
        title: matched.hero.title,
        reason: result.reason.trim(),
      },
      requestId,
    );
  } catch (error) {
    const failure =
      error instanceof PublicApiError
        ? error
        : new PublicApiError({
            code: "RECOMMEND_INTERNAL_ERROR",
            status: 500,
            retryable: true,
            userMessage: "A recommendation isn't available right now. Please try again later.",
            diagnostic: "An unclassified recommendation failure occurred.",
          });
    if (failure.status >= 500) {
      logPublicApiFailure("api/recommend", requestId, {
        code: failure.code,
        dependency: failure.code.includes("RATE_LIMIT") ? "rate-limit" : "anthropic",
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

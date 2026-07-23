import "server-only";

import { caseStudies } from "@/data/caseStudies";
import {
  invalidRequest,
  requireStrictObject,
} from "@/lib/server/public-api-core";

const SEGMENTS = ["ai", "dashboard", "platform", "enterprise", "general"] as const;

export type RecommendationRequest = {
  currentSlug: string;
  segment: (typeof SEGMENTS)[number];
};

export function parseRecommendationRequest(value: unknown): RecommendationRequest {
  const body = requireStrictObject(value, ["currentSlug", "segment"]);
  const slugs = Object.keys(caseStudies);
  if (typeof body.currentSlug !== "string" || !slugs.includes(body.currentSlug)) {
    throw invalidRequest("Recommendation current slug was not allowlisted.");
  }
  if (
    typeof body.segment !== "string" ||
    !SEGMENTS.includes(body.segment as (typeof SEGMENTS)[number])
  ) {
    throw invalidRequest("Recommendation segment was not allowlisted.");
  }
  return {
    currentSlug: body.currentSlug,
    segment: body.segment as RecommendationRequest["segment"],
  };
}

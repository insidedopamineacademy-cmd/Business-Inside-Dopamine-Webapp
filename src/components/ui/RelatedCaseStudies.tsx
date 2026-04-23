"use client";

import { useEffect, useState } from "react";
import { MotionDiv } from "@/lib/motion";
import { fadeUp } from "@/lib/animations";
import { Button, Card, Badge } from "@/components/ui";

type Recommendation = { slug: string; title: string; reason: string };

type Props = {
  currentSlug: string;
  segment?: string;
};

export default function RelatedCaseStudies({ currentSlug, segment }: Props) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentSlug, segment: segment ?? "general" }),
    })
      .then((r) => r.json())
      .then((data: Recommendation) => {
        if (data?.slug) setRecommendation(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentSlug, segment]);

  if (loading) {
    return (
      <Card variant="bordered" className="p-6">
        {/* Badge skeleton */}
        <div className="h-5 w-36 animate-pulse rounded-full bg-[var(--color-surface)]" />
        {/* Title skeleton */}
        <div className="mt-4 h-7 w-3/4 animate-pulse rounded-lg bg-[var(--color-surface)]" />
        {/* Reason skeleton */}
        <div className="mt-3 flex flex-col gap-2">
          <div className="h-4 w-full animate-pulse rounded-lg bg-[var(--color-surface)]" />
          <div className="h-4 w-2/3 animate-pulse rounded-lg bg-[var(--color-surface)]" />
        </div>
        {/* Button skeleton */}
        <div className="mt-5 h-11 w-36 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </Card>
    );
  }

  if (!recommendation) return null;

  return (
    <MotionDiv
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Card variant="bordered" className="p-6">
        <Badge variant="accent">Recommended for you</Badge>

        <p className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">
          {recommendation.title}
        </p>

        <p className="mt-2 text-base italic text-[var(--color-text-secondary)]">
          {recommendation.reason}
        </p>

        <div className="mt-5">
          <Button as="link" href={`/work/${recommendation.slug}`} variant="primary">
            Read case study
          </Button>
        </div>
      </Card>
    </MotionDiv>
  );
}

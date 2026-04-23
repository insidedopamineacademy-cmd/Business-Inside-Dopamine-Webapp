"use client";

import { useEffect, useState } from "react";
import { MotionDiv, AnimatePresence } from "@/lib/motion";
import { fadeUp, fadeIn } from "@/lib/animations";
import { getSegment } from "@/lib/segments";
import Button from "@/components/ui/Button";
import type { Variants } from "framer-motion";

function delayed(base: Variants, delay: number): Variants {
  const visible = base.visible as Record<string, unknown>;
  const existingTransition = (visible.transition as Record<string, unknown>) ?? {};
  return {
    hidden: base.hidden,
    visible: { ...visible, transition: { ...existingTransition, delay } },
  };
}

const exitFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export default function DynamicHero() {
  const [segment, setSegment] = useState("general");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/segment")
      .then((r) => r.json())
      .then((data: { segment?: string; source?: string; intent?: string }) => {
        if (data.segment) setSegment(data.segment);
        try {
          fetch("/api/personalisation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              segment: data.segment ?? "general",
              source: data.source ?? "other",
              intent: data.intent ?? "low",
              path: window.location.pathname,
            }),
          });
        } catch {
          // fire-and-forget — silent failure
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const hero = getSegment(segment).hero;

  return (
    <AnimatePresence mode="wait">
      {!loaded ? (
        <MotionDiv
          key="skeleton"
          variants={exitFade}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="flex flex-col gap-5"
        >
          {/* Eyebrow skeleton */}
          <div className="h-4 w-32 animate-pulse rounded-lg bg-[var(--color-surface)]" />
          {/* Headline skeleton */}
          <div className="flex flex-col gap-3">
            <div className="h-12 w-full max-w-2xl animate-pulse rounded-lg bg-[var(--color-surface)] md:h-14" />
            <div className="h-12 w-4/5 max-w-xl animate-pulse rounded-lg bg-[var(--color-surface)] md:h-14" />
          </div>
          {/* Subheadline skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-full max-w-lg animate-pulse rounded-lg bg-[var(--color-surface)]" />
            <div className="h-5 w-3/4 max-w-md animate-pulse rounded-lg bg-[var(--color-surface)]" />
          </div>
          {/* CTA skeleton */}
          <div className="flex gap-3">
            <div className="h-12 w-36 animate-pulse rounded-full bg-[var(--color-surface)]" />
            <div className="h-12 w-28 animate-pulse rounded-full bg-[var(--color-surface)]" />
          </div>
        </MotionDiv>
      ) : (
        <MotionDiv
          key={`content-${segment}`}
          variants={exitFade}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="flex flex-col gap-5"
        >
          {/* Eyebrow */}
          <MotionDiv
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]"
          >
            {hero.eyebrow}
          </MotionDiv>

          {/* Headline */}
          <MotionDiv
            variants={delayed(fadeUp, 0.1)}
            initial="hidden"
            animate="visible"
          >
            <h1 className="max-w-4xl text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
              {hero.headline}
            </h1>
          </MotionDiv>

          {/* Subheadline */}
          <MotionDiv
            variants={delayed(fadeUp, 0.2)}
            initial="hidden"
            animate="visible"
          >
            <p className="max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl">
              {hero.subheadline}
            </p>
          </MotionDiv>

          {/* CTAs */}
          <MotionDiv
            variants={delayed(fadeUp, 0.3)}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3"
          >
            <Button as="link" href="/work" variant="primary" size="lg">
              {hero.cta}
            </Button>
            <Button as="link" href="/contact" variant="ghost" size="lg">
              Talk to us
            </Button>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}

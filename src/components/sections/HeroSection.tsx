"use client";

import { MotionDiv, type Variants } from "@/lib/motion";
import { fadeIn, fadeUp } from "@/lib/animations";
import Button from "@/components/ui/Button";

type Props = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

function delayed(base: Variants, delay: number): Variants {
  const visible = base.visible as Record<string, unknown>;
  const existingTransition = (visible.transition as Record<string, unknown>) ?? {};
  return {
    hidden: base.hidden,
    visible: { ...visible, transition: { ...existingTransition, delay } },
  };
}

export default function HeroSection({ eyebrow, headline, subheadline, primaryCta, secondaryCta }: Props) {
  return (
    <div className="flex flex-col">
      <MotionDiv
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]"
      >
        {eyebrow}
      </MotionDiv>

      <MotionDiv variants={delayed(fadeUp, 0.1)} initial="hidden" animate="visible" className="mb-6">
        <h1 className="max-w-4xl text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
          {headline}
        </h1>
      </MotionDiv>

      <MotionDiv variants={delayed(fadeUp, 0.2)} initial="hidden" animate="visible" className="mb-8">
        <p className="max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl">
          {subheadline}
        </p>
      </MotionDiv>

      <MotionDiv
        variants={delayed(fadeUp, 0.3)}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3"
      >
        <Button as="link" href={primaryCta.href} variant="primary" size="lg">
          {primaryCta.label}
        </Button>
        <Button as="link" href={secondaryCta.href} variant="ghost" size="lg">
          {secondaryCta.label}
        </Button>
      </MotionDiv>
    </div>
  );
}

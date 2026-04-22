"use client";

import Container from "../ui/Container";
import { MotionDiv, useReducedMotion } from "@/lib/motion";
import { fadeUp, staggerContainer, viewport } from "@/lib/animations";

type PageHeroProps = {
  label: string;
  headline: string;
  intro: string;
};

export default function PageHero({ label, headline, intro }: PageHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-space" aria-label={`${label} hero`}>
      <Container>
        <MotionDiv
          className="max-w-[44rem]"
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <MotionDiv variants={fadeUp}>
            <p className="type-mono text-[var(--color-text-tertiary)]">{label}</p>
          </MotionDiv>
          <MotionDiv variants={fadeUp}>
            <h1 className="type-section mt-4 text-3xl text-[var(--color-text-primary)] md:text-5xl">
              {headline}
            </h1>
          </MotionDiv>
          <MotionDiv variants={fadeUp}>
            <p className="type-body mt-4 max-w-[38rem]">{intro}</p>
          </MotionDiv>
        </MotionDiv>
      </Container>
    </section>
  );
}

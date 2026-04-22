"use client";

import Button from "../ui/Button";
import Container from "../ui/Container";
import { MotionSection, useReducedMotion } from "@/lib/motion";
import { fadeUp, viewport } from "@/lib/animations";

export default function FinalCTASection() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionSection
      className="section-space"
      aria-label="Final call to action"
      variants={fadeUp}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={viewport}
    >
      <Container>
        <div className="rounded-3xl border border-white/10 bg-[var(--color-text-primary)] px-6 py-9 md:px-10 md:py-12">
          <p className="type-mono text-white/70">BOOK A STRATEGY CALL</p>
          <h2 className="type-section mt-4 text-3xl text-white md:text-5xl">
            Ready to stop doing it manually?
          </h2>
          <p className="type-mono mt-4 text-white/70">30-min strategy call • no commitment</p>
          <div className="mt-7 md:mt-8">
            <Button as="link" href="/contact" variant="primary">
              Book a Strategy Call →
            </Button>
          </div>
        </div>
      </Container>
    </MotionSection>
  );
}

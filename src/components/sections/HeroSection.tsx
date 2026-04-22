"use client";

import Button from "../ui/Button";
import Container from "../ui/Container";
import { MotionDiv, useReducedMotion } from "@/lib/motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero-shell" aria-label="Hero">
      <Container>
        <MotionDiv
          className="flex min-h-[clamp(34rem,76svh,48rem)] max-w-[44rem] flex-col justify-between py-10 md:min-h-[clamp(38rem,72svh,50rem)] md:py-14"
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <div>
            <MotionDiv variants={fadeUp}>
              <p className="type-mono text-[var(--color-text-tertiary)]">
                AI SYSTEMS & AUTOMATION
              </p>
            </MotionDiv>

            <h1 className="type-display hero-title mt-6 text-[var(--color-text-primary)] md:mt-7">
              <MotionDiv variants={fadeUp} className="block">
                Systems that
              </MotionDiv>
              <MotionDiv variants={fadeUp} className="block">
                make you
              </MotionDiv>
              <MotionDiv variants={fadeUp} className="block">
                <span className="text-[var(--color-accent)]">run</span> faster.
              </MotionDiv>
            </h1>
          </div>

          <div className="mt-10 md:mt-12">
            <MotionDiv variants={fadeUp}>
              <p className="type-body max-w-[36rem] text-balance">
                We build dashboards, web apps, and automation systems for teams that are done
                doing things manually.
              </p>
            </MotionDiv>

            <MotionDiv variants={fadeUp}>
              <p className="type-mono mt-7 text-[var(--color-text-tertiary)]">
                40+ systems built • 12x avg ops speedup • 3-week delivery
              </p>
            </MotionDiv>

            <MotionDiv
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center"
            >
              <Button as="link" href="/contact" variant="primary">
                Book a Strategy Call →
              </Button>
              <Button as="link" href="/work" variant="secondary">
                See Our Work ↗
              </Button>
            </MotionDiv>
          </div>
        </MotionDiv>
      </Container>
    </section>
  );
}

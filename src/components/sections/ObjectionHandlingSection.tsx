"use client";

import Container from "../ui/Container";
import { MotionDiv, MotionUl, MotionLi, useReducedMotion } from "@/lib/motion";
import { fadeUp, staggerContainer, viewport } from "@/lib/animations";

const points = [
  "No long-term contracts.",
  "No generic templates.",
  "No unnecessary complexity.",
  "Built specifically for your business.",
];

export default function ObjectionHandlingSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-space" aria-label="Why Inside Dopamine">
      <Container>
        <MotionDiv
          className="max-w-[44rem]"
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewport}
        >
          <p className="type-mono text-[var(--color-text-tertiary)]">WHY INSIDE DOPAMINE</p>
        </MotionDiv>

        <MotionUl
          className="mt-8 border-y border-[var(--color-border)]"
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewport}
        >
          {points.map((point, index) => (
            <MotionLi
              key={point}
              variants={fadeUp}
              className={[
                "type-section py-5 text-2xl text-[var(--color-text-primary)] md:text-4xl",
                index !== points.length - 1 ? "border-b border-[var(--color-border)]" : "",
              ].join(" ")}
            >
              {point}
            </MotionLi>
          ))}
        </MotionUl>
      </Container>
    </section>
  );
}

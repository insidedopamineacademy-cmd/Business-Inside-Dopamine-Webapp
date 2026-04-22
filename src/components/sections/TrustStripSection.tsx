"use client";

import Container from "../ui/Container";
import { MotionSection, useReducedMotion } from "@/lib/motion";
import { fadeIn, viewport } from "@/lib/animations";

const trustItems = [
  "40+ Systems Built",
  "12x Operations Speed",
  "3 Week Delivery",
  "0 Template Thinking",
];

export default function TrustStripSection() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionSection
      className="trust-strip bg-[var(--color-surface)]"
      aria-label="Trust metrics"
      variants={fadeIn}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={viewport}
    >
      <Container>
        <ul className="grid grid-cols-1 gap-0 py-3 sm:grid-cols-2 md:grid-cols-4 md:py-0">
          {trustItems.map((item, index) => (
            <li
              key={item}
              className={[
                "type-mono flex min-h-[64px] items-center justify-center py-3 text-center text-[var(--color-text-primary)]",
                "sm:py-4",
                index > 0 ? "md:border-l md:border-[var(--color-border)] md:px-6" : "md:px-6",
              ].join(" ")}
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </MotionSection>
  );
}

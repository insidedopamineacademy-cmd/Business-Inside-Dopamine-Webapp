"use client";

import { motion, useReducedMotion } from "framer-motion";
import Button from "../ui/Button";
import Container from "../ui/Container";

export default function FinalCTASection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="section-space"
      aria-label="Final call to action"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
      }
    >
      <Container>
        <div className="rounded-3xl border border-white/10 bg-[var(--color-surface-dark)] px-6 py-9 md:px-10 md:py-12">
          <p className="type-mono text-white/70">BOOK A STRATEGY CALL</p>
          <h2 className="type-section mt-4 text-3xl text-white md:text-5xl">
            Ready to stop doing it manually?
          </h2>
          <p className="type-mono mt-4 text-white/70">30-min strategy call • no commitment</p>
          <div className="mt-7 md:mt-8">
            <Button as="link" href="/contact" variant="accent">
              Book a Strategy Call →
            </Button>
          </div>
        </div>
      </Container>
    </motion.section>
  );
}

"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Button from "../ui/Button";
import Container from "../ui/Container";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const parentV: Variants = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.08, delayChildren: 0.06 },
    },
  };

  const itemV: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0 } : { duration: 0.45, ease },
    },
  };

  return (
    <section className="hero-shell" aria-label="Hero">
      <Container>
        <motion.div
          className="max-w-[44rem] py-14 md:py-20"
          variants={parentV}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
        >
          <motion.p variants={itemV} className="type-mono text-[var(--color-muted)]">
            AI SYSTEMS & AUTOMATION
          </motion.p>

          <h1 className="type-display hero-title mt-5 text-[var(--color-text)]">
            <motion.span variants={itemV} className="block">
              Systems that
            </motion.span>
            <motion.span variants={itemV} className="block">
              make you
            </motion.span>
            <motion.span variants={itemV} className="block">
              <span className="text-[var(--color-accent)]">run</span> faster.
            </motion.span>
          </h1>

          <motion.p variants={itemV} className="type-body mt-5 max-w-[36rem] text-balance">
            We build dashboards, web apps, and automation systems for teams that are done
            doing things manually.
          </motion.p>

          <motion.p variants={itemV} className="type-mono mt-5 text-[var(--color-muted)]">
            40+ systems built • 12x avg ops speedup • 3-week delivery
          </motion.p>

          <motion.div variants={itemV} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button as="link" href="/contact" variant="primary">
              Book a Strategy Call →
            </Button>
            <Button as="link" href="/work" variant="secondary">
              See Our Work ↗
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

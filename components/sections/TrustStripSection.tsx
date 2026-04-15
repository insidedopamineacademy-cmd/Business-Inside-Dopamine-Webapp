"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "../ui/Container";

const trustItems = [
  "40+ Systems Built",
  "12x Operations Speed",
  "3 Week Delivery",
  "0 Generic Solutions",
];

export default function TrustStripSection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="trust-strip"
      aria-label="Trust metrics"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
      }
    >
      <Container>
        <ul className="grid grid-cols-1 gap-0 py-4 sm:grid-cols-2 md:grid-cols-4 md:py-0">
          {trustItems.map((item, index) => (
            <li
              key={item}
              className={[
                "type-mono flex min-h-[64px] items-center py-3 text-[var(--color-text)]",
                "sm:py-4",
                index > 0 ? "md:border-l md:border-[var(--border-light)] md:pl-6" : "md:pr-6",
              ].join(" ")}
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </motion.section>
  );
}

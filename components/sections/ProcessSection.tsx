"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Container from "../ui/Container";

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "We map your workflows and bottlenecks.",
  },
  {
    number: "02",
    title: "Design",
    description: "We architect the system around your operations.",
  },
  {
    number: "03",
    title: "Build",
    description: "We develop, integrate, and automate everything.",
  },
  {
    number: "04",
    title: "Deploy",
    description: "We launch and make sure it runs cleanly.",
  },
  {
    number: "05",
    title: "Scale",
    description: "We iterate and expand as your business grows.",
  },
];

export default function ProcessSection() {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const introV: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0 } : { duration: 0.45, ease },
    },
  };

  const listV: Variants = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemV: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0 } : { duration: 0.4, ease },
    },
  };

  return (
    <section className="section-space surface-soft" aria-label="Process">
      <Container>
        <motion.div
          className="max-w-[44rem]"
          variants={introV}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <p className="type-mono text-[var(--color-muted)]">PROCESS</p>
          <h2 className="type-section mt-4 text-3xl text-[var(--color-text)] md:text-5xl">
            Clear method. No chaos.
          </h2>
          <p className="type-body mt-4 max-w-[38rem]">
            We keep the build simple, fast, and structured from the first call to launch.
          </p>
        </motion.div>

        <motion.ol
          className="mt-10 border-y border-[var(--border-light)] py-2 md:py-3"
          variants={listV}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {steps.map((step, index) => (
            <motion.li key={step.number} variants={itemV}>
              <div className="grid grid-cols-[44px_1fr] gap-4 py-5 md:grid-cols-[72px_1fr] md:gap-8 md:py-6">
                <div className="relative flex justify-center">
                  <p className="type-mono process-number-halo pt-0.5 text-[var(--color-muted)]">
                    {step.number}
                  </p>
                  {index !== steps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-6 bottom-[-1.75rem] w-px -translate-x-1/2 bg-[var(--border-light)] md:top-7 md:bottom-[-1.5rem]"
                    />
                  ) : null}
                </div>

                <div>
                  <h3 className="type-section text-xl text-[var(--color-text)] md:text-2xl">{step.title}</h3>
                  <p className="type-body mt-2">{step.description}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}

"use client";

import Container from "../ui/Container";
import { MotionDiv, MotionOl, MotionLi, useReducedMotion } from "@/lib/motion";
import { fadeUp, staggerContainer, viewport } from "@/lib/animations";

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

const steps: ProcessStep[] = [
  { number: "01", title: "Discover", description: "We map your workflows and bottlenecks." },
  { number: "02", title: "Design",   description: "We architect the system around your operations." },
  { number: "03", title: "Build",    description: "We develop, integrate, and automate everything." },
  { number: "04", title: "Deploy",   description: "We launch and make sure it runs cleanly." },
  { number: "05", title: "Scale",    description: "We iterate and expand as your business grows." },
];

export default function ProcessSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-space surface-soft" aria-label="Process">
      <Container>
        <MotionDiv
          className="max-w-[44rem]"
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewport}
        >
          <MotionDiv variants={fadeUp}>
            <p className="type-mono text-[var(--color-text-tertiary)]">PROCESS</p>
          </MotionDiv>
          <MotionDiv variants={fadeUp}>
            <h2 className="type-section mt-4 text-3xl text-[var(--color-text-primary)] md:text-5xl">
              Clear method. No chaos.
            </h2>
          </MotionDiv>
          <MotionDiv variants={fadeUp}>
            <p className="type-body mt-4 max-w-[38rem]">
              We keep the build simple, fast, and structured from the first call to launch.
            </p>
          </MotionDiv>
        </MotionDiv>

        <MotionOl
          className="mt-10 border-y border-[var(--color-border)] py-2 md:py-3"
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewport}
        >
          {steps.map((step, index) => (
            <MotionLi key={step.number} variants={fadeUp}>
              <div className="grid grid-cols-[44px_1fr] gap-4 py-5 md:grid-cols-[72px_1fr] md:gap-8 md:py-6">
                <div className="relative flex justify-center">
                  <p className="type-mono process-number-halo pt-0.5 text-[var(--color-text-tertiary)]">
                    {step.number}
                  </p>
                  {index !== steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-6 bottom-[-1.75rem] w-px -translate-x-1/2 bg-[var(--color-border)] md:top-7 md:bottom-[-1.5rem]"
                    />
                  )}
                </div>
                <div>
                  <h3 className="type-section text-xl text-[var(--color-text-primary)] md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="type-body mt-2">{step.description}</p>
                </div>
              </div>
            </MotionLi>
          ))}
        </MotionOl>
      </Container>
    </section>
  );
}

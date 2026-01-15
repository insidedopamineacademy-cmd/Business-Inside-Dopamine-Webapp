"use client";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef } from "react";

export default function CTA() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });

  const easing: [number, number, number, number] = [0.21, 0.47, 0.22, 0.9];

  const sectionV: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.7,
        ease: easing,
        when: "beforeChildren",
        staggerChildren: reduce ? 0 : 0.08,
      },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: easing },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="relative py-20"
      variants={sectionV}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        initial={reduce ? false : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: easing }}
      >
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-[0.10] blur-3xl" />
        <div className="absolute left-[10%] top-[20%] h-[280px] w-[280px] rounded-full bg-accent opacity-[0.06] blur-3xl" />
        <div className="absolute right-[8%] bottom-[10%] h-[320px] w-[320px] rounded-full bg-accent opacity-[0.06] blur-3xl" />
      </motion.div>

      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          className="card relative overflow-hidden p-10 md:p-12"
          variants={fadeUp}
          whileHover={reduce ? undefined : { y: -3 }}
          transition={reduce ? { duration: 0 } : { duration: 0.18 }}
        >
          {/* Inner sheen on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.16), transparent 55%), radial-gradient(circle at 90% 40%, rgba(56,189,248,0.10), transparent 55%), radial-gradient(circle at 50% 110%, rgba(139,92,246,0.12), transparent 60%)",
            }}
          />

          <motion.div
            className="relative grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]"
            variants={fadeUp}
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Next step
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
                Tell us what you’re building.
              </h2>
              <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
                Whether it’s a dashboard, an AI copilot, or a full platform —
                we’ll help you design the right system and ship it with confidence.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Book a Call
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Contact Us
                </Link>
              </div>

              <div className="mt-6 text-xs text-muted">
                Global delivery • Remote-first • Enterprise & startup friendly
              </div>
            </div>

            {/* Right-side mini panel */}
            <div className="rounded-3xl border border-border bg-muted p-6">
              <div className="text-xs text-muted">What we can do in 2–4 weeks</div>
              <div className="mt-3 grid gap-3">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm font-semibold">Dashboard MVP</div>
                  <div className="mt-1 text-xs text-muted">
                    KPI model + executive Power BI view
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm font-semibold">AI Copilot Prototype</div>
                  <div className="mt-1 text-xs text-muted">
                    RAG + secure knowledge base search
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm font-semibold">Platform Foundation</div>
                  <div className="mt-1 text-xs text-muted">
                    Next.js app + analytics-ready architecture
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
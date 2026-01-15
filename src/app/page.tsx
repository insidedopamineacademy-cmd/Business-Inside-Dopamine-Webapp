"use client";

import Link from "next/link";
import DopamineLoop from "@/components/sections/DopamineLoop";
import FeaturedWork from "@/components/sections/FeaturedWork";
import CTA from "@/components/sections/CTA";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export default function HomePage() {
  const reduce = useReducedMotion();

  const easing: [number, number, number, number] = [0.21, 0.47, 0.22, 0.9];

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.7,
        delay: reduce ? 0 : 0.08 * i,
        ease: easing,
      },
    }),
  };

  const cardIn: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduce ? 0 : 0.75,
        delay: reduce ? 0 : 0.25,
        ease: easing,
      },
    },
  };

  return (
    <main>
      <section className="hero-gradient">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          {/* Left */}
          <div>
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="text-4xl font-semibold tracking-tight md:text-6xl"
            >
              Dream in data.
              <br />
              Build with AI.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-5 text-base text-muted md:text-lg"
            >
              We craft Power BI dashboards, AI copilots, and high-performance web platforms that
              turn raw data into decisions.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/contact" className="btn-primary">
                Book a Call
              </Link>
              <Link href="/work" className="btn-secondary">
                View Work
              </Link>
            </motion.div>

            {/* Subtle “trust line” */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-8 flex flex-wrap items-center gap-2 text-xs text-muted"
            >
              <span className="rounded-full border border-border bg-card px-3 py-1">
                Enterprise-ready
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1">
                Fast delivery
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1">
                Measurable outcomes
              </span>
            </motion.div>
          </div>

          {/* Right “Ask the system” */}
          <motion.div
            variants={cardIn}
            initial="hidden"
            animate="show"
            whileHover={reduce ? undefined : { y: -3 }}
            transition={reduce ? { duration: 0 } : { duration: 0.2 }}
            className="relative rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            {/* animated border glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 dark:ring-white/10" />
            <div className="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-60 blur-xl hero-card-glow" />

            <div className="relative">
              <div className="text-xs text-muted">Ask the system</div>

              <div className="mt-3 rounded-2xl border border-border bg-muted p-4">
                <p className="text-sm">
                  Create a dashboard that tracks revenue, churn, and operational KPIs across regions —
                  with AI summaries for executives.
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted">+ Add metrics • + Add data sources</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-black">
                    →
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                <span className="rounded-full bg-muted px-3 py-2 text-center">Power BI</span>
                <span className="rounded-full bg-muted px-3 py-2 text-center">RAG</span>
                <span className="rounded-full bg-muted px-3 py-2 text-center">Web Apps</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services cards */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Three ways we build impact</h2>
        <p className="mt-3 text-muted">
          Data becomes insight. Insight becomes action. Action becomes systems people rely on.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card
            title="Data Analytics & Power BI"
            desc="Dashboards that leaders trust. Models that teams can scale."
            href="/services/data-analytics-power-bi"
          />
          <Card
            title="Web Platforms"
            desc="Fast, modern web apps built to convert and perform."
            href="/services/web-platforms"
          />
          <Card
            title="AI Solutions"
            desc="LLM copilots, chatbots, and predictive systems integrated into workflows."
            href="/services/ai-solutions"
          />
        </div>
      </section>

      <DopamineLoop />
      <FeaturedWork />
      <CTA />
    </main>
  );
}

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="card p-6">
      <div className="text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm text-muted">{desc}</p>
      <div className="mt-5 text-sm font-medium">Explore →</div>
    </Link>
  );
}
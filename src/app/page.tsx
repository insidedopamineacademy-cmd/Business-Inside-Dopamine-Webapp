"use client";

import Link from "next/link";
import DopamineLoop from "@/components/sections/DopamineLoop";
import FeaturedWork from "@/components/sections/FeaturedWork";
import CTA from "@/components/sections/CTA";
import DopamineSystemCore from "@/components/sections/DopamineSystemCore";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export default function HomePage() {
  const reduce = useReducedMotion() ?? false;

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
    <main className="overflow-x-hidden touch-pan-y [scroll-snap-type:none] [scroll-behavior:auto]">
      <section className="hero-gradient relative overflow-hidden">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-6 md:grid-cols-2 md:py-24">
          {/* Left */}
          <div className="relative z-10">
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
              We craft BI dashboards, AI copilots, and high-performance web platforms that turn raw data into decisions.
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
              className="mt-7 flex flex-wrap items-center gap-2 text-xs text-muted"
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

          {/* Mobile: background graphic behind the hero copy (no overlap issues) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 md:hidden"
          >
            <div className="absolute -right-24 top-12 h-[420px] w-[420px] opacity-60 blur-[0.2px]">
              <div className="h-full w-full scale-[0.92]">
                <DopamineSystemCore />
              </div>
            </div>
            {/* soft vignette to keep text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgb(var(--bg))]/30" />
          </div>

          {/* Desktop: dedicated right-column hero graphic */}
          <div className="pointer-events-none select-none relative z-10 hidden min-h-[420px] md:block">
            <DopamineSystemCore />

            {/* Small legend (desktop only) */}
            <div className="absolute bottom-6 left-6 z-10 flex flex-wrap gap-2 text-[11px] text-muted">
              <span className="rounded-full border border-border bg-card/70 px-3 py-1 backdrop-blur">
                BI Dashboards
              </span>
              <span className="rounded-full border border-border bg-card/70 px-3 py-1 backdrop-blur">
                RAG
              </span>
              <span className="rounded-full border border-border bg-card/70 px-3 py-1 backdrop-blur">
                Web Apps
              </span>
              <span className="rounded-full border border-border bg-card/70 px-3 py-1 backdrop-blur">
                Automations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Services cards */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold md:text-3xl">Three ways we build impact</h2>
        <p className="mt-3 text-muted">
          Data becomes insight. Insight becomes action. Action becomes systems people rely on.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card
            title="Data Analytics & BI Dashboards"
            desc="Dashboards that leaders trust. Models that teams can scale."
            href="/services/data-analytics-bi-dashboards"
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
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

  return (
    <main className="min-h-dvh overflow-x-clip">
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
              Build systems teams feel instantly.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-5 text-base text-muted md:text-lg"
            >
              From signal to action: dashboards, AI copilots, and web platforms that move decisions forward.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-6"
            >
              <ul className="grid gap-2 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Decision-grade BI in weeks
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  AI copilots inside workflows
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Web platforms built to scale
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/contact" className="btn-primary">
                Book a Call
              </Link>
            </motion.div>

            {/* Metrics strip replacing trust chips */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted"
            >
              <span className="rounded-full border border-border bg-card px-3 py-1.5">
                <span className="font-medium text-fg">Days to dashboard</span>
                <span className="ml-2 text-[10px] text-muted">typical range</span>
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1.5">
                <span className="font-medium text-fg">Automate reporting flow</span>
                <span className="ml-2 text-[10px] text-muted">common outcome</span>
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1.5">
                <span className="font-medium text-fg">Enterprise-safe patterns</span>
                <span className="ml-2 text-[10px] text-muted">delivery standard</span>
              </span>
            </motion.div>

            {/* Optional suggestion: animate tiny signal pulses from these anchors to the right-side system core. */}
            <div className="pointer-events-none relative mt-3 hidden h-6 md:block">
              <span className="absolute left-3 top-2 h-2 w-2 rounded-full bg-accent/70" />
              <span className="absolute left-28 top-1 h-2 w-2 rounded-full bg-accent/55" />
              <span className="absolute left-56 top-3 h-2 w-2 rounded-full bg-accent/40" />
            </div>
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
            promise="Clarity from complexity"
            href="/services/data-analytics-power-bi"
            icon="chart"
          />
          <Card
            title="Web Platforms"
            promise="Speed built natively"
            href="/services/web-platforms"
            icon="bolt"
          />
          <Card
            title="AI Solutions"
            promise="Intelligence in workflow"
            href="/services/ai-solutions"
            icon="spark"
          />
        </div>
      </section>

      <DopamineLoop />
      <FeaturedWork />
      <CTA />
    </main>
  );
}

function Card({
  title,
  promise,
  href,
  icon,
}: {
  title: string;
  promise: string;
  href: string;
  icon: "chart" | "bolt" | "spark";
}) {
  return (
    <Link href={href} className="group card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="text-lg font-semibold">{title}</div>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-muted text-muted">
          <TinyIcon type={icon} />
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">{promise}</p>
      <div className="mt-5 text-sm font-medium">Explore →</div>
      {/* Optional suggestion: reveal 2 quick deliverables on group hover (kept intentionally unimplemented). */}
    </Link>
  );
}

function TinyIcon({ type }: { type: "chart" | "bolt" | "spark" }) {
  if (type === "chart") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M3 14L8 9L11 12L17 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "bolt") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M11.5 2L5.5 10H9.5L8.5 18L14.5 10H10.5L11.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M10 3V7M10 13V17M3 10H7M13 10H17M5.5 5.5L7.8 7.8M12.2 12.2L14.5 14.5M14.5 5.5L12.2 7.8M7.8 12.2L5.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import DopamineSystemCore from "@/components/sections/DopamineSystemCore";

export default function AboutClient() {
  const reduce = useReducedMotion() ?? false;

  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
  } as const;

  const stagger = {
    hidden: {},
    show: {
      transition: reduce
        ? { duration: 0 }
        : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  } as const;

  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Background graphic (subtle) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <div className="absolute -right-40 top-6 h-[520px] w-[520px] md:-right-10 md:top-1/2 md:-translate-y-1/2">
            <DopamineSystemCore />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgb(var(--bg))]/35" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-14 sm:px-6 md:py-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold tracking-widest text-muted"
            >
              ABOUT INSIDE DOPAMINE
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl"
            >
              We design clarity.
              <br />
              We engineer momentum.
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 text-base text-muted md:text-lg">
              Inside Dopamine helps teams see what matters, act faster, and ship systems that scale.
              We blend BI dashboards, AI copilots, and high-performance web platforms into one cohesive
              delivery.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Book a Call
              </Link>
              <Link href="/work" className="btn-secondary">
                See Our Work
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 grid gap-3 text-sm text-muted sm:grid-cols-3"
            >
              <div className="card p-4">
                <div className="text-xs">Focus</div>
                <div className="mt-1 font-semibold text-fg">Decision-grade BI</div>
              </div>
              <div className="card p-4">
                <div className="text-xs">Build</div>
                <div className="mt-1 font-semibold text-fg">AI integrated systems</div>
              </div>
              <div className="card p-4">
                <div className="text-xs">Ship</div>
                <div className="mt-1 font-semibold text-fg">Fast web platforms</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission + Approach */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="card p-7"
          >
            <motion.h2 variants={fadeUp} className="text-2xl font-semibold md:text-3xl">
              Our mission
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-muted">
              Turn complex data into clear choices — then build the systems that make those choices
              repeatable.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-6 grid gap-3 text-sm">
              <div className="rounded-2xl border border-border bg-muted p-4">
                <div className="font-semibold">Clarity</div>
                <div className="mt-1 text-muted">BI dashboards designed for executive decisions.</div>
              </div>
              <div className="rounded-2xl border border-border bg-muted p-4">
                <div className="font-semibold">Leverage</div>
                <div className="mt-1 text-muted">AI copilots that compress analysis time.</div>
              </div>
              <div className="rounded-2xl border border-border bg-muted p-4">
                <div className="font-semibold">Speed</div>
                <div className="mt-1 text-muted">Web platforms engineered to perform and scale.</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="card p-7"
          >
            <motion.h2 variants={fadeUp} className="text-2xl font-semibold md:text-3xl">
              How we work
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-muted">
              A calm, systems-first process. We align on outcomes, ship the smallest useful version,
              then iterate with real usage.
            </motion.p>

            <motion.ol variants={fadeUp} className="mt-6 grid gap-3 text-sm">
              <li className="rounded-2xl border border-border bg-muted p-4">
                <div className="font-semibold">1) Discover</div>
                <div className="mt-1 text-muted">KPIs, stakeholders, data sources, constraints.</div>
              </li>
              <li className="rounded-2xl border border-border bg-muted p-4">
                <div className="font-semibold">2) Design</div>
                <div className="mt-1 text-muted">Information architecture, dashboard flows, UI system.</div>
              </li>
              <li className="rounded-2xl border border-border bg-muted p-4">
                <div className="font-semibold">3) Build</div>
                <div className="mt-1 text-muted">Pipelines, models, dashboards, AI modules, web apps.</div>
              </li>
              <li className="rounded-2xl border border-border bg-muted p-4">
                <div className="font-semibold">4) Ship & iterate</div>
                <div className="mt-1 text-muted">Performance, QA, enablement, continuous improvement.</div>
              </li>
            </motion.ol>
          </motion.div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-6">
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">What we optimize for</h2>
          <p className="mt-3 text-muted">
            Enterprise-grade thinking, startup speed. Less noise, more signal.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card p-6">
            <div className="text-lg font-semibold">Speed without fragility</div>
            <p className="mt-2 text-sm text-muted">
              Fast delivery, clean architecture. We prefer boring reliability over flashy complexity.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-lg font-semibold">Decision-grade UX</div>
            <p className="mt-2 text-sm text-muted">
              The right metrics, at the right moment, in a layout executives actually use.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-lg font-semibold">AI that fits workflows</div>
            <p className="mt-2 text-sm text-muted">
              Copilots and automations integrated where teams already work — not separate demos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <div className="card hero-gradient p-8 md:p-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold md:text-3xl">Let’s build your next system</h2>
            <p className="mt-3 text-muted">
              Share your goal and your data context. We’ll propose a clear plan — dashboards, AI, and
              platform delivery — designed for speed and adoption.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Talk to the team
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
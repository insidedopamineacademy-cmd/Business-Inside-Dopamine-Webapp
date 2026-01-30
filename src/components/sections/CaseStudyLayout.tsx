"use client";

import Link from "next/link";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { CaseStudy } from "@/app/content/work/caseStudies";

export default function CaseStudyLayout({ study }: { study: CaseStudy }) {
  const prefersReducedMotion = useReducedMotion();

  const ease = [0.22, 1, 0.36, 1] as const;

  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6, ease } },
  };

  const revealProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, margin: "-10% 0px" },
      };

  return (
    <main className="relative text-fg">
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-6 md:px-6 md:pt-20 md:pb-12">
          <motion.div {...revealProps} variants={fadeUp} className="flex flex-wrap gap-2">
            {study.hero.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted backdrop-blur"
              >
                {t}
              </span>
            ))}
          </motion.div>

          <motion.h1
            {...revealProps}
            variants={fadeUp}
            className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl"
          >
            {study.hero.title}
          </motion.h1>

          <motion.p
            {...revealProps}
            variants={fadeUp}
            className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
          >
            {study.hero.subtitle}
          </motion.p>

          {/* ✅ Fix: button always visible (white bg + black text) */}
          <motion.div
            {...revealProps}
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href={study.cta.href}
              className="btn-primary"
            >
              {study.cta.primaryLabel}
            </Link>

            <Link
              href="/work"
              className="btn-secondary"
            >
              Back to Work
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BODY */}
      <motion.section
        className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16"
        {...revealProps}
        variants={fadeIn}
      >
        <div className="grid gap-14">
          <Section title="Context" {...revealProps}>
            <Bullets items={study.context.bullets} />
          </Section>

          <Section title="Problem" {...revealProps}>
            <Bullets items={study.problem.bullets} />
          </Section>

          <Section title="Solution" {...revealProps}>
            <Bullets items={study.solution.bullets} />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {study.solution.pillars.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur-md"
                >
                  <div className="text-sm font-semibold">{p.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {p.description}
                  </p>
                  <div className="mt-4">
                    <Bullets items={p.highlights} compact />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Architecture" {...revealProps}>
            <div className="grid gap-4 md:grid-cols-2">
              {study.architecture.lanes.map((lane) => (
                <div
                  key={lane.title}
                  className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur-md"
                >
                  <div className="text-sm font-semibold">{lane.title}</div>
                  <div className="mt-3">
                    <Bullets items={lane.items} compact />
                  </div>
                </div>
              ))}
            </div>
            {study.architecture.note ? (
              <p className="mt-6 text-sm text-muted">{study.architecture.note}</p>
            ) : null}
          </Section>

          <Section title="Impact" {...revealProps}>
            <div className="grid gap-3 md:grid-cols-2">
              {study.impact.bullets.map((b) => (
                <div
                  key={b}
                  className="rounded-2xl border border-border bg-card/70 px-4 py-3 text-sm backdrop-blur-md"
                >
                  {b}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Tech Stack" {...revealProps}>
            <div className="grid gap-4 md:grid-cols-2">
              {study.tech.groups.map((g) => (
                <div
                  key={g.title}
                  className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur-md"
                >
                  <div className="text-sm font-semibold">{g.title}</div>
                  <div className="mt-3">
                    <Bullets items={g.items} compact />
                  </div>
                </div>
              ))}
            </div>
            {study.tech.note ? (
              <p className="mt-6 text-sm text-muted">{study.tech.note}</p>
            ) : null}
          </Section>

          {study.confidentialityNote ? (
            <div className="rounded-2xl border border-border bg-card/70 p-5 text-sm text-muted shadow-sm backdrop-blur-md">
              <span className="font-semibold">Confidentiality note:</span> {study.confidentialityNote}
            </div>
          ) : null}

          <div className="rounded-3xl border border-border bg-muted p-8">
            <div className="text-xl font-semibold">{study.cta.heading}</div>
            <p className="mt-3 max-w-2xl text-sm text-muted">{study.cta.subheading}</p>
            <div className="mt-6">
              <Link
                href={study.cta.href}
                className="btn-primary"
              >
                {study.cta.primaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

function Section({
  title,
  children,
  ...motionProps
}: {
  title: string;
  children: React.ReactNode;
} & HTMLMotionProps<"section">) {
  return (
    <motion.section
      {...motionProps}
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
      className="grid gap-4"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <div>{children}</div>
    </motion.section>
  );
}

function Bullets({ items, compact = false }: { items: string[]; compact?: boolean }) {
  return (
    <ul className={compact ? "space-y-2" : "space-y-3"}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-muted">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
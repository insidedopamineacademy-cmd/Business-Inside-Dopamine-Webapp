"use client";

import Link from "next/link";
import { useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { MotionDiv, MotionSection } from "@/lib/motion";
import { fadeUp, fadeIn, viewport } from "@/lib/animations";
import Button from "../ui/Button";
import type { CaseStudy } from "@/data/caseStudies";

export default function CaseStudyLayout({ study }: { study: CaseStudy }) {
  const prefersReducedMotion = useReducedMotion();

  const revealProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-10% 0px" },
      };

  return (
    <main className="relative text-[var(--color-text-primary)]">
      {/* ── Hero ── */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-6 md:px-6 md:pt-20 md:pb-12">
          <MotionDiv {...revealProps} variants={fadeUp} className="flex flex-wrap gap-2">
            {study.hero.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]"
              >
                {t}
              </span>
            ))}
          </MotionDiv>

          <MotionDiv
            {...revealProps}
            variants={fadeUp}
            className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl"
          >
            <h1>{study.hero.title}</h1>
          </MotionDiv>

          <MotionDiv {...revealProps} variants={fadeUp}>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
              {study.hero.subtitle}
            </p>
          </MotionDiv>

          <MotionDiv
            {...revealProps}
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button as="link" href={study.cta.href} variant="primary">
              {study.cta.primaryLabel}
            </Button>
            <Button as="link" href="/work" variant="secondary">
              Back to Work
            </Button>
          </MotionDiv>
        </div>
      </section>

      {/* ── Body ── */}
      <MotionSection
        className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16"
        {...revealProps}
        variants={fadeIn}
      >
        <div className="grid gap-14">
          <CollapsibleModule title="Impact" defaultOpen>
            <div className="grid gap-3 md:grid-cols-2">
              {study.impact.bullets.map((b) => (
                <div
                  key={b}
                  className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm"
                >
                  {b}
                </div>
              ))}
            </div>
          </CollapsibleModule>

          <CollapsibleModule title="Architecture Snapshot" defaultOpen>
            <div className="grid gap-4 md:grid-cols-2">
              {study.architecture.lanes.map((lane) => (
                <div
                  key={lane.title}
                  className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
                >
                  <h3 className="text-sm font-semibold">{lane.title}</h3>
                  <div className="mt-3">
                    <Bullets items={lane.items} compact />
                  </div>
                </div>
              ))}
            </div>
            {study.architecture.note && (
              <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
                {study.architecture.note}
              </p>
            )}
          </CollapsibleModule>

          <CollapsibleModule title="Tech Stack" defaultOpen>
            <div className="grid gap-4 md:grid-cols-2">
              {study.tech.groups.map((g) => (
                <div
                  key={g.title}
                  className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
                >
                  <h3 className="text-sm font-semibold">{g.title}</h3>
                  <div className="mt-3">
                    <Bullets items={g.items} compact />
                  </div>
                </div>
              ))}
            </div>
            {study.tech.note && (
              <p className="mt-6 text-sm text-[var(--color-text-secondary)]">{study.tech.note}</p>
            )}
          </CollapsibleModule>

          <details className="group rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <summary className="cursor-pointer list-none rounded-2xl px-2 py-2 text-sm font-semibold transition hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2">
              <span className="inline-flex items-center gap-2">
                <span>View full details</span>
                <Chevron className="h-4 w-4 transition duration-200 group-open:rotate-180" />
              </span>
            </summary>

            <div className="grid grid-rows-[0fr] transition-all duration-300 ease-out group-open:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <div className="mt-6 grid gap-10 opacity-0 transition-opacity duration-300 ease-out group-open:opacity-100">
                  <Section title="Context">
                    <Bullets items={study.context.bullets} />
                  </Section>
                  <Section title="Problem">
                    <Bullets items={study.problem.bullets} />
                  </Section>
                  <Section title="Solution">
                    <Bullets items={study.solution.bullets} />
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      {study.solution.pillars.map((p) => (
                        <div
                          key={p.title}
                          className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
                        >
                          <h3 className="text-sm font-semibold">{p.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                            {p.description}
                          </p>
                          <div className="mt-4">
                            <Bullets items={p.highlights} compact />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>

                  {study.confidentialityNote && (
                    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 text-sm text-[var(--color-text-secondary)] shadow-sm">
                      <span className="font-semibold">Confidentiality note:</span>{" "}
                      {study.confidentialityNote}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </details>

          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
            <h2 className="text-xl font-semibold">{study.cta.heading}</h2>
            <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-secondary)]">
              {study.cta.subheading}
            </p>
            <div className="mt-6">
              <Button as="link" href={study.cta.href} variant="primary">
                {study.cta.primaryLabel}
              </Button>
            </div>
          </div>
        </div>
      </MotionSection>
    </main>
  );
}

// ── Local sub-components ───────────────────────────────────────────────────

function Section({
  title,
  children,
  ...motionProps
}: {
  title: string;
  children: React.ReactNode;
} & HTMLMotionProps<"section">) {
  return (
    <MotionSection
      {...motionProps}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
      className="grid gap-4"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <div>{children}</div>
    </MotionSection>
  );
}

function CollapsibleModule({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
    >
      <summary className="cursor-pointer list-none rounded-2xl px-2 py-2 transition hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2">
        <h2 className="inline-flex items-center gap-2 text-xl font-semibold">
          <span>{title}</span>
          <Chevron className="h-4 w-4 transition duration-200 group-open:rotate-180" />
        </h2>
      </summary>
      <div className="grid grid-rows-[0fr] transition-all duration-300 ease-out group-open:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <div className="mt-4 opacity-0 transition-opacity duration-300 ease-out group-open:opacity-100">
            {children}
          </div>
        </div>
      </div>
    </details>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 8L10 13L15 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Bullets({ items, compact = false }: { items: string[]; compact?: boolean }) {
  return (
    <ul className={compact ? "space-y-2" : "space-y-3"}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[var(--color-text-secondary)]">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
          <span className="text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

import Link from "next/link";
import type { CaseStudy } from "@/app/content/work/caseStudies";

export default function CaseStudyLayout({ study }: { study: CaseStudy }) {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="flex flex-wrap gap-2">
            {study.hero.tags.map((t: string) => (
              <span
                key={t}
                className="rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-black/80 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/80"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-black md:text-5xl dark:text-white">
            {study.hero.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/70 md:text-lg dark:text-white/70">
            {study.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={study.cta.href}
              className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              {study.cta.primaryLabel}
            </Link>
            <Link
              href="/work"
              className="rounded-xl border border-black/10 bg-white/60 px-4 py-2.5 text-sm font-medium text-black/80 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
            >
              Back to Work
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="h-px w-full bg-black/10 dark:bg-white/10" />
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <SectionBlock title="Context" bullets={study.context.bullets} />
        <Spacer />

        <SectionBlock title="Problem" bullets={study.problem.bullets} />
        <Spacer />

        {/* Solution */}
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
              Solution
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              {study.solution.bullets.map((b: string) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40 dark:bg-white/40" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-medium text-black/70 dark:text-white/70">
              Capability Focus
            </h3>
            <div className="mt-4 space-y-5">
              {study.solution.pillars.map((p: { title: string; description: string; highlights: string[] }) => (
                <div key={p.title}>
                  <div className="text-base font-semibold text-black dark:text-white">
                    {p.title}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-black/70 dark:text-white/70">
                    {p.description}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {p.highlights.map((h: string) => (
                      <li
                        key={h}
                        className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Spacer />

        {/* Architecture */}
        <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
          Architecture / System Thinking
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {study.architecture.lanes.map((lane: { title: string; items: string[] }) => (
            <div
              key={lane.title}
              className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="text-sm font-semibold text-black dark:text-white">
                {lane.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-black/70 dark:text-white/70">
                {lane.items.map((it: string) => (
                  <li key={it} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40 dark:bg-white/40" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {study.architecture.note ? (
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-black/60 dark:text-white/60">
            {study.architecture.note}
          </p>
        ) : null}

        <Spacer />

        <SectionBlock title="Impact" bullets={study.impact.bullets} />
        <Spacer />

        {/* Tech */}
        <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
          Tech Stack (Abstracted)
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {study.tech.groups.map((g: { title: string; items: string[] }) => (
            <div
              key={g.title}
              className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="text-sm font-semibold text-black dark:text-white">
                {g.title}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.items.map((it: string) => (
                  <li
                    key={it}
                    className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {study.tech.note ? (
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-black/60 dark:text-white/60">
            {study.tech.note}
          </p>
        ) : null}

        {study.confidentialityNote ? (
          <div className="mt-10 rounded-2xl border border-black/10 bg-white/60 p-6 text-sm text-black/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            <span className="font-medium text-black/70 dark:text-white/70">
              Confidentiality note:{" "}
            </span>
            {study.confidentialityNote}
          </div>
        ) : null}

        {/* CTA */}
        <div className="mt-12 rounded-3xl border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
            {study.cta.heading}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/70 dark:text-white/70">
            {study.cta.subheading}
          </p>
          <div className="mt-6">
            <Link
              href={study.cta.href}
              className="inline-flex rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              {study.cta.primaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionBlock({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr] md:gap-10">
      <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
        {title}
      </h2>
      <ul className="space-y-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
        {bullets.map((b: string) => (
          <li key={b} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40 dark:bg-white/40" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Spacer() {
  return <div className="my-10 md:my-14" />;
}


import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Inside Dopamine builds BI dashboards, AI copilots, and high-performance web platforms that turn raw data into decisions.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Inside Dopamine",
    description:
      "We build BI dashboards, AI solutions, and modern web platforms for teams that move fast.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden">
      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              About Inside Dopamine
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
              Systems that make
              <br />
              data feel inevitable.
            </h1>

            <p className="mt-5 max-w-prose text-base text-muted md:text-lg">
              We design BI dashboards, AI copilots, and high-performance web platforms that help teams
              move faster — with clarity, automation, and measurable outcomes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Book a Call
              </Link>
              <Link href="/work" className="btn-secondary">
                View Work
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="card p-4">
                <div className="text-xs text-muted">Focus</div>
                <div className="mt-1 text-sm font-semibold">Outcome-first delivery</div>
              </div>
              <div className="card p-4">
                <div className="text-xs text-muted">Style</div>
                <div className="mt-1 text-sm font-semibold">Apple × SpaceX polish</div>
              </div>
              <div className="card p-4">
                <div className="text-xs text-muted">Speed</div>
                <div className="mt-1 text-sm font-semibold">Fast iterations</div>
              </div>
            </div>
          </div>

          {/* PREMIUM “SYSTEM” CARD */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-violet-500/15 via-sky-500/10 to-indigo-500/10 blur-2xl" />

            <div className="card relative overflow-hidden p-6 md:p-7">
              <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl" />
                <div className="absolute right-0 top-10 h-44 w-44 rounded-full bg-sky-500/10 blur-2xl" />
                <div className="absolute bottom-0 left-10 h-44 w-44 rounded-full bg-indigo-500/10 blur-2xl" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted">How we think</div>
                    <div className="mt-1 text-base font-semibold">Signal → System → Scale</div>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted">
                    Built for teams
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-border bg-muted p-4">
                    <div className="text-xs text-muted">1) Signal</div>
                    <div className="mt-1 text-sm">
                      Identify the KPI that truly moves the business — revenue, retention, cost, or
                      speed.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted p-4">
                    <div className="text-xs text-muted">2) System</div>
                    <div className="mt-1 text-sm">
                      Build dashboards, data models, and automation that make decisions repeatable.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted p-4">
                    <div className="text-xs text-muted">3) Scale</div>
                    <div className="mt-1 text-sm">
                      Ship a platform your team can trust — fast, secure, and simple to maintain.
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-border bg-card px-3 py-2">BI Dashboards</span>
                  <span className="rounded-full border border-border bg-card px-3 py-2">AI Copilots</span>
                  <span className="rounded-full border border-border bg-card px-3 py-2">Web Platforms</span>
                  <span className="rounded-full border border-border bg-card px-3 py-2">Automation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Why we exist</h2>
            <p className="mt-4 text-muted">
              Most teams don’t have a data problem — they have a clarity problem. Tools are fine.
              Pipelines exist. Dashboards are “there.” But decisions still feel slow.
            </p>
            <p className="mt-4 text-muted">
              Inside Dopamine builds systems that remove friction: cleaner metrics, faster feedback
              loops, and automation that makes performance visible.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="card p-6">
                <div className="text-sm font-semibold">Clarity</div>
                <p className="mt-2 text-sm text-muted">
                  A single source of truth for leadership and operations.
                </p>
              </div>
              <div className="card p-6">
                <div className="text-sm font-semibold">Leverage</div>
                <p className="mt-2 text-sm text-muted">
                  Automation that cuts manual work and keeps teams focused.
                </p>
              </div>
              <div className="card p-6">
                <div className="text-sm font-semibold">Velocity</div>
                <p className="mt-2 text-sm text-muted">
                  Modern web platforms that feel instant and convert.
                </p>
              </div>
              <div className="card p-6">
                <div className="text-sm font-semibold">Trust</div>
                <p className="mt-2 text-sm text-muted">
                  Quality, testing, and maintainability — built in, not added later.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            <h3 className="text-lg font-semibold">What clients typically need</h3>
            <ul className="mt-4 grid gap-3 text-sm text-muted">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                KPI definitions that don’t change every meeting.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                Dashboards that are fast, readable, and used daily.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                AI copilots that summarize, triage, or route work.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                Web platforms that convert and don’t feel “template.”
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                Automation across ops so the team stops copy-pasting.
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-border bg-muted p-5">
              <div className="text-xs text-muted">Result</div>
              <div className="mt-1 text-sm">
                Your team spends less time chasing numbers — and more time improving them.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-6">
        <div className="card p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">Our process</h2>
              <p className="mt-3 text-muted">
                Premium work is mostly sequencing: what to build first, what to automate, and what to
                standardize.
              </p>
            </div>
            <div className="grid gap-3">
              <Step n="01" title="Discovery" desc="Map your goals, KPIs, and constraints. Align on what success means." />
              <Step n="02" title="Design" desc="Information architecture, dashboard UX, and platform UI — before code." />
              <Step n="03" title="Build" desc="Ship in tight iterations with performance and maintainability as defaults." />
              <Step n="04" title="Launch" desc="Rollout, documentation, and fast feedback loops for continuous upgrades." />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <div className="card relative overflow-hidden p-8 md:p-10">
          <div className="pointer-events-none absolute -inset-10 bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-sky-500/10 blur-2xl" />
          <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">Let’s build something inevitable.</h2>
              <p className="mt-3 text-muted">
                If you want BI dashboards that leaders actually use, AI that removes busywork, and a
                web platform that feels premium — we should talk.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/contact" className="btn-primary">
                Book a Call
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({
  n,
  title,
  desc,
}: {
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-muted">{n}</div>
          <div className="mt-1 text-sm font-semibold">{title}</div>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/20 text-sm font-semibold text-fg">
          →
        </span>
      </div>
      <p className="mt-3 text-sm text-muted">{desc}</p>
    </div>
  );
}
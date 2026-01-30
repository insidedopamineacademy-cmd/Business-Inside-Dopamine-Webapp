import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/app/content/work/caseStudies";

export const metadata: Metadata = {
  title: "Work — Case Studies | Inside Dopamine",
  description:
    "Representative case studies across BI Dashboards, AI systems, and high-performance web platforms—built for enterprise-grade clarity and scale.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Work — Case Studies | Inside Dopamine",
    description:
      "Representative case studies across BI Dashboards, AI systems, and high-performance web platforms—built for enterprise-grade clarity and scale.",
    url: "/work",
    type: "website",
  },
};


export default function WorkPage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-gradient border-b border-border">
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Work
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Selected work & case studies
            </h1>
            <p className="mt-5 text-base text-muted md:text-lg">
              A snapshot of how we help teams make better decisions, move faster, and scale with
              confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          Case studies
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Representative examples across analytics, AI, and web platforms. Full details available
          on request.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {(
            [
              caseStudies["executive-sales-dashboard"],
              caseStudies["ai-knowledge-copilot"],
              caseStudies["operations-data-platform"],
            ] as const
          ).map((study) => (
            <Link
              key={study.slug}
              href={`/work/${study.slug}`}
              className="group card relative p-6 transition-all duration-300 ease-out will-change-transform backdrop-blur-md bg-card/70 hover:bg-card/80 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 dark:ring-white/5" />
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-foreground">{study.hero.title}</h3>
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:scale-105 group-hover:bg-foreground group-hover:text-background"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
              <p className="mt-3 text-sm text-muted leading-relaxed">{study.seo.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {study.hero.tags.slice(0, 3).map((t: string) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-muted/80 px-3 py-2 text-xs transition-colors duration-300 group-hover:bg-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-border bg-muted p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Want to see something similar for your team?
          </h2>
          <p className="mt-3 text-muted">
            Tell us about your data, platform, or AI challenge. We’ll share relevant examples.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Start a conversation
            </Link>
            <Link href="/services" className="btn-secondary">
              Explore services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
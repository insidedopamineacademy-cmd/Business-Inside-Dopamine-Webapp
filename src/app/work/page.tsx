import Link from "next/link";

export const metadata = {
  title: "Our Work & Case Studies",
  description:
    "Selected analytics, AI, and web platform projects showing how we turn data into decisions and systems into results.",
};

const caseStudies = [
  {
    title: "Executive Power BI Dashboard",
    desc: "Unified financial, sales, and operational KPIs into a single executive reporting layer.",
    tags: ["Power BI", "Executive reporting", "Data modeling"],
  },
  {
    title: "AI Knowledge Copilot",
    desc: "Internal LLM assistant trained on company documents with secure access controls.",
    tags: ["LLM", "RAG", "Internal tools"],
  },
  {
    title: "High-performance Web Platform",
    desc: "SEO-optimized, conversion-focused web platform with analytics and AI integrations.",
    tags: ["Next.js", "SEO", "Performance"],
  },
];

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
          {caseStudies.map((c) => (
            <div key={c.title} className="group card p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight">{c.title}</h3>
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
              <p className="mt-3 text-sm text-muted leading-relaxed">{c.desc}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-muted px-3 py-2 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
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
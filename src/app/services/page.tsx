import Link from "next/link";

export const metadata = {
  title: "Services — Analytics, AI, Web Platforms",
  description:
    "Explore Inside Dopamine services: Power BI dashboards, AI solutions, and high-performance web platforms built for teams that move fast.",
};

const services = [
  {
    title: "Data Analytics & Power BI",
    desc: "Dashboards leaders trust. Models teams can scale. Visibility that drives action.",
    href: "/services/data-analytics-power-bi",
    tags: ["Power BI", "KPI model", "Governance"],
  },
  {
    title: "Web Platforms",
    desc: "Fast, modern web apps built to convert and perform — with clean integrations.",
    href: "/services/web-platforms",
    tags: ["Next.js", "Core Web Vitals", "SEO"],
  },
  {
    title: "AI Solutions",
    desc: "LLM copilots, RAG chatbots, and predictive systems integrated into workflows.",
    href: "/services/ai-solutions",
    tags: ["RAG", "Copilots", "Automation"],
  },
];

const pillars = [
  {
    title: "Built for decision speed",
    desc: "We optimize for clarity, governance, and the shortest path from insight to action.",
  },
  {
    title: "Enterprise-ready foundations",
    desc: "Repeatable patterns and systems your team can operate without dependency.",
  },
  {
    title: "Performance-first delivery",
    desc: "SEO, speed, and accessibility baked in — from architecture to UX.",
  },
];

export default function ServicesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-gradient border-b border-border">
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Services
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Analytics, AI, and web platforms — built as one system.
            </h1>
            <p className="mt-5 text-base text-muted md:text-lg">
              We help teams turn raw data into decisions, then automate the next step. Start with
              dashboards, expand into AI copilots, and scale with high-performance platforms.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Book a Call
              </Link>
              <Link href="/work" className="btn-secondary">
                View Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted">
          Capabilities
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
          What we deliver
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Choose a service below — or combine them. Most clients start with dashboards, then expand
          into AI copilots and platforms.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <Link key={s.title} href={s.href} className="group card p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>

              <p className="mt-3 text-sm text-muted leading-relaxed">{s.desc}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-muted px-3 py-2 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-transform duration-200 group-hover:translate-x-0.5">
                Explore <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="card p-10 md:p-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Why Inside Dopamine
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Built for clarity, speed, and measurable outcomes.
              </h2>
              <p className="mt-3 text-muted">
                We design systems that make decisions easier — then help your team operationalize
                them.
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="grid gap-4 md:grid-cols-3">
                {pillars.map((p) => (
                  <div key={p.title} className="rounded-3xl border border-border bg-muted p-6">
                    <div className="text-sm font-semibold">{p.title}</div>
                    <p className="mt-2 text-sm text-muted">{p.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Talk to us
                </Link>
                <Link href="/services/data-analytics-power-bi" className="btn-secondary">
                  Start with dashboards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-border bg-muted p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Not sure where to start?
          </h2>
          <p className="mt-3 text-muted">
            Describe your data and your goal. We’ll recommend the fastest path to value.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Get a recommendation
            </Link>
            <Link href="/work" className="btn-secondary">
              See examples
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
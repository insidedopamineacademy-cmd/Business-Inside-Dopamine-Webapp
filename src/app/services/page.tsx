import Link from "next/link";

export const metadata = {
  title: "Services — Analytics, AI, Web Platforms",
  description:
    "Explore Inside Dopamine services: BI dashboards, AI solutions, and high-performance web platforms built for teams that move fast.",
};

const services = [
  {
    title: "Data Analytics & BI Dashboards",
    desc: "Dashboards leaders trust. Models teams can scale. Visibility that drives action.",
    href: "/services/data-analytics-power-bi",
    tags: ["BI Dashboards", "KPI model", "Governance"],
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
    title: "Clarity-first architecture",
    desc: "Signal over noise: information hierarchy, KPI discipline, and decision-ready interfaces.",
  },
  {
    title: "Workflow-native delivery",
    desc: "Dashboards, AI, and platforms are embedded where teams already operate.",
  },
  {
    title: "Scale-safe engineering",
    desc: "Performance, maintainability, and governance built in from the first release.",
  },
];

const matrix = [
  {
    row: "Speed to first release",
    bi: "2-4 weeks",
    ai: "3-6 weeks",
    platform: "4-8 weeks",
  },
  {
    row: "Implementation complexity",
    bi: "Low-Medium",
    ai: "Medium-High",
    platform: "Medium",
  },
  {
    row: "ROI horizon",
    bi: "Immediate clarity",
    ai: "Compounding leverage",
    platform: "Growth foundation",
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
              <Link href="/work" className="inline-flex items-center text-sm font-medium text-muted transition hover:text-fg">
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

      {/* Decision block */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="card p-10 md:p-12">
          <div className="grid gap-10 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Decision support
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Pick the right first move.
              </h2>
              <p className="mt-3 text-muted">
                Use this matrix to choose based on speed, complexity, and value horizon. We can
                start with one lane and expand into the rest.
              </p>
              <div className="mt-6 grid gap-3">
                {pillars.map((p) => (
                  <div key={p.title} className="rounded-2xl border border-border bg-muted p-4">
                    <div className="text-sm font-semibold">{p.title}</div>
                    <p className="mt-1 text-sm text-muted">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="mb-2 flex items-center justify-between px-1 text-xs text-muted sm:hidden">
                <span>Swipe to compare</span>
                <span>BI / AI / Platform</span>
              </div>
              <div className="overflow-x-auto overscroll-x-contain rounded-3xl border border-border bg-muted [-webkit-overflow-scrolling:touch]">
                <div className="min-w-[620px]">
                  <div className="grid grid-cols-4 border-b border-border bg-card px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    <div className="sticky left-0 z-10 bg-card pr-3">Decision factor</div>
                    <div className="text-center">BI</div>
                    <div className="text-center">AI</div>
                    <div className="text-center">Platform</div>
                  </div>
                  {matrix.map((item) => (
                    <div
                      key={item.row}
                      className="grid grid-cols-4 border-b border-border px-4 py-3 text-sm last:border-b-0"
                    >
                      <div className="sticky left-0 z-10 bg-muted pr-3 font-medium">{item.row}</div>
                      <div className="text-center text-muted">{item.bi}</div>
                      <div className="text-center text-muted">{item.ai}</div>
                      <div className="text-center text-muted">{item.platform}</div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-3 text-xs text-muted">
                Typical planning guidance only. Scope and timeline depend on data maturity, integrations,
                and governance constraints.
              </p>

              <div className="mt-7 flex items-center gap-4">
                <Link href="/contact" className="btn-primary">
                  Get a recommendation
                </Link>
                <Link href="/work" className="text-sm font-medium text-muted transition hover:text-fg">
                  See examples
                </Link>
              </div>
              <div className="mt-2 text-xs text-muted">Reply in 24h · No commitment</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

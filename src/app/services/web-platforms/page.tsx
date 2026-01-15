import Link from "next/link";

export const metadata = {
  title: "Web Platforms & High-Performance Websites",
  description:
    "High-performance web platforms and websites built with modern engineering: SEO, speed, accessibility, and AI/data integrations.",
};

const capabilities = [
  "Next.js websites & web apps",
  "Conversion-focused UX/UI",
  "SEO architecture & technical SEO",
  "Performance & Core Web Vitals",
  "Dashboards & analytics integration",
  "AI features embedded in product",
];

const outcomes = [
  {
    title: "Speed + SEO",
    desc: "Fast pages and clean information architecture that search engines and users love.",
  },
  {
    title: "Conversion-ready",
    desc: "Clear positioning, strong CTAs, and UX designed to turn visits into action.",
  },
  {
    title: "Integration-first",
    desc: "We connect your site to data, dashboards, CRMs, and AI modules without bloat.",
  },
];

const deliverables = [
  {
    title: "Landing pages",
    desc: "SEO-optimized service pages built for speed and lead generation.",
  },
  {
    title: "Product platforms",
    desc: "Full web apps with auth, dashboards, and modern UI systems.",
  },
  {
    title: "Analytics-enabled sites",
    desc: "Events, funnels, and measurement that help you improve what matters.",
  },
];

export default function WebPlatformsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-gradient border-b border-border">
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Service
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Web platforms built for speed and scale
            </h1>
            <p className="mt-5 text-base text-muted md:text-lg">
              We build modern websites and web applications that load fast, rank well, and convert.
              Clean architecture, premium UI, and integrations with data and AI — without bloat.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Book a Call
              </Link>
              <Link href="/work" className="btn-secondary">
                View work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          What we deliver
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          From marketing sites to internal platforms — we ship production-ready web systems with
          performance and SEO built in.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {capabilities.map((c) => (
            <div key={c} className="card p-6">
              <div className="text-sm font-semibold">{c}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="card p-10 md:p-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Outcomes
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Built to perform — technically and commercially
              </h2>
              <p className="mt-3 text-muted">
                Great web engineering is invisible when it works: fast, stable, measurable.
              </p>
            </div>

            <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
              {outcomes.map((o) => (
                <div key={o.title} className="rounded-3xl border border-border bg-muted p-6">
                  <div className="text-sm font-semibold">{o.title}</div>
                  <p className="mt-2 text-sm text-muted">{o.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          Typical builds
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Pick a direction — we’ll tailor scope and architecture to your timeline and goals.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {deliverables.map((d) => (
            <div key={d.title} className="group card p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight">{d.title}</h3>
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
              <p className="mt-3 text-sm text-muted leading-relaxed">{d.desc}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-transform duration-200 group-hover:translate-x-0.5">
                Discuss this build <span aria-hidden="true">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-border bg-muted p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Want a platform that feels premium and loads instantly?
          </h2>
          <p className="mt-3 text-muted">
            Tell us what you’re building. We’ll recommend the best architecture and fastest path to
            launch.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Talk to us
            </Link>
            <Link href="/services" className="btn-secondary">
              Back to services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
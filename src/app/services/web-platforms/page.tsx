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

const workflow = [
  { title: "Frame", desc: "Define conversion goals, IA, and performance targets." },
  { title: "Build", desc: "Ship a fast frontend with clean integration architecture." },
  { title: "Scale", desc: "Iterate with analytics, SEO, and product expansion paths." },
];

const benchmarks = [
  { value: "4-8 weeks", label: "to first production release" },
  { value: "Medium", label: "implementation complexity" },
  { value: "30-60 days", label: "ROI signal horizon" },
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
              <Link href="/work" className="inline-flex items-center text-sm font-medium text-muted transition hover:text-fg">
                View work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual workflow */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted">
          Visual workflow
        </div>
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          Frame → Build → Scale
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          A practical sequence for launching premium web products that stay fast and maintainable.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {workflow.map((item, idx) => (
            <div key={item.title} className="card p-6">
              <div className="text-xs text-muted">0{idx + 1}</div>
              <div className="mt-2 text-sm font-semibold">{item.title}</div>
              <p className="mt-2 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          Capabilities
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Building blocks for high-performance websites and product platforms.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {capabilities.map((c) => (
            <span key={c} className="rounded-full border border-border bg-muted px-4 py-2 text-sm">
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="card p-10 md:p-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Typical ranges</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Typical delivery profile
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {benchmarks.map((item) => (
              <div key={item.label} className="rounded-3xl border border-border bg-muted p-6">
                <div className="text-lg font-semibold">{item.value}</div>
                <div className="mt-1 text-sm text-muted">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted">
            Typical planning guidance only. Real timelines and ROI depend on scope, integrations, and content maturity.
          </p>
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
            <Link href="/services" className="inline-flex items-center text-sm font-medium text-muted transition hover:text-fg">
              Back to services
            </Link>
          </div>
          <div className="mt-2 text-xs text-muted">Reply in 24h · No commitment</div>
        </div>
      </section>
    </main>
  );
}

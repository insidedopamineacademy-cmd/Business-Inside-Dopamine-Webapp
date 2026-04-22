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
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Service
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Web platforms built for speed and scale
            </h1>
            <p className="mt-5 text-base text-[var(--color-text-secondary)] md:text-lg">
              We build modern websites and web applications that load fast, rank well, and convert.
              Clean architecture, premium UI, and integrations with data and AI — without bloat.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                Book a Call
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                View work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual workflow */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Visual workflow
        </div>
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          Frame → Build → Scale
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--color-text-secondary)]">
          A practical sequence for launching premium web products that stay fast and maintainable.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {workflow.map((item, idx) => (
            <div key={item.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <div className="text-xs text-[var(--color-text-secondary)]">0{idx + 1}</div>
              <div className="mt-2 text-sm font-semibold">{item.title}</div>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          Capabilities
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--color-text-secondary)]">
          Building blocks for high-performance websites and product platforms.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {capabilities.map((c) => (
            <span key={c} className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm">
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-10 shadow-sm md:p-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Typical ranges</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Typical delivery profile
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {benchmarks.map((item) => (
              <div key={item.label} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="text-lg font-semibold">{item.value}</div>
                <div className="mt-1 text-sm text-[var(--color-text-secondary)]">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-[var(--color-text-secondary)]">
            Typical planning guidance only. Real timelines and ROI depend on scope, integrations, and content maturity.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Want a platform that feels premium and loads instantly?
          </h2>
          <p className="mt-3 text-[var(--color-text-secondary)]">
            Tell us what you're building. We'll recommend the best architecture and fastest path to
            launch.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              Talk to us
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              Back to services
            </Link>
          </div>
          <div className="mt-2 text-xs text-[var(--color-text-secondary)]">Reply in 24h · No commitment</div>
        </div>
      </section>
    </main>
  );
}

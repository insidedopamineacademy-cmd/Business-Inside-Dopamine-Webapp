import Link from "next/link";

export const metadata = {
  title: "Data Analytics & BI Dashboards",
  description:
    "BI dashboards and data analytics solutions that turn complex data into clear, actionable decisions for leadership and teams.",
};

const capabilities = [
  "BI dashboard design",
  "Data modeling & semantic layers",
  "KPI frameworks & governance",
  "Automated refresh & alerting",
  "Performance optimization",
  "Executive storytelling",
];

const workflow = [
  { title: "Signal", desc: "Map KPIs, stakeholders, and decision moments." },
  { title: "Model", desc: "Build governed data models and semantic definitions." },
  { title: "Activate", desc: "Ship dashboards with alerts and iteration loops." },
];

const benchmarks = [
  { value: "2-4 weeks", label: "to first dashboard release" },
  { value: "Weekly", label: "decision cadence support" },
  { value: "Low-Medium", label: "implementation complexity" },
];

export default function DataAnalyticsPowerBIPage() {
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
              Data analytics & BI dashboards
            </h1>
            <p className="mt-5 text-base text-[var(--color-text-secondary)] md:text-lg">
              We design dashboards leaders trust — built on clean data models, clear KPIs, and
              performance-optimized BI architecture.
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
                View dashboards
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
          Signal → Model → Activate
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--color-text-secondary)]">
          A compact delivery path designed to move from fragmented reporting to trusted executive
          decisions.
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
          Core building blocks we use to deliver decision-grade BI systems.
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
            Typical planning guidance only. Final scope depends on source quality, tooling, and governance.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Ready to turn data into decisions?
          </h2>
          <p className="mt-3 text-[var(--color-text-secondary)]">
            Tell us about your data and reporting needs. We'll design the right BI foundation.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              Talk to an expert
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

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
      <section className="hero-gradient border-b border-border">
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Service
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Data analytics & BI dashboards
            </h1>
            <p className="mt-5 text-base text-muted md:text-lg">
              We design dashboards leaders trust — built on clean data models, clear KPIs, and
              performance-optimized BI architecture.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Book a Call
              </Link>
              <Link href="/work" className="inline-flex items-center text-sm font-medium text-muted transition hover:text-fg">
                View dashboards
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
          Signal → Model → Activate
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          A compact delivery path designed to move from fragmented reporting to trusted executive
          decisions.
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
          Core building blocks we use to deliver decision-grade BI systems.
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
            Typical planning guidance only. Final scope depends on source quality, tooling, and governance.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-border bg-muted p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Ready to turn data into decisions?
          </h2>
          <p className="mt-3 text-muted">
            Tell us about your data and reporting needs. We’ll design the right BI foundation.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Talk to an expert
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

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

const useCases = [
  {
    title: "Executive reporting",
    desc: "High-level dashboards for leadership, focused on trends, risks, and performance signals.",
  },
  {
    title: "Sales & revenue analytics",
    desc: "Pipeline visibility, churn analysis, cohort tracking, and forecasting.",
  },
  {
    title: "Operations & finance",
    desc: "Cost tracking, efficiency metrics, and operational KPIs across departments.",
  },
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
              <Link href="/work" className="btn-secondary">
                View dashboards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          What we deliver
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          From raw data to executive insight — we build analytics systems that scale with your
          organization.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {capabilities.map((c) => (
            <div key={c} className="card p-6">
              <div className="text-sm font-semibold">{c}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="card p-10 md:p-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Use cases
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Where BI dashboards create impact
              </h2>
              <p className="mt-3 text-muted">
                Dashboards designed for real operational and strategic decisions.
              </p>
            </div>

            <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
              {useCases.map((u) => (
                <div key={u.title} className="rounded-3xl border border-border bg-muted p-6">
                  <div className="text-sm font-semibold">{u.title}</div>
                  <p className="mt-2 text-sm text-muted">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          Our approach
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Analytics should reduce friction, not create it. Our process is simple and transparent.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="card p-6">
            <div className="text-sm font-semibold">1. Understand</div>
            <p className="mt-2 text-sm text-muted">Business goals, metrics, and data sources.</p>
          </div>
          <div className="card p-6">
            <div className="text-sm font-semibold">2. Model</div>
            <p className="mt-2 text-sm text-muted">Clean data models and semantic layers.</p>
          </div>
          <div className="card p-6">
            <div className="text-sm font-semibold">3. Visualize</div>
            <p className="mt-2 text-sm text-muted">Dashboards designed for clarity and speed.</p>
          </div>
          <div className="card p-6">
            <div className="text-sm font-semibold">4. Enable</div>
            <p className="mt-2 text-sm text-muted">Documentation, training, and iteration.</p>
          </div>
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
            <Link href="/services" className="btn-secondary">
              Back to services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
import Link from "next/link";

export const metadata = {
  title: "AI Solutions & LLM Copilots",
  description:
    "Custom AI solutions including LLM copilots, RAG chatbots, and predictive systems integrated into real business workflows.",
};

const capabilities = [
  "LLM copilots & assistants",
  "RAG (retrieval-augmented generation)",
  "Secure internal chatbots",
  "Workflow automation with AI",
  "Predictive & forecasting models",
  "AI integration into web platforms",
];

const useCases = [
  {
    title: "Internal knowledge copilots",
    desc: "AI assistants trained on company documents, policies, and data — with access control.",
  },
  {
    title: "Operational automation",
    desc: "AI-driven workflows that reduce manual tasks and surface the next best action.",
  },
  {
    title: "Decision support",
    desc: "Predictive models and AI summaries that support leadership decisions.",
  },
];

export default function AISolutionsPage() {
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
              AI solutions built for real workflows
            </h1>
            <p className="mt-5 text-base text-muted md:text-lg">
              We design and integrate AI systems that actually get used — secure, explainable, and
              embedded directly into your tools and processes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Book a Call
              </Link>
              <Link href="/work" className="btn-secondary">
                View examples
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          What we build
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          From prototypes to production systems — our AI solutions are designed to integrate cleanly
          with your existing data and platforms.
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
                Where AI creates leverage
              </h2>
              <p className="mt-3 text-muted">
                Practical AI use cases focused on speed, accuracy, and trust.
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

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          Our AI principles
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          We build AI systems that teams can trust, explain, and operate long-term.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="card p-6">
            <div className="text-sm font-semibold">Secure by design</div>
            <p className="mt-2 text-sm text-muted">
              Access controls, private data handling, and deployment choices that fit your risk
              profile.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-sm font-semibold">Explainable outputs</div>
            <p className="mt-2 text-sm text-muted">
              Transparent prompts, sources, and summaries — not black boxes.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-sm font-semibold">Workflow-first</div>
            <p className="mt-2 text-sm text-muted">
              AI embedded into tools people already use.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-sm font-semibold">Measurable impact</div>
            <p className="mt-2 text-sm text-muted">
              Clear success metrics tied to time saved, accuracy, or cost reduction.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-border bg-muted p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Ready to add AI to your workflow?
          </h2>
          <p className="mt-3 text-muted">
            Tell us what you want to automate or accelerate. We’ll design the right AI solution.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Talk to an AI expert
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
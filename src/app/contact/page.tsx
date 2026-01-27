import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Inside Dopamine about BI dashboards, AI copilots, and high-performance web platforms.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="hero-gradient rounded-3xl border border-border bg-card p-8 md:p-12">
        <h1 className="text-3xl font-semibold md:text-5xl">Contact</h1>
        <p className="mt-4 text-muted md:text-lg">
          Tell us what you’re building — we’ll reply with next steps, timelines, and a clear plan.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <div className="text-sm font-semibold">Email</div>
            <p className="mt-2 text-sm text-muted">
              Prefer email? Send your requirements and a sample dataset (if available).
            </p>
            <div className="mt-4">
              <a className="btn-primary" href="mailto:hello@insidedopamine.com">
                hello@insidedopamine.com
              </a>
            </div>
          </div>

          <div className="card p-6">
            <div className="text-sm font-semibold">Book a call</div>
            <p className="mt-2 text-sm text-muted">
              If you already know the goal, jump straight to a quick call.
            </p>
            <div className="mt-4 flex gap-3">
              <Link className="btn-primary" href="/services">
                View Services
              </Link>
              <Link className="btn-secondary" href="/work">
                View Work
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-muted">
          Typical projects: BI dashboards • AI copilots (RAG) • Web platforms • Predictive models
        </div>
      </section>
    </main>
  );
}
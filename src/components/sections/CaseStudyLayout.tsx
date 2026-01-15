import Link from "next/link";

type CaseStudyProps = {
  title: string;
  category: string;
  summary: string;
  context: string;
  problem: string[];
  solution: string[];
  architecture: string[];
  outcomes: string[];
};

export default function CaseStudyLayout({
  title,
  category,
  summary,
  context,
  problem,
  solution,
  architecture,
  outcomes,
}: CaseStudyProps) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="text-xs text-muted">{category}</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base text-muted md:text-lg">{summary}</p>
      </div>

      {/* Context */}
      <Section title="Context">
        <p className="text-muted">{context}</p>
      </Section>

      {/* Problem */}
      <Section title="Problem">
        <List items={problem} />
      </Section>

      {/* Solution */}
      <Section title="Solution">
        <List items={solution} />
      </Section>

      {/* Architecture */}
      <Section title="Architecture">
        <List items={architecture} />
      </Section>

      {/* Outcomes */}
      <Section title="Outcomes">
        <div className="grid gap-3 md:grid-cols-2">
          {outcomes.map((o) => (
            <div
              key={o}
              className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
            >
              {o}
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <div className="mt-16 rounded-3xl border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-semibold">Building something similar?</h2>
        <p className="mt-3 text-sm text-muted">
          Let’s talk about how this could work for your team.
        </p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-fg px-6 py-3 text-sm font-medium text-white dark:text-black"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-muted">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
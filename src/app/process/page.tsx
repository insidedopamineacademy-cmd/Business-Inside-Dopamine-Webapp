import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/sections/PageHero";
import PageCta from "@/components/sections/PageCta";

export const metadata: Metadata = {
  title: "Process | Inside Dopamine",
  description:
    "A clear five-step method for planning, building, and launching the right system.",
};

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "We map your workflows and bottlenecks.",
  },
  {
    number: "02",
    title: "Design",
    description: "We architect the system around your operations.",
  },
  {
    number: "03",
    title: "Build",
    description: "We develop, integrate, and automate everything.",
  },
  {
    number: "04",
    title: "Deploy",
    description: "We launch and make sure it runs cleanly.",
  },
  {
    number: "05",
    title: "Scale",
    description: "We iterate and expand as your business grows.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        label="PROCESS"
        headline="A simple method for building the right system."
        intro="We keep the work structured from discovery to launch so the build stays clear and useful."
      />

      <section className="section-space surface-soft" aria-label="Process steps">
        <Container>
          <ol className="border-y border-[var(--border-light)] py-2 md:py-3">
            {steps.map((step) => (
              <li key={step.number} className="grid grid-cols-[52px_1fr] gap-4 py-5 md:grid-cols-[72px_1fr] md:gap-8 md:py-6">
                <p className="type-mono process-number-halo text-[var(--color-muted)]">
                  {step.number}
                </p>
                <div>
                  <h3 className="type-section text-xl text-[var(--color-text)] md:text-2xl">{step.title}</h3>
                  <p className="type-body mt-2">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <PageCta
        heading="Book a Strategy Call"
        ctaLabel="Book a Strategy Call →"
        href="/contact"
      />
    </>
  );
}

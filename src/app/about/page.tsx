import type { Metadata } from "next";
import Container from "../../../components/ui/Container";
import PageHero from "../../../components/sections/PageHero";
import PageCta from "../../../components/sections/PageCta";

export const metadata: Metadata = {
  title: "About | Inside Dopamine",
  description:
    "Inside Dopamine builds systems that reduce operational drag and make execution easier.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="ABOUT"
        headline="Built for teams that are done doing things manually."
        intro="Inside Dopamine builds systems that reduce operational drag and make execution easier."
      />

      <section className="section-space" aria-label="What we do">
        <Container>
          <div className="max-w-[44rem] rounded-2xl border border-[var(--border-light)] bg-[var(--color-bg)] p-6 md:p-8">
            <h2 className="type-section text-2xl text-[var(--color-text)] md:text-3xl">What we do</h2>
            <p className="type-body mt-4">
              We design and build dashboards, automations, internal tools, and AI systems for
              teams that need custom infrastructure — not generic software.
            </p>
          </div>
        </Container>
      </section>

      <section className="section-space" aria-label="How we work">
        <Container>
          <div className="max-w-[44rem] rounded-2xl border border-[var(--border-light)] bg-[var(--color-bg)] p-6 md:p-8">
            <h2 className="type-section text-2xl text-[var(--color-text)] md:text-3xl">How we work</h2>
            <p className="type-body mt-4">
              We keep projects clear, fast, and structured. Understand the workflow, design the
              right system, build it properly, and make sure it runs cleanly.
            </p>
          </div>
        </Container>
      </section>

      <PageCta heading="Book a Strategy Call" ctaLabel="Book a Strategy Call →" href="/contact" />
    </>
  );
}

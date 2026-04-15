import type { Metadata } from "next";
import Link from "next/link";
import Container from "../../../components/ui/Container";
import Tag from "../../../components/ui/Tag";
import PageHero from "../../../components/sections/PageHero";
import PageCta from "../../../components/sections/PageCta";
import { orderedCaseStudies } from "./caseStudies";

export const metadata: Metadata = {
  title: "Work | Inside Dopamine",
  description:
    "Selected systems built to improve visibility, speed, and operational execution.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        label="WORK"
        headline="A few systems built to improve speed, visibility, and execution."
        intro="Selected examples of dashboards, automations, and internal tools built for operational clarity."
      />

      <section className="section-space" aria-label="Work examples">
        <Container>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {orderedCaseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/work/${study.slug}`}
                className="work-card flex h-full flex-col rounded-2xl border border-[var(--border-light)] bg-[var(--color-bg)] p-6 no-underline md:p-7"
              >
                <p className="type-section text-3xl leading-[1.02] text-[var(--color-text)] md:text-4xl">
                  {study.card.metric}
                </p>
                <p className="type-section mt-4 text-lg tracking-[-0.01em] text-[var(--color-text)] md:text-xl">
                  {study.card.system}
                </p>
                <p className="type-body mt-4 text-sm text-[var(--color-muted)]">
                  {study.card.context}
                </p>
                <div className="mt-6">
                  <Tag>{study.card.tag}</Tag>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <PageCta
        heading="Need something built around your workflow?"
        ctaLabel="Book a Strategy Call →"
        href="/contact"
      />
    </>
  );
}

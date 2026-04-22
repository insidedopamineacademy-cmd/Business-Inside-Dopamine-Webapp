import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { Section } from "@/components/ui/index";
import PageHero from "@/components/sections/PageHero";
import PageCta from "@/components/sections/PageCta";
import { MotionDiv } from "@/lib/motion";
import { staggerContainer, scaleIn, viewport } from "@/lib/animations";
import { orderedCaseStudies } from "@/data/caseStudies";

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

      <Section background="white" size="md" aria-label="Work examples">
        <MotionDiv
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {orderedCaseStudies.map((study) => (
            <MotionDiv key={study.slug} variants={scaleIn}>
              <Link
                href={`/work/${study.slug}`}
                className="work-card flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 md:p-7"
              >
                <p className="type-section text-3xl leading-[1.02] text-[var(--color-text-primary)] md:text-4xl">
                  {study.card.metric}
                </p>
                <p className="type-section mt-4 text-lg tracking-[-0.01em] text-[var(--color-text-primary)] md:text-xl">
                  {study.card.system}
                </p>
                <p className="type-body mt-4 text-sm text-[var(--color-text-secondary)]">
                  {study.card.context}
                </p>
                <div className="mt-6">
                  <Badge variant="default">{study.card.tag}</Badge>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </Section>

      <PageCta
        heading="Need something built around your workflow?"
        ctaLabel="Book a Strategy Call →"
        href="/contact"
      />
    </>
  );
}

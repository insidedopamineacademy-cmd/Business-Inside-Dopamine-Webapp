import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import PageCta from "../../../../components/sections/PageCta";
import Container from "../../../../components/ui/Container";
import Tag from "../../../../components/ui/Tag";
import {
  caseStudies,
  caseStudySlugs,
  type CaseStudy,
  type CaseStudySlug,
} from "../caseStudies";

type WorkCaseStudyParams = { slug: string };
type WorkCaseStudyPageProps = { params: WorkCaseStudyParams };

function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return caseStudySlugs.includes(slug as CaseStudySlug);
}

function getCaseStudy(slug: string): CaseStudy | null {
  if (!isCaseStudySlug(slug)) return null;
  return caseStudies[slug];
}

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WorkCaseStudyPageProps): Promise<Metadata> {
  const study = getCaseStudy(params.slug);
  if (!study) return {};

  return {
    title: study.seo.title,
    description: study.seo.description,
    alternates: {
      canonical: `/work/${study.slug}`,
    },
  };
}

type TextSectionProps = {
  label: string;
  title: string;
  body: string;
  children?: ReactNode;
};

function TextSection({ label, title, body, children }: TextSectionProps) {
  return (
    <section className="section-space" aria-label={label}>
      <Container>
        <div className="max-w-[46rem]">
          <p className="type-mono text-[var(--color-muted)]">{label}</p>
          <h2 className="type-section mt-3 text-2xl text-[var(--color-text)] md:text-4xl">
            {title}
          </h2>
          <p className="type-body mt-4">{body}</p>
          {children}
        </div>
      </Container>
    </section>
  );
}

export default function WorkCaseStudyPage({ params }: WorkCaseStudyPageProps) {
  const study = getCaseStudy(params.slug);
  if (!study) notFound();

  return (
    <>
      <section className="section-space" aria-label="Case study hero">
        <Container>
          <div className="max-w-[52rem]">
            <p className="type-mono text-[var(--color-muted)]">{study.hero.label}</p>
            <h1 className="type-section mt-4 text-3xl text-[var(--color-text)] md:text-6xl">
              {study.hero.headline}
            </h1>
            <p className="type-body mt-5 max-w-[42rem]">{study.hero.intro}</p>
            <div className="mt-6">
              <Tag>{study.hero.tag}</Tag>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space" aria-label="Key metrics">
        <Container>
          <div className="border-y border-[var(--border-light)] py-4 md:py-5">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
              {study.keyMetrics.map((metric) => (
                <li key={metric} className="py-2 sm:py-3">
                  <p className="type-section text-lg text-[var(--color-text)] md:text-2xl">
                    {metric}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <TextSection
        label="PROBLEM / CONTEXT"
        title="The challenge"
        body={study.problemContext}
      />

      <TextSection label="WHAT WE BUILT" title="System built" body={study.whatBuilt} />

      <TextSection label="OUTCOME" title="What changed" body={study.outcome} />

      <TextSection
        label="STACK / SYSTEM DETAILS"
        title="Core system details"
        body={study.stackSummary}
      >
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="System stack details">
          {study.stackItems.map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
        </ul>
      </TextSection>

      <PageCta
        heading={study.ctaHeading}
        ctaLabel="Book a Strategy Call →"
        href="/contact"
      />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { caseStudies, caseStudySlugs, type CaseStudySlug } from "@/data/caseStudies";
import CaseStudyLayout from "@/components/sections/CaseStudyLayout";
import Section from "@/components/ui/Section";
import RelatedCaseStudies from "@/components/ui/RelatedCaseStudies";

type PageProps = { params: Promise<{ slug: string }> };

function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return caseStudySlugs.includes(slug as CaseStudySlug);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isCaseStudySlug(slug)) return {};
  const study = caseStudies[slug];
  return {
    title: study.seo.title,
    description: study.seo.description,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      title: study.seo.title,
      description: study.seo.description,
      url: `/work/${study.slug}`,
      type: "article",
    },
  };
}

export default async function WorkCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isCaseStudySlug(slug)) notFound();
  const study = caseStudies[slug];
  return (
    <>
      <CaseStudyLayout study={study} />
      <Section background="surface" size="md">
        <RelatedCaseStudies currentSlug={slug} />
      </Section>
    </>
  );
}

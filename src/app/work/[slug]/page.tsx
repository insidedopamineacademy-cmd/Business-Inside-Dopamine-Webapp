import { notFound } from "next/navigation";
import type { Metadata } from "next";

import CaseStudyLayout from "@/components/sections/CaseStudyLayout";
import WorkHeroBackdrop from "@/components/sections/WorkHeroBackdrop";
import { caseStudies, type WorkSlug } from "@/app/content/work/caseStudies";

type Params = { slug: string };

function isWorkSlug(slug: string): slug is WorkSlug {
  return slug in caseStudies;
}

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const slug = params.slug;
  if (!isWorkSlug(slug)) return {};

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

export default function WorkCaseStudyPage({ params }: { params: Params }) {
  const slug = params.slug;
  if (!isWorkSlug(slug)) notFound();

  const study = caseStudies[slug];

  return (
    <div className="relative text-slate-900 dark:text-white">
      <WorkHeroBackdrop />
      <CaseStudyLayout study={study} />
    </div>
  );
}
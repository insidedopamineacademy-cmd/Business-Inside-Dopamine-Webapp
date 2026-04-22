import type { Metadata } from "next";
import { caseStudies } from "@/data/caseStudies";
import CaseStudyLayout from "@/components/sections/CaseStudyLayout";

const study = caseStudies["operations-data-platform"];

export const metadata: Metadata = {
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

export default function Page() {
  return <CaseStudyLayout study={study} />;
}

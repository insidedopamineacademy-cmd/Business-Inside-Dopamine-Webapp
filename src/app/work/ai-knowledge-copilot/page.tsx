import type { Metadata } from "next";
import { caseStudies } from "@/app/content/work/caseStudies";
import WorkCaseStudyPage from "../[slug]/page";

const study = caseStudies["ai-knowledge-copilot"];

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
  return <WorkCaseStudyPage params={{ slug: "ai-knowledge-copilot" }} />;
}
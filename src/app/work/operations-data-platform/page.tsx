import type { Metadata } from "next";
import { caseStudies } from "@/app/content/work/caseStudies";

export { default } from "../[slug]/page";

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
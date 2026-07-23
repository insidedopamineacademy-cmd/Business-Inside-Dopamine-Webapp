import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ReactElement } from "react";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  notFound: vi.fn(),
}));

vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));
vi.mock("@/lib/env", () => ({
  getPublicSiteUrl: () => "https://portfolio.example",
}));

import CaseStudyLayout from "../src/components/sections/CaseStudyLayout";
import RelatedCaseStudies from "../src/components/ui/RelatedCaseStudies";
import Section from "../src/components/ui/Section";
import { caseStudies, caseStudySlugs } from "../src/data/caseStudies";
import sitemap from "../src/app/sitemap";
import WorkCaseStudyPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "../src/app/(public)/work/[slug]/page";

const root = process.cwd();

beforeEach(() => {
  mocks.notFound.mockImplementation(() => {
    throw new Error("NEXT_NOT_FOUND");
  });
});

describe("case-study route ownership", () => {
  it("uses one dynamic owner and no explicit case-study page owners", () => {
    expect(existsSync(join(root, "src/app/(public)/work/[slug]/page.tsx"))).toBe(true);

    for (const slug of caseStudySlugs) {
      expect(existsSync(join(root, `src/app/(public)/work/${slug}/page.tsx`))).toBe(false);
    }
  });

  it("pre-renders every known slug and rejects additional dynamic params", () => {
    expect(generateStaticParams()).toEqual(caseStudySlugs.map((slug) => ({ slug })));
    expect(dynamicParams).toBe(false);
  });

  it("preserves metadata and canonical URLs for every known case study", async () => {
    for (const slug of caseStudySlugs) {
      const study = caseStudies[slug];

      await expect(
        generateMetadata({ params: Promise.resolve({ slug }) }),
      ).resolves.toEqual({
        title: study.seo.title,
        description: study.seo.description,
        alternates: { canonical: `/work/${slug}` },
        openGraph: {
          title: study.seo.title,
          description: study.seo.description,
          url: `/work/${slug}`,
          type: "article",
        },
      });
    }
  });

  it("renders canonical case-study content and related studies consistently", async () => {
    for (const slug of caseStudySlugs) {
      const page = (await WorkCaseStudyPage({
        params: Promise.resolve({ slug }),
      })) as ReactElement<{ children: ReactElement[] }>;
      const caseStudy = page.props.children[0] as ReactElement<{ study: unknown }>;
      const relatedSection = page.props.children[1] as ReactElement<{
        children: ReactElement<{ currentSlug: string }>;
      }>;
      const related = relatedSection.props.children;

      expect(caseStudy.type).toBe(CaseStudyLayout);
      expect(caseStudy.props.study).toBe(caseStudies[slug]);
      expect(relatedSection.type).toBe(Section);
      expect(related.type).toBe(RelatedCaseStudies);
      expect(related.props.currentSlug).toBe(slug);
    }
  });

  it("uses the not-found boundary for an unknown slug", async () => {
    const params = Promise.resolve({ slug: "unknown-case-study" });

    await expect(WorkCaseStudyPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.notFound).toHaveBeenCalledOnce();
    await expect(generateMetadata({ params })).resolves.toEqual({});
  });

  it("includes every case-study URL exactly once in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);

    for (const slug of caseStudySlugs) {
      const expectedUrl = `https://portfolio.example/work/${slug}`;
      expect(urls.filter((url) => url === expectedUrl)).toHaveLength(1);
    }
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env", () => ({
  getPublicSiteUrl: () => "https://portfolio.example",
}));
vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import nextConfig from "../next.config";
import { metadata as aiMetadata } from "../src/app/(public)/services/ai-solutions/page";
import { metadata as biMetadata } from "../src/app/(public)/services/data-analytics-power-bi/page";
import { metadata as platformMetadata } from "../src/app/(public)/services/web-platforms/page";
import sitemap from "../src/app/sitemap";
import {
  caseStudyRouteProjections,
  caseStudySlugs,
  contactEnquiryOptions,
  getPortfolioService,
  homepageWorkCards,
  portfolioCaseStudies,
  portfolioCategories,
  portfolioNavigationItems,
  portfolioServices,
  serviceRouteProjections,
} from "../src/data/portfolio";
import { CONTACT_NEEDS } from "../src/lib/lead-service";
import { SEGMENTS } from "../src/lib/segments";

const root = process.cwd();

function source(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function expectUnique(values: readonly string[]) {
  expect(new Set(values).size).toBe(values.length);
}

describe("typed portfolio registry", () => {
  it("has the three unique stable category identities", () => {
    expect(portfolioCategories).toEqual([
      { key: "product", label: "Product Engineering" },
      { key: "bi", label: "Business Intelligence" },
      { key: "growth", label: "Growth" },
    ]);
    expectUnique(portfolioCategories.map((category) => category.key));
  });

  it("keeps service keys, service slugs, and case-study slugs unique", () => {
    expectUnique(portfolioServices.map((service) => service.key));
    expectUnique(
      portfolioServices.flatMap((service) => (service.slug ? [service.slug] : [])),
    );
    expectUnique(caseStudySlugs);
    expect(caseStudySlugs).toEqual(portfolioCaseStudies.map((study) => study.slug));
  });

  it("uses only valid category, service, and case-study references", () => {
    const categoryKeys = new Set(portfolioCategories.map((category) => category.key));
    const serviceKeys = new Set(portfolioServices.map((service) => service.key));
    const caseStudiesBySlug = new Map(
      portfolioCaseStudies.map((study) => [study.slug, study]),
    );

    for (const service of portfolioServices) {
      expect(categoryKeys.has(service.category)).toBe(true);
    }
    for (const study of portfolioCaseStudies) {
      expect(categoryKeys.has(study.category)).toBe(true);
    }
    for (const option of contactEnquiryOptions) {
      if (option.category) expect(categoryKeys.has(option.category)).toBe(true);
      if (option.serviceKey) expect(serviceKeys.has(option.serviceKey)).toBe(true);
    }
    for (const card of homepageWorkCards) {
      expect(categoryKeys.has(card.category)).toBe(true);
      if (!card.caseStudySlug) continue;
      const relation = caseStudiesBySlug.get(card.caseStudySlug);
      expect(relation).toBeDefined();
      expect(card.category).toBe(relation?.category);
    }
    for (const segment of Object.values(SEGMENTS)) {
      for (const serviceKey of segment.serviceOrder) {
        expect(serviceKeys.has(serviceKey)).toBe(true);
      }
    }
  });

  it("keeps client contact options identical to the authoritative server allowlist", () => {
    expect(CONTACT_NEEDS).toEqual(contactEnquiryOptions.map((option) => option.value));
    expect(source("src/features/contact/components/ContactForm.tsx")).toContain(
      "contactEnquiryOptions.map",
    );
    expect(source("src/lib/lead-service.ts")).toContain(
      "export const CONTACT_NEEDS = contactEnquiryValues",
    );
  });

  it("preserves routed service metadata and intentionally has no Growth detail route", () => {
    expect(aiMetadata).toEqual(getPortfolioService("automation").metadata);
    expect(biMetadata).toEqual(getPortfolioService("dashboard").metadata);
    expect(platformMetadata).toEqual(getPortfolioService("platform").metadata);

    const growthService = getPortfolioService("performance-analytics");
    expect(growthService.category).toBe("growth");
    expect(growthService.slug).toBeNull();
    expect(growthService.href).toBeNull();
    expect(serviceRouteProjections).toHaveLength(3);
  });

  it("projects valid internal routes and preserves legacy work-card redirects", async () => {
    for (const item of portfolioNavigationItems) {
      expect(item.href.startsWith("/")).toBe(true);
      expect(existsSync(join(root, `src/app/(public)${item.href}/page.tsx`))).toBe(true);
    }

    for (const service of serviceRouteProjections) {
      expect(service.href).toBe(`/services/${service.slug}`);
      expect(existsSync(join(root, `src/app/(public)${service.href}/page.tsx`))).toBe(true);
    }

    for (const study of caseStudyRouteProjections) {
      expect(study.href).toBe(`/work/${study.slug}`);
    }
    expect(existsSync(join(root, "src/app/(public)/work/[slug]/page.tsx"))).toBe(true);

    const redirects = await nextConfig.redirects!();
    const redirectBySource = new Map(
      redirects.map((redirect) => [redirect.source, redirect.destination]),
    );
    const validDestinations = new Set([
      "/work",
      ...caseStudyRouteProjections.map((study) => study.href),
    ]);

    for (const card of homepageWorkCards) {
      expect(card.href.startsWith("/")).toBe(true);
      const destination = redirectBySource.get(card.href);
      expect(destination).toBeDefined();
      expect(validDestinations.has(destination!)).toBe(true);
    }
  });

  it("keeps sitemap entries aligned with service and case-study route projections", () => {
    const urls = sitemap().map((entry) => entry.url);

    for (const route of [...serviceRouteProjections, ...caseStudyRouteProjections]) {
      const expectedUrl = `https://portfolio.example${route.href}`;
      expect(urls.filter((url) => url === expectedUrl)).toHaveLength(1);
    }
  });

  it("removes parallel taxonomy definitions from migrated live surfaces", () => {
    const migratedSources = {
      servicesSection: source("src/components/sections/ServicesSection.tsx"),
      servicesPage: source("src/app/(public)/services/page.tsx"),
      workSection: source("src/components/sections/WorkSection.tsx"),
      contactSection: source("src/features/contact/components/ContactForm.tsx"),
      leadService: source("src/lib/lead-service.ts"),
      caseStudies: source("src/data/caseStudies.ts"),
      sitemap: source("src/app/sitemap.ts"),
      navbar: source("src/components/layout/Navbar.tsx"),
      footer: source("src/components/layout/Footer.tsx"),
    };

    expect(migratedSources.servicesSection).not.toContain("const services");
    expect(migratedSources.servicesPage).not.toContain("const serviceBlocks");
    expect(migratedSources.workSection).not.toContain("const workCards");
    expect(migratedSources.contactSection).not.toContain(
      '<option value="BI & AI Dashboards">',
    );
    expect(migratedSources.leadService).not.toContain('"BI & AI Dashboards",');
    expect(migratedSources.caseStudies).not.toContain("export type CaseStudySlug =");
    expect(migratedSources.sitemap).not.toContain('"/services/data-analytics-power-bi"');
    expect(migratedSources.navbar).toContain("...portfolioNavigationItems");
    expect(migratedSources.footer).toContain("...portfolioNavigationItems");

    const registry = source("src/data/portfolio.ts");
    expect(registry).not.toContain('import "server-only"');
    expect(registry).not.toContain('"use server"');
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import WorkPage from "../src/app/(public)/work/page";
import CaseStudyLayout from "../src/components/sections/CaseStudyLayout";
import FinalCTASection from "../src/components/sections/FinalCTASection";
import HeroSection from "../src/components/sections/HeroSection";
import ObjectionHandlingSection from "../src/components/sections/ObjectionHandlingSection";
import PageCta from "../src/components/sections/PageCta";
import PageHero from "../src/components/sections/PageHero";
import ProcessSection from "../src/components/sections/ProcessSection";
import TrustStripSection from "../src/components/sections/TrustStripSection";
import WorkSection from "../src/components/sections/WorkSection";
import {
  caseStudies,
  caseStudySlugs,
  orderedCaseStudies,
} from "../src/data/caseStudies";
import { homepageWorkCards } from "../src/data/portfolio";

const root = process.cwd();

function source(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

const migratedComponents = [
  "src/components/sections/HeroSection.tsx",
  "src/components/sections/TrustStripSection.tsx",
  "src/components/sections/WorkSection.tsx",
  "src/components/sections/ProcessSection.tsx",
  "src/components/sections/ObjectionHandlingSection.tsx",
  "src/components/sections/FinalCTASection.tsx",
  "src/components/sections/PageHero.tsx",
  "src/components/sections/PageCta.tsx",
  "src/components/sections/CaseStudyLayout.tsx",
  "src/app/(public)/work/page.tsx",
] as const;

describe("static presentation server boundaries", () => {
  it("keeps every migrated presentation component server-safe", () => {
    for (const path of migratedComponents) {
      const component = source(path);

      expect(component, path).not.toMatch(/^\s*["']use client["'];/);
      expect(component, path).not.toMatch(
        /framer-motion|@\/lib\/(?:motion|animations)|useReducedMotion|useState|useEffect/,
      );
      expect(component, path).toContain("presentation-reveal");
    }
  });

  it("keeps the services accordion as a focused interactive client island", () => {
    const services = source("src/components/sections/ServicesSection.tsx");

    expect(services).toMatch(/^"use client";/);
    expect(services).toContain("useState");
    expect(services).toContain("useReducedMotion");
    expect(services).toContain("aria-expanded={isOpen}");
    expect(services).toContain("aria-controls={detailId}");
  });
});

describe("server-rendered public presentation", () => {
  it("renders representative heroes and calls to action with unchanged links", () => {
    const markup = renderToStaticMarkup(
      <>
        <HeroSection
          eyebrow="AI-NATIVE DIGITAL AGENCY"
          headline="We build digital products powered by AI"
          subheadline="Inside Dopamine designs and ships dashboards, AI copilots, and full digital platforms for ambitious businesses."
          primaryCta={{ label: "See our work", href: "/work" }}
          secondaryCta={{ label: "Talk to us", href: "/contact" }}
        />
        <PageHero
          label="PROCESS"
          headline="How we work"
          intro="A clear path from discovery to delivery."
        />
        <PageCta heading="Start a project" ctaLabel="Talk to us" href="/contact" />
      </>,
    );

    expect(markup).toContain("AI-NATIVE DIGITAL AGENCY");
    expect(markup).toContain("We build digital products powered by AI");
    expect(markup).toContain('href="/work"');
    expect(markup.match(/href="\/contact"/g)).toHaveLength(2);
    expect(markup).toContain("presentation-reveal-load");
    expect(markup).toContain("presentation-reveal-view");
  });

  it("renders stable homepage copy and registry projections without client state", () => {
    const markup = [
      <TrustStripSection key="trust" />,
      <WorkSection key="work" />,
      <ProcessSection key="process" />,
      <ObjectionHandlingSection key="objections" />,
      <FinalCTASection key="cta" />,
    ].map((element) => renderToStaticMarkup(element)).join("");

    expect(markup).toContain("40+ Systems Built");
    expect(markup).toContain("Proof, not promises.");
    expect(markup).toContain("Clear method. No chaos.");
    expect(markup).toContain("No long-term contracts.");
    expect(markup).toContain("Ready to stop doing it manually?");

    for (const card of homepageWorkCards) {
      expect(markup).toContain(card.headline);
      expect(markup).toContain(`href="${card.href}"`);
    }
  });

  it("renders the work index cards and known case-study links on the server", () => {
    const markup = renderToStaticMarkup(<WorkPage />);

    for (const study of orderedCaseStudies) {
      expect(markup).toContain(study.card.metric);
      expect(markup).toContain(`href="/work/${study.slug}"`);
    }

    expect(markup).toContain("presentation-reveal-scale");
  });
});

describe("server-rendered case studies", () => {
  it("renders every known study through the shared static presentation", () => {
    for (const slug of caseStudySlugs) {
      const study = caseStudies[slug];
      const markup = renderToStaticMarkup(<CaseStudyLayout study={study} />);

      expect(markup).toContain(study.hero.title);
      expect(markup).toContain(study.hero.tags[0]);
      expect(markup).toContain(`href="${study.cta.href}"`);
      expect(markup).toContain("Back to Work");
      expect(markup).toContain("View full details");
    }
  });

  it("preserves native disclosure semantics and initial open state", () => {
    const markup = renderToStaticMarkup(
      <CaseStudyLayout study={caseStudies["ai-knowledge-copilot"]} />,
    );

    expect(markup.match(/<details\b/g)).toHaveLength(4);
    expect(markup.match(/<summary\b/g)).toHaveLength(4);
    expect(markup.match(/<details open=""/g)).toHaveLength(3);
    expect(markup).toContain("presentation-disclosure-motion");
    expect(markup).not.toContain("aria-expanded");
  });
});

describe("CSS presentation motion contract", () => {
  const css = source("src/styles/globals.css");

  it("uses progressive CSS reveals with a visible unsupported-browser fallback", () => {
    expect(css).toContain("@keyframes presentation-reveal-up");
    expect(css).toContain("@supports (animation-timeline: view())");
    expect(css).toContain("animation-timeline: view()");
    expect(css).toContain("animation-range: entry 0% entry 38%");
    expect(css).toMatch(
      /\.presentation-reveal-view\s*{[^}]*opacity:\s*1;[^}]*transform:\s*none;/,
    );
  });

  it("removes reveal motion and disclosure transitions for reduced motion", () => {
    const reducedMotion = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));

    expect(reducedMotion).toContain(".presentation-reveal-load");
    expect(reducedMotion).toContain(".presentation-reveal-view");
    expect(reducedMotion).toContain("animation: none");
    expect(reducedMotion).toContain("opacity: 1");
    expect(reducedMotion).toContain("transform: none");
    expect(reducedMotion).toMatch(
      /\.presentation-disclosure-motion\s*{[^}]*transition-duration:\s*0\.01ms !important;/,
    );
  });
});

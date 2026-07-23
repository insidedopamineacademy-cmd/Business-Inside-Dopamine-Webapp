export type InternalHref = `/${string}`;

export const portfolioCategories = [
  { key: "product", label: "Product Engineering" },
  { key: "bi", label: "Business Intelligence" },
  { key: "growth", label: "Growth" },
] as const;

export type PortfolioCategoryKey = (typeof portfolioCategories)[number]["key"];

type PortfolioServiceDefinition = {
  key: string;
  category: PortfolioCategoryKey;
  slug: string | null;
  href: InternalHref | null;
  index: {
    title: string;
    summary: string;
  };
  homepage: {
    number: string;
    title: string;
    description: string;
    tag: string;
    tagVariant: "accent" | "default";
    detail: string;
  };
  metadata: {
    title: string;
    description: string;
  } | null;
};

export const portfolioServices = [
  {
    key: "dashboard",
    category: "bi",
    slug: "data-analytics-power-bi",
    href: "/services/data-analytics-power-bi",
    index: {
      title: "BI & AI Dashboards",
      summary: "Real-time reporting systems built for visibility and decision-making.",
    },
    homepage: {
      number: "01",
      title: "BI & AI DASHBOARDS",
      description: "Real-time insights across your entire operation.",
      tag: "Primary",
      tagVariant: "accent",
      detail:
        "Built for teams that need live visibility across performance, delivery, and operational throughput, these dashboards replace fragmented reporting with one reliable source of truth. We structure the data around your decisions, not generic templates, so reporting becomes faster, clearer, and useful for daily execution instead of retrospective guesswork.",
    },
    metadata: {
      title: "Data Analytics & BI Dashboards",
      description:
        "BI dashboards and data analytics solutions that turn complex data into clear, actionable decisions for leadership and teams.",
    },
  },
  {
    key: "platform",
    category: "product",
    slug: "web-platforms",
    href: "/services/web-platforms",
    index: {
      title: "Web Applications",
      summary: "Custom tools for internal operations, team workflows, and client-facing utility.",
    },
    homepage: {
      number: "02",
      title: "WEB APPLICATIONS",
      description: "Custom tools built for your workflows, not templates.",
      tag: "Primary",
      tagVariant: "accent",
      detail:
        "These applications are designed around how your team already operates, then improved to remove friction, duplicated effort, and tool switching. Instead of forcing people into generic SaaS constraints, we build a focused system that matches your process, supports real usage at speed, and keeps execution consistent across teams.",
    },
    metadata: {
      title: "Web Platforms & High-Performance Websites",
      description:
        "High-performance web platforms and websites built with modern engineering: SEO, speed, accessibility, and AI/data integrations.",
    },
  },
  {
    key: "automation",
    category: "product",
    slug: "ai-solutions",
    href: "/services/ai-solutions",
    index: {
      title: "Automation Systems",
      summary:
        "AI copilots, NLM solutions, CRM systems, WhatsApp flows, n8n workflows, and intelligent process automation — our broadest and most capable service category.",
    },
    homepage: {
      number: "03",
      title: "AUTOMATION SYSTEMS",
      description:
        "AI copilots, NLM solutions, CRM, WhatsApp flows, and intelligent process automation.",
      tag: "AI • n8n • Integrations",
      tagVariant: "accent",
      detail:
        "Our broadest and most capable service category. We build AI copilots and NLM solutions trained on your business logic, CRM systems that qualify and route leads automatically, WhatsApp flows that turn conversations into conversions, and n8n-powered workflows that connect every tool in your stack. The result is end-to-end intelligent process automation — less coordination overhead, fewer dropped steps, and an operation that compounds in efficiency over time.",
    },
    metadata: {
      title: "AI Solutions & LLM Copilots",
      description:
        "Custom AI solutions including LLM copilots, RAG chatbots, and predictive systems integrated into real business workflows.",
    },
  },
  {
    key: "performance-analytics",
    category: "growth",
    slug: null,
    href: null,
    index: {
      title: "Performance & Analytics",
      summary:
        "Google Ads management, GA4, GTM, conversion tracking, and AI-powered campaign analysis — the full measurement and growth stack.",
    },
    homepage: {
      number: "04",
      title: "PERFORMANCE & ANALYTICS",
      description: "Data-driven growth, measured and optimised.",
      tag: "Google Ads • GA4",
      tagVariant: "default",
      detail:
        "We build the full measurement stack — GA4, GTM, conversion tracking, and attribution — then layer Google Ads management on top. AI-powered analysis turns your data into decisions, not just reports. From initial setup to ongoing optimisation, we own the full loop: track, analyse, act, and iterate. Key inclusions: Google Ads Management, GA4 Setup & Configuration, Google Tag Manager, Conversion Tracking & Attribution, Custom Performance Dashboards, and AI Campaign Analysis.",
    },
    metadata: null,
  },
] as const satisfies readonly PortfolioServiceDefinition[];

export type PortfolioService = (typeof portfolioServices)[number];
export type PortfolioServiceKey = PortfolioService["key"];
export type PortfolioServiceSlug = Exclude<PortfolioService["slug"], null>;

export function getPortfolioService<Key extends PortfolioServiceKey>(key: Key) {
  const service = portfolioServices.find((candidate) => candidate.key === key);
  if (!service) throw new Error(`Unknown portfolio service: ${key}`);
  return service as Extract<PortfolioService, { key: Key }>;
}

export const portfolioServiceIndexItems = portfolioServices.map((service) => ({
  id: service.key,
  category: service.category,
  title: service.index.title,
  description: service.index.summary,
}));

export const homepageServiceItems = portfolioServices.map((service) => ({
  key: service.key,
  category: service.category,
  ...service.homepage,
}));

export const serviceRouteProjections = portfolioServices.flatMap((service) =>
  service.slug && service.href
    ? [
        {
          key: service.key,
          category: service.category,
          slug: service.slug,
          href: service.href,
          label: service.index.title,
        },
      ]
    : [],
);

export const portfolioCaseStudies = [
  {
    slug: "ai-knowledge-copilot",
    category: "product",
    href: "/work/ai-knowledge-copilot",
  },
  {
    slug: "executive-sales-dashboard",
    category: "bi",
    href: "/work/executive-sales-dashboard",
  },
  {
    slug: "operations-data-platform",
    category: "bi",
    href: "/work/operations-data-platform",
  },
] as const satisfies readonly {
  slug: string;
  category: PortfolioCategoryKey;
  href: InternalHref;
}[];

export type CaseStudySlug = (typeof portfolioCaseStudies)[number]["slug"];

export const caseStudySlugs: CaseStudySlug[] = portfolioCaseStudies.map(
  (study) => study.slug,
);

export const caseStudyRouteProjections = portfolioCaseStudies.map((study) => ({
  ...study,
  label: study.slug,
}));

export const portfolioNavigationItems = [
  { href: "/services", label: "Solutions" },
  { href: "/work", label: "Work" },
] as const satisfies readonly { href: InternalHref; label: string }[];

export const homepageWorkCards = [
  {
    headline: "Reporting that runs itself",
    subheadline: "BI dashboard + automation layer",
    label: "BI & AUTOMATION",
    clientType: "Operations team",
    href: "/work/reporting-speed-dashboard",
    category: "bi",
    caseStudySlug: "executive-sales-dashboard",
  },
  {
    headline: "Leads qualified before your team picks up the phone",
    subheadline: "WhatsApp + CRM qualification flow",
    label: "CRM & MESSAGING",
    clientType: "E-commerce brand",
    href: "/work/whatsapp-crm-qualification-flow",
    category: "growth",
    caseStudySlug: null,
  },
  {
    headline: "Internal tool live in three weeks",
    subheadline: "Custom web app for internal operations",
    label: "WEB APP",
    clientType: "Multi-team workflow",
    href: "/work/internal-ops-web-app",
    category: "bi",
    caseStudySlug: "operations-data-platform",
  },
] as const satisfies readonly {
  headline: string;
  subheadline: string;
  label: string;
  clientType: string;
  href: InternalHref;
  category: PortfolioCategoryKey;
  caseStudySlug: CaseStudySlug | null;
}[];

export const contactEnquiryOptions = [
  {
    value: "BI & AI Dashboards",
    label: "BI & AI Dashboards",
    category: "bi",
    serviceKey: "dashboard",
  },
  {
    value: "Web Applications",
    label: "Web Applications",
    category: "product",
    serviceKey: "platform",
  },
  {
    value: "Automation Systems",
    label: "Automation Systems",
    category: "product",
    serviceKey: "automation",
  },
  {
    value: "AI Copilots & LLMs",
    label: "AI Copilots & LLMs",
    category: "product",
    serviceKey: "automation",
  },
  {
    value: "CRM & WhatsApp Flows",
    label: "CRM & WhatsApp Flows",
    category: "product",
    serviceKey: "automation",
  },
  {
    value: "Other",
    label: "Other",
    category: null,
    serviceKey: null,
  },
] as const satisfies readonly {
  value: string;
  label: string;
  category: PortfolioCategoryKey | null;
  serviceKey: PortfolioServiceKey | null;
}[];

export type ContactEnquiryValue = (typeof contactEnquiryOptions)[number]["value"];

export const contactEnquiryValues: readonly ContactEnquiryValue[] =
  contactEnquiryOptions.map((option) => option.value);

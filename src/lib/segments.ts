export interface Segment {
  key: string;
  label: string;
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    cta: string;
  };
  serviceOrder: string[];
  caseStudyTags: string[];
}

export const SEGMENTS: Record<string, Segment> = {
  ai: {
    key: "ai",
    label: "AI-Focused Visitor",
    hero: {
      eyebrow: "AI-Native Agency",
      headline: "We build AI products your team will actually use",
      subheadline:
        "From knowledge copilots to intelligent dashboards — we design, build and ship AI that fits your workflow, not the other way around.",
      cta: "See our AI work",
    },
    serviceOrder: ["ai-copilot", "dashboard", "platform", "strategy"],
    caseStudyTags: ["ai", "copilot", "automation"],
  },

  dashboard: {
    key: "dashboard",
    label: "Dashboard / Analytics Visitor",
    hero: {
      eyebrow: "Data Visualisation Experts",
      headline: "The dashboard agency that ships in two weeks",
      subheadline:
        "We turn your raw data into executive-ready dashboards that drive real decisions — fast, beautiful, and built to scale.",
      cta: "See our dashboard work",
    },
    serviceOrder: ["dashboard", "analytics", "platform", "ai-copilot"],
    caseStudyTags: ["dashboard", "analytics", "data"],
  },

  platform: {
    key: "platform",
    label: "Platform / Product Visitor",
    hero: {
      eyebrow: "Product Studio",
      headline: "From idea to shipped product — in weeks, not months",
      subheadline:
        "We are the technical co-founder you need — strategy, design, and full-stack engineering under one roof.",
      cta: "See how we build",
    },
    serviceOrder: ["platform", "strategy", "dashboard", "ai-copilot"],
    caseStudyTags: ["platform", "saas", "product"],
  },

  enterprise: {
    key: "enterprise",
    label: "Enterprise Visitor",
    hero: {
      eyebrow: "Enterprise Digital Partner",
      headline: "Enterprise-grade digital products, startup speed",
      subheadline:
        "We embed with your team to design and deliver secure, scalable digital products — with the governance your stakeholders expect.",
      cta: "Talk to our team",
    },
    serviceOrder: ["platform", "dashboard", "ai-copilot", "strategy"],
    caseStudyTags: ["enterprise", "scale", "governance"],
  },

  general: {
    key: "general",
    label: "General Visitor",
    hero: {
      eyebrow: "AI-Native Digital Agency",
      headline: "We build digital products powered by AI",
      subheadline:
        "Inside Dopamine designs and ships dashboards, AI copilots, and full digital platforms for ambitious businesses.",
      cta: "See our work",
    },
    serviceOrder: ["dashboard", "ai-copilot", "platform", "strategy"],
    caseStudyTags: [],
  },
};

export function getSegment(key: string): Segment {
  return SEGMENTS[key] ?? SEGMENTS.general;
}

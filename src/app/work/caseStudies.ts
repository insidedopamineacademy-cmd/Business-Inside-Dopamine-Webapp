export type CaseStudySlug =
  | "reporting-speed-dashboard"
  | "whatsapp-crm-qualification-flow"
  | "internal-ops-web-app";

export type CaseStudy = {
  slug: CaseStudySlug;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    label: "CASE STUDY";
    headline: string;
    intro: string;
    tag: string;
  };
  keyMetrics: [string, string, string];
  problemContext: string;
  whatBuilt: string;
  outcome: string;
  stackSummary: string;
  stackItems: string[];
  ctaHeading: string;
  card: {
    metric: string;
    system: string;
    context: string;
    tag: string;
  };
};

export const caseStudySlugs: CaseStudySlug[] = [
  "reporting-speed-dashboard",
  "whatsapp-crm-qualification-flow",
  "internal-ops-web-app",
];

export const caseStudies: Record<CaseStudySlug, CaseStudy> = {
  "reporting-speed-dashboard": {
    slug: "reporting-speed-dashboard",
    seo: {
      title: "12x Faster Reporting | Case Study | Inside Dopamine",
      description:
        "BI dashboard and automation layer that replaced manual reporting for an ops-heavy services team.",
    },
    hero: {
      label: "CASE STUDY",
      headline: "12x faster reporting for an ops-heavy services team.",
      intro:
        "We built a BI dashboard and automation layer that replaced manual reporting workflows and gave the team real-time visibility.",
      tag: "BI & Automation",
    },
    keyMetrics: [
      "12x Reporting speed",
      "1 source of truth",
      "Hours of manual work removed",
    ],
    problemContext:
      "The team was pulling operational data manually across multiple sources. Reporting was slow, repetitive, and hard to trust.",
    whatBuilt:
      "A central dashboard with an automation layer that consolidated reporting inputs and made day-to-day visibility immediate.",
    outcome:
      "Reporting became faster, cleaner, and easier to act on. Leadership could see what mattered without waiting on manual updates.",
    stackSummary:
      "Dashboard layer, reporting automation, workflow cleanup, operational visibility system",
    stackItems: [
      "Dashboard layer",
      "Reporting automation",
      "Workflow cleanup",
      "Operational visibility system",
    ],
    ctaHeading: "Need better visibility across operations?",
    card: {
      metric: "12x faster reporting",
      system: "BI dashboard + automation layer",
      context: "Ops-heavy services team",
      tag: "BI & Automation",
    },
  },
  "whatsapp-crm-qualification-flow": {
    slug: "whatsapp-crm-qualification-flow",
    seo: {
      title: "+127% Lead Conversion | Case Study | Inside Dopamine",
      description:
        "Automated WhatsApp and CRM qualification flow that increased conversion and reduced manual follow-up load.",
    },
    hero: {
      label: "CASE STUDY",
      headline:
        "+127% lead conversion through a WhatsApp + CRM qualification flow.",
      intro:
        "We built a lead qualification system that captured, routed, and followed up automatically across WhatsApp and CRM workflows.",
      tag: "CRM & Messaging",
    },
    keyMetrics: [
      "+127% Lead conversion",
      "Faster qualification",
      "Lower manual follow-up load",
    ],
    problemContext:
      "The brand had strong lead volume, but qualification and follow-up were inconsistent. Too much depended on manual messaging and delayed responses.",
    whatBuilt:
      "An automated WhatsApp and CRM flow that captured leads, qualified intent, and routed follow-up without relying on manual repetition.",
    outcome:
      "Lead handling became faster and more consistent. More prospects moved through the funnel without operational drag.",
    stackSummary:
      "WhatsApp automation, CRM integration, lead routing, qualification logic, follow-up workflow",
    stackItems: [
      "WhatsApp automation",
      "CRM integration",
      "Lead routing",
      "Qualification logic",
      "Follow-up workflow",
    ],
    ctaHeading: "Need a better lead handling system?",
    card: {
      metric: "+127% lead conversion",
      system: "WhatsApp + CRM qualification flow",
      context: "Ecommerce brand",
      tag: "CRM & Messaging",
    },
  },
  "internal-ops-web-app": {
    slug: "internal-ops-web-app",
    seo: {
      title: "3-Week Internal Ops Web App | Case Study | Inside Dopamine",
      description:
        "Custom internal operations web app launched in three weeks for a multi-team workflow.",
    },
    hero: {
      label: "CASE STUDY",
      headline: "A 3-week internal web app launch for a multi-team workflow.",
      intro:
        "We built a custom internal operations tool that gave the team a cleaner workflow and reduced friction across day-to-day execution.",
      tag: "Web App",
    },
    keyMetrics: [
      "3-week launch",
      "Multi-team workflow support",
      "Less operational friction",
    ],
    problemContext:
      "The existing workflow was fragmented across tools and manual steps. Teams were losing time switching contexts and managing process inconsistently.",
    whatBuilt:
      "A custom web application built around the team’s actual internal process, giving them one cleaner environment for execution.",
    outcome:
      "The workflow became more structured and easier to manage. Teams spent less time coordinating the process and more time moving work forward.",
    stackSummary:
      "Custom web app, workflow interface, internal operations tool, process simplification",
    stackItems: [
      "Custom web app",
      "Workflow interface",
      "Internal operations tool",
      "Process simplification",
    ],
    ctaHeading: "Need an internal tool built around your workflow?",
    card: {
      metric: "3-week internal tool launch",
      system: "Custom web app for internal operations",
      context: "Multi-team workflow",
      tag: "Web App",
    },
  },
};

export const orderedCaseStudies: CaseStudy[] = caseStudySlugs.map(
  (slug) => caseStudies[slug],
);

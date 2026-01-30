// src/app/content/work/caseStudies.ts
export type WorkSlug =
  | "ai-knowledge-copilot"
  | "executive-sales-dashboard"
  | "operations-data-platform";

export type CaseStudy = {
  slug: WorkSlug;
  seo: { title: string; description: string };

  hero: {
    title: string;
    subtitle: string;
    tags: string[];
  };

  context: { bullets: string[] };
  problem: { bullets: string[] };

  solution: {
    bullets: string[];
    pillars: Array<{
      title: string;
      description: string;
      highlights: string[];
    }>;
  };

  architecture: {
    lanes: Array<{ title: string; items: string[] }>;
    note?: string;
  };

  impact: { bullets: string[] };

  tech: {
    groups: Array<{ title: string; items: string[] }>;
    note?: string;
  };

  confidentialityNote?: string;

  cta: {
    heading: string;
    subheading: string;
    primaryLabel: string;
    href: string;
  };
};

export const caseStudies: Record<WorkSlug, CaseStudy> = {
  "ai-knowledge-copilot": {
    slug: "ai-knowledge-copilot",
    seo: {
      title: "AI Knowledge Copilot — Governed Retrieval & Enterprise-Grade UX",
      description:
        "A governed AI copilot that turns fragmented internal knowledge into traceable, source-backed answers—built for enterprise constraints.",
    },
    hero: {
      title: "AI Knowledge Copilot",
      subtitle:
        "A governed, traceable assistant that converts fragmented knowledge into confident, source-backed answers—without exposing sensitive data.",
      tags: ["RAG", "Governance-first", "Traceability", "Enterprise UX"],
    },
    context: {
      bullets: [
        "Large organization with knowledge distributed across documents, internal portals, and operational systems.",
        "Information changed frequently across departments and ownership boundaries.",
        "Teams needed speed without sacrificing trust, safety, or policy alignment.",
      ],
    },
    problem: {
      bullets: [
        "Employees lost time searching across systems and still lacked confidence in what was current or correct.",
        "Inconsistent answers created operational friction and compliance risk.",
        "Leaders wanted AI-first capability with explicit controls and safe-by-design behavior.",
      ],
    },
    solution: {
      bullets: [
        "A knowledge copilot that retrieves only from approved sources and surfaces evidence alongside answers.",
        "A controlled admin workflow to manage source approvals, access rules, and freshness policies.",
      ],
      pillars: [
        {
          title: "Grounded Intelligence",
          description:
            "Retrieval-augmented answering designed for confidence: evidence-first format, clear citations, and graceful fallback when sources are weak.",
          highlights: [
            "Approved-source retrieval",
            "Evidence-first responses",
            "Safe fallback + escalation",
          ],
        },
        {
          title: "Premium Operational UX",
          description:
            "A clean interface optimized for clarity, speed, and trust—built like a product, not a prototype.",
          highlights: [
            "Confidence signals",
            "Citations panel",
            "Audit-friendly interactions",
          ],
        },
        {
          title: "Enterprise Controls",
          description:
            "Governance patterns that align with enterprise constraints and reduce risk during real-world usage.",
          highlights: [
            "Role-aware access",
            "Redaction patterns",
            "Review + monitoring hooks",
          ],
        },
      ],
    },
    architecture: {
      lanes: [
        {
          title: "Ingestion",
          items: [
            "Approved document sources (policies, SOPs, internal knowledge)",
            "Incremental syncing and freshness strategy",
            "Metadata for ownership and sensitivity",
          ],
        },
        {
          title: "Transformation",
          items: [
            "Normalization and deduplication",
            "Chunking aligned to document types",
            "Quality checks for staleness and conflicts",
          ],
        },
        {
          title: "Intelligence Layer",
          items: [
            "Retrieval + reranking for precision",
            "Grounded response composition",
            "Safety filters + access-aware retrieval",
          ],
        },
        {
          title: "Delivery",
          items: [
            "Copilot UI with evidence panel",
            "Admin controls for sources and access",
            "Secure APIs for integrations",
          ],
        },
      ],
      note:
        "Designed to degrade safely: if evidence is weak, the system avoids guessing and guides users to verified paths.",
    },
    impact: {
      bullets: [
        "Faster answers with clearer provenance and confidence.",
        "Reduced dependency on a small set of “knowledge gatekeepers.”",
        "More consistent decisions across teams and locations.",
        "A safer AI experience aligned with enterprise governance expectations.",
      ],
    },
    tech: {
      groups: [
        {
          title: "AI & Retrieval",
          items: ["LLM inference (provider-agnostic)", "RAG pipeline", "Reranking"],
        },
        {
          title: "Data & Pipelines",
          items: ["Document processing", "ETL/ELT workflows", "Governance metadata"],
        },
        {
          title: "Security",
          items: ["RBAC patterns", "Audit hooks", "Safe retrieval constraints"],
        },
        {
          title: "Delivery",
          items: ["Web interface", "Admin console", "Secure APIs"],
        },
      ],
      note:
        "Tool choices depend on the environment and security posture. The design remains portable across cloud vendors.",
    },
    confidentialityNote:
      "Client identifiers, internal taxonomies, and source systems are intentionally abstracted. The architecture and UX patterns remain representative.",
    cta: {
      heading: "Build something similar",
      subheading:
        "If you need governed AI experiences that feel premium and stay safe under enterprise constraints, let’s talk.",
      primaryLabel: "Contact Inside Dopamine",
      href: "/contact",
    },
  },

  "executive-sales-dashboard": {
    slug: "executive-sales-dashboard",
    seo: {
      title: "Executive Sales Dashboard — Leadership-Grade BI Dashboards",
      description:
        "Leadership-grade BI Dashboards that consolidate revenue signals, pipeline health, and forecasting inputs—designed for clarity, not noise.",
    },
    hero: {
      title: "Executive Sales Dashboard",
      subtitle:
        "Decision-ready BI Dashboards for leadership: clear pipeline health, revenue signals, and accountable forecasting—without drowning in noise.",
      tags: ["BI Dashboards", "Multi-source", "Executive UX", "Governed KPIs"],
    },
    context: {
      bullets: [
        "Sales leadership required a single, trusted view across commercial and operational systems.",
        "Regional teams used inconsistent definitions and reporting habits.",
        "Meetings were slowed by data disputes instead of decisions.",
      ],
    },
    problem: {
      bullets: [
        "Fragmented KPIs and mismatched definitions across teams.",
        "High cognitive-load dashboards that reduced adoption.",
        "Leadership needed explainability, drill-down paths, and accountability—not more charts.",
      ],
    },
    solution: {
      bullets: [
        "A tiered dashboard system: executive overview for speed, drill-down for accountability, operational views for action.",
        "A KPI contract: consistent definitions, shared filters, and governance patterns for trust.",
      ],
      pillars: [
        {
          title: "Executive Layer",
          description:
            "A minimal, premium surface optimized for weekly decisions—signal over noise.",
          highlights: ["Momentum signals", "Risk visibility", "Clear drill paths"],
        },
        {
          title: "Operational Layer",
          description:
            "Actionable views for teams: what moved, what stalled, and what needs intervention.",
          highlights: ["Exception-based views", "Fast filtering", "Export-ready workflows"],
        },
        {
          title: "Governance Layer",
          description:
            "A definition system that keeps the dashboards honest as the business evolves.",
          highlights: ["KPI dictionary", "Versioned logic", "Access patterns"],
        },
      ],
    },
    architecture: {
      lanes: [
        {
          title: "Ingestion",
          items: ["CRM signals", "Finance systems", "Sales ops datasets", "Governed manual overrides"],
        },
        {
          title: "Transformation",
          items: ["Normalization of regions/stages", "Metric contracts", "Quality checks"],
        },
        {
          title: "Intelligence Layer",
          items: ["Forecasting inputs", "Risk flags (rule-based + ML-ready)", "Narrative summaries"],
        },
        {
          title: "Delivery",
          items: ["BI Dashboards (exec + ops)", "Secure sharing", "Mobile-friendly views"],
        },
      ],
      note: "The core objective was trust: every KPI is defined, testable, and consistent across layers.",
    },
    impact: {
      bullets: [
        "More time spent on decisions, less time reconciling data.",
        "Leadership alignment around consistent definitions.",
        "Better visibility into stalled deals and pipeline risk.",
        "Improved adoption due to clarity-first UX.",
      ],
    },
    tech: {
      groups: [
        {
          title: "BI & Reporting",
          items: ["BI dashboard tooling (client-selected)", "Semantic layer patterns", "KPI governance"],
        },
        {
          title: "Data Platform",
          items: ["ELT pipelines", "Warehouse/lakehouse patterns", "Data quality checks"],
        },
        {
          title: "Intelligence",
          items: ["Rule-based signals", "ML-ready inputs", "Explainable KPI logic"],
        },
        {
          title: "Delivery",
          items: ["Secure access patterns", "Performance-first dashboards", "Reusable view system"],
        },
      ],
      note: "We focus on durable patterns—definitions, governance, and UX—regardless of BI vendor.",
    },
    confidentialityNote:
      "Client datasets, deal values, and pipeline structure are intentionally abstracted. The reporting system and UX patterns remain representative.",
    cta: {
      heading: "Build something similar",
      subheading:
        "If your leadership team needs BI Dashboards people actually trust and use, let’s talk.",
      primaryLabel: "Contact Inside Dopamine",
      href: "/contact",
    },
  },

  "operations-data-platform": {
    slug: "operations-data-platform",
    seo: {
      title: "Operations Data Platform — Operational Clarity at Scale",
      description:
        "A cloud-native data foundation that unifies operational signals and powers BI Dashboards plus intelligent workflows.",
    },
    hero: {
      title: "Operations Data Platform",
      subtitle:
        "A practical, cloud-native data foundation that unifies operational signals and enables BI Dashboards, copilots, and decision workflows.",
      tags: ["Data Platform", "Pipelines", "Governed Models", "AI-ready"],
    },
    context: {
      bullets: [
        "Operations relied on multiple systems: tickets, inventory, logistics, vendor data, and internal tools.",
        "Reporting slowed down due to brittle pipelines and inconsistent models.",
        "Teams needed a foundation that supports analytics now and AI later.",
      ],
    },
    problem: {
      bullets: [
        "Operational data was distributed and inconsistent with no reliable unified model.",
        "Dashboards were difficult to maintain due to fragile transformations.",
        "Decisions lacked a shared view across teams and locations.",
      ],
    },
    solution: {
      bullets: [
        "A cloud-native platform pattern: ingestion, modeled transformations, and a governed delivery layer.",
        "A clean operational model powering BI Dashboards today and intelligent workflows tomorrow.",
      ],
      pillars: [
        {
          title: "Reliable Data Foundation",
          description:
            "Pipelines optimized for correctness, freshness, and maintainability.",
          highlights: ["Incremental pipelines", "Observability hooks", "Quality validation"],
        },
        {
          title: "Operational Model",
          description:
            "A unified model that aligns teams around shared operational definitions.",
          highlights: ["Standard entities/events", "Data contracts", "Consistent dimensions"],
        },
        {
          title: "Delivery & Action",
          description:
            "Dashboards and tools designed to drive action, not just reporting.",
          highlights: ["BI Dashboards", "Exception-based reporting", "Automation-ready interfaces"],
        },
      ],
    },
    architecture: {
      lanes: [
        { title: "Ingestion", items: ["Operational systems", "Vendor feeds", "Internal tools", "Event streams (optional)"] },
        { title: "Transformation", items: ["Validated staging", "Modeled entities", "Versioned transformations"] },
        { title: "Intelligence Layer", items: ["Operational signals", "Prediction-ready features", "Workflow triggers"] },
        { title: "Delivery", items: ["BI Dashboards", "Internal web tools", "Secure APIs"] },
      ],
      note:
        "The goal isn’t more data—it’s reliable decisions with durable contracts and maintainable models.",
    },
    impact: {
      bullets: [
        "Operational visibility improved across teams and locations.",
        "Dashboards became easier to trust because logic was consistent and governed.",
        "Reduced manual reporting overhead through cleaner pipelines and models.",
        "A foundation ready for intelligent workflows without rework.",
      ],
    },
    tech: {
      groups: [
        { title: "Data Platform", items: ["Warehouse/lakehouse patterns", "ELT pipelines", "Orchestration & monitoring"] },
        { title: "Modeling", items: ["Contract-driven modeling", "Quality validation", "Versioned transformations"] },
        { title: "Intelligence", items: ["Feature readiness", "Predictive model hooks", "Automation triggers"] },
        { title: "Delivery", items: ["BI Dashboards", "Internal tools", "Secure APIs"] },
      ],
      note:
        "We keep the system vendor-flexible and focus on durability: contracts, quality, and operational alignment.",
    },
    confidentialityNote:
      "Client systems, vendors, and operational processes are intentionally abstracted. The platform pattern and delivery approach remain representative.",
    cta: {
      heading: "Build something similar",
      subheading:
        "If you want a data foundation that drives clarity now and supports AI later, let’s talk.",
      primaryLabel: "Contact Inside Dopamine",
      href: "/contact",
    },
  },
};
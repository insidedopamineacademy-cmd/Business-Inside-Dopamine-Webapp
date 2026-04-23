import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqs = [
  // Services
  {
    question: "What do you actually build?",
    answer:
      "We build BI dashboards, AI copilots, data platforms, and high-performance web products for businesses. Everything we ship is production-grade — designed for real decision-makers, not demos. Our work sits at the intersection of data engineering, AI, and product design.",
    category: "Services",
    order: 1,
  },
  {
    question: "What industries do you work with?",
    answer:
      "We work across professional services, SaaS, e-commerce, logistics, and fintech — anywhere there's valuable data that isn't being used well. Our frameworks are industry-agnostic, but we move fastest when there's an existing data layer to build on.",
    category: "Services",
    order: 2,
  },
  {
    question: "Do you build mobile apps?",
    answer:
      "Mobile isn't our primary focus — we specialise in web platforms, internal tools, and data products. That said, many of the dashboards and AI copilots we build are fully responsive and work well on mobile browsers. If you need a native iOS/Android app, we can recommend trusted partners.",
    category: "Services",
    order: 3,
  },
  {
    question: "Is there a minimum project size?",
    answer:
      "We typically engage on projects starting at £10,000. Smaller scopes tend to lack the depth needed to produce work we're proud of. If you're not sure whether your project qualifies, book a call — we'll tell you honestly.",
    category: "Services",
    order: 4,
  },
  {
    question: "Can you handle both design and engineering on the same project?",
    answer:
      "Yes — we run end-to-end. Most of our projects span discovery, UX/information architecture, frontend engineering, and backend/data integration. You get one team, one process, and one point of accountability.",
    category: "Services",
    order: 5,
  },

  // Process
  {
    question: "How does a project typically start?",
    answer:
      "We start with a scoping call to understand your goals, data environment, and constraints. From there we produce a short proposal with scope, timeline, and a fixed or phased budget. Most projects move from first call to kickoff within two weeks.",
    category: "Process",
    order: 6,
  },
  {
    question: "How long does a typical project take?",
    answer:
      "BI dashboard builds run 2–4 weeks. AI copilot pilots take 3–6 weeks to production. Full web platforms typically land in 4–8 weeks. Timelines depend on scope, data readiness, and how quickly your team can review and approve deliverables.",
    category: "Process",
    order: 7,
  },
  {
    question: "How do you communicate during a project?",
    answer:
      "We work asynchronously in Notion or Linear with weekly check-ins via video call. You'll always have visibility into what's in progress, what's next, and what needs your input. We don't go quiet for two weeks and resurface with a surprise.",
    category: "Process",
    order: 8,
  },
  {
    question: "Do you run a discovery phase?",
    answer:
      "Yes — for anything beyond a small scope, we recommend a paid discovery sprint (1–2 weeks). It surfaces data gaps, aligns stakeholders, and produces a detailed technical spec before any build begins. It almost always saves time and money downstream.",
    category: "Process",
    order: 9,
  },

  // AI
  {
    question: "What AI services do you offer?",
    answer:
      "We build LLM copilots, RAG-powered knowledge assistants, secure internal chatbots, predictive models, and AI features embedded into web products. We focus on systems that slot into existing workflows — not standalone tools nobody uses.",
    category: "AI",
    order: 10,
  },
  {
    question: "Which AI models do you work with?",
    answer:
      "We primarily work with OpenAI (GPT-4o), Anthropic (Claude), and Mistral, chosen per project based on latency, cost, and compliance requirements. We're model-agnostic — we architect for the right tool, not the most hyped one.",
    category: "AI",
    order: 11,
  },
  {
    question: "Can you integrate AI into an existing product?",
    answer:
      "Absolutely — most of our AI work is additive, not greenfield. We audit your current stack, identify where AI creates the most leverage, and integrate cleanly via API or embedded modules. No big-bang rewrites required.",
    category: "AI",
    order: 12,
  },
  {
    question: "How do you handle data privacy when building AI systems?",
    answer:
      "We design with data minimisation and access control from day one. For sensitive environments we use self-hosted models, private vector stores, and tenant-level data isolation. We can work within SOC 2, GDPR, and HIPAA-adjacent constraints.",
    category: "AI",
    order: 13,
  },

  // Pricing
  {
    question: "How do you charge for projects?",
    answer:
      "We work on fixed-scope project fees for clearly defined deliverables and monthly retainers for ongoing development or iteration. We don't bill by the hour — it misaligns incentives and creates uncertainty for your budget.",
    category: "Pricing",
    order: 14,
  },
  {
    question: "What is a typical project budget?",
    answer:
      "A focused BI dashboard build typically runs £10,000–£25,000. AI copilot pilots land between £15,000–£40,000 depending on integration depth. Full web platform projects start at £20,000. We'll give you a clear number after a scoping call — no vague ranges.",
    category: "Pricing",
    order: 15,
  },
  {
    question: "Do you offer retainers?",
    answer:
      "Yes — we offer monthly retainers for teams that need ongoing development, iteration, or data operations support. Retainers start at £4,000/month and include a defined block of capacity. They're a good fit after an initial project lands and you want to keep momentum.",
    category: "Pricing",
    order: 16,
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Projects are typically split 50% upfront and 50% on delivery. For larger engagements we can structure milestone-based payments aligned to delivery phases. We don't offer deferred payment or equity-for-work arrangements.",
    category: "Pricing",
    order: 17,
  },

  // General
  {
    question: "Where are you based?",
    answer:
      "Inside Dopamine is a remote-first agency. Our team operates across the UK and EU, and we work with clients globally. We run all collaboration asynchronously with scheduled video calls — timezone gaps haven't been an issue for any of our clients.",
    category: "General",
    order: 18,
  },
  {
    question: "Can I see examples of past work?",
    answer:
      "Yes — our Work page shows selected case studies with context on the problem, our approach, and the outcome. Some client work is under NDA, but we're happy to share additional references on a call.",
    category: "General",
    order: 19,
  },
  {
    question: "How do I get started?",
    answer:
      "Book a call via our contact page. Come with a rough sense of your goal and your current data setup — we'll handle the rest. Most clients have a clear proposal in their inbox within 48 hours of the first call.",
    category: "General",
    order: 20,
  },
];

async function main() {
  console.log("Seeding FAQs...");

  await prisma.faq.deleteMany();

  const created = await prisma.faq.createMany({ data: faqs });

  console.log(`✓ Seeded ${created.count} FAQs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

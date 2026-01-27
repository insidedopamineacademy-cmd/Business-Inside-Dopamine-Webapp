"use client";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef } from "react";

type CaseItem = {
  title: string;
  category: string;
  description: string;
  outcomes: string[];
  href: string;
};

const cases: CaseItem[] = [
  {
    title: "Executive Sales Dashboard",
    category: "Data Analytics · BI Dashboards",
    description:
      "Designed a unified executive dashboard combining sales, churn, and regional performance metrics across multiple data sources.",
    outcomes: [
      "60% reduction in reporting time",
      "Single source of truth for leadership",
      "Faster weekly decision cycles",
    ],
    href: "/work/executive-sales-dashboard",
  },
  {
    title: "AI Knowledge Copilot (RAG)",
    category: "AI Solutions · LLM",
    description:
      "Built an internal AI copilot that answers questions from company documents, policies, and historical data in real time.",
    outcomes: [
      "40% fewer internal support queries",
      "Instant access to institutional knowledge",
      "Improved operational efficiency",
    ],
    href: "/work/ai-knowledge-copilot",
  },
  {
    title: "Operations Data Platform",
    category: "Web Platforms · Analytics",
    description:
      "Developed a custom web platform combining dashboards, alerts, and workflows for cross-team operational visibility.",
    outcomes: [
      "Unified data across 5 departments",
      "Automated alerts for key KPIs",
      "Scalable foundation for future AI features",
    ],
    href: "/work/operations-data-platform",
  },
];

export default function FeaturedWork() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  const easing: [number, number, number, number] = [0.21, 0.47, 0.22, 0.9];

  const sectionV: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.7,
        ease: easing,
        when: "beforeChildren",
        staggerChildren: reduce ? 0 : 0.08,
      },
    },
  };

  const headerV: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: easing },
    },
  };

  const cardV: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduce ? 0 : 0.55, ease: easing },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="relative py-16"
      variants={sectionV}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {/* Ambient background for this section (subtle + premium) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent opacity-[0.10] blur-3xl" />
        <div className="absolute right-[-120px] top-[120px] h-[320px] w-[320px] rounded-full bg-accent opacity-[0.06] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <motion.div className="mb-10 flex items-end justify-between gap-6" variants={headerV}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Proof
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
              Featured Work
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              A selection of systems we’ve built to turn data into clarity, and
              clarity into action.
            </p>
          </div>

          <Link
            href="/work"
            className="hidden md:inline-flex btn-secondary"
            aria-label="View all case studies"
          >
            View all
          </Link>
        </motion.div>

        <motion.div className="grid gap-6 md:grid-cols-3">
          {cases.map((item) => (
            <Link key={item.title} href={item.href} className="group block">
              <motion.div
                className="card relative block overflow-hidden p-6"
                variants={cardV}
                whileHover={
                  reduce
                    ? undefined
                    : {
                        y: -4,
                        transition: { duration: 0.18 },
                      }
                }
                whileTap={reduce ? undefined : { scale: 0.99 }}
              >
                {/* Hover sheen */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.18), transparent 55%), radial-gradient(circle at 90% 40%, rgba(56,189,248,0.12), transparent 55%), radial-gradient(circle at 50% 110%, rgba(139,92,246,0.14), transparent 60%)",
                  }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs text-muted">{item.category}</div>
                      <h3 className="mt-2 text-lg font-semibold tracking-tight">
                        {item.title}
                      </h3>
                    </div>

                    {/* Arrow badge */}
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                      title="Open"
                    >
                      ↗
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>

                  <ul className="mt-5 space-y-2">
                    {item.outcomes.map((o) => (
                      <li key={o} className="flex gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                        <span className="text-muted">{o}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-transform duration-200 group-hover:translate-x-0.5">
                    View case <span aria-hidden="true">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <div className="mt-8 md:hidden">
          <Link href="/work" className="btn-secondary w-full justify-center">
            View all
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
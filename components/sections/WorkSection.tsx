"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Container from "../ui/Container";
import Tag from "../ui/Tag";

type WorkCard = {
  metric: string;
  system: string;
  context: string;
  tag: string;
  href: string;
};

const workCards: WorkCard[] = [
  {
    metric: "12x faster reporting",
    system: "BI dashboard + automation layer",
    context: "Ops-heavy services team",
    tag: "BI & Automation",
    href: "/work/reporting-speed-dashboard",
  },
  {
    metric: "+127% lead conversion",
    system: "WhatsApp + CRM qualification flow",
    context: "Ecommerce brand",
    tag: "CRM & Messaging",
    href: "/work/whatsapp-crm-qualification-flow",
  },
  {
    metric: "3-week internal tool launch",
    system: "Custom web app for internal operations",
    context: "Multi-team workflow",
    tag: "Web App",
    href: "/work/internal-ops-web-app",
  },
];

export default function WorkSection() {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const cardsV: Variants = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const cardV: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0 } : { duration: 0.4, ease },
    },
  };

  return (
    <section className="section-space" aria-label="Selected work">
      <Container>
        <div className="max-w-[44rem]">
          <p className="type-mono text-[var(--color-muted)]">SELECTED WORK</p>
          <h2 className="type-section mt-4 text-3xl text-[var(--color-text)] md:text-5xl">
            Proof, not promises.
          </h2>
          <p className="type-body mt-4 max-w-[38rem]">
            A few examples of systems built to reduce manual work and improve execution.
          </p>
        </div>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2"
          variants={cardsV}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {workCards.map((card) => (
            <motion.div key={card.metric} variants={cardV}>
              <Link
                href={card.href}
                className="work-card flex h-full flex-col rounded-2xl border border-[var(--border-light)] bg-[var(--color-bg)] p-6 no-underline md:p-7"
              >
                <div className="flex flex-col gap-4">
                  <p className="type-section text-3xl leading-[1.02] text-[var(--color-text)] md:text-4xl">
                    {card.metric}
                  </p>
                  <p className="type-section text-lg tracking-[-0.01em] text-[var(--color-text)] md:text-xl">
                    {card.system}
                  </p>
                  <p className="type-body text-sm text-[var(--color-muted)]">{card.context}</p>
                </div>
                <div className="mt-6">
                  <Tag>{card.tag}</Tag>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

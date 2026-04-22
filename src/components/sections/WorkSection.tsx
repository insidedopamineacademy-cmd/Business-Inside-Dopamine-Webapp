"use client";

import Link from "next/link";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import { MotionDiv, useReducedMotion } from "@/lib/motion";
import { staggerContainer, scaleIn, viewport } from "@/lib/animations";

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

  return (
    <section className="section-space" aria-label="Selected work">
      <Container>
        <MotionDiv
          className="max-w-[44rem]"
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewport}
        >
          <MotionDiv variants={scaleIn}>
            <p className="type-mono text-[var(--color-text-tertiary)]">SELECTED WORK</p>
          </MotionDiv>
          <MotionDiv variants={scaleIn}>
            <h2 className="type-section mt-4 text-3xl text-[var(--color-text-primary)] md:text-5xl">
              Proof, not promises.
            </h2>
          </MotionDiv>
          <MotionDiv variants={scaleIn}>
            <p className="type-body mt-4 max-w-[38rem]">
              A few examples of systems built to reduce manual work and improve execution.
            </p>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2"
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewport}
        >
          {workCards.map((card) => (
            <MotionDiv key={card.metric} variants={scaleIn}>
              <Link
                href={card.href}
                className="work-card flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 no-underline md:p-7"
              >
                <div className="flex flex-col gap-4">
                  <p className="type-section text-3xl leading-[1.02] text-[var(--color-text-primary)] md:text-4xl">
                    {card.metric}
                  </p>
                  <p className="type-section text-lg tracking-[-0.01em] text-[var(--color-text-primary)] md:text-xl">
                    {card.system}
                  </p>
                  <p className="type-body text-sm text-[var(--color-text-secondary)]">
                    {card.context}
                  </p>
                </div>
                <div className="mt-6">
                  <Badge variant="default">{card.tag}</Badge>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </Container>
    </section>
  );
}

"use client";

import Link from "next/link";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import { MotionDiv, useReducedMotion } from "@/lib/motion";
import { staggerContainer, scaleIn, viewport } from "@/lib/animations";

type WorkCard = {
  headline: string;
  subheadline: string;
  label: string;
  clientType: string;
  href: string;
};

const workCards: WorkCard[] = [
  {
    headline: "Reporting that runs itself",
    subheadline: "BI dashboard + automation layer",
    label: "BI & AUTOMATION",
    clientType: "Operations team",
    href: "/work/reporting-speed-dashboard",
  },
  {
    headline: "Leads qualified before your team picks up the phone",
    subheadline: "WhatsApp + CRM qualification flow",
    label: "CRM & MESSAGING",
    clientType: "E-commerce brand",
    href: "/work/whatsapp-crm-qualification-flow",
  },
  {
    headline: "Internal tool live in three weeks",
    subheadline: "Custom web app for internal operations",
    label: "WEB APP",
    clientType: "Multi-team workflow",
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
            <MotionDiv key={card.headline} variants={scaleIn}>
              <Link
                href={card.href}
                className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-2xl font-bold leading-snug text-[var(--color-text-primary)]">
                  {card.headline}
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
                  {card.subheadline}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {card.clientType}
                </p>
                <div className="mt-4">
                  <Badge variant="default">{card.label}</Badge>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </Container>
    </section>
  );
}

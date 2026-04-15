"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Container from "../ui/Container";
import Tag from "../ui/Tag";

type ServiceItem = {
  number: string;
  title: string;
  description: string;
  tag: string;
  detail: string;
};

const services: ServiceItem[] = [
  {
    number: "01",
    title: "BI & AI DASHBOARDS",
    description: "Real-time insights across your entire operation.",
    tag: "Primary",
    detail:
      "Built for teams that need live visibility across performance, delivery, and operational throughput, these dashboards replace fragmented reporting with one reliable source of truth. We structure the data around your decisions, not generic templates, so reporting becomes faster, clearer, and useful for daily execution instead of retrospective guesswork.",
  },
  {
    number: "02",
    title: "WEB APPLICATIONS",
    description: "Custom tools built for your workflows, not templates.",
    tag: "Primary",
    detail:
      "These applications are designed around how your team already operates, then improved to remove friction, duplicated effort, and tool switching. Instead of forcing people into generic SaaS constraints, we build a focused system that matches your process, supports real usage at speed, and keeps execution consistent across teams.",
  },
  {
    number: "03",
    title: "AUTOMATION SYSTEMS",
    description: "Remove repetitive work with fully automated pipelines.",
    tag: "n8n • Workflows",
    detail:
      "Automation systems connect repetitive tasks, approvals, data movement, and downstream actions into one dependable workflow. The result is less manual coordination, fewer dropped steps, and more consistent outcomes across operations. We design these flows to be resilient, auditable, and aligned to how your business actually runs day to day.",
  },
  {
    number: "04",
    title: "AI COPILOTS & LLMS",
    description: "Intelligent assistants tailored to your business logic.",
    tag: "Custom Builds",
    detail:
      "We build practical internal AI tools that help teams search knowledge faster, support decisions with context, and accelerate execution in recurring workflows. These copilots are shaped around your business logic, language, and process requirements, so they deliver useful operational leverage rather than novelty features that look impressive but fail in daily use.",
  },
  {
    number: "05",
    title: "CRM & WHATSAPP FLOWS",
    description: "Capture, qualify, and convert leads automatically.",
    tag: "Integrations",
    detail:
      "These flows capture inbound leads, qualify intent, route opportunities, and automate follow-up across CRM and WhatsApp touchpoints. By reducing response delays and manual handoffs, teams get a cleaner pipeline and better consistency from first contact to conversion. The system is structured to improve speed without sacrificing lead quality or control.",
  },
];

export default function ServicesSection() {
  const [openNumber, setOpenNumber] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-space surface-soft" aria-label="Services">
      <Container>
        <div className="max-w-[44rem]">
          <p className="type-mono text-[var(--color-muted)]">SOLUTIONS</p>
          <h2 className="type-section mt-4 text-3xl text-[var(--color-text)] md:text-5xl">
            Built for teams that need real systems.
          </h2>
        </div>

        <ol className="mt-10 border-y border-[var(--border-light)]">
          {services.map((service, index) => {
            const isOpen = openNumber === service.number;
            const detailId = `service-detail-${service.number}`;

            return (
              <li
                key={service.number}
                className={`group service-row transition-colors duration-200 hover:border-[var(--border-medium)] ${
                  index !== services.length - 1 ? "border-b border-[var(--border-light)]" : ""
                }`}
              >
                <div className="service-row-content relative grid gap-5 py-7 pr-12 md:grid-cols-[64px_1fr_220px] md:items-start md:gap-8 md:pr-14">
                  <p className="type-mono text-[var(--color-muted)]">{service.number}</p>

                  <div className="max-w-[40rem]">
                    <h3 className="type-section text-xl text-[var(--color-text)] md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="type-body mt-2">{service.description}</p>
                  </div>

                  <div className="flex items-start gap-3 md:justify-self-end md:pt-1 md:pr-1">
                    <Tag
                      variant={service.tag === "Primary" ? "primary" : "neutral"}
                      className="transition-colors duration-200 group-hover:border-[var(--border-medium)]"
                    >
                      {service.tag}
                    </Tag>
                  </div>

                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={detailId}
                    onClick={() => setOpenNumber(isOpen ? null : service.number)}
                    className="absolute right-0 top-7 inline-flex h-9 w-9 items-center justify-center text-[var(--color-text-secondary)] transition-[color,opacity,transform] duration-150 hover:scale-105 hover:text-[var(--color-text)] hover:opacity-95 focus-visible:scale-105 focus-visible:outline-2 focus-visible:outline-[rgba(0,0,0,0.3)] focus-visible:outline-offset-2 md:top-8"
                  >
                    <span className="relative block h-3 w-3" aria-hidden="true">
                      <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
                      <span
                        className={`absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-opacity duration-200 ${
                          isOpen ? "opacity-0" : "opacity-100"
                        }`}
                      />
                    </span>
                    <span className="sr-only">Toggle details for {service.title}</span>
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={detailId}
                      initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }
                      }
                      className="overflow-hidden border-t border-[var(--border-light)]"
                    >
                      <div className="py-4 md:py-5">
                        <p className="type-body max-w-[44rem] text-[var(--color-text-secondary)]">
                          {service.detail}
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

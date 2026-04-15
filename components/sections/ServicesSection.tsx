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
    detail: "Designed for live visibility, reporting speed, and better day-to-day decisions.",
  },
  {
    number: "02",
    title: "WEB APPLICATIONS",
    description: "Custom tools built for your workflows, not templates.",
    tag: "Primary",
    detail: "Built around your real workflow instead of forcing teams into generic tools.",
  },
  {
    number: "03",
    title: "AUTOMATION SYSTEMS",
    description: "Remove repetitive work with fully automated pipelines.",
    tag: "n8n • Workflows",
    detail: "Connect repetitive steps, data movement, and actions into one reliable workflow.",
  },
  {
    number: "04",
    title: "AI COPILOTS & LLMS",
    description: "Intelligent assistants tailored to your business logic.",
    tag: "Custom Builds",
    detail: "Useful internal AI tools that support decisions, search, or execution.",
  },
  {
    number: "05",
    title: "CRM & WHATSAPP FLOWS",
    description: "Capture, qualify, and convert leads automatically.",
    tag: "Integrations",
    detail: "Capture, route, and follow up with leads faster and more consistently.",
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
                <div className="service-row-content grid gap-5 py-7 md:grid-cols-[64px_1fr_220px] md:items-start md:gap-8">
                  <p className="type-mono text-[var(--color-muted)]">{service.number}</p>

                  <div className="max-w-[40rem]">
                    <h3 className="type-section text-xl text-[var(--color-text)] md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="type-body mt-2">{service.description}</p>
                  </div>

                  <div className="flex items-center gap-3 md:justify-self-end md:pt-1">
                    <Tag
                      variant={service.tag === "Primary" ? "primary" : "neutral"}
                      className="transition-colors duration-200 group-hover:border-[var(--border-medium)]"
                    >
                      {service.tag}
                    </Tag>

                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={detailId}
                      onClick={() => setOpenNumber(isOpen ? null : service.number)}
                      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-light)] bg-[var(--color-bg)] transition-colors duration-200 hover:border-[var(--border-medium)]"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-full bg-[rgba(229,0,122,0.12)] blur-[6px]"
                      />
                      <span className="relative block h-3 w-3" aria-hidden="true">
                        <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-[var(--color-text)]" />
                        <span
                          className={`absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-[var(--color-text)] transition-opacity duration-200 ${
                            isOpen ? "opacity-0" : "opacity-100"
                          }`}
                        />
                      </span>
                      <span className="sr-only">Toggle details for {service.title}</span>
                    </button>
                  </div>
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

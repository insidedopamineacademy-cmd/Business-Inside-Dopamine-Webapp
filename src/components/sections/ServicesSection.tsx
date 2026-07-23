"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import { homepageServiceItems } from "@/data/portfolio";

export default function ServicesSection() {
  const [openNumber, setOpenNumber] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-space surface-soft" aria-label="Services">
      <Container>
        <div className="max-w-[44rem]">
          <p className="type-mono text-[var(--color-text-tertiary)]">SOLUTIONS</p>
          <h2 className="type-section mt-4 text-3xl text-[var(--color-text-primary)] md:text-5xl">
            Built for teams that need real systems.
          </h2>
        </div>

        <ol className="mt-10 border-y border-[var(--color-border)]">
          {homepageServiceItems.map((service, index) => {
            const isOpen = openNumber === service.number;
            const detailId = `service-detail-${service.number}`;

            return (
              <li
                key={service.number}
                className={`group service-row transition-colors duration-200 ${
                  index !== homepageServiceItems.length - 1
                    ? "border-b border-[var(--color-border)]"
                    : ""
                }`}
              >
                <div className="service-row-content relative grid gap-5 py-7 pr-12 md:grid-cols-[64px_1fr_220px] md:items-start md:gap-8 md:pr-14">
                  <p className="type-mono text-[var(--color-text-tertiary)]">{service.number}</p>

                  <div className="max-w-[40rem]">
                    <h3 className="type-section text-xl text-[var(--color-text-primary)] md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="type-body mt-2">{service.description}</p>
                  </div>

                  <div className="flex items-start gap-3 md:justify-self-end md:pt-1 md:pr-1">
                    <Badge variant={service.tagVariant}>{service.tag}</Badge>
                  </div>

                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={detailId}
                    onClick={() => setOpenNumber(isOpen ? null : service.number)}
                    className="absolute right-0 top-7 inline-flex h-9 w-9 items-center justify-center text-[var(--color-text-secondary)] transition-[color,transform] duration-150 hover:scale-105 hover:text-[var(--color-text-primary)] focus-visible:scale-105 focus-visible:outline-2 focus-visible:outline-[var(--color-border)] focus-visible:outline-offset-2 md:top-8"
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
                  {isOpen && (
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
                      className="overflow-hidden border-t border-[var(--color-border)]"
                    >
                      <div className="py-4 md:py-5">
                        <p className="type-body max-w-[44rem] text-[var(--color-text-secondary)]">
                          {service.detail}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

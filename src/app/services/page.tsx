import type { Metadata } from "next";
import Container from "../../../components/ui/Container";
import PageHero from "../../../components/sections/PageHero";
import PageCta from "../../../components/sections/PageCta";

export const metadata: Metadata = {
  title: "Solutions | Inside Dopamine",
  description:
    "Custom dashboards, web applications, and automation systems built around your actual workflows.",
};

const serviceBlocks = [
  {
    title: "BI & AI Dashboards",
    description: "Real-time reporting systems built for visibility and decision-making.",
  },
  {
    title: "Web Applications",
    description: "Custom tools for internal operations, team workflows, and client-facing utility.",
  },
  {
    title: "Automation Systems",
    description: "n8n-powered workflows and API automations that remove repetitive work.",
  },
  {
    title: "AI Copilots & LLMs",
    description: "Custom AI systems trained around your business logic and internal use cases.",
  },
  {
    title: "CRM & WhatsApp Flows",
    description: "Lead capture, qualification, routing, and follow-up systems that run automatically.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="SOLUTIONS"
        headline="Systems built around how your business actually works."
        intro="From dashboards to automations to internal tools, we design and build systems that reduce manual work and improve execution."
      />

      <section className="section-space surface-soft" aria-label="Service blocks">
        <Container>
          <ul className="border-y border-[var(--border-light)]">
            {serviceBlocks.map((service, index) => (
              <li
                key={service.title}
                className={`py-6 md:py-7 ${
                  index !== serviceBlocks.length - 1 ? "border-b border-[var(--border-light)]" : ""
                }`}
              >
                <h2 className="type-section text-2xl text-[var(--color-text)] md:text-3xl">{service.title}</h2>
                <p className="type-body mt-3 max-w-[40rem]">{service.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <PageCta
        heading="Ready to build the right system?"
        ctaLabel="Book a Strategy Call →"
        href="/contact"
      />
    </>
  );
}

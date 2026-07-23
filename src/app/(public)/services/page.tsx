import type { Metadata } from "next";
import { headers } from "next/headers";
import Container from "@/components/ui/Container";
import PageHero from "@/components/sections/PageHero";
import PageCta from "@/components/sections/PageCta";
import { portfolioServiceIndexItems } from "@/data/portfolio";
import { getSegment } from "@/lib/segments";

export const metadata: Metadata = {
  title: "Solutions | Inside Dopamine",
  description:
    "Custom dashboards, web applications, and automation systems built around your actual workflows.",
};

export default async function ServicesPage() {
  const headersList = await headers();
  const segment = headersList.get("x-visitor-segment") ?? "general";
  const { serviceOrder } = getSegment(segment);

  const ordered = [
    ...serviceOrder
      .map((key) => portfolioServiceIndexItems.find((service) => service.id === key))
      .filter(
        (service): service is (typeof portfolioServiceIndexItems)[number] =>
          service !== undefined,
      ),
    ...portfolioServiceIndexItems.filter((service) => !serviceOrder.includes(service.id)),
  ];

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
            {ordered.map((service, index) => (
              <li
                key={service.title}
                className={`py-6 md:py-7 ${
                  index !== ordered.length - 1 ? "border-b border-[var(--border-light)]" : ""
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
        ctaLabel="Request a Strategy Call →"
        href="/contact"
      />
    </>
  );
}

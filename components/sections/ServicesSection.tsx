import Container from "../ui/Container";
import Tag from "../ui/Tag";

type ServiceItem = {
  number: string;
  title: string;
  description: string;
  tag: string;
};

const services: ServiceItem[] = [
  {
    number: "01",
    title: "BI & AI DASHBOARDS",
    description: "Real-time insights across your entire operation.",
    tag: "Primary",
  },
  {
    number: "02",
    title: "WEB APPLICATIONS",
    description: "Custom tools built for your workflows, not templates.",
    tag: "Primary",
  },
  {
    number: "03",
    title: "AUTOMATION SYSTEMS",
    description: "Remove repetitive work with fully automated pipelines.",
    tag: "n8n • Workflows",
  },
  {
    number: "04",
    title: "AI COPILOTS & LLMS",
    description: "Intelligent assistants tailored to your business logic.",
    tag: "Custom Builds",
  },
  {
    number: "05",
    title: "CRM & WHATSAPP FLOWS",
    description: "Capture, qualify, and convert leads automatically.",
    tag: "Integrations",
  },
];

export default function ServicesSection() {
  return (
    <section className="section-space" aria-label="Services">
      <Container>
        <div className="max-w-[44rem]">
          <p className="type-mono text-[var(--color-muted)]">SOLUTIONS</p>
          <h2 className="type-section mt-4 text-3xl text-[var(--color-text)] md:text-5xl">
            Built for teams that need real systems.
          </h2>
        </div>

        <ol className="mt-10 border-y border-[var(--border-light)]">
          {services.map((service, index) => (
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

                <div className="md:justify-self-end md:pt-1">
                  <Tag
                    variant={service.tag === "Primary" ? "primary" : "neutral"}
                    className="transition-colors duration-200 group-hover:border-[var(--border-medium)]"
                  >
                    {service.tag}
                  </Tag>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

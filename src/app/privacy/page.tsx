import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "Privacy Notice | Inside Dopamine",
  description: "How Inside Dopamine currently collects, uses, and protects personal information.",
};

const sections = [
  {
    title: "Information we collect",
    body: [
      "Contact and chat follow-up requests may include your name, email address, company, phone number, project needs, notes, preferred call date or time, and the related chat conversation.",
      "Chat messages and a random session identifier are stored so the assistant can use server-authoritative context. Personalisation events contain bounded page, source, segment, and intent labels. Abuse protection pseudonymises a trusted network address before sending quota keys to the configured Redis service.",
    ],
  },
  {
    title: "Why we use it",
    body: [
      "We use inquiry details to respond to the request, understand the proposed work, prevent duplicate submissions, operate the assistant, protect public services from abuse, and diagnose failures without logging full messages or contact details.",
      "Sending a form requests contact; it does not create a calendar booking or guarantee a response time.",
    ],
  },
  {
    title: "Services that process data",
    body: [
      "The application uses a PostgreSQL database for durable records, Anthropic for chat and recommendation processing, Upstash-compatible Redis for production quotas, the hosting platform for delivery and operational metadata, and an optional business-controlled webhook for lead notification.",
      "Chat content sent to the AI provider is bounded. Contact details are sent to the notification webhook only after the Lead has been stored. A failed or missing webhook is recorded separately and does not erase the Lead.",
    ],
  },
  {
    title: "Retention and your choices",
    body: [
      "Chat storage is capped by message count, but this pre-launch system does not yet enforce a time-based retention or automated deletion schedule for leads, conversations, or personalisation events. Production collection remains blocked pending owner-approved retention periods and a tested deletion/export procedure.",
      "To ask for access, correction, export, or deletion, email info@insidedopamine.com. The team may need to verify the request before acting and will apply any rights required by the applicable jurisdiction.",
    ],
  },
  {
    title: "Security and changes",
    body: [
      "The application uses server-only configuration, bounded input, request identifiers, idempotent writes, redacted logs, and protected administration. No internet service can promise absolute security.",
      "This operational notice was last updated on 22 July 2026. It requires business/legal review and named controller details before public launch; material changes will be reflected here.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        label="PRIVACY"
        headline="Privacy Notice"
        intro="A factual pre-launch summary of the information this website handles and the controls still required before production collection."
      />
      <section className="section-space surface-soft">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-[var(--color-error)]/40 bg-white p-5">
              <p className="type-body text-sm text-[var(--color-error)]">
                Launch notice: business/legal approval, controller identity, final processor details,
                and enforceable retention/deletion operations are still required.
              </p>
            </div>
            <div className="mt-10 space-y-10">
              {sections.map((section) => (
                <section key={section.title} aria-labelledby={`privacy-${section.title.toLowerCase().replaceAll(" ", "-")}`}>
                  <h2
                    id={`privacy-${section.title.toLowerCase().replaceAll(" ", "-")}`}
                    className="type-section text-2xl text-[var(--color-text-primary)]"
                  >
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="type-body">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "Website Terms | Inside Dopamine",
  description: "Pre-launch terms for use of the Inside Dopamine website and assistant.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        label="TERMS"
        headline="Website Terms"
        intro="Plain-language operational terms for this pre-launch website. Final business/legal approval is still required before launch."
      />
      <section className="section-space surface-soft">
        <Container>
          <div className="mx-auto max-w-3xl space-y-10">
            <section>
              <h2 className="type-section text-2xl text-[var(--color-text-primary)]">Website use</h2>
              <p className="type-body mt-4">
                You may use the public site to review Inside Dopamine&apos;s work and submit genuine
                project questions. Do not attempt to bypass access controls, automate abusive
                traffic, submit unlawful material, impersonate another person, or interfere with
                the service or its providers.
              </p>
            </section>
            <section>
              <h2 className="type-section text-2xl text-[var(--color-text-primary)]">Assistant and recommendations</h2>
              <p className="type-body mt-4">
                The assistant provides bounded general information from the site&apos;s FAQ content.
                It can be incomplete or unavailable and is not professional, legal, financial, or
                contractual advice. A recommendation does not form an offer or commitment.
              </p>
            </section>
            <section>
              <h2 className="type-section text-2xl text-[var(--color-text-primary)]">Contact requests</h2>
              <p className="type-body mt-4">
                Sending contact details creates a request for the team to follow up. It does not
                book a meeting, guarantee a response time, accept a project, or create a services
                agreement. Commercial work begins only under separately agreed terms.
              </p>
            </section>
            <section>
              <h2 className="type-section text-2xl text-[var(--color-text-primary)]">Content and availability</h2>
              <p className="type-body mt-4">
                Site content and branding remain owned by their respective rights holders. The
                website may change or be unavailable, and case-study descriptions must not be
                treated as a promise of identical results. Nothing here limits rights or
                responsibilities that cannot lawfully be limited.
              </p>
            </section>
            <section>
              <h2 className="type-section text-2xl text-[var(--color-text-primary)]">Questions</h2>
              <p className="type-body mt-4">
                See the Privacy Notice for data handling. Questions can be sent to{" "}
                <a className="underline underline-offset-4" href="mailto:info@insidedopamine.com">
                  info@insidedopamine.com
                </a>
                . These terms were last updated on 22 July 2026 and remain a launch-blocking legal
                review item until the responsible business owner approves them.
              </p>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}

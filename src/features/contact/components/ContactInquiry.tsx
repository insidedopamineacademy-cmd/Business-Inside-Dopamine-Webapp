import Container from "@/components/ui/Container";
import ContactForm from "@/features/contact/components/ContactForm";
import { submitContactForm } from "@/features/contact/server/action";

const trustPoints = [
  "Clear scope",
  "No generic recommendations",
  "Built around your workflow",
] as const;

export default function ContactInquiry() {
  return (
    <>
      <section
        className="section-space surface-soft"
        aria-label="Request a strategy call"
      >
        <Container>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
            <div className="presentation-reveal-view rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-10">
              <p className="type-mono text-[var(--color-text-tertiary)]">
                30-MIN STRATEGY CALL
              </p>
              <h2 className="type-section mt-4 text-3xl text-[var(--color-text-primary)] md:text-4xl">
                Request a call
              </h2>
              <p className="type-body mt-4 max-w-2xl">
                We&apos;ll review the workflow, identify friction points, and decide what kind
                of system makes sense.
              </p>

              <ContactForm action={submitContactForm} />
            </div>

            <aside
              className="presentation-reveal-view presentation-delay-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8 lg:sticky lg:top-28 lg:h-fit"
              aria-label="Direct contact details"
            >
              <p className="type-mono text-[var(--color-text-tertiary)]">DIRECT CONTACT</p>
              <h2 className="type-section mt-4 text-2xl text-[var(--color-text-primary)]">
                Reach us directly
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="type-mono text-[var(--color-text-tertiary)]">Email</p>
                  <a
                    href="mailto:info@insidedopamine.com"
                    className="type-body mt-2 inline-block text-[var(--color-text-primary)] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                  >
                    info@insidedopamine.com
                  </a>
                </div>

                <div>
                  <p className="type-mono text-[var(--color-text-tertiary)]">Phone</p>
                  <a
                    href="tel:+447447232654"
                    className="type-body mt-2 inline-block text-[var(--color-text-primary)] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                  >
                    +44 7447 232654
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="pb-0 pt-10 md:pt-12" aria-label="Contact trust points">
        <Container>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {trustPoints.map((item) => (
              <p
                key={item}
                className="type-mono rounded-full border border-[var(--color-border)] px-4 py-3.5 text-center text-[var(--color-text-primary)]"
              >
                {item}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="presentation-reveal-view pb-16 pt-10 md:pb-20 md:pt-12">
        <Container>
          <div className="max-w-3xl border-t border-[var(--color-border)]">
            <div className="py-5 md:py-6">
              <h2 className="type-section text-xl text-[var(--color-text-primary)] md:text-2xl">
                What happens on the call?
              </h2>
              <p className="type-body mt-3 text-[var(--color-text-secondary)]">
                We review the workflow, identify where the friction is, and outline what kind
                of system would actually help.
              </p>
            </div>
            <div className="border-t border-[var(--color-border)] py-5 md:py-6">
              <h2 className="type-section text-xl text-[var(--color-text-primary)] md:text-2xl">
                Do I need a full spec before reaching out?
              </h2>
              <p className="type-body mt-3 text-[var(--color-text-secondary)]">
                No. A rough description of the current process is enough to start the
                conversation.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

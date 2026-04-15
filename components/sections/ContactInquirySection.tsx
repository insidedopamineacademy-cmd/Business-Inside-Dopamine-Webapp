"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import Button from "../ui/Button";
import Container from "../ui/Container";
import {
  initialContactFormState,
  submitContactForm,
} from "@/app/contact/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      as="button"
      type="submit"
      variant="primary"
      disabled={pending}
      className={pending ? "cursor-not-allowed opacity-80" : ""}
    >
      {pending ? "Sending request..." : "Book a Strategy Call →"}
    </Button>
  );
}

export default function ContactInquirySection() {
  const reduceMotion = useReducedMotion();
  const [state, formAction] = useActionState(submitContactForm, initialContactFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldErrors = state?.fieldErrors ?? {};
  const status = state?.status ?? "idle";
  const message = state?.message ?? "";
  const sectionTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  useEffect(() => {
    if (status === "success") {
      formRef.current?.reset();
    }
  }, [status]);

  return (
    <>
      <section className="section-space" aria-label="Book a strategy call">
        <Container>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
            <motion.div
              className="rounded-2xl border border-[var(--border-light)] p-6 md:p-10"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={sectionTransition}
            >
              <p className="type-mono text-[var(--color-muted)]">30-MIN STRATEGY CALL</p>
              <h2 className="type-section mt-4 text-3xl text-[var(--color-text)] md:text-4xl">
                Book a call
              </h2>
              <p className="type-body mt-4 max-w-2xl">
                We’ll review the workflow, identify friction points, and decide what kind of system
                makes sense.
              </p>

              <form ref={formRef} action={formAction} className="mt-8">
                <p className="type-body text-sm text-[var(--color-text-secondary)]">
                  Fields marked with * are required.
                </p>

                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-1">
                    <label htmlFor="fullName" className="type-mono text-[var(--color-text)]">
                      Full name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      aria-invalid={Boolean(fieldErrors.fullName)}
                      aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
                      className="id-input mt-2"
                    />
                    {fieldErrors.fullName ? (
                      <p id="fullName-error" className="id-field-error mt-2" role="alert">
                        {fieldErrors.fullName}
                      </p>
                    ) : null}
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor="email" className="type-mono text-[var(--color-text)]">
                      Email address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                      className="id-input mt-2"
                    />
                    {fieldErrors.email ? (
                      <p id="email-error" className="id-field-error mt-2" role="alert">
                        {fieldErrors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor="company" className="type-mono text-[var(--color-text)]">
                      Company / team
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      className="id-input mt-2"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor="phone" className="type-mono text-[var(--color-text)]">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="id-input mt-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="need" className="type-mono text-[var(--color-text)]">
                      What do you need? *
                    </label>
                    <select
                      id="need"
                      name="need"
                      required
                      aria-invalid={Boolean(fieldErrors.need)}
                      aria-describedby={fieldErrors.need ? "need-error" : undefined}
                      className="id-input mt-2"
                    >
                      <option value="">Select an option</option>
                      <option value="BI & AI Dashboards">BI & AI Dashboards</option>
                      <option value="Web Applications">Web Applications</option>
                      <option value="Automation Systems">Automation Systems</option>
                      <option value="AI Copilots & LLMs">AI Copilots & LLMs</option>
                      <option value="CRM & WhatsApp Flows">CRM & WhatsApp Flows</option>
                      <option value="Other">Other</option>
                    </select>
                    {fieldErrors.need ? (
                      <p id="need-error" className="id-field-error mt-2" role="alert">
                        {fieldErrors.need}
                      </p>
                    ) : null}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="bottleneck" className="type-mono text-[var(--color-text)]">
                      Current bottleneck *
                    </label>
                    <textarea
                      id="bottleneck"
                      name="bottleneck"
                      rows={4}
                      required
                      aria-invalid={Boolean(fieldErrors.bottleneck)}
                      aria-describedby={fieldErrors.bottleneck ? "bottleneck-error" : undefined}
                      className="id-input mt-2 resize-y"
                    />
                    {fieldErrors.bottleneck ? (
                      <p id="bottleneck-error" className="id-field-error mt-2" role="alert">
                        {fieldErrors.bottleneck}
                      </p>
                    ) : null}
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor="preferredDate" className="type-mono text-[var(--color-text)]">
                      Preferred call date
                    </label>
                    <input id="preferredDate" name="preferredDate" type="date" className="id-input mt-2" />
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor="preferredTime" className="type-mono text-[var(--color-text)]">
                      Preferred call time
                    </label>
                    <input id="preferredTime" name="preferredTime" type="time" className="id-input mt-2" />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="type-mono text-[var(--color-text)]">
                      Additional notes
                    </label>
                    <textarea id="notes" name="notes" rows={3} className="id-input mt-2 resize-y" />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <div>
                    <SubmitButton />
                  </div>

                  {status !== "idle" ? (
                    <div
                      className={`rounded-xl border px-4 py-3 ${
                        status === "error"
                          ? "border-[rgba(229,0,122,0.35)] bg-[rgba(229,0,122,0.08)]"
                          : "border-[var(--border-light)] bg-[var(--color-surface-light)]"
                      }`}
                      role={status === "error" ? "alert" : "status"}
                      aria-live={status === "error" ? "assertive" : "polite"}
                    >
                      <p
                        className={`type-body text-sm ${
                          status === "error"
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-text)]"
                        }`}
                      >
                        {message}
                      </p>
                    </div>
                  ) : null}

                  <p className="type-body text-sm text-[var(--color-text-secondary)]">
                    No commitment. Just a focused first conversation.
                  </p>
                </div>
              </form>
            </motion.div>

            <motion.aside
              className="rounded-2xl border border-[var(--border-light)] bg-[var(--color-surface-light)] p-6 md:p-8 lg:sticky lg:top-28 lg:h-fit"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={sectionTransition}
              aria-label="Direct contact details"
            >
              <p className="type-mono text-[var(--color-muted)]">DIRECT CONTACT</p>
              <h2 className="type-section mt-4 text-2xl text-[var(--color-text)]">Reach us directly</h2>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="type-mono text-[var(--color-muted)]">Email</p>
                  <a
                    href="mailto:info@insidedopamine.com"
                    className="type-body mt-2 inline-block text-[var(--color-text)] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                  >
                    info@insidedopamine.com
                  </a>
                </div>

                <div>
                  <p className="type-mono text-[var(--color-muted)]">Phone</p>
                  <a
                    href="tel:+447447232654"
                    className="type-body mt-2 inline-block text-[var(--color-text)] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                  >
                    +44 7447 232654
                  </a>
                </div>
              </div>
            </motion.aside>
          </div>
        </Container>
      </section>

      <section className="pb-0 pt-10 md:pt-12" aria-label="Contact trust points">
        <Container>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <p className="type-mono rounded-full border border-[var(--border-light)] px-4 py-3.5 text-center text-[var(--color-text)]">
              Clear scope
            </p>
            <p className="type-mono rounded-full border border-[var(--border-light)] px-4 py-3.5 text-center text-[var(--color-text)]">
              No generic recommendations
            </p>
            <p className="type-mono rounded-full border border-[var(--border-light)] px-4 py-3.5 text-center text-[var(--color-text)]">
              Built around your workflow
            </p>
          </div>
        </Container>
      </section>

      <motion.section
        className="pb-16 pt-10 md:pt-12 md:pb-20"
        aria-label="Contact FAQ"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={sectionTransition}
      >
        <Container>
          <div className="max-w-3xl border-t border-[var(--border-light)]">
            <div className="py-5 md:py-6">
              <h2 className="type-section text-xl text-[var(--color-text)] md:text-2xl">
                What happens on the call?
              </h2>
              <p className="type-body mt-3 text-[var(--color-text-secondary)]">
                We review the workflow, identify where the friction is, and outline what kind of
                system would actually help.
              </p>
            </div>
            <div className="border-t border-[var(--border-light)] py-5 md:py-6">
              <h2 className="type-section text-xl text-[var(--color-text)] md:text-2xl">
                Do I need a full spec before reaching out?
              </h2>
              <p className="type-body mt-3 text-[var(--color-text-secondary)]">
                No. A rough description of the current process is enough to start the conversation.
              </p>
            </div>
          </div>
        </Container>
      </motion.section>
    </>
  );
}

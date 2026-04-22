"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { Input, Label, HelperText } from "../ui/index";
import { MotionDiv, useReducedMotion } from "@/lib/motion";
import { fadeUp, slideInRight, viewport } from "@/lib/animations";
import { submitContactForm } from "@/app/contact/actions";
import { initialContactFormState } from "@/app/contact/form-state";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      as="button"
      type="submit"
      variant="primary"
      isLoading={pending}
      disabled={pending}
    >
      Book a Strategy Call →
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

  useEffect(() => {
    if (status === "success") formRef.current?.reset();
  }, [status]);

  return (
    <>
      <section className="section-space surface-soft" aria-label="Book a strategy call">
        <Container>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">

            {/* ── Form card ── */}
            <MotionDiv
              className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-10"
              variants={fadeUp}
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={viewport}
            >
              <p className="type-mono text-[var(--color-text-tertiary)]">30-MIN STRATEGY CALL</p>
              <h2 className="type-section mt-4 text-3xl text-[var(--color-text-primary)] md:text-4xl">
                Book a call
              </h2>
              <p className="type-body mt-4 max-w-2xl">
                We'll review the workflow, identify friction points, and decide what kind of
                system makes sense.
              </p>

              <form ref={formRef} action={formAction} className="mt-8">
                <p className="type-body text-sm text-[var(--color-text-secondary)]">
                  Fields marked with * are required.
                </p>

                {/* Honeypot */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-1">
                    <Label htmlFor="fullName">Full name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      error={Boolean(fieldErrors.fullName)}
                      aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
                      className="mt-1.5"
                    />
                    {fieldErrors.fullName && (
                      <HelperText error id="fullName-error" role="alert">
                        {fieldErrors.fullName}
                      </HelperText>
                    )}
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="email">Email address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      error={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                      className="mt-1.5"
                    />
                    {fieldErrors.email && (
                      <HelperText error id="email-error" role="alert">
                        {fieldErrors.email}
                      </HelperText>
                    )}
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="company">Company / team</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      className="mt-1.5"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="mt-1.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="need">What do you need? *</Label>
                    <select
                      id="need"
                      name="need"
                      required
                      aria-invalid={Boolean(fieldErrors.need)}
                      aria-describedby={fieldErrors.need ? "need-error" : undefined}
                      className="id-input mt-1.5"
                    >
                      <option value="">Select an option</option>
                      <option value="BI & AI Dashboards">BI & AI Dashboards</option>
                      <option value="Web Applications">Web Applications</option>
                      <option value="Automation Systems">Automation Systems</option>
                      <option value="AI Copilots & LLMs">AI Copilots & LLMs</option>
                      <option value="CRM & WhatsApp Flows">CRM & WhatsApp Flows</option>
                      <option value="Other">Other</option>
                    </select>
                    {fieldErrors.need && (
                      <HelperText error id="need-error" role="alert">
                        {fieldErrors.need}
                      </HelperText>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="bottleneck">Current bottleneck *</Label>
                    <textarea
                      id="bottleneck"
                      name="bottleneck"
                      rows={4}
                      required
                      maxLength={4000}
                      aria-invalid={Boolean(fieldErrors.bottleneck)}
                      aria-describedby={fieldErrors.bottleneck ? "bottleneck-error" : undefined}
                      className="id-input mt-1.5 resize-y"
                    />
                    {fieldErrors.bottleneck && (
                      <HelperText error id="bottleneck-error" role="alert">
                        {fieldErrors.bottleneck}
                      </HelperText>
                    )}
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="preferredDate">Preferred call date</Label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      className="id-input-native-picker mt-1.5"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="preferredTime">Preferred call time</Label>
                    <Input
                      id="preferredTime"
                      name="preferredTime"
                      type="time"
                      className="id-input-native-picker mt-1.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Additional notes</Label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      maxLength={2000}
                      className="id-input mt-1.5 resize-y"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <div>
                    <SubmitButton />
                  </div>

                  {status !== "idle" && (
                    <div
                      className={`rounded-xl border px-4 py-3 ${
                        status === "error"
                          ? "border-[var(--color-error)]/40 bg-[var(--color-error)]/10"
                          : "border-[var(--color-border)] bg-[var(--color-surface)]"
                      }`}
                      role={status === "error" ? "alert" : "status"}
                      aria-live={status === "error" ? "assertive" : "polite"}
                    >
                      <p
                        className={`type-body text-sm ${
                          status === "error"
                            ? "text-[var(--color-error)]"
                            : "text-[var(--color-text-primary)]"
                        }`}
                      >
                        {message}
                      </p>
                    </div>
                  )}

                  <p className="type-body text-sm text-[var(--color-text-secondary)]">
                    No commitment. Just a focused first conversation.
                  </p>
                </div>
              </form>
            </MotionDiv>

            {/* ── Sidebar ── */}
            <MotionDiv
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8 lg:sticky lg:top-28 lg:h-fit"
              variants={slideInRight}
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={viewport}
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
            </MotionDiv>
          </div>
        </Container>
      </section>

      {/* ── Trust pills ── */}
      <section className="pb-0 pt-10 md:pt-12" aria-label="Contact trust points">
        <Container>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["Clear scope", "No generic recommendations", "Built around your workflow"].map(
              (item) => (
                <p
                  key={item}
                  className="type-mono rounded-full border border-[var(--color-border)] px-4 py-3.5 text-center text-[var(--color-text-primary)]"
                >
                  {item}
                </p>
              ),
            )}
          </div>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <MotionDiv
        className="pb-16 pt-10 md:pt-12 md:pb-20"
        variants={fadeUp}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewport}
      >
        <Container>
          <div className="max-w-3xl border-t border-[var(--color-border)]">
            <div className="py-5 md:py-6">
              <h2 className="type-section text-xl text-[var(--color-text-primary)] md:text-2xl">
                What happens on the call?
              </h2>
              <p className="type-body mt-3 text-[var(--color-text-secondary)]">
                We review the workflow, identify where the friction is, and outline what kind of
                system would actually help.
              </p>
            </div>
            <div className="border-t border-[var(--color-border)] py-5 md:py-6">
              <h2 className="type-section text-xl text-[var(--color-text-primary)] md:text-2xl">
                Do I need a full spec before reaching out?
              </h2>
              <p className="type-body mt-3 text-[var(--color-text-secondary)]">
                No. A rough description of the current process is enough to start the conversation.
              </p>
            </div>
          </div>
        </Container>
      </MotionDiv>
    </>
  );
}

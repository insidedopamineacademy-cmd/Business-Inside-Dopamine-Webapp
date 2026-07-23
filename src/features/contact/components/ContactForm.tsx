"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import {
  contactEnquiryOptions,
  contactFieldDefinitions,
  initialContactFormState,
  type ContactFormAction,
} from "@/features/contact/contract";

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
      Request a Strategy Call →
    </Button>
  );
}

export default function ContactForm({
  action,
}: {
  action: ContactFormAction;
}) {
  const [state, formAction] = useActionState(
    action,
    initialContactFormState,
  );
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const formRef = useRef<HTMLFormElement>(null);
  const fieldErrors = state?.fieldErrors ?? {};
  const status = state?.status ?? "idle";
  const message = state?.message ?? "";
  const values = state?.values ?? {};
  const activeIdempotencyKey = state.idempotencyKey ?? idempotencyKey;

  useEffect(() => {
    if (status === "success") {
      formRef.current?.reset();
    }
  }, [status, state.requestId]);

  return (
    <form
      key={state.requestId ?? "contact-form"}
      ref={formRef}
      action={formAction}
      className="mt-8"
    >
      <input type="hidden" name="idempotencyKey" value={activeIdempotencyKey} />
      <p className="type-body text-sm text-[var(--color-text-secondary)]">
        Fields marked with * are required.
      </p>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          className="md:col-span-1"
          htmlFor="fullName"
          label="Full name *"
          error={fieldErrors.fullName}
          messageId="fullName-error"
        >
          <Input
            id="fullName"
            name="fullName"
            type={contactFieldDefinitions.fullName.type}
            autoComplete="name"
            maxLength={contactFieldDefinitions.fullName.maxLength}
            required
            defaultValue={values.fullName ?? ""}
            error={Boolean(fieldErrors.fullName)}
            aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
            className="mt-1.5"
          />
        </Field>

        <Field
          className="md:col-span-1"
          htmlFor="email"
          label="Email address *"
          error={fieldErrors.email}
          messageId="email-error"
        >
          <Input
            id="email"
            name="email"
            type={contactFieldDefinitions.email.type}
            autoComplete="email"
            maxLength={contactFieldDefinitions.email.maxLength}
            required
            defaultValue={values.email ?? ""}
            error={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className="mt-1.5"
          />
        </Field>

        <Field
          className="md:col-span-1"
          htmlFor="company"
          label="Company / team"
          error={fieldErrors.company}
          messageId="company-error"
        >
          <Input
            id="company"
            name="company"
            type={contactFieldDefinitions.company.type}
            autoComplete="organization"
            defaultValue={values.company ?? ""}
            maxLength={contactFieldDefinitions.company.maxLength}
            error={Boolean(fieldErrors.company)}
            aria-describedby={fieldErrors.company ? "company-error" : undefined}
            className="mt-1.5"
          />
        </Field>

        <Field
          className="md:col-span-1"
          htmlFor="phone"
          label="Phone number"
          error={fieldErrors.phone}
          messageId="phone-error"
        >
          <Input
            id="phone"
            name="phone"
            type={contactFieldDefinitions.phone.type}
            autoComplete="tel"
            defaultValue={values.phone ?? ""}
            maxLength={contactFieldDefinitions.phone.maxLength}
            error={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            className="mt-1.5"
          />
        </Field>

        <Field
          className="md:col-span-2"
          htmlFor="need"
          label="What do you need? *"
          error={fieldErrors.need}
          messageId="need-error"
        >
          <Select
            id="need"
            name="need"
            required
            defaultValue={values.need ?? ""}
            error={Boolean(fieldErrors.need)}
            aria-describedby={fieldErrors.need ? "need-error" : undefined}
            className="mt-1.5"
          >
            <option value="">Select an option</option>
            {contactEnquiryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          className="md:col-span-2"
          htmlFor="bottleneck"
          label="Current bottleneck *"
          error={fieldErrors.bottleneck}
          messageId="bottleneck-error"
        >
          <Textarea
            id="bottleneck"
            name="bottleneck"
            rows={4}
            required
            defaultValue={values.bottleneck ?? ""}
            maxLength={contactFieldDefinitions.bottleneck.maxLength}
            error={Boolean(fieldErrors.bottleneck)}
            aria-describedby={fieldErrors.bottleneck ? "bottleneck-error" : undefined}
            className="mt-1.5"
          />
        </Field>

        <Field
          className="md:col-span-1"
          htmlFor="preferredDate"
          label="Preferred call date"
          error={fieldErrors.preferredDate}
          messageId="preferredDate-error"
        >
          <Input
            id="preferredDate"
            name="preferredDate"
            type={contactFieldDefinitions.preferredDate.type}
            defaultValue={values.preferredDate ?? ""}
            error={Boolean(fieldErrors.preferredDate)}
            aria-describedby={
              fieldErrors.preferredDate ? "preferredDate-error" : undefined
            }
            className="id-input-native-picker mt-1.5"
          />
        </Field>

        <Field
          className="md:col-span-1"
          htmlFor="preferredTime"
          label="Preferred call time"
          error={fieldErrors.preferredTime}
          messageId="preferredTime-error"
        >
          <Input
            id="preferredTime"
            name="preferredTime"
            type={contactFieldDefinitions.preferredTime.type}
            defaultValue={values.preferredTime ?? ""}
            error={Boolean(fieldErrors.preferredTime)}
            aria-describedby={
              fieldErrors.preferredTime ? "preferredTime-error" : undefined
            }
            className="id-input-native-picker mt-1.5"
          />
        </Field>

        <Field className="md:col-span-2" htmlFor="notes" label="Additional notes">
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={values.notes ?? ""}
            maxLength={contactFieldDefinitions.notes.maxLength}
            className="mt-1.5"
          />
        </Field>
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
        <p className="type-body text-sm text-[var(--color-text-secondary)]">
          By sending, you ask Inside Dopamine to store these details and use them to
          respond to your inquiry. This does not book a meeting. See the{" "}
          <a href="/privacy" className="underline underline-offset-2">
            Privacy Notice
          </a>
          .
        </p>
      </div>
    </form>
  );
}

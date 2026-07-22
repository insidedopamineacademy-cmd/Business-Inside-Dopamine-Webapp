"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Button from "@/components/ui/Button";
import Input, { Label, HelperText } from "@/components/ui/Input";

type Props = {
  onSubmit: (
    name: string,
    email: string,
    idempotencyKey: string,
  ) => Promise<{ success: boolean; message?: string }>;
  onSkip: () => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function ChatLeadCapture({ onSubmit, onSkip }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate() {
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_RE.test(email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || isSubmitting) return;
    setSubmitError("");
    setIsSubmitting(true);
    const result = await onSubmit(name.trim(), email.trim(), idempotencyKey);
    if (!result.success) {
      setSubmitError(
        result.message ??
          "We couldn't save your request. Please retry or use the contact page.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="show"
      className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-md"
    >
      <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">
        Request a call with our team
      </p>
      <p className="mb-3 mt-0.5 text-[13px] text-[var(--color-text-secondary)]">
        Share your details so the team can follow up
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div>
          <Label htmlFor="chat-lead-name">Name</Label>
          <Input
            id="chat-lead-name"
            type="text"
            placeholder="Your name"
            value={name}
            maxLength={100}
            disabled={isSubmitting}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={!!errors.name}
            aria-describedby={errors.name ? "chat-lead-name-error" : undefined}
            autoComplete="name"
          />
          {errors.name && (
            <HelperText id="chat-lead-name-error" error>
              {errors.name}
            </HelperText>
          )}
        </div>

        <div>
          <Label htmlFor="chat-lead-email">Email</Label>
          <Input
            id="chat-lead-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            maxLength={254}
            disabled={isSubmitting}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={!!errors.email}
            aria-describedby={errors.email ? "chat-lead-email-error" : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <HelperText id="chat-lead-email-error" error>
              {errors.email}
            </HelperText>
          )}
        </div>

        {submitError && (
          <p role="alert" className="text-sm text-[var(--color-error)]">
            {submitError}{" "}
            <a href="/contact" className="underline underline-offset-2">
              Use the contact page
            </a>
            .
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-1"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Send request
        </Button>
        <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
          By sending, you ask us to store these details and follow up. This does not book a
          meeting. See the{" "}
          <a href="/privacy" className="underline underline-offset-2">
            Privacy Notice
          </a>
          .
        </p>
      </form>

      <button
        type="button"
        onClick={onSkip}
        disabled={isSubmitting}
        className="mt-3 w-full cursor-pointer text-center text-sm text-[var(--color-text-secondary)] underline underline-offset-2 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      >
        Maybe later
      </button>
    </motion.div>
  );
}

"use server";

import { headers } from "next/headers";

import type { ContactFormState } from "./form-state";
import {
  createLead,
  LeadServiceError,
  validateContactFormEnvelope,
} from "@/lib/lead-service";
import {
  PublicApiError,
  createRequestId,
  isUuid,
  logPublicApiFailure,
} from "@/lib/public-api";
import { checkPublicRateLimit } from "@/lib/rate-limit";

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function submittedValues(formData: FormData): ContactFormState["values"] {
  const bounded = (key: string, maximum: number) => readField(formData, key).slice(0, maximum);
  return {
    fullName: bounded("fullName", 100),
    email: bounded("email", 254),
    company: bounded("company", 120),
    phone: bounded("phone", 32),
    need: bounded("need", 80),
    bottleneck: bounded("bottleneck", 4_000),
    preferredDate: bounded("preferredDate", 10),
    preferredTime: bounded("preferredTime", 5),
    notes: bounded("notes", 2_000),
  };
}

const SUCCESS_MESSAGE =
  "Thanks, your inquiry has been received. The team can follow up using the details you provided.";
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const requestId = createRequestId();
  const submittedIdempotencyKey = readField(formData, "idempotencyKey");
  const retryIdempotencyKey = isUuid(submittedIdempotencyKey)
    ? submittedIdempotencyKey
    : requestId;
  const values = submittedValues(formData);
  const envelope = validateContactFormEnvelope(formData);
  if (!envelope.valid) {
    return {
      status: "error",
      message:
        envelope.reason === "oversized"
          ? "That request is too large. Please shorten it and try again."
          : "The submitted form was not valid. Please refresh and try again.",
      fieldErrors: {},
      values,
      idempotencyKey: retryIdempotencyKey,
      requestId,
    };
  }
  const honeypot = readField(formData, "website").trim();

  if (honeypot) {
    return {
      status: "error",
      message: "That request could not be submitted. Please refresh and try again.",
      fieldErrors: {},
      values,
      idempotencyKey: retryIdempotencyKey,
      requestId,
    };
  }

  try {
    const headersList = await headers();
    const quota = await checkPublicRateLimit(headersList, {
      scope: "contact",
      ipLimit: 3,
      windowMs: 10 * 60 * 1_000,
    });
    if (!quota.allowed) {
      return {
        status: "error",
        message: `Too many submissions. Please try again in ${Math.ceil(quota.retryAfterSeconds / 60)} minute${quota.retryAfterSeconds > 60 ? "s" : ""}.`,
        fieldErrors: {},
        values,
        idempotencyKey: retryIdempotencyKey,
        requestId,
      };
    }

    await createLead({
      source: "CONTACT",
      idempotencyKey: readField(formData, "idempotencyKey"),
      traceId: requestId,
      fullName: readField(formData, "fullName"),
      email: readField(formData, "email"),
      company: readField(formData, "company"),
      phone: readField(formData, "phone"),
      need: readField(formData, "need"),
      bottleneck: readField(formData, "bottleneck"),
      preferredDate: readField(formData, "preferredDate"),
      preferredTime: readField(formData, "preferredTime"),
      notes: readField(formData, "notes"),
    });

    return {
      status: "success",
      message: SUCCESS_MESSAGE,
      fieldErrors: {},
      values: {},
      idempotencyKey: requestId,
      requestId,
    };
  } catch (error) {
    if (error instanceof LeadServiceError && error.code === "LEAD_INVALID_REQUEST") {
      return {
        status: "error",
        message: "Please review the highlighted fields and try again.",
        fieldErrors: error.fieldErrors,
        values,
        idempotencyKey: retryIdempotencyKey,
        requestId,
      };
    }

    const retryable =
      error instanceof LeadServiceError
        ? error.retryable
        : error instanceof PublicApiError
          ? error.retryable
          : true;
    const code =
      error instanceof LeadServiceError || error instanceof PublicApiError
        ? error.code
        : "CONTACT_INTERNAL_ERROR";
    logPublicApiFailure("contact", requestId, {
      code,
      dependency: code.includes("RATE_LIMIT") ? "rate-limit" : "database",
      retryable,
    });
    return {
      status: "error",
      message:
        "We couldn't save your request right now. Please retry or email info@insidedopamine.com.",
      fieldErrors: {},
      values,
      idempotencyKey: retryIdempotencyKey,
      requestId,
    };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import type { ContactFormState } from "./form-state";

type ContactSubmission = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  need: string;
  bottleneck: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  submittedAt: string;
};

function readField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const honeypot = readField(formData, "website");

  if (honeypot) {
    return {
      status: "success",
      message:
        "Thanks, your inquiry has been received. We’ll reply shortly from info@insidedopamine.com.",
      fieldErrors: {},
    };
  }

  const payload: ContactSubmission = {
    fullName: readField(formData, "fullName"),
    email: readField(formData, "email"),
    company: readField(formData, "company"),
    phone: readField(formData, "phone"),
    need: readField(formData, "need"),
    bottleneck: readField(formData, "bottleneck"),
    preferredDate: readField(formData, "preferredDate"),
    preferredTime: readField(formData, "preferredTime"),
    notes: readField(formData, "notes"),
    submittedAt: new Date().toISOString(),
  };

  const fieldErrors: ContactFormState["fieldErrors"] = {};

  if (!payload.fullName) fieldErrors.fullName = "Please enter your full name.";
  if (!payload.email) fieldErrors.email = "Please enter your email address.";
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  if (!payload.need) fieldErrors.need = "Please select what you need.";
  if (!payload.bottleneck) fieldErrors.bottleneck = "Please describe your current bottleneck.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please review the highlighted fields and try again.",
      fieldErrors,
    };
  }

  try {
    await prisma.lead.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        company: payload.company || null,
        phone: payload.phone || null,
        need: payload.need,
        bottleneck: payload.bottleneck,
        preferredDate: payload.preferredDate || null,
        preferredTime: payload.preferredTime || null,
        notes: payload.notes || null,
      },
    });
  } catch (error) {
    console.error("[contact] failed to save lead submission", error);
    return {
      status: "error",
      message:
        "We couldn’t save your request right now. Please email info@insidedopamine.com or call +44 7447 232654.",
      fieldErrors: {},
    };
  }

  const webhookUrl = process.env.CONTACT_INBOX_WEBHOOK_URL;

  if (webhookUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn("[contact] webhook notification failed with non-ok status", {
          status: response.status,
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn("[contact] webhook notification request failed", error);
    }
  } else {
    console.warn(
      "[contact] CONTACT_INBOX_WEBHOOK_URL is not configured. Lead is saved to database only.",
    );
  }

  return {
    status: "success",
    message:
      "Thanks, your inquiry has been received. We’ll reply shortly from info@insidedopamine.com.",
    fieldErrors: {},
  };
}

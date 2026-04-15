"use server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<"fullName" | "email" | "need" | "bottleneck", string>>;
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

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
        return {
          status: "error",
          message:
            "We couldn’t send your request right now. Please email info@insidedopamine.com or call +44 7447 232654.",
          fieldErrors: {},
        };
      }
    } catch {
      clearTimeout(timeoutId);
      return {
        status: "error",
        message:
          "We couldn’t send your request right now. Please email info@insidedopamine.com or call +44 7447 232654.",
        fieldErrors: {},
      };
    }
  } else {
    console.warn(
      "[contact] CONTACT_INBOX_WEBHOOK_URL is not configured. Submission is logged only.",
    );
    console.info("[contact] strategy-call-submission", payload);

    return {
      status: "error",
      message:
        "We couldn’t send your request right now. Please email info@insidedopamine.com or call +44 7447 232654.",
      fieldErrors: {},
    };
  }

  return {
    status: "success",
    message:
      "Thanks, your inquiry has been received. We’ll reply shortly from info@insidedopamine.com.",
    fieldErrors: {},
  };
}

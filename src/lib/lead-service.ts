import "server-only";

import { createHash } from "node:crypto";

import type { LeadNotificationStatus, LeadSource, PrismaClient } from "@prisma/client";

import {
  contactEnquiryValues,
  contactFieldDefinitions,
  contactFieldNames,
  isContactEnquiryValue,
  type ContactFieldName,
} from "@/features/contact/contract";
import {
  type ContactWebhookConfiguration,
  getContactWebhookConfiguration,
  getDatabaseConfiguration,
} from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  isUuid,
  logPublicApiFailure,
  logPublicApiWarning,
} from "@/lib/server/public-api-core";

export const CONTACT_NEEDS = contactEnquiryValues;

const CONTACT_BODY_LIMIT_BYTES = 16 * 1_024;
const CONTACT_FIELDS = new Set([
  "idempotencyKey",
  "website",
  ...contactFieldNames,
]);

export function validateContactFormEnvelope(formData: FormData) {
  const encoder = new TextEncoder();
  const seen = new Set<string>();
  let bytes = 0;

  for (const [key, value] of formData.entries()) {
    if (seen.has(key) || typeof value !== "string") {
      return { valid: false as const, reason: "unsupported" as const };
    }
    seen.add(key);
    bytes += encoder.encode(key).byteLength + encoder.encode(value).byteLength + 2;
    if (bytes > CONTACT_BODY_LIMIT_BYTES) {
      return { valid: false as const, reason: "oversized" as const };
    }

    // React/Next adds opaque Server Action transport metadata to FormData.
    // It is counted toward the decoded budget but is not visitor input.
    if (key.startsWith("$ACTION_")) continue;
    if (!CONTACT_FIELDS.has(key)) {
      return { valid: false as const, reason: "unsupported" as const };
    }
  }

  return { valid: true as const };
}

export type LeadField = ContactFieldName;

export class LeadServiceError extends Error {
  readonly code:
    | "LEAD_INVALID_REQUEST"
    | "LEAD_IDEMPOTENCY_CONFLICT"
    | "LEAD_CONVERSATION_NOT_FOUND"
    | "LEAD_PERSISTENCE_FAILED";
  readonly fieldErrors: Partial<Record<LeadField, string>>;
  readonly retryable: boolean;

  constructor(options: {
    code: LeadServiceError["code"];
    diagnostic: string;
    retryable?: boolean;
    fieldErrors?: Partial<Record<LeadField, string>>;
  }) {
    super(options.diagnostic);
    this.name = "LeadServiceError";
    this.code = options.code;
    this.retryable = options.retryable ?? false;
    this.fieldErrors = options.fieldErrors ?? {};
  }
}

export type RawLeadSubmission =
  | {
      source: "CONTACT";
      idempotencyKey: unknown;
      traceId: string;
      fullName: unknown;
      email: unknown;
      company: unknown;
      phone: unknown;
      need: unknown;
      bottleneck: unknown;
      preferredDate: unknown;
      preferredTime: unknown;
      notes: unknown;
    }
  | {
      source: "CHAT";
      idempotencyKey: unknown;
      traceId: string;
      conversationId: string;
      fullName: unknown;
      email: unknown;
    };

type NormalizedLead = {
  source: LeadSource;
  idempotencyKey: string;
  traceId: string;
  conversationId: string | null;
  fullName: string;
  email: string;
  company: string | null;
  phone: string | null;
  need: string;
  bottleneck: string;
  preferredDate: string | null;
  preferredTime: string | null;
  notes: string | null;
};

type LeadServiceDependencies = {
  db?: PrismaClient;
  fetchImpl?: typeof fetch;
  webhook?: ContactWebhookConfiguration;
  validateDatabase?: () => unknown;
};

function normalizedText(value: unknown, maximum: number) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.length <= maximum ? normalized : null;
}

function normalizedLongText(value: unknown, maximum: number) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\r\n?/g, "\n");
  return normalized.length <= maximum ? normalized : null;
}

function validEmail(value: unknown) {
  const email = normalizedText(
    value,
    contactFieldDefinitions.email.maxLength,
  )?.toLowerCase() ?? null;
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value);
}

function validateLead(raw: RawLeadSubmission): NormalizedLead {
  const fieldErrors: Partial<Record<LeadField, string>> = {};
  const idempotencyKey =
    typeof raw.idempotencyKey === "string" && isUuid(raw.idempotencyKey)
      ? raw.idempotencyKey
      : null;
  const fullName = normalizedText(
    raw.fullName,
    contactFieldDefinitions.fullName.maxLength,
  );
  const email = validEmail(raw.email);

  if (!fullName) fieldErrors.fullName = "Please enter a name using 100 characters or fewer.";
  if (!email) fieldErrors.email = "Please enter a valid email address.";

  if (!idempotencyKey || !isUuid(raw.traceId)) {
    throw new LeadServiceError({
      code: "LEAD_INVALID_REQUEST",
      diagnostic: "Lead idempotency or trace identifier was invalid.",
      fieldErrors,
    });
  }

  if (raw.source === "CHAT") {
    if (!raw.conversationId || raw.conversationId.length > 128 || Object.keys(fieldErrors).length) {
      throw new LeadServiceError({
        code: "LEAD_INVALID_REQUEST",
        diagnostic: "Chat lead fields were invalid.",
        fieldErrors,
      });
    }
    return {
      source: "CHAT",
      idempotencyKey,
      traceId: raw.traceId,
      conversationId: raw.conversationId,
      fullName: fullName!,
      email: email!,
      company: null,
      phone: null,
      need: "Chat follow-up request",
      bottleneck: "Visitor requested a follow-up through chat.",
      preferredDate: null,
      preferredTime: null,
      notes: null,
    };
  }

  const company = normalizedText(
    raw.company,
    contactFieldDefinitions.company.maxLength,
  );
  const phone = normalizedText(raw.phone, contactFieldDefinitions.phone.maxLength);
  const need = normalizedText(raw.need, contactFieldDefinitions.need.maxLength);
  const bottleneck = normalizedLongText(
    raw.bottleneck,
    contactFieldDefinitions.bottleneck.maxLength,
  );
  const preferredDate = normalizedText(
    raw.preferredDate,
    contactFieldDefinitions.preferredDate.maxLength,
  );
  const preferredTime = normalizedText(
    raw.preferredTime,
    contactFieldDefinitions.preferredTime.maxLength,
  );
  const notes = normalizedLongText(
    raw.notes,
    contactFieldDefinitions.notes.maxLength,
  );

  if (typeof raw.company !== "string" || company === null) {
    fieldErrors.company = "Please keep the company name under 120 characters.";
  }
  if (typeof raw.phone !== "string" || phone === null) {
    fieldErrors.phone = "Please keep the phone number under 32 characters.";
  }
  if (!need || !isContactEnquiryValue(need)) {
    fieldErrors.need = "Please select one of the available options.";
  }
  if (!bottleneck) {
    fieldErrors.bottleneck = "Please describe your current bottleneck in 4,000 characters or fewer.";
  }
  if (preferredDate && !validDate(preferredDate)) {
    fieldErrors.preferredDate = "Please enter a valid date.";
  }
  if (preferredTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(preferredTime)) {
    fieldErrors.preferredTime = "Please enter a valid time.";
  }
  if (typeof raw.notes !== "string" || notes === null) {
    fieldErrors.notes = "Please keep additional notes under 2,000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new LeadServiceError({
      code: "LEAD_INVALID_REQUEST",
      diagnostic: "Contact lead fields were invalid.",
      fieldErrors,
    });
  }

  return {
    source: "CONTACT",
    idempotencyKey,
    traceId: raw.traceId,
    conversationId: null,
    fullName: fullName!,
    email: email!,
    company: company || null,
    phone: phone || null,
    need: need!,
    bottleneck: bottleneck!,
    preferredDate: preferredDate || null,
    preferredTime: preferredTime || null,
    notes: notes || null,
  };
}

function fingerprint(input: NormalizedLead) {
  return createHash("sha256")
    .update(JSON.stringify({ ...input, traceId: undefined }))
    .digest("hex");
}

async function existingReceipt(db: PrismaClient, input: NormalizedLead, inputFingerprint: string) {
  const existing = await db.lead.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
    select: {
      id: true,
      requestFingerprint: true,
      notifications: { select: { status: true }, take: 1 },
    },
  });
  if (!existing) return null;
  if (existing.requestFingerprint !== inputFingerprint) {
    throw new LeadServiceError({
      code: "LEAD_IDEMPOTENCY_CONFLICT",
      diagnostic: "An idempotency key was reused with different normalized input.",
    });
  }
  return {
    leadId: existing.id,
    duplicate: true,
    notificationStatus: existing.notifications[0]?.status ?? "NOT_CONFIGURED",
  } as const;
}

async function existingConversationReceipt(db: PrismaClient, input: NormalizedLead) {
  if (input.source !== "CHAT" || !input.conversationId) return null;

  const existing = await db.lead.findUnique({
    where: { conversationId: input.conversationId },
    select: {
      id: true,
      source: true,
      fullName: true,
      email: true,
      notifications: { select: { status: true }, take: 1 },
    },
  });
  if (!existing) return null;
  if (
    existing.source !== "CHAT" ||
    existing.fullName !== input.fullName ||
    existing.email !== input.email
  ) {
    throw new LeadServiceError({
      code: "LEAD_IDEMPOTENCY_CONFLICT",
      diagnostic: "A chat conversation was already linked to different normalized lead details.",
    });
  }

  return {
    leadId: existing.id,
    duplicate: true,
    notificationStatus: existing.notifications[0]?.status ?? "NOT_CONFIGURED",
  } as const;
}

function isUniqueConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

async function deliverNotification(options: {
  db: PrismaClient;
  fetchImpl: typeof fetch;
  webhookUrl: string;
  leadId: string;
  input: NormalizedLead;
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  let status: LeadNotificationStatus = "FAILED";
  let errorCode: string | null = "NETWORK";

  try {
    const response = await options.fetchImpl(options.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": `lead-notification:${options.leadId}`,
      },
      body: JSON.stringify({
        leadId: options.leadId,
        traceId: options.input.traceId,
        source: options.input.source,
        fullName: options.input.fullName,
        email: options.input.email,
        company: options.input.company,
        phone: options.input.phone,
        need: options.input.need,
        bottleneck: options.input.bottleneck,
        preferredDate: options.input.preferredDate,
        preferredTime: options.input.preferredTime,
        notes: options.input.notes,
      }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (response.ok) {
      status = "SENT";
      errorCode = null;
    } else {
      errorCode = `HTTP_${Math.floor(response.status / 100)}XX`;
    }
  } catch (error) {
    errorCode = error instanceof Error && error.name === "AbortError" ? "TIMEOUT" : "NETWORK";
  } finally {
    clearTimeout(timeout);
  }

  try {
    await options.db.leadNotification.update({
      where: { leadId_channel: { leadId: options.leadId, channel: "WEBHOOK" } },
      data: {
        status,
        attempts: { increment: 1 },
        lastAttemptAt: new Date(),
        deliveredAt: status === "SENT" ? new Date() : null,
        lastErrorCode: errorCode,
      },
    });
  } catch {
    logPublicApiFailure("lead-notification", options.input.traceId, {
      code: "NOTIFICATION_STATUS_PERSISTENCE_FAILED",
      dependency: "database",
      retryable: true,
    });
  }

  if (status === "FAILED") {
    logPublicApiWarning("lead-notification", options.input.traceId, {
      code: errorCode ?? "NOTIFICATION_FAILED",
      dependency: "notification",
      retryable: true,
    });
  }
  return status;
}

export async function createLead(
  raw: RawLeadSubmission,
  dependencies: LeadServiceDependencies = {},
) {
  const input = validateLead(raw);
  const inputFingerprint = fingerprint(input);
  const db = dependencies.db ?? prisma;
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const webhook = dependencies.webhook ?? getContactWebhookConfiguration();

  try {
    (dependencies.validateDatabase ?? getDatabaseConfiguration)();
  } catch {
    throw new LeadServiceError({
      code: "LEAD_PERSISTENCE_FAILED",
      diagnostic: "Database configuration is missing or invalid.",
      retryable: false,
    });
  }

  let duplicate;
  try {
    duplicate = await existingReceipt(db, input, inputFingerprint);
  } catch (error) {
    if (error instanceof LeadServiceError) throw error;
    throw new LeadServiceError({
      code: "LEAD_PERSISTENCE_FAILED",
      diagnostic: "Lead idempotency lookup failed.",
      retryable: true,
    });
  }
  if (duplicate) return duplicate;

  // A chat conversation can only own one lead. A later capture form may use a
  // fresh idempotency key after remounting. Return the existing durable receipt
  // only when the normalized business details match; never confirm unstored edits.
  try {
    const conversationDuplicate = await existingConversationReceipt(db, input);
    if (conversationDuplicate) return conversationDuplicate;
  } catch (error) {
    if (error instanceof LeadServiceError) throw error;
    throw new LeadServiceError({
      code: "LEAD_PERSISTENCE_FAILED",
      diagnostic: "Chat conversation lead lookup failed.",
      retryable: true,
    });
  }

  const initialNotificationStatus: LeadNotificationStatus =
    webhook.status === "configured"
      ? "PENDING"
      : webhook.status === "invalid"
        ? "FAILED"
        : "NOT_CONFIGURED";

  let created: { id: string };
  try {
    created = await db.$transaction(async (transaction) => {
      const lead = await transaction.lead.create({
        data: {
          source: input.source,
          idempotencyKey: input.idempotencyKey,
          requestFingerprint: inputFingerprint,
          traceId: input.traceId,
          conversationId: input.conversationId,
          fullName: input.fullName,
          email: input.email,
          company: input.company,
          phone: input.phone,
          need: input.need,
          bottleneck: input.bottleneck,
          preferredDate: input.preferredDate,
          preferredTime: input.preferredTime,
          notes: input.notes,
          notifications: {
            create: {
              status: initialNotificationStatus,
              lastErrorCode:
                webhook.status === "invalid" ? "WEBHOOK_CONFIGURATION_INVALID" : null,
            },
          },
        },
        select: { id: true },
      });

      if (input.source === "CHAT" && input.conversationId) {
        await transaction.conversation.update({
          where: { id: input.conversationId },
          data: { leadName: input.fullName, leadEmail: input.email },
          select: { id: true },
        });
      }
      return lead;
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      try {
        const racedDuplicate = await existingReceipt(db, input, inputFingerprint);
        if (racedDuplicate) return racedDuplicate;

        const racedConversationDuplicate = await existingConversationReceipt(db, input);
        if (racedConversationDuplicate) return racedConversationDuplicate;
      } catch (lookupError) {
        if (lookupError instanceof LeadServiceError) throw lookupError;
      }
    }
    const missingConversation =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === "P2025";
    throw new LeadServiceError({
      code: missingConversation ? "LEAD_CONVERSATION_NOT_FOUND" : "LEAD_PERSISTENCE_FAILED",
      diagnostic: missingConversation
        ? "The linked chat conversation no longer exists."
        : "The durable lead transaction failed.",
      retryable: !missingConversation,
    });
  }

  if (webhook.status === "invalid") {
    logPublicApiWarning("lead-notification", input.traceId, {
      code: "WEBHOOK_CONFIGURATION_INVALID",
      dependency: "notification",
      retryable: false,
    });
  }

  const notificationStatus =
    webhook.status === "configured"
      ? await deliverNotification({
          db,
          fetchImpl,
          webhookUrl: webhook.url,
          leadId: created.id,
          input,
        })
      : initialNotificationStatus;

  return {
    leadId: created.id,
    duplicate: false,
    notificationStatus,
  } as const;
}

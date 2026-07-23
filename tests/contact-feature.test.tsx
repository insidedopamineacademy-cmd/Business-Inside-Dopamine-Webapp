import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const REQUEST_ID = "22222222-2222-4222-8222-222222222222";
const IDEMPOTENCY_KEY = "11111111-1111-4111-8111-111111111111";

const mocks = vi.hoisted(() => ({
  createLead: vi.fn(),
  checkPublicRateLimit: vi.fn(),
  headers: vi.fn(),
  logPublicApiFailure: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("@/lib/rate-limit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/lib/rate-limit")>();
  return { ...actual, checkPublicRateLimit: mocks.checkPublicRateLimit };
});
vi.mock("@/lib/lead-service", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/lib/lead-service")>();
  return { ...actual, createLead: mocks.createLead };
});
vi.mock("@/lib/server/public-api-core", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("../src/lib/server/public-api-core")
  >();
  return {
    ...actual,
    createRequestId: () => REQUEST_ID,
    logPublicApiFailure: mocks.logPublicApiFailure,
  };
});

import ContactPage from "../src/app/(public)/contact/page";
import {
  contactEnquiryOptions,
  contactEnquiryValues,
  contactFieldDefinitions,
  contactFieldNames,
  initialContactFormState,
  type ContactFormState,
} from "../src/features/contact/contract";
import { submitContactForm } from "../src/features/contact/server/action";
import { contactEnquiryOptions as portfolioContactEnquiryOptions } from "../src/data/portfolio";
import { CONTACT_NEEDS, LeadServiceError } from "../src/lib/lead-service";

const root = process.cwd();

function source(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function sourceFiles(directory: string): string[] {
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

function validContactForm(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const fields = {
    idempotencyKey: IDEMPOTENCY_KEY,
    website: "",
    fullName: "Ada Lovelace",
    email: "ada@example.test",
    company: "Dopamine Labs",
    phone: "+44 1234",
    need: "AI Copilots & LLMs",
    bottleneck: "Manual research",
    preferredDate: "2026-08-20",
    preferredTime: "10:30",
    notes: "Please email",
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) formData.set(key, value);
  return formData;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.headers.mockResolvedValue(new Headers());
  mocks.checkPublicRateLimit.mockResolvedValue({ allowed: true });
  mocks.createLead.mockResolvedValue({
    leadId: "lead_123",
    duplicate: false,
    notificationStatus: "NOT_CONFIGURED",
  });
});

describe("contact feature ownership", () => {
  it("keeps shared UI and section modules independent from the route layer", () => {
    for (const file of [
      ...sourceFiles("src/components/ui"),
      ...sourceFiles("src/components/sections"),
    ]) {
      expect(source(file), file).not.toMatch(/from\s+["'][^"']*\/app(?:\/|["'])/);
    }

    const page = source("src/app/(public)/contact/page.tsx");
    expect(page).toContain("@/features/contact/components/ContactInquiry");
    expect(page).not.toContain("@/components/sections/ContactInquirySection");
  });

  it("keeps static contact composition on the server and state in the form island", () => {
    const composition = source("src/features/contact/components/ContactInquiry.tsx");
    const form = source("src/features/contact/components/ContactForm.tsx");

    expect(composition).not.toMatch(/^\s*["']use client["'];/);
    expect(composition).toContain("Reach us directly");
    expect(composition).toContain("Contact trust points");
    expect(composition).toContain("What happens on the call?");
    expect(form).toMatch(/^"use client";/);
    expect(form).toContain("useActionState");
    expect(form).toContain("useFormStatus");
    expect(form).not.toContain("Reach us directly");
    expect(form).not.toContain("What happens on the call?");
  });

  it("keeps the feature options projected from the portfolio registry and server allowlist", () => {
    expect(contactEnquiryOptions).toBe(portfolioContactEnquiryOptions);
    expect(contactEnquiryValues).toEqual(
      portfolioContactEnquiryOptions.map((option) => option.value),
    );
    expect(CONTACT_NEEDS).toBe(contactEnquiryValues);
    expect(contactFieldNames).toEqual(Object.keys(contactFieldDefinitions));
  });

  it("keeps the form state contract JSON serializable", () => {
    const state: ContactFormState = {
      status: "error",
      message: "Please review the highlighted fields and try again.",
      fieldErrors: { email: "Please enter a valid email address." },
      values: { fullName: "Ada Lovelace", email: "invalid" },
      idempotencyKey: IDEMPOTENCY_KEY,
      requestId: REQUEST_ID,
    };

    expect(JSON.parse(JSON.stringify(state))).toEqual(state);
    expect(JSON.parse(JSON.stringify(initialContactFormState))).toEqual(
      initialContactFormState,
    );
  });

  it("keeps createLead behind the feature Server Action", () => {
    const form = source("src/features/contact/components/ContactForm.tsx");
    const action = source("src/features/contact/server/action.ts");
    const leadService = source("src/lib/lead-service.ts");

    expect(action).toMatch(/^"use server";/);
    expect(action).toContain("createLead");
    expect(form).not.toContain("@/lib/lead-service");
    expect(leadService).toMatch(/^import "server-only";/);
  });
});

describe("contact action behavior", () => {
  it("submits normalized server inputs and clears values only after durable success", async () => {
    const result = await submitContactForm(
      initialContactFormState,
      validContactForm(),
    );

    expect(mocks.checkPublicRateLimit).toHaveBeenCalledOnce();
    expect(mocks.createLead).toHaveBeenCalledWith({
      source: "CONTACT",
      idempotencyKey: IDEMPOTENCY_KEY,
      traceId: REQUEST_ID,
      fullName: "Ada Lovelace",
      email: "ada@example.test",
      company: "Dopamine Labs",
      phone: "+44 1234",
      need: "AI Copilots & LLMs",
      bottleneck: "Manual research",
      preferredDate: "2026-08-20",
      preferredTime: "10:30",
      notes: "Please email",
    });
    expect(result).toEqual({
      status: "success",
      message:
        "Thanks, your inquiry has been received. The team can follow up using the details you provided.",
      fieldErrors: {},
      values: {},
      idempotencyKey: REQUEST_ID,
      requestId: REQUEST_ID,
    });
  });

  it("preserves entered values, field errors, and the retry idempotency key", async () => {
    mocks.createLead.mockRejectedValue(
      new LeadServiceError({
        code: "LEAD_INVALID_REQUEST",
        diagnostic: "Synthetic invalid contact fields.",
        fieldErrors: { email: "Please enter a valid email address." },
      }),
    );

    const result = await submitContactForm(
      initialContactFormState,
      validContactForm({ email: "invalid" }),
    );

    expect(result).toMatchObject({
      status: "error",
      message: "Please review the highlighted fields and try again.",
      fieldErrors: { email: "Please enter a valid email address." },
      values: {
        fullName: "Ada Lovelace",
        email: "invalid",
        bottleneck: "Manual research",
      },
      idempotencyKey: IDEMPOTENCY_KEY,
      requestId: REQUEST_ID,
    });
  });
});

describe("server-rendered contact route", () => {
  it("renders the existing form, direct contact, trust, and FAQ content", () => {
    const markup = renderToStaticMarkup(<ContactPage />);

    expect(markup).toContain("Let’s talk about the system you need.");
    expect(markup).toContain("Request a Strategy Call");
    expect(markup).toContain("info@insidedopamine.com");
    expect(markup).toContain("Built around your workflow");
    expect(markup).toContain("What happens on the call?");
    expect(markup).toContain("AI Copilots &amp; LLMs");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
  leadUpdate: vi.fn(),
  faqFindMany: vi.fn(),
  faqCreate: vi.fn(),
  faqUpdate: vi.fn(),
  faqDelete: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/admin-auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    lead: { update: mocks.leadUpdate },
    faq: {
      findMany: mocks.faqFindMany,
      create: mocks.faqCreate,
      update: mocks.faqUpdate,
      delete: mocks.faqDelete,
    },
  },
}));

import {
  archiveLead,
  unarchiveLead,
  updateLead,
} from "../src/app/admin/leads/actions";
import {
  createFAQ,
  deleteFAQ,
  getFAQs,
  updateFAQ,
} from "../src/app/admin/faqs/actions";

function leadForm(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const values = {
    id: "lead_123",
    status: "QUALIFIED",
    meetingBooked: "on",
    meetingDate: "2026-08-20",
    meetingNotes: "Confirmed by phone.",
    ...overrides,
  };

  for (const [key, value] of Object.entries(values)) formData.set(key, value);
  return formData;
}

const prismaSpies = [
  mocks.leadUpdate,
  mocks.faqFindMany,
  mocks.faqCreate,
  mocks.faqUpdate,
  mocks.faqDelete,
];

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireAdmin.mockResolvedValue(undefined);
  mocks.leadUpdate.mockResolvedValue({ id: "lead_123" });
  mocks.faqFindMany.mockResolvedValue([]);
  mocks.faqCreate.mockResolvedValue({
    id: "faq_123",
    question: "What do you build?",
    answer: "Business applications.",
    category: "Services",
    isActive: true,
    order: 2,
  });
  mocks.faqUpdate.mockResolvedValue({
    id: "faq_123",
    question: "What do you build?",
    answer: "Business applications.",
    category: "Services",
    isActive: false,
    order: 2,
  });
  mocks.faqDelete.mockResolvedValue({ id: "faq_123" });
});

describe("admin Server Action authorization", () => {
  const actions: Array<[string, () => Promise<unknown>]> = [
    ["updateLead", () => updateLead(undefined as unknown as FormData)],
    ["archiveLead", () => archiveLead(undefined as unknown as FormData)],
    ["unarchiveLead", () => unarchiveLead(undefined as unknown as FormData)],
    ["getFAQs", () => getFAQs()],
    ["createFAQ", () => createFAQ(undefined)],
    ["updateFAQ", () => updateFAQ(undefined, undefined)],
    ["deleteFAQ", () => deleteFAQ(undefined)],
  ];

  it.each(actions)("rejects direct unauthorized invocation of %s before Prisma", async (_name, invoke) => {
    mocks.requireAdmin.mockRejectedValue(new Error("Unauthorized."));

    await expect(invoke()).rejects.toThrow("Unauthorized.");

    for (const prismaSpy of prismaSpies) expect(prismaSpy).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});

describe("authorized admin actions", () => {
  it("returns only the FAQ fields selected for the manager", async () => {
    const faq = {
      id: "faq_123",
      question: "What do you build?",
      answer: "Business applications.",
      category: "Services",
      isActive: true,
      order: 2,
    };
    mocks.faqFindMany.mockResolvedValue([faq]);

    await expect(getFAQs()).resolves.toEqual([faq]);
    expect(mocks.faqFindMany).toHaveBeenCalledWith({
      orderBy: { order: "asc" },
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        isActive: true,
        order: true,
      },
    });
  });

  it("normalizes and bounds FAQ creation data", async () => {
    const result = await createFAQ({
      question: "  What do you build? ",
      answer: " Business applications. ",
      category: "Services",
      order: 2,
    });

    expect(mocks.faqCreate).toHaveBeenCalledWith({
      data: {
        question: "What do you build?",
        answer: "Business applications.",
        category: "Services",
        order: 2,
      },
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        isActive: true,
        order: true,
      },
    });
    expect(result).toEqual({
      id: "faq_123",
      question: "What do you build?",
      answer: "Business applications.",
      category: "Services",
      isActive: true,
      order: 2,
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/faqs");
  });

  it("returns updated FAQ data and revalidates after update and delete", async () => {
    const updated = await updateFAQ(" faq_123 ", { isActive: false });
    await deleteFAQ(" faq_123 ");

    expect(updated).toMatchObject({ id: "faq_123", isActive: false, order: 2 });
    expect(mocks.faqUpdate).toHaveBeenCalledWith({
      where: { id: "faq_123" },
      data: { isActive: false },
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        isActive: true,
        order: true,
      },
    });
    expect(mocks.faqDelete).toHaveBeenCalledWith({
      where: { id: "faq_123" },
      select: { id: true },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledTimes(2);
    expect(mocks.revalidatePath).toHaveBeenNthCalledWith(1, "/admin/faqs");
    expect(mocks.revalidatePath).toHaveBeenNthCalledWith(2, "/admin/faqs");
  });

  it("validates and applies an authorized lead update before revalidation", async () => {
    await updateLead(leadForm());

    expect(mocks.leadUpdate).toHaveBeenCalledWith({
      where: { id: "lead_123" },
      data: {
        status: "QUALIFIED",
        meetingBooked: true,
        meetingDate: "2026-08-20",
        meetingNotes: "Confirmed by phone.",
      },
      select: { id: true },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/leads");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/leads/lead_123");
  });

  it.each([
    [{ question: "Q", answer: "A", category: "Unknown", order: 0 }],
    [{ question: "Q", answer: "A", category: "General", order: -1 }],
    [{ question: "Q", answer: "A", category: "General", order: 0, unknown: true }],
  ])("rejects malformed FAQ creation input without writing", async (input) => {
    await expect(createFAQ(input)).rejects.toThrow();
    expect(mocks.faqCreate).not.toHaveBeenCalled();
  });

  it("rejects oversized meeting notes without writing", async () => {
    await expect(updateLead(leadForm({ meetingNotes: "x".repeat(2_001) }))).rejects.toThrow(
      "Meeting notes are too long."
    );
    expect(mocks.leadUpdate).not.toHaveBeenCalled();
  });
});

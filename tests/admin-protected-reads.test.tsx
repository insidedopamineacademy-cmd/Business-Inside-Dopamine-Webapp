import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  leadFindMany: vi.fn(),
  leadGroupBy: vi.fn(),
  leadCount: vi.fn(),
  leadFindUnique: vi.fn(),
  faqFindMany: vi.fn(),
  conversationFindMany: vi.fn(),
  conversationCount: vi.fn(),
  conversationFindUnique: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/admin-auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("next/navigation", () => ({
  notFound: mocks.notFound,
  redirect: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    lead: {
      findMany: mocks.leadFindMany,
      groupBy: mocks.leadGroupBy,
      count: mocks.leadCount,
      findUnique: mocks.leadFindUnique,
    },
    faq: { findMany: mocks.faqFindMany },
    conversation: {
      findMany: mocks.conversationFindMany,
      count: mocks.conversationCount,
      findUnique: mocks.conversationFindUnique,
    },
  },
}));

import AdminLayout from "../src/app/admin/layout";
import FAQEditor from "../src/app/admin/faqs/FAQEditor";
import AdminFAQsPage from "../src/app/admin/faqs/page";
import AdminConversationsPage from "../src/app/admin/conversations/page";
import AdminLeadsPage from "../src/app/admin/leads/page";
import AdminLeadDetailPage from "../src/app/admin/leads/[id]/page";
import ConversationDetailPage from "../src/app/admin/conversations/[id]/page";

const prismaReadSpies = [
  mocks.leadFindMany,
  mocks.leadGroupBy,
  mocks.leadCount,
  mocks.leadFindUnique,
  mocks.faqFindMany,
  mocks.conversationFindMany,
  mocks.conversationCount,
  mocks.conversationFindUnique,
];

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireAdmin.mockResolvedValue(undefined);
  mocks.leadFindMany.mockResolvedValue([]);
  mocks.leadGroupBy.mockResolvedValue([]);
  mocks.leadCount.mockResolvedValue(0);
  mocks.faqFindMany.mockResolvedValue([]);
  mocks.conversationFindMany.mockResolvedValue([]);
  mocks.conversationCount.mockResolvedValue(0);
  mocks.notFound.mockImplementation(() => {
    throw new Error("Not found.");
  });
});

describe("protected admin reads", () => {
  const reads: Array<[string, () => Promise<unknown>]> = [
    ["admin layout", () => AdminLayout({ children: null })],
    ["FAQ list", () => AdminFAQsPage()],
    ["conversation list", () => AdminConversationsPage({})],
    ["lead list", () => AdminLeadsPage({})],
    [
      "lead detail",
      () => AdminLeadDetailPage({ params: Promise.resolve({ id: "lead_123" }) }),
    ],
    [
      "conversation detail",
      () => ConversationDetailPage({ params: Promise.resolve({ id: "conversation_123" }) }),
    ],
  ];

  it.each(reads)("checks authorization before the %s data path", async (_name, invoke) => {
    mocks.requireAdmin.mockRejectedValue(new Error("Unauthorized."));

    await expect(invoke()).rejects.toThrow("Unauthorized.");

    for (const prismaSpy of prismaReadSpies) expect(prismaSpy).not.toHaveBeenCalled();
    expect(mocks.notFound).not.toHaveBeenCalled();
  });

  it("runs the authorized lead list queries after authorization", async () => {
    await AdminLeadsPage({ searchParams: Promise.resolve({ status: "NEW" }) });

    expect(mocks.requireAdmin).toHaveBeenCalledOnce();
    expect(mocks.leadFindMany).toHaveBeenCalledOnce();
    expect(mocks.leadGroupBy).toHaveBeenCalledOnce();
    expect(mocks.leadCount).toHaveBeenCalledOnce();
  });

  it("loads authorized FAQ data on the server and passes it to the editor", async () => {
    const faqs = [
      {
        id: "faq_123",
        question: "What do you build?",
        answer: "Business applications.",
        category: "Services",
        isActive: true,
        order: 2,
      },
    ];
    mocks.faqFindMany.mockResolvedValue(faqs);

    const page = (await AdminFAQsPage()) as ReactElement<{
      initialFaqs: typeof faqs;
    }>;

    expect(mocks.requireAdmin).toHaveBeenCalledOnce();
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
    expect(page.type).toBe(FAQEditor);
    expect(page.props.initialFaqs).toEqual(faqs);
  });

  it("renders the authorized conversation list on the server in query order", async () => {
    mocks.conversationFindMany.mockResolvedValue([
      {
        id: "conversation_newer",
        createdAt: new Date("2026-07-22T12:00:00.000Z"),
        leadName: "Ada",
        leadEmail: "ada@example.test",
        bookedCall: false,
        messageCount: 3,
        lead: { id: "lead_123" },
      },
      {
        id: "conversation_older",
        createdAt: new Date("2026-07-21T12:00:00.000Z"),
        leadName: "Grace",
        leadEmail: null,
        bookedCall: true,
        messageCount: 0,
        lead: null,
      },
    ]);

    const markup = renderToStaticMarkup(await AdminConversationsPage({}));

    expect(mocks.requireAdmin).toHaveBeenCalledOnce();
    expect(mocks.conversationFindMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 26,
      select: {
        id: true,
        createdAt: true,
        leadName: true,
        leadEmail: true,
        bookedCall: true,
        messageCount: true,
        lead: { select: { id: true } },
      },
    });
    expect(mocks.conversationCount).toHaveBeenNthCalledWith(1);
    expect(mocks.conversationCount).toHaveBeenNthCalledWith(2, {
      where: { lead: { isNot: null } },
    });
    expect(markup).toContain("Chat Conversations");
    expect(markup).toContain("3");
    expect(markup).toContain("Captured");
    expect(markup).toContain("Legacy flag");
    expect(markup.indexOf("Ada")).toBeLessThan(markup.indexOf("Grace"));
  });

  it("uses a narrow select for an authorized conversation detail", async () => {
    mocks.conversationFindUnique.mockResolvedValue({
      sessionId: "session_123",
      messages: [],
      leadName: null,
      leadEmail: null,
      bookedCall: false,
      createdAt: new Date("2026-07-22T10:00:00.000Z"),
      lead: null,
    });

    await ConversationDetailPage({ params: Promise.resolve({ id: "conversation_123" }) });

    expect(mocks.conversationFindUnique).toHaveBeenCalledWith({
      where: { id: "conversation_123" },
      select: {
        sessionId: true,
        messages: true,
        leadName: true,
        leadEmail: true,
        bookedCall: true,
        createdAt: true,
        lead: { select: { id: true } },
      },
    });
  });

  it("uses a narrow lead-detail select that exposes notification outcomes to operators", async () => {
    const createdAt = new Date("2026-07-22T10:00:00.000Z");
    mocks.leadFindUnique.mockResolvedValue({
      id: "lead_123",
      createdAt,
      updatedAt: createdAt,
      fullName: "Ada Lovelace",
      email: "ada@example.test",
      phone: null,
      company: null,
      need: "Other",
      bottleneck: "Synthetic test",
      preferredDate: null,
      preferredTime: null,
      notes: null,
      status: "NEW",
      source: "CHAT",
      meetingBooked: false,
      meetingDate: null,
      meetingNotes: null,
      archived: false,
      notifications: [],
    });

    await AdminLeadDetailPage({ params: Promise.resolve({ id: "lead_123" }) });

    expect(mocks.leadFindUnique).toHaveBeenCalledWith({
      where: { id: "lead_123" },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        fullName: true,
        email: true,
        phone: true,
        company: true,
        need: true,
        bottleneck: true,
        preferredDate: true,
        preferredTime: true,
        notes: true,
        status: true,
        source: true,
        meetingBooked: true,
        meetingDate: true,
        meetingNotes: true,
        archived: true,
        notifications: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            channel: true,
            status: true,
            attempts: true,
            lastAttemptAt: true,
            deliveredAt: true,
            lastErrorCode: true,
          },
        },
      },
    });
  });
});

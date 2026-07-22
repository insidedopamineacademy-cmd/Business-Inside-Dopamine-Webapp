import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  leadFindMany: vi.fn(),
  leadGroupBy: vi.fn(),
  leadCount: vi.fn(),
  leadFindUnique: vi.fn(),
  conversationFindUnique: vi.fn(),
  notFound: vi.fn(),
}));

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
    conversation: { findUnique: mocks.conversationFindUnique },
  },
}));

import AdminLayout from "../src/app/admin/layout";
import AdminLeadsPage from "../src/app/admin/leads/page";
import AdminLeadDetailPage from "../src/app/admin/leads/[id]/page";
import ConversationDetailPage from "../src/app/admin/conversations/[id]/page";

const prismaReadSpies = [
  mocks.leadFindMany,
  mocks.leadGroupBy,
  mocks.leadCount,
  mocks.leadFindUnique,
  mocks.conversationFindUnique,
];

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireAdmin.mockResolvedValue(undefined);
  mocks.leadFindMany.mockResolvedValue([]);
  mocks.leadGroupBy.mockResolvedValue([]);
  mocks.leadCount.mockResolvedValue(0);
  mocks.notFound.mockImplementation(() => {
    throw new Error("Not found.");
  });
});

describe("protected admin reads", () => {
  const reads: Array<[string, () => Promise<unknown>]> = [
    ["admin layout", () => AdminLayout({ children: null })],
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

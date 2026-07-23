import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  leadFindMany: vi.fn(),
  leadGroupBy: vi.fn(),
  leadCount: vi.fn(),
  conversationFindMany: vi.fn(),
  conversationCount: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/admin-auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    lead: {
      findMany: mocks.leadFindMany,
      groupBy: mocks.leadGroupBy,
      count: mocks.leadCount,
    },
    conversation: {
      findMany: mocks.conversationFindMany,
      count: mocks.conversationCount,
    },
  },
}));

import { getConversationListPage } from "../src/app/admin/conversations/queries";
import { getLeadListPage } from "../src/app/admin/leads/queries";
import {
  ADMIN_LIST_DEFAULT_SIZE,
  ADMIN_LIST_MAX_SIZE,
  decodeAdminCursor,
  encodeAdminCursor,
} from "../src/lib/admin-pagination";

const root = process.cwd();

function lead(index: number) {
  return {
    id: `lead_${String(index).padStart(3, "0")}`,
    fullName: `Lead ${index}`,
    email: `lead-${index}@example.test`,
    company: null,
    need: "Other",
    status: "NEW" as const,
    createdAt: new Date(Date.UTC(2026, 6, 22, 12, 0, -index)),
    archived: false,
  };
}

function conversation(index: number) {
  return {
    id: `conversation_${String(index).padStart(3, "0")}`,
    createdAt: new Date(Date.UTC(2026, 6, 22, 12, 0, -index)),
    leadName: index % 2 === 0 ? `Visitor ${index}` : null,
    leadEmail: null,
    bookedCall: false,
    messageCount: index,
    lead: index % 2 === 0 ? { id: `lead_${index}` } : null,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireAdmin.mockResolvedValue(undefined);
  mocks.leadFindMany.mockResolvedValue([]);
  mocks.leadGroupBy.mockResolvedValue([]);
  mocks.leadCount.mockResolvedValue(0);
  mocks.conversationFindMany.mockResolvedValue([]);
  mocks.conversationCount.mockResolvedValue(0);
});

describe("bounded authorized admin collection queries", () => {
  it.each([
    ["lead", () => getLeadListPage(), [mocks.leadFindMany, mocks.leadGroupBy, mocks.leadCount]],
    [
      "conversation",
      () => getConversationListPage(),
      [mocks.conversationFindMany, mocks.conversationCount],
    ],
  ])("rejects an unauthorized %s read before Prisma", async (_name, invoke, spies) => {
    mocks.requireAdmin.mockRejectedValue(new Error("Unauthorized."));

    await expect(invoke()).rejects.toThrow("Unauthorized.");
    for (const spy of spies) expect(spy).not.toHaveBeenCalled();
  });

  it("bounds the default lead page and keeps filters in a narrow deterministic query", async () => {
    mocks.leadFindMany.mockResolvedValue(Array.from({ length: 26 }, (_, index) => lead(index)));

    const result = await getLeadListPage({ q: " Ada ", status: "NEW" });

    expect(result.items).toHaveLength(ADMIN_LIST_DEFAULT_SIZE);
    expect(result.pageInfo.hasNextPage).toBe(true);
    expect(result.pageInfo.hasPreviousPage).toBe(false);
    expect(mocks.leadFindMany).toHaveBeenCalledWith({
      where: {
        archived: false,
        status: "NEW",
        OR: [
          { fullName: { contains: "Ada", mode: "insensitive" } },
          { email: { contains: "Ada", mode: "insensitive" } },
          { company: { contains: "Ada", mode: "insensitive" } },
        ],
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: ADMIN_LIST_DEFAULT_SIZE + 1,
      select: {
        id: true,
        fullName: true,
        email: true,
        company: true,
        need: true,
        status: true,
        createdAt: true,
        archived: true,
      },
    });
  });

  it("enforces the hard maximum and never selects conversation transcript JSON", async () => {
    mocks.conversationFindMany.mockResolvedValue(
      Array.from({ length: ADMIN_LIST_MAX_SIZE + 1 }, (_, index) => conversation(index)),
    );
    mocks.conversationCount.mockResolvedValueOnce(72).mockResolvedValueOnce(18);

    const result = await getConversationListPage({ limit: "999" });

    expect(result.items).toHaveLength(ADMIN_LIST_MAX_SIZE);
    expect(result.stats).toEqual({ totalCount: 72, leadsCount: 18 });
    expect(result.items[4]?.messageCount).toBe(4);
    expect(result.items[0]).not.toHaveProperty("messages");
    expect(result.items[0]).not.toHaveProperty("sessionId");
    expect(mocks.conversationFindMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: ADMIN_LIST_MAX_SIZE + 1,
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
    expect(JSON.stringify(mocks.conversationFindMany.mock.calls)).not.toContain('"messages"');
  });

  it("uses stable forward and backward cursor boundaries without overlapping rows", async () => {
    const boundary = conversation(25);
    const cursor = encodeAdminCursor(boundary);
    mocks.conversationFindMany.mockResolvedValueOnce([conversation(26), conversation(27)]);

    const forward = await getConversationListPage({ after: cursor, limit: "2" });

    expect(forward.items.map((item) => item.id)).toEqual([
      "conversation_026",
      "conversation_027",
    ]);
    expect(forward.pageInfo.hasPreviousPage).toBe(true);
    expect(mocks.conversationFindMany).toHaveBeenNthCalledWith(1, {
      where: {
        OR: [
          { createdAt: { lt: boundary.createdAt } },
          { createdAt: boundary.createdAt, id: { lt: boundary.id } },
        ],
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 3,
      select: expect.any(Object),
    });

    vi.clearAllMocks();
    mocks.requireAdmin.mockResolvedValue(undefined);
    mocks.conversationCount.mockResolvedValue(0);
    mocks.conversationFindMany.mockResolvedValueOnce([conversation(24), conversation(23)]);

    const backward = await getConversationListPage({ before: cursor, limit: "2" });

    expect(backward.items.map((item) => item.id)).toEqual([
      "conversation_023",
      "conversation_024",
    ]);
    expect(backward.pageInfo.hasNextPage).toBe(true);
    expect(mocks.conversationFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { createdAt: { gt: boundary.createdAt } },
            { createdAt: boundary.createdAt, id: { gt: boundary.id } },
          ],
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        take: 3,
      }),
    );
  });

  it("treats malformed cursors as the first page and round-trips valid cursors", async () => {
    const result = await getLeadListPage({ after: "not-a-valid-cursor" });

    expect(result.pageInfo.hasPreviousPage).toBe(false);
    expect(mocks.leadFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { archived: false } }),
    );

    const record = lead(3);
    expect(decodeAdminCursor(encodeAdminCursor(record))).toEqual({
      createdAt: record.createdAt,
      id: record.id,
    });
  });
});

describe("durable conversation message counts", () => {
  it("backfills existing JSON arrays and enforces transcript/count equality", () => {
    const migration = readFileSync(
      resolve(
        root,
        "prisma/migrations/20260722160000_add_conversation_message_count/migration.sql",
      ),
      "utf8",
    );

    expect(migration).toContain('ADD COLUMN "messageCount" INTEGER NOT NULL DEFAULT 0');
    expect(migration).toContain("jsonb_array_length(\"messages\")");
    expect(migration).toContain("Conversation_messageCount_matches_messages_check");
    expect(migration).toContain('ON "Conversation"("createdAt" DESC, "id" DESC)');
  });

  it("keeps full transcript access confined to the conversation detail and chat paths", () => {
    const listQuery = readFileSync(
      resolve(root, "src/app/admin/conversations/queries.ts"),
      "utf8",
    );
    const detailPage = readFileSync(
      resolve(root, "src/app/admin/conversations/[id]/page.tsx"),
      "utf8",
    );

    expect(listQuery).not.toMatch(/\bmessages:\s*true\b/);
    expect(listQuery).toContain("messageCount: true");
    expect(detailPage).toMatch(/\bmessages:\s*true\b/);
  });
});

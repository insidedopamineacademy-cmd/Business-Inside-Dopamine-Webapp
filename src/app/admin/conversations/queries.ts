import "server-only";

import type { Prisma } from "@/generated/prisma/client";

import { requireAdmin } from "@/lib/admin-auth";
import {
  createAdminPage,
  normalizeAdminPageSize,
  resolveAdminCursorDirection,
} from "@/lib/admin-pagination";
import { prisma } from "@/lib/prisma";

export type ConversationListInput = {
  after?: string;
  before?: string;
  limit?: string | number;
};

const CONVERSATION_LIST_SELECT = {
  id: true,
  createdAt: true,
  leadName: true,
  leadEmail: true,
  bookedCall: true,
  messageCount: true,
  lead: { select: { id: true } },
} satisfies Prisma.ConversationSelect;

function conversationCursorWhere(
  cursor: { createdAt: Date; id: string },
  direction: "backward" | "forward",
): Prisma.ConversationWhereInput {
  const comparison = direction === "backward" ? "gt" : "lt";
  return {
    OR: [
      { createdAt: { [comparison]: cursor.createdAt } },
      { createdAt: cursor.createdAt, id: { [comparison]: cursor.id } },
    ],
  };
}

export async function getConversationListPage(input: ConversationListInput = {}) {
  await requireAdmin();

  const pageSize = normalizeAdminPageSize(input.limit);
  const { cursor, direction } = resolveAdminCursorDirection(input);
  const readRows = (
    activeCursor: typeof cursor,
    activeDirection: "backward" | "forward" = direction,
  ) =>
    prisma.conversation.findMany({
      where: activeCursor
        ? conversationCursorWhere(activeCursor, activeDirection)
        : undefined,
      orderBy:
        activeDirection === "backward"
          ? [{ createdAt: "asc" }, { id: "asc" }]
          : [{ createdAt: "desc" }, { id: "desc" }],
      take: pageSize + 1,
      select: CONVERSATION_LIST_SELECT,
    });

  try {
    const [initialRows, totalCount, leadsCount] = await Promise.all([
      readRows(cursor),
      prisma.conversation.count(),
      prisma.conversation.count({ where: { lead: { isNot: null } } }),
    ]);
    const fellBackToFirstPage = cursor !== null && initialRows.length === 0;
    const rows = fellBackToFirstPage
      ? await readRows(null, "forward")
      : initialRows;
    const page = createAdminPage({
      cursor: fellBackToFirstPage ? null : cursor,
      direction: fellBackToFirstPage ? "forward" : direction,
      pageSize,
      rows,
    });

    return {
      ...page,
      items: page.items.map((conversation) => ({
        id: conversation.id,
        createdAt: conversation.createdAt,
        leadName: conversation.leadName,
        leadEmail: conversation.leadEmail,
        bookedCall: conversation.bookedCall,
        leadCaptured: conversation.lead !== null,
        messageCount: conversation.messageCount,
      })),
      stats: { leadsCount, totalCount },
    };
  } catch {
    throw new Error("Failed to fetch conversations.");
  }
}

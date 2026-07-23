import "server-only";

import type { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/admin-auth";
import {
  createAdminPage,
  normalizeAdminPageSize,
  resolveAdminCursorDirection,
} from "@/lib/admin-pagination";
import {
  isLeadStatus,
  leadStatuses,
  type LeadStatus,
} from "@/lib/leads";
import { prisma } from "@/lib/prisma";

export type LeadListInput = {
  after?: string;
  archived?: string;
  before?: string;
  limit?: string | number;
  q?: string;
  status?: string;
};

const LEAD_LIST_SELECT = {
  id: true,
  fullName: true,
  email: true,
  company: true,
  need: true,
  status: true,
  createdAt: true,
  archived: true,
} satisfies Prisma.LeadSelect;

function leadCursorWhere(
  cursor: { createdAt: Date; id: string },
  direction: "backward" | "forward",
): Prisma.LeadWhereInput {
  const comparison = direction === "backward" ? "gt" : "lt";
  return {
    OR: [
      { createdAt: { [comparison]: cursor.createdAt } },
      { createdAt: cursor.createdAt, id: { [comparison]: cursor.id } },
    ],
  };
}

export async function getLeadListPage(input: LeadListInput = {}) {
  await requireAdmin();

  const status = input.status ?? "";
  const q = (input.q ?? "").trim();
  const includeArchived = input.archived === "1";
  const pageSize = normalizeAdminPageSize(input.limit);
  const { cursor, direction } = resolveAdminCursorDirection(input);

  const filters: Prisma.LeadWhereInput = {
    archived: includeArchived ? undefined : false,
  };
  if (isLeadStatus(status)) filters.status = status;
  if (q) {
    filters.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
    ];
  }

  const readRows = (
    activeCursor: typeof cursor,
    activeDirection: "backward" | "forward" = direction,
  ) =>
    prisma.lead.findMany({
      where: activeCursor
        ? { AND: [filters, leadCursorWhere(activeCursor, activeDirection)] }
        : filters,
      orderBy:
        activeDirection === "backward"
          ? [{ createdAt: "asc" }, { id: "asc" }]
          : [{ createdAt: "desc" }, { id: "desc" }],
      take: pageSize + 1,
      select: LEAD_LIST_SELECT,
    });

  try {
    const [initialRows, statusCounts, activeLeadsCount] = await Promise.all([
      readRows(cursor),
      prisma.lead.groupBy({
        by: ["status"],
        where: { archived: false },
        _count: { status: true },
      }),
      prisma.lead.count({ where: { archived: false } }),
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
    const statusCountMap = Object.fromEntries(
      leadStatuses.map((item) => [item, 0]),
    ) as Record<LeadStatus, number>;
    for (const item of statusCounts) statusCountMap[item.status] = item._count.status;

    return {
      ...page,
      filters: {
        includeArchived,
        q,
        status: isLeadStatus(status) ? status : "",
      },
      stats: { activeLeadsCount, statusCountMap },
    };
  } catch {
    throw new Error("Failed to fetch leads.");
  }
}

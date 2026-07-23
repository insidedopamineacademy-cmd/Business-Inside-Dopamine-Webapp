import "server-only";

export const ADMIN_LIST_DEFAULT_SIZE = 25;
export const ADMIN_LIST_MAX_SIZE = 50;

const MAX_CURSOR_LENGTH = 512;
const MAX_CURSOR_ID_LENGTH = 128;

export type AdminListCursor = {
  createdAt: Date;
  id: string;
};

export type AdminPageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: string | null;
  pageSize: number;
  previousCursor: string | null;
};

type CursorRecord = {
  createdAt: Date;
  id: string;
};

export function normalizeAdminPageSize(value: string | number | undefined) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && /^\d+$/.test(value)
        ? Number(value)
        : Number.NaN;

  if (!Number.isSafeInteger(parsed) || parsed < 1) return ADMIN_LIST_DEFAULT_SIZE;
  return Math.min(parsed, ADMIN_LIST_MAX_SIZE);
}

export function encodeAdminCursor(record: CursorRecord) {
  return Buffer.from(
    JSON.stringify({ createdAt: record.createdAt.toISOString(), id: record.id }),
    "utf8",
  ).toString("base64url");
}

export function decodeAdminCursor(value: string | undefined): AdminListCursor | null {
  if (!value || value.length > MAX_CURSOR_LENGTH) return null;

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as {
      createdAt?: unknown;
      id?: unknown;
    };
    if (
      typeof parsed.id !== "string" ||
      parsed.id.length < 1 ||
      parsed.id.length > MAX_CURSOR_ID_LENGTH ||
      typeof parsed.createdAt !== "string"
    ) {
      return null;
    }

    const createdAt = new Date(parsed.createdAt);
    if (
      Number.isNaN(createdAt.valueOf()) ||
      createdAt.toISOString() !== parsed.createdAt
    ) {
      return null;
    }

    return { createdAt, id: parsed.id };
  } catch {
    return null;
  }
}

export function resolveAdminCursorDirection(input: {
  after?: string;
  before?: string;
}) {
  const after = decodeAdminCursor(input.after);
  if (after) return { cursor: after, direction: "forward" as const };

  const before = decodeAdminCursor(input.before);
  if (before) return { cursor: before, direction: "backward" as const };

  return { cursor: null, direction: "forward" as const };
}

export function createAdminPage<T extends CursorRecord>(options: {
  cursor: AdminListCursor | null;
  direction: "backward" | "forward";
  pageSize: number;
  rows: T[];
}) {
  const hasExtraRow = options.rows.length > options.pageSize;
  const selectedRows = options.rows.slice(0, options.pageSize);
  const items =
    options.direction === "backward" ? selectedRows.reverse() : selectedRows;
  const hasPreviousPage =
    options.direction === "backward" ? hasExtraRow : options.cursor !== null;
  const hasNextPage =
    options.direction === "backward" ? options.cursor !== null : hasExtraRow;

  return {
    items,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      nextCursor:
        hasNextPage && items.length > 0
          ? encodeAdminCursor(items[items.length - 1])
          : null,
      pageSize: options.pageSize,
      previousCursor:
        hasPreviousPage && items.length > 0
          ? encodeAdminCursor(items[0])
          : null,
    } satisfies AdminPageInfo,
  };
}

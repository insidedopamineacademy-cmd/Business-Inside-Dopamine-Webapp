import type { Metadata } from "next";
import Link from "next/link";

import { ADMIN_LIST_DEFAULT_SIZE } from "@/lib/admin-pagination";
import { formatDateTime, formatLeadStatus, isLeadStatus, leadStatuses } from "@/lib/leads";
import PaginationNav from "../PaginationNav";
import { getLeadListPage } from "./queries";
import StatusBadge from "./StatusBadge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Leads | Inside Dopamine",
  description: "Review and manage incoming lead submissions.",
  robots: {
    index: false,
    follow: false,
  },
};

type LeadsPageProps = {
  searchParams?: Promise<{
    after?: string;
    status?: string;
    q?: string;
    archived?: string;
    before?: string;
    limit?: string;
  }>;
};

function leadPageHref(
  filters: { includeArchived: boolean; q: string; status: string },
  pageSize: number,
  cursor: { key: "after" | "before"; value: string | null },
) {
  if (!cursor.value) return null;
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.status) params.set("status", filters.status);
  if (filters.includeArchived) params.set("archived", "1");
  if (pageSize !== ADMIN_LIST_DEFAULT_SIZE) params.set("limit", String(pageSize));
  params.set(cursor.key, cursor.value);
  return `/admin/leads?${params.toString()}`;
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const params = (await searchParams) ?? {};
  const { filters, items: leads, pageInfo, stats } = await getLeadListPage(params);
  const { includeArchived, q, status } = filters;
  const { activeLeadsCount, statusCountMap } = stats;
  const hasFilters = Boolean(q) || isLeadStatus(status) || includeArchived;
  const previousHref = leadPageHref(filters, pageInfo.pageSize, {
    key: "before",
    value: pageInfo.previousCursor,
  });
  const nextHref = leadPageHref(filters, pageInfo.pageSize, {
    key: "after",
    value: pageInfo.nextCursor,
  });

  return (
    <section aria-label="Leads inbox">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="type-mono text-[var(--color-muted)]">LEADS</p>
          <h2 className="type-section mt-2 text-3xl text-[var(--color-text)]">Incoming submissions</h2>
          <p className="type-body mt-2">
            Newest first. {leads.length} shown{hasFilters ? " (filtered)" : ""}.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--color-surface-light)]/55 px-4 py-4">
          <p className="type-mono text-[var(--color-muted)]">Total Leads</p>
          <p className="type-section mt-2 text-3xl text-[var(--color-text)]">{activeLeadsCount}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--color-surface-light)]/55 px-4 py-4">
          <p className="type-mono text-[var(--color-muted)]">New</p>
          <p className="type-section mt-2 text-3xl text-[var(--color-text)]">{statusCountMap.NEW}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--color-surface-light)]/55 px-4 py-4">
          <p className="type-mono text-[var(--color-muted)]">Qualified</p>
          <p className="type-section mt-2 text-3xl text-[var(--color-text)]">{statusCountMap.QUALIFIED}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--color-surface-light)]/55 px-4 py-4">
          <p className="type-mono text-[var(--color-muted)]">Booked</p>
          <p className="type-section mt-2 text-3xl text-[var(--color-text)]">{statusCountMap.BOOKED}</p>
        </div>
      </div>

      <form
        method="get"
        className="mt-6 grid gap-3 rounded-2xl border border-[var(--border-light)] bg-white/35 p-4 md:grid-cols-[minmax(0,1fr)_220px_auto_auto] md:items-end md:p-5"
      >
        {pageInfo.pageSize !== ADMIN_LIST_DEFAULT_SIZE ? (
          <input type="hidden" name="limit" value={pageInfo.pageSize} />
        ) : null}
        <div>
          <label htmlFor="q" className="type-mono text-[var(--color-text)]">
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Name, email, or company"
            className="id-input mt-2"
          />
        </div>

        <div>
          <label htmlFor="status" className="type-mono text-[var(--color-text)]">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={isLeadStatus(status) ? status : ""}
            className="id-input mt-2"
          >
            <option value="">All statuses</option>
            {leadStatuses.map((item) => (
              <option key={item} value={item}>
                {formatLeadStatus(item)}
              </option>
            ))}
          </select>
        </div>

        <label className="flex min-h-12 items-center gap-2 rounded-2xl border border-[var(--border-light)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            name="archived"
            value="1"
            defaultChecked={includeArchived}
            className="h-4 w-4"
          />
          Include archived
        </label>

        <button
          type="submit"
          className="type-mono inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border-medium)] px-5 text-[var(--color-text)] transition-opacity duration-200 hover:opacity-75"
        >
          Apply
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border-light)] bg-white/45">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border-light)] bg-[var(--color-surface-light)]">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                Lead
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                Email
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                Need
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className={`border-b border-[var(--border-light)] transition-colors duration-150 hover:bg-[var(--color-surface-light)]/65 last:border-b-0 ${
                    lead.archived ? "bg-[var(--color-surface-light)]/55" : ""
                  }`}
                >
                  <td className="px-4 py-3.5 align-top">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-[var(--color-text)] underline decoration-transparent underline-offset-4 transition-colors duration-150 hover:decoration-[var(--color-text)]"
                    >
                      {lead.fullName}
                    </Link>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {lead.company || "No company provided"}
                    </p>
                    {lead.archived ? (
                      <span className="type-mono mt-2 inline-flex rounded-full border border-[var(--border-light)] bg-[var(--color-surface-light)] px-2 py-1 text-[var(--color-text-secondary)]">
                        Archived
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5 align-top text-sm text-[var(--color-text-secondary)]">{lead.email}</td>
                  <td className="px-4 py-3.5 align-top text-sm text-[var(--color-text-secondary)]">{lead.need}</td>
                  <td className="px-4 py-3.5 align-top">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3.5 align-top text-sm text-[var(--color-text-secondary)]">
                    {formatDateTime(lead.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center">
                  <p className="type-section text-lg text-[var(--color-text)]">No leads found.</p>
                  <p className="type-body mt-2 text-sm text-[var(--color-text-secondary)]">
                    Try clearing filters or search to see recent submissions.
                  </p>
                  {hasFilters ? (
                    <Link
                      href="/admin/leads"
                      className="type-mono mt-4 inline-flex rounded-full border border-[var(--border-medium)] px-4 py-2 text-[var(--color-text)] no-underline transition-opacity duration-200 hover:opacity-75"
                    >
                      Clear filters
                    </Link>
                  ) : null}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {previousHref || nextHref ? (
        <PaginationNav
          label="Lead list pagination"
          previousHref={previousHref}
          nextHref={nextHref}
        />
      ) : null}
    </section>
  );
}

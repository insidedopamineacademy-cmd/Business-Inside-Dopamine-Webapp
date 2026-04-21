import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  formatDateTime,
  formatLeadStatus,
  formatOptionalText,
  leadStatuses,
} from "@/lib/leads";
import { prisma } from "@/lib/prisma";
import StatusBadge from "../StatusBadge";
import { archiveLead, unarchiveLead, updateLead } from "../actions";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Lead Detail | Inside Dopamine Admin",
  description: "Review a lead and update status.",
  robots: {
    index: false,
    follow: false,
  },
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-mono text-[var(--color-muted)]">{label}</p>
      <p className="type-body mt-1 text-[var(--color-text)]">{value}</p>
    </div>
  );
}

export default async function AdminLeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) notFound();

  return (
    <section aria-label="Lead detail">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="type-mono text-[var(--color-muted)]">LEAD DETAIL</p>
          <h2 className="type-section mt-2 text-3xl text-[var(--color-text)]">{lead.fullName}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={lead.status} />
            {lead.archived ? (
              <span className="type-mono inline-flex rounded-full border border-[var(--border-light)] bg-[var(--color-surface-light)] px-2.5 py-1 text-[var(--color-text-secondary)]">
                Archived
              </span>
            ) : null}
          </div>
        </div>

        <Link
          href="/admin/leads"
          className="type-mono rounded-full border border-[var(--border-medium)] px-4 py-2 no-underline text-[var(--color-text)] transition-opacity duration-200 hover:opacity-75"
        >
          Back to leads
        </Link>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border-light)] bg-white/45 p-5 md:p-6">
            <h3 className="type-section text-xl text-[var(--color-text)]">Contact info</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" value={lead.fullName} />
              <Field label="Email" value={lead.email} />
              <Field label="Phone" value={formatOptionalText(lead.phone)} />
              <Field label="Company" value={formatOptionalText(lead.company)} />
              <Field label="Created" value={formatDateTime(lead.createdAt)} />
              <Field label="Updated" value={formatDateTime(lead.updatedAt)} />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-light)] bg-white/45 p-5 md:p-6">
            <h3 className="type-section text-xl text-[var(--color-text)]">Request details</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Need" value={lead.need} />
              <Field label="Source" value={lead.source} />
              <Field label="Preferred date" value={formatOptionalText(lead.preferredDate)} />
              <Field label="Preferred time" value={formatOptionalText(lead.preferredTime)} />
            </div>

            <div className="mt-5">
              <p className="type-mono text-[var(--color-muted)]">Bottleneck</p>
              <p className="type-body mt-1 whitespace-pre-wrap text-[var(--color-text)]">{lead.bottleneck}</p>
            </div>

            <div className="mt-5">
              <p className="type-mono text-[var(--color-muted)]">Additional notes</p>
              <p className="type-body mt-1 whitespace-pre-wrap text-[var(--color-text)]">
                {formatOptionalText(lead.notes)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--color-surface-light)]/55 p-5 md:p-6">
            <h3 className="type-section text-xl text-[var(--color-text)]">Meeting and follow-up</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Meeting booked" value={lead.meetingBooked ? "Yes" : "No"} />
              <Field label="Meeting date" value={formatOptionalText(lead.meetingDate)} />
            </div>
            <div className="mt-5">
              <p className="type-mono text-[var(--color-muted)]">Meeting notes</p>
              <p className="type-body mt-1 whitespace-pre-wrap text-[var(--color-text)]">
                {formatOptionalText(lead.meetingNotes)}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <form action={updateLead} className="rounded-2xl border border-[var(--border-light)] bg-white/55 p-5 md:p-6">
            <input type="hidden" name="id" value={lead.id} />

            <h3 className="type-section text-xl text-[var(--color-text)]">Update lead</h3>
            <p className="type-body mt-2 text-sm text-[var(--color-text-secondary)]">
              Update status and meeting details, then save.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="status" className="type-mono text-[var(--color-text)]">
                  Status
                </label>
                <select id="status" name="status" defaultValue={lead.status} className="id-input mt-2">
                  {leadStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatLeadStatus(status)}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--color-bg)] px-3 py-3 text-sm text-[var(--color-text)]">
                <input
                  type="checkbox"
                  name="meetingBooked"
                  defaultChecked={lead.meetingBooked}
                  className="h-4 w-4"
                />
                Meeting booked
              </label>

              <div>
                <label htmlFor="meetingDate" className="type-mono text-[var(--color-text)]">
                  Meeting date
                </label>
                <input
                  id="meetingDate"
                  name="meetingDate"
                  type="date"
                  defaultValue={lead.meetingDate ?? ""}
                  className="id-input mt-2"
                />
              </div>

              <div>
                <label htmlFor="meetingNotes" className="type-mono text-[var(--color-text)]">
                  Meeting notes
                </label>
                <textarea
                  id="meetingNotes"
                  name="meetingNotes"
                  rows={4}
                  defaultValue={lead.meetingNotes ?? ""}
                  className="id-input mt-2 resize-y"
                />
              </div>

              <button
                type="submit"
                className="type-mono inline-flex w-full items-center justify-center rounded-full border border-[var(--border-medium)] bg-[var(--color-text)] px-5 py-3 text-white transition-opacity duration-200 hover:opacity-85"
              >
                Save updates
              </button>
            </div>
          </form>

          {lead.archived ? (
            <form
              action={unarchiveLead}
              className="rounded-2xl border border-[var(--border-light)] bg-[var(--color-surface-light)]/55 p-5 md:p-6"
            >
              <input type="hidden" name="id" value={lead.id} />
              <h3 className="type-section text-lg text-[var(--color-text)]">Archive state</h3>
              <p className="type-body mt-2 text-[var(--color-text)]">This lead is archived.</p>
              <button
                type="submit"
                className="type-mono mt-4 inline-flex w-full items-center justify-center rounded-full border border-[var(--border-medium)] px-5 py-3 text-[var(--color-text)] transition-opacity duration-200 hover:opacity-75"
              >
                Unarchive lead
              </button>
            </form>
          ) : (
            <form
              action={archiveLead}
              className="rounded-2xl border border-[var(--border-light)] bg-[var(--color-surface-light)]/55 p-5 md:p-6"
            >
              <input type="hidden" name="id" value={lead.id} />
              <h3 className="type-section text-lg text-[var(--color-text)]">Archive state</h3>
              <p className="type-body mt-2 text-[var(--color-text)]">
                Archive this lead when active follow-up is no longer needed.
              </p>
              <button
                type="submit"
                className="type-mono mt-4 inline-flex w-full items-center justify-center rounded-full border border-[var(--border-medium)] px-5 py-3 text-[var(--color-text)] transition-opacity duration-200 hover:opacity-75"
              >
                Archive lead
              </button>
            </form>
          )}
        </aside>
      </div>
    </section>
  );
}

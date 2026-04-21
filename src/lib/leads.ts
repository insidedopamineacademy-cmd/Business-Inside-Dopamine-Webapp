import type { LeadStatus } from "@prisma/client";

export const leadStatuses: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "BOOKED",
  "CLOSED",
];

export function isLeadStatus(value: string): value is LeadStatus {
  return leadStatuses.includes(value as LeadStatus);
}

export function formatLeadStatus(status: LeadStatus) {
  return status.toLowerCase().replace(/(^|_)([a-z])/g, (_, p1, p2) => `${p1 ? " " : ""}${p2.toUpperCase()}`);
}

type LeadStatusTone = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

const leadStatusTones: Record<LeadStatus, LeadStatusTone> = {
  NEW: {
    backgroundColor: "rgba(17, 16, 16, 0.08)",
    borderColor: "rgba(17, 16, 16, 0.18)",
    color: "#2A2929",
  },
  CONTACTED: {
    backgroundColor: "rgba(29, 78, 216, 0.10)",
    borderColor: "rgba(29, 78, 216, 0.24)",
    color: "#1D4ED8",
  },
  QUALIFIED: {
    backgroundColor: "rgba(99, 102, 241, 0.11)",
    borderColor: "rgba(99, 102, 241, 0.24)",
    color: "#4338CA",
  },
  BOOKED: {
    backgroundColor: "rgba(22, 163, 74, 0.11)",
    borderColor: "rgba(22, 163, 74, 0.24)",
    color: "#15803D",
  },
  CLOSED: {
    backgroundColor: "rgba(107, 114, 128, 0.10)",
    borderColor: "rgba(107, 114, 128, 0.20)",
    color: "#4B5563",
  },
};

export function getLeadStatusTone(status: LeadStatus): LeadStatusTone {
  return leadStatusTones[status];
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function formatOptionalText(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "—";
}

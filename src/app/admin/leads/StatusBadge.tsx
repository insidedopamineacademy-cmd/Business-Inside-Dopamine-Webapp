import type { LeadStatus } from "@prisma/client";

import { formatLeadStatus, getLeadStatusTone } from "@/lib/leads";

type StatusBadgeProps = {
  status: LeadStatus;
  className?: string;
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const tone = getLeadStatusTone(status);

  return (
    <span
      className={`type-mono inline-flex items-center rounded-full border px-2.5 py-1 ${className}`.trim()}
      style={tone}
    >
      {formatLeadStatus(status)}
    </span>
  );
}

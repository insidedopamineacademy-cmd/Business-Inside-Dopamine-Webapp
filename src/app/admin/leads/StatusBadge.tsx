import {
  StatusBadge as StatusBadgePrimitive,
  type StatusBadgeVariant,
} from "@/components/ui";
import {
  formatLeadStatus,
  type LeadStatus,
} from "@/lib/leads";

type StatusBadgeProps = {
  status: LeadStatus;
  className?: string;
};

const variants: Record<LeadStatus, StatusBadgeVariant> = {
  NEW: "neutral",
  CONTACTED: "info",
  QUALIFIED: "accent",
  BOOKED: "success",
  CLOSED: "muted",
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <StatusBadgePrimitive
      variant={variants[status]}
      className={`type-mono ${className}`.trim()}
    >
      {formatLeadStatus(status)}
    </StatusBadgePrimitive>
  );
}

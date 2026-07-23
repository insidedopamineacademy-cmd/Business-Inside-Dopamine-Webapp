import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "./utils";

export const statusBadgeVariants = [
  "neutral",
  "info",
  "accent",
  "success",
  "muted",
] as const;

export type StatusBadgeVariant = (typeof statusBadgeVariants)[number];

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: StatusBadgeVariant;
};

const variants: Record<StatusBadgeVariant, string> = {
  neutral:
    "border-[var(--color-status-neutral-border)] bg-[var(--color-status-neutral-background)] text-[var(--color-status-neutral-text)]",
  info:
    "border-[var(--color-status-info-border)] bg-[var(--color-status-info-background)] text-[var(--color-status-info-text)]",
  accent:
    "border-[var(--color-status-accent-border)] bg-[var(--color-status-accent-background)] text-[var(--color-status-accent-text)]",
  success:
    "border-[var(--color-status-success-border)] bg-[var(--color-status-success-background)] text-[var(--color-status-success-text)]",
  muted:
    "border-[var(--color-status-muted-border)] bg-[var(--color-status-muted-background)] text-[var(--color-status-muted-text)]",
};

export default function StatusBadge({
  children,
  variant = "neutral",
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-[var(--radius-full)] border px-2.5 py-1",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

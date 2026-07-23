import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "./utils";

export type BadgeVariant = "default" | "accent" | "success" | "error";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

// ── Base ───────────────────────────────────────────────────────────────────
const base =
  "inline-flex items-center rounded-[var(--radius-full)] px-3 py-1 " +
  "text-xs font-medium uppercase tracking-widest";

// ── Variants ───────────────────────────────────────────────────────────────
const variants: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-surface)]  text-[var(--color-text-primary)]",
  accent:  "bg-[var(--color-accent-light)] text-[var(--color-accent)]",
  success: "bg-[var(--color-success-surface)] text-[var(--color-success)]",
  error:   "bg-[var(--color-error-surface)] text-[var(--color-error)]",
};

export default function Badge({
  children,
  variant = "default",
  className,
  ...rest
}: BadgeProps) {
  return (
    <span className={cx(base, variants[variant], className)} {...rest}>
      {children}
    </span>
  );
}

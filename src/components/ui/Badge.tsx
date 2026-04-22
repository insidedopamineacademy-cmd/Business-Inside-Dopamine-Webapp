import type { HTMLAttributes, ReactNode } from "react";

function cx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

export type BadgeVariant = "default" | "accent" | "success" | "error";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

// ── Base ───────────────────────────────────────────────────────────────────
const base =
  "inline-flex items-center rounded-full px-3 py-1 " +
  "text-xs font-medium uppercase tracking-widest";

// ── Variants ───────────────────────────────────────────────────────────────
const variants: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-surface)]  text-[var(--color-text-primary)]",
  accent:  "bg-[var(--color-accent-light)] text-[var(--color-accent)]",
  success: "bg-[rgba(52,199,89,0.12)]   text-[var(--color-success)]",
  error:   "bg-[rgba(255,59,48,0.12)]   text-[var(--color-error)]",
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

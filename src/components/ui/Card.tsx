import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "./utils";

export type CardVariant = "default" | "surface" | "bordered";
export type CardSize = "default" | "large";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  hoverable?: boolean;
  className?: string;
};

// ── Variants ───────────────────────────────────────────────────────────────
const variants: Record<CardVariant, string> = {
  default:  "bg-[var(--color-surface-raised)] shadow-[var(--shadow-md)] rounded-[var(--radius-lg)]",
  surface:  "bg-[var(--color-surface)] rounded-[var(--radius-lg)]",
  bordered: "bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-lg)]",
};

// ── Sizes ──────────────────────────────────────────────────────────────────
const sizes: Record<CardSize, string> = {
  default: "p-8",
  large:   "p-10",
};

// Applied only when hoverable=true
const hoverStyles =
  "transition-all duration-[var(--transition-duration-base)] ease-[var(--ease-apple)] " +
  "cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]";

export default function Card({
  children,
  variant = "default",
  size = "default",
  hoverable = false,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cx(
        variants[variant],
        sizes[size],
        hoverable && hoverStyles,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

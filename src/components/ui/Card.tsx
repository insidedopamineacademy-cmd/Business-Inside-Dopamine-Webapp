import type { HTMLAttributes, ReactNode } from "react";

function cx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

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
  default:  "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] rounded-2xl",
  surface:  "bg-[var(--color-surface)] rounded-2xl",
  bordered: "bg-white border border-[var(--color-border)] rounded-2xl",
};

// ── Sizes ──────────────────────────────────────────────────────────────────
const sizes: Record<CardSize, string> = {
  default: "p-8",
  large:   "p-10",
};

// Applied only when hoverable=true
const hoverStyles =
  "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] " +
  "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]";

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

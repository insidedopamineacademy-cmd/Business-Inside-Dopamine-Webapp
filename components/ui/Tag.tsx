import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  variant?: "neutral" | "primary";
  className?: string;
};

export default function Tag({ children, variant = "neutral", className = "" }: TagProps) {
  const variantClass =
    variant === "primary"
      ? "border border-[rgba(229,0,122,0.35)] bg-[rgba(229,0,122,0.12)] text-[var(--color-accent)]"
      : "border border-[var(--border-light)] bg-[var(--color-surface-light)] text-[var(--color-text)]";

  return (
    <span
      className={`type-mono inline-flex rounded-full px-3 py-1 ${variantClass} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

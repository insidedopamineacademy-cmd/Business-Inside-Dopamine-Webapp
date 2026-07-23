import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "./utils";

function Spinner() {
  return (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={15}
      height={15}
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        className="opacity-75"
      />
    </svg>
  );
}

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  className?: string;
};

type AsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type AsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    as: "link";
    href: string;
  };

export type ButtonProps = AsButton | AsLink;

// ── Base ───────────────────────────────────────────────────────────────────
const base = [
  "relative inline-flex items-center justify-center gap-2",
  "font-medium rounded-[var(--radius-full)] select-none whitespace-nowrap",
  "transition-all duration-[var(--transition-duration-base)] ease-[var(--ease-apple)]",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-[var(--focus-ring-offset)]",
  "disabled:cursor-not-allowed disabled:pointer-events-none",
].join(" ");

// ── Variants ───────────────────────────────────────────────────────────────
const variants: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--color-accent)] text-white border border-transparent",
    "hover:bg-[var(--color-accent-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-accent-hover)]",
    "disabled:bg-[var(--color-text-tertiary)] disabled:hover:translate-y-0 disabled:hover:shadow-none",
    "active:translate-y-0",
  ].join(" "),

  secondary: [
    "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)]",
    "hover:bg-[var(--color-surface)] hover:-translate-y-px",
    "disabled:bg-[var(--color-surface)] disabled:text-[var(--color-text-secondary)] disabled:hover:translate-y-0",
    "active:translate-y-0",
  ].join(" "),

  ghost: [
    "bg-transparent text-[var(--color-text-primary)] border border-transparent",
    "hover:bg-[var(--color-surface)] hover:-translate-y-px",
    "disabled:bg-[var(--color-surface)] disabled:text-[var(--color-text-secondary)] disabled:hover:translate-y-0",
    "active:translate-y-0",
  ].join(" "),
};

// ── Sizes ──────────────────────────────────────────────────────────────────
const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  ...rest
}: ButtonProps) {
  const classes = cx(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {isLoading && <Spinner />}
      <span>{children}</span>
    </>
  );

  if (rest.as === "link") {
    const { href, as: _as, ...linkProps } = rest as AsLink;
    void _as;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  const { as: _as, disabled, ...buttonProps } = rest as AsButton;
  void _as;

  return (
    <button
      className={classes}
      disabled={isLoading || !!disabled}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

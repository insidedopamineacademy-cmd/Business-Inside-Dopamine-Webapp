import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

function cx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

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
  "font-medium rounded-full select-none whitespace-nowrap",
  "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
].join(" ");

// ── Variants ───────────────────────────────────────────────────────────────
const variants: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--color-accent)] text-white border border-transparent",
    "hover:bg-[var(--color-accent-hover)] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(109,86,250,0.30)]",
    "active:translate-y-0",
  ].join(" "),

  secondary: [
    "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)]",
    "hover:bg-[var(--color-surface)] hover:-translate-y-px",
    "active:translate-y-0",
  ].join(" "),

  ghost: [
    "bg-transparent text-[var(--color-text-primary)] border border-transparent",
    "hover:bg-[var(--color-surface)] hover:-translate-y-px",
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
      <span className={cx(isLoading && "opacity-60")}>{children}</span>
    </>
  );

  if (rest.as === "link") {
    const { href, as: _as, ...linkProps } = rest as AsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  const { as: _as, disabled, ...buttonProps } = rest as AsButton;

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

import type { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

function cx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

// ── Label ──────────────────────────────────────────────────────────────────
export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  className?: string;
};

export function Label({ children, className, ...rest }: LabelProps) {
  return (
    <label
      className={cx(
        "block text-[14px] font-medium text-[var(--color-text-primary)] mb-1.5",
        className,
      )}
      {...rest}
    >
      {children}
    </label>
  );
}

// ── HelperText ─────────────────────────────────────────────────────────────
export type HelperTextProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
  error?: boolean;
  className?: string;
};

export function HelperText({ children, error = false, className, ...rest }: HelperTextProps) {
  return (
    <p
      className={cx(
        "mt-1.5 text-[12px] leading-snug",
        error
          ? "text-[var(--color-error)]"
          : "text-[var(--color-text-secondary)]",
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────
export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  className?: string;
};

const base = [
  "w-full rounded-xl border bg-white px-4 py-3",
  "text-[17px] text-[var(--color-text-primary)]",
  "placeholder:text-[var(--color-text-tertiary)]",
  "outline-none",
  "transition-[border-color,box-shadow] duration-[200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const stateDefault =
  "border-[var(--color-border)] " +
  "focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";

const stateError =
  "border-[var(--color-error)] ring-2 ring-[var(--color-error)]/20 " +
  "focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20";

export default function Input({ error = false, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={error || undefined}
      className={cx(base, error ? stateError : stateDefault, className)}
      {...props}
    />
  );
}

import type { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

import { formControlBase, formControlDefault, formControlError } from "./formControlStyles";
import { cx } from "./utils";

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

export default function Input({ error = false, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={error || undefined}
      className={cx(
        formControlBase,
        error ? formControlError : formControlDefault,
        className,
      )}
      {...props}
    />
  );
}

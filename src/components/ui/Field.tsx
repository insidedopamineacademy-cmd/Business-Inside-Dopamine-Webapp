import type { HTMLAttributes, ReactNode } from "react";

import { HelperText, Label } from "./Input";
import { cx } from "./utils";

export type FieldProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode;
  label: ReactNode;
  htmlFor: string;
  error?: ReactNode;
  hint?: ReactNode;
  messageId?: string;
};

export default function Field({
  children,
  label,
  htmlFor,
  error,
  hint,
  messageId,
  className,
  ...props
}: FieldProps) {
  const message = error ?? hint;

  return (
    <div className={cx(className)} {...props}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {message ? (
        <HelperText
          id={messageId}
          error={Boolean(error)}
          role={error ? "alert" : undefined}
        >
          {message}
        </HelperText>
      ) : null}
    </div>
  );
}

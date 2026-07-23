import type { SelectHTMLAttributes } from "react";

import { formControlBase, formControlDefault, formControlError } from "./formControlStyles";
import { cx } from "./utils";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

export default function Select({ error = false, className, ...props }: SelectProps) {
  return (
    <select
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

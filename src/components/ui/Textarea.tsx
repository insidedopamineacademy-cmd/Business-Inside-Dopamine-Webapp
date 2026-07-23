import type { TextareaHTMLAttributes } from "react";

import { formControlBase, formControlDefault, formControlError } from "./formControlStyles";
import { cx } from "./utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export default function Textarea({ error = false, className, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={error || undefined}
      className={cx(
        formControlBase,
        "resize-y",
        error ? formControlError : formControlDefault,
        className,
      )}
      {...props}
    />
  );
}

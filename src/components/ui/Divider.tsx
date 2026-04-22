import type { ReactNode } from "react";

function cx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

export type DividerProps = {
  label?: ReactNode;
  className?: string;
};

export default function Divider({ label, className }: DividerProps) {
  if (!label) {
    return (
      <hr
        className={cx(
          "w-full border-t border-[var(--color-border)]",
          className,
        )}
      />
    );
  }

  return (
    <div className={cx("flex items-center gap-0", className)}>
      <div className="h-px flex-1 bg-[var(--color-border)]" />
      <span className="bg-white px-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  );
}

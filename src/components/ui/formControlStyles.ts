export const formControlBase = [
  "w-full rounded-[var(--radius-md)] border bg-[var(--color-surface-raised)] px-4 py-3",
  "text-[17px] text-[var(--color-text-primary)]",
  "placeholder:text-[var(--color-text-tertiary)]",
  "outline-none",
  "transition-[border-color,box-shadow] duration-[var(--transition-duration-fast)] ease-[var(--ease-apple)]",
  "disabled:cursor-not-allowed disabled:bg-[var(--color-surface)] disabled:text-[var(--color-text-secondary)]",
  "disabled:placeholder:text-[var(--color-text-secondary)]",
].join(" ");

export const formControlDefault =
  "border-[var(--color-border)] " +
  "focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]/20";

export const formControlError =
  "border-[var(--color-error)] ring-2 ring-[var(--color-error)]/20 " +
  "focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20";


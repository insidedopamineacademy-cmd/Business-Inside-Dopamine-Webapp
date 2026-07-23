import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "./utils";

export const containerVariants = ["narrow", "standard", "wide", "admin"] as const;
export type ContainerVariant = (typeof containerVariants)[number];

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  variant?: ContainerVariant;
};

const variants: Record<ContainerVariant, string> = {
  narrow: "max-w-[var(--container-narrow)] px-5 md:px-8",
  standard: "max-w-[var(--container-standard)] px-5 md:px-8",
  wide: "max-w-[var(--container-wide)] px-6",
  admin: "max-w-[var(--container-admin)] px-5 md:px-8",
};

export default function Container({
  children,
  variant = "standard",
  className,
  ...props
}: ContainerProps) {
  return (
    <div className={cx("mx-auto w-full", variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

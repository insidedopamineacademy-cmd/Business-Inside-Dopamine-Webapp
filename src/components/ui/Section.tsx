import type { HTMLAttributes, ReactNode } from "react";

import Container from "./Container";
import { cx } from "./utils";

export type SectionBackground = "white" | "surface";
export type SectionSize = "sm" | "md" | "lg";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  background?: SectionBackground;
  size?: SectionSize;
  className?: string;
};

const backgrounds: Record<SectionBackground, string> = {
  white:   "bg-[var(--color-background)]",
  surface: "bg-[var(--color-surface)]",
};

const sizes: Record<SectionSize, string> = {
  sm: "py-[var(--spacing-section-sm)]",
  md: "py-[var(--spacing-section-md)]",
  lg: "py-[var(--spacing-section-lg)]",
};

export default function Section({
  children,
  background = "white",
  size = "md",
  className,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cx(backgrounds[background], sizes[size], className)}
      {...rest}
    >
      <Container variant="wide">{children}</Container>
    </section>
  );
}

import type { HTMLAttributes, ReactNode } from "react";

function cx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

export type SectionBackground = "white" | "surface";
export type SectionSize = "sm" | "md" | "lg";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  background?: SectionBackground;
  size?: SectionSize;
  className?: string;
};

const backgrounds: Record<SectionBackground, string> = {
  white:   "bg-white",
  surface: "bg-[var(--color-surface)]",
};

const sizes: Record<SectionSize, string> = {
  sm: "py-16",
  md: "py-24",
  lg: "py-32",
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
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";

type Variant = "primary" | "secondary" | "accent";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonAsButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type ButtonAsLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    as: "link";
    href: string;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<Variant, string> = {
  primary: "border hover:opacity-90",
  secondary: "border hover:opacity-80",
  accent: "border hover:opacity-90",
};

const sharedClasses =
  "type-mono inline-flex items-center justify-center rounded-full px-[22px] py-[14px] no-underline transition-opacity duration-200";

const variantStyles: Record<Variant, CSSProperties> = {
  primary: {
    backgroundColor: "#111010",
    color: "#FFFFFF",
    borderColor: "#111010",
  },
  secondary: {
    backgroundColor: "transparent",
    color: "#111010",
    borderColor: "rgba(0,0,0,0.15)",
  },
  accent: {
    backgroundColor: "var(--color-accent)",
    color: "#FFFFFF",
    borderColor: "var(--color-accent)",
  },
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  const classes = `${sharedClasses} ${variantClasses[variant]} ${className}`.trim();
  const baseStyle = variantStyles[variant];

  if (rest.as === "link") {
    const { href, as: _as, style, ...anchorProps } = rest;
    return (
      <Link href={href} className={classes} style={{ ...baseStyle, ...style }} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { as: _as, style, ...buttonProps } = rest;

  return (
    <button className={classes} style={{ ...baseStyle, ...style }} {...buttonProps}>
      {children}
    </button>
  );
}

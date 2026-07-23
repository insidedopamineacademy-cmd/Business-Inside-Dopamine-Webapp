import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { isValidElement, type ReactElement } from "react";
import { describe, expect, it } from "vitest";

import Badge from "../src/components/ui/Badge";
import Button from "../src/components/ui/Button";
import Card from "../src/components/ui/Card";
import Container, {
  containerVariants,
} from "../src/components/ui/Container";
import Input from "../src/components/ui/Input";
import Select from "../src/components/ui/Select";
import StatusBadge, {
  statusBadgeVariants,
} from "../src/components/ui/StatusBadge";
import Textarea from "../src/components/ui/Textarea";

const root = process.cwd();

function source(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

function className(element: ReactElement) {
  return (element.props as { className?: string }).className ?? "";
}

const css = source("src/styles/globals.css");

describe("authoritative design-system tokens", () => {
  it("defines every semantic token family once in the CSS-first theme", () => {
    const theme = css.slice(css.indexOf("@theme {"), css.indexOf("\n}", css.indexOf("@theme {")));
    const requiredTokens = [
      "--color-background",
      "--color-surface-raised",
      "--color-text-primary",
      "--color-focus",
      "--font-sans",
      "--text-body",
      "--tracking-title",
      "--spacing-space-1",
      "--spacing-section-md",
      "--radius-md",
      "--shadow-md",
      "--transition-duration-base",
      "--ease-apple",
      "--focus-ring-width",
      "--container-narrow",
      "--container-standard",
      "--container-wide",
      "--container-admin",
    ];

    for (const token of requiredTokens) {
      expect(theme.match(new RegExp(`${token}:`, "g")) ?? [], token).toHaveLength(1);
    }

    expect(source("src/app/globals.css").trim()).toBe(
      '@import "../styles/globals.css";',
    );
  });

  it("tracks compatibility aliases and keeps them out of normalized primitives", () => {
    expect(css).toContain("DEPRECATED COMPATIBILITY ALIASES");

    for (const alias of [
      "--color-bg",
      "--color-text",
      "--color-muted",
      "--color-surface-light",
      "--border-light",
      "--border-medium",
      ".type-section",
      ".mono-ui",
      ".section-space",
      ".surface-soft",
      ".id-input",
    ]) {
      expect(css, alias).toContain(alias);
    }

    const primitiveSources = [
      "src/components/ui/Badge.tsx",
      "src/components/ui/Button.tsx",
      "src/components/ui/Card.tsx",
      "src/components/ui/Container.tsx",
      "src/components/ui/Input.tsx",
      "src/components/ui/Select.tsx",
      "src/components/ui/StatusBadge.tsx",
      "src/components/ui/Textarea.tsx",
    ].map(source).join("\n");

    expect(primitiveSources).not.toMatch(/var\(--(?:color-bg|color-text|color-muted|border-light|border-medium)\)/);
    expect(source("src/components/ui/Container.tsx")).not.toContain("id-container");
  });
});

describe("layout and primitive variants", () => {
  it("exposes only the demonstrated container variants", () => {
    expect(containerVariants).toEqual(["narrow", "standard", "wide", "admin"]);
    expect(new Set(containerVariants).size).toBe(containerVariants.length);

    for (const variant of containerVariants) {
      const element = Container({ variant, children: variant });
      expect(isValidElement(element)).toBe(true);
      expect(className(element)).toContain(`var(--container-${variant})`);
    }
  });

  it("keeps primitive variants semantic and contrast-sensitive states explicit", () => {
    expect(statusBadgeVariants).toEqual([
      "neutral",
      "info",
      "accent",
      "success",
      "muted",
    ]);
    expect(new Set(statusBadgeVariants).size).toBe(statusBadgeVariants.length);

    const controls = [
      Input({ error: true, disabled: true }),
      Select({ error: true, disabled: true }),
      Textarea({ error: true, disabled: true }),
    ];

    for (const control of controls) {
      expect(className(control)).toContain("disabled:bg-[var(--color-surface)]");
      expect(className(control)).toContain("border-[var(--color-error)]");
      expect(className(control)).toContain("ring-2");
      expect(className(control)).toContain("focus:ring-[var(--color-error)]/20");
    }

    for (const element of [
      Button({ children: "Save", disabled: true }),
      Card({ children: "Card", hoverable: true }),
      Badge({ children: "Active", variant: "success" }),
      StatusBadge({ children: "Booked", variant: "success" }),
    ]) {
      expect(isValidElement(element)).toBe(true);
      expect(className(element)).toContain("var(--");
    }
  });
});

describe("representative public and admin migrations", () => {
  it("uses shared fields and controls on the public contact surface", () => {
    const contact = source("src/features/contact/components/ContactForm.tsx");

    expect(contact).toContain("<Field");
    expect(contact).toContain("<Select");
    expect(contact).toContain("<Textarea");
    expect(contact).not.toContain("<select");
    expect(contact).not.toContain("<textarea");
    expect(contact).not.toContain('className="id-input ');
  });

  it("uses the admin container, controls, and status composition", () => {
    const layout = source("src/app/admin/layout.tsx");
    const faqs = source("src/app/admin/faqs/FAQEditor.tsx");
    const status = source("src/app/admin/leads/StatusBadge.tsx");

    expect(layout.match(/<Container\s+variant="admin"/g)).toHaveLength(2);
    expect(layout).toContain("<main>");
    expect(layout).not.toContain("max-w-[1100px]");
    expect(faqs).toContain("<Field");
    expect(faqs).toContain("<Select");
    expect(faqs).toContain("<Textarea");
    expect(faqs).not.toContain("<select");
    expect(faqs).not.toContain("<textarea");
    expect(status).toContain("StatusBadgePrimitive");
    expect(status).not.toContain("style={tone}");
  });
});

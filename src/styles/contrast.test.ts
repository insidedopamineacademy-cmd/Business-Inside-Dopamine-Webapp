import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { getLeadStatusTone } from "../lib/leads";

type Rgb = [number, number, number];

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");
const buttonSource = readFileSync(new URL("../components/ui/Button.tsx", import.meta.url), "utf8");
const inputSource = readFileSync(new URL("../components/ui/Input.tsx", import.meta.url), "utf8");
const chatSource = readFileSync(new URL("../components/ui/ChatWidget.tsx", import.meta.url), "utf8");
const leadListSource = readFileSync(new URL("../app/admin/leads/page.tsx", import.meta.url), "utf8");

function token(name: string): string {
  const values = Array.from(
    css.matchAll(
      new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})\\s*;`, "g"),
    ),
    (match) => match[1].toUpperCase(),
  );

  expect(values.length, `missing --color-${name}`).toBeGreaterThan(0);
  expect(
    new Set(values).size,
    `conflicting --color-${name} declarations`,
  ).toBe(1);

  return values[0];
}

function hexToRgb(value: string): Rgb {
  return [1, 3, 5].map((offset) =>
    Number.parseInt(value.slice(offset, offset + 2), 16),
  ) as Rgb;
}

function relativeLuminance([red, green, blue]: Rgb): number {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(hexToRgb(foreground));
  const backgroundLuminance = relativeLuminance(hexToRgb(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function compositeOverWhite(value: string): string {
  const match = value.match(
    /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0?\.\d+|1(?:\.0+)?)\s*\)$/,
  );
  expect(match, `unsupported rgba color: ${value}`).not.toBeNull();

  const [, red, green, blue, alpha] = match!;
  const opacity = Number(alpha);
  const channels = [red, green, blue].map((channel) =>
    Math.round(Number(channel) * opacity + 255 * (1 - opacity)),
  );

  return `#${channels
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

const auditedPairs = [
  {
    label: "secondary text on white",
    before: "#86868B",
    afterToken: "text-secondary",
    background: "#FFFFFF",
    beforeRatio: 3.62,
  },
  {
    label: "secondary text on surface",
    before: "#86868B",
    afterToken: "text-secondary",
    background: "#F5F5F7",
    beforeRatio: 3.33,
  },
  {
    label: "tertiary text on white",
    before: "#ABABAB",
    afterToken: "text-tertiary",
    background: "#FFFFFF",
    beforeRatio: 2.3,
  },
  {
    label: "tertiary text on surface",
    before: "#ABABAB",
    afterToken: "text-tertiary",
    background: "#F5F5F7",
    beforeRatio: 2.11,
  },
  {
    label: "accent text on accent-light",
    before: "#6D56FA",
    afterToken: "accent",
    background: "#F0EEFF",
    beforeRatio: 4.21,
  },
  {
    label: "success text on success tint",
    before: "#34C759",
    afterToken: "success",
    background: "#E7F8EB",
    beforeRatio: 2.01,
  },
  {
    label: "error text on error tint",
    before: "#FF3B30",
    afterToken: "error",
    background: "#FFE7E6",
    beforeRatio: 3.01,
  },
] as const;

describe("semantic color contrast", () => {
  it.each(auditedPairs)(
    "$label improves from the audited ratio and meets WCAG AA",
    ({ before, afterToken, background, beforeRatio }) => {
      expect(contrastRatio(before, background)).toBeCloseTo(beforeRatio, 2);
      expect(contrastRatio(token(afterToken), background)).toBeGreaterThanOrEqual(
        4.5,
      );
    },
  );

  it("keeps the legacy muted alias aligned with tertiary text", () => {
    expect(token("muted")).toBe(token("text-tertiary"));
  });

  it("keeps white button text readable on the accent token", () => {
    expect(contrastRatio(token("white"), token("accent"))).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it("replaces composited disabled opacity with explicit AA colors", () => {
    // The former group opacity produced approximately 2.27:1 for white text
    // over the composited primary button. Explicit disabled colors remain AA.
    expect(buttonSource).not.toContain("disabled:opacity-");
    expect(inputSource).not.toContain("disabled:opacity-");
    expect(chatSource).not.toContain("disabled:opacity-");
    expect(chatSource).not.toContain('text-[11px] opacity-75');
    expect(leadListSource).not.toContain('lead.archived ? "opacity-');
    expect(contrastRatio(token("white"), token("text-tertiary"))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(token("text-secondary"), token("surface"))).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the BOOKED admin status readable on its tinted background", () => {
    const tone = getLeadStatusTone("BOOKED");
    const background = compositeOverWhite(tone.backgroundColor);

    expect(contrastRatio("#15803D", background)).toBeCloseTo(4.44, 2);
    expect(contrastRatio(tone.color, background)).toBeGreaterThanOrEqual(4.5);
  });
});

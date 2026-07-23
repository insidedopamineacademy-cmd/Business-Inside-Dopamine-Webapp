import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { portfolioNavigationItems } from "../src/data/portfolio";

const root = process.cwd();

function source(path: string) {
  return readFileSync(join(root, path), "utf8");
}

describe("public navigation and page-transition characterization", () => {
  it("keeps the root layout document-only with shared metadata inheritance", () => {
    const layout = source("src/app/layout.tsx");

    expect(layout.match(/<main\b/g) ?? []).toHaveLength(0);
    expect(layout).toContain('<html lang="en"');
    expect(layout).toContain("<body>{children}</body>");
    expect(layout).toContain("export const metadata: Metadata");
    expect(layout).toContain("metadataBase: new URL(siteUrl)");
    for (const publicOwner of [
      "Navbar",
      "Footer",
      "PageTransition",
      "ScrollToTopButton",
      "ChatWidget",
    ]) {
      expect(layout).not.toContain(publicOwner);
    }
  });

  it("gives the public and admin shells one main landmark each without crossing chrome", () => {
    const publicLayout = source("src/app/(public)/layout.tsx");
    const adminLayout = source("src/app/admin/layout.tsx");

    expect(publicLayout.match(/<main\b/g) ?? []).toHaveLength(1);
    expect(adminLayout.match(/<main\b/g) ?? []).toHaveLength(1);

    for (const publicOwner of [
      "Navbar",
      "Footer",
      "PageTransition",
      "ScrollToTopButton",
      "ChatWidget",
    ]) {
      expect(publicLayout).toContain(publicOwner);
      expect(adminLayout).not.toContain(publicOwner);
    }

    expect(publicLayout).not.toContain("requireAdmin");
    expect(adminLayout).toContain("requireAdmin");
  });

  it("keeps the existing pathname transition and reduced-motion behavior", () => {
    const transition = source("src/components/layout/PageTransition.tsx");

    expect(transition).toContain("usePathname()");
    expect(transition).toContain('initial={false} mode="popLayout"');
    expect(transition).toContain("key={pathname}");
    expect(transition).toContain("useReducedMotion()");
    expect(transition).toContain('data-page-transition=""');
  });

  it.each(["/", "/services", "/work", "/process", "/contact"])(
    "has a page for representative route %s",
    (route) => {
      const page =
        route === "/"
          ? "src/app/(public)/page.tsx"
          : `src/app/(public)${route}/page.tsx`;
      expect(source(page).length).toBeGreaterThan(0);
    },
  );

  it("keeps the not-found boundary inside the public shell", () => {
    expect(source("src/app/(public)/not-found.tsx").length).toBeGreaterThan(0);
    expect(source("src/app/not-found.tsx")).toContain("<PublicLayout>");
    expect(source("src/app/admin/not-found.tsx").length).toBeGreaterThan(0);
    expect(source("src/app/admin/[...not-found]/page.tsx")).toContain("notFound()");
  });

  it("uses Next links for representative primary navigation", () => {
    const navbar = source("src/components/layout/Navbar.tsx");

    expect(portfolioNavigationItems).toEqual([
      { href: "/services", label: "Solutions" },
      { href: "/work", label: "Work" },
    ]);
    expect(navbar).toContain("...portfolioNavigationItems");
    expect(navbar).toContain('href: "/process"');
    expect(navbar).toContain('href="/contact"');
    expect(navbar).toContain("import Link from \"next/link\"");
  });
});

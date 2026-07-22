import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

function source(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function tsxFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory()
      ? tsxFiles(path)
      : path.endsWith(".tsx")
        ? [path]
        : [];
  });
}

describe("public navigation and page-transition characterization", () => {
  it("keeps one application main landmark", () => {
    const files = tsxFiles(join(root, "src"));
    const openingMains = files.flatMap((path) =>
      [...readFileSync(path, "utf8").matchAll(/<main\b/g)].map(() => path),
    );

    expect(openingMains).toEqual([join(root, "src/app/layout.tsx")]);
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
      const page = route === "/" ? "src/app/page.tsx" : `src/app${route}/page.tsx`;
      expect(source(page).length).toBeGreaterThan(0);
    },
  );

  it("uses Next links for representative primary navigation", () => {
    const navbar = source("src/components/layout/Navbar.tsx");

    for (const href of ["/services", "/work", "/process"]) {
      expect(navbar).toContain(`href: "${href}"`);
    }
    expect(navbar).toContain('href="/contact"');
    expect(navbar).toContain("import Link from \"next/link\"");
  });
});

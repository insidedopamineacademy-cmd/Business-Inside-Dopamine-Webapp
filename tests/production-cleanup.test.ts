import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import prismaConfig from "../prisma.config";
import {
  findSyntheticSecretExposure,
  SYNTHETIC_SECRET_SENTINEL,
} from "../scripts/client-bundle-secret-scan.mjs";

const root = process.cwd();
const temporaryDirectories: string[] = [];

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("Prisma CLI configuration", () => {
  it("uses the supported config API without changing schema, migrations, or seed ownership", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(root, "package.json"), "utf8"),
    ) as Record<string, unknown>;

    expect(packageJson).not.toHaveProperty("prisma");
    expect(prismaConfig.schema).toBe("prisma/schema.prisma");
    expect(prismaConfig.migrations).toEqual({
      path: "prisma/migrations",
      seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    });
  });
});

describe("App Router runtime configuration", () => {
  it("does not opt pages or routes into Edge runtime", () => {
    const appFiles = sourceFiles(resolve(root, "src/app"));
    const edgeRuntimeDeclarations = appFiles.flatMap((file) => {
      const source = readFileSync(file, "utf8");
      return /runtime\s*(?:=|:)\s*["'](?:edge|experimental-edge)["']/.test(source)
        ? [relative(root, file)]
        : [];
    });

    expect(edgeRuntimeDeclarations).toEqual([]);
  });
});

describe("public environment declarations", () => {
  it("allows only the non-sensitive canonical site origin to use NEXT_PUBLIC_", () => {
    const sources = [
      resolve(root, ".env.example"),
      resolve(root, "next.config.ts"),
      resolve(root, "prisma.config.ts"),
      ...sourceFiles(resolve(root, "src")),
    ].map((file) => readFileSync(file, "utf8")).join("\n");

    const publicNames = new Set(
      [...sources.matchAll(/\bNEXT_PUBLIC_[A-Z0-9_]+\b/g)].map(
        (match) => match[0],
      ),
    );

    expect([...publicNames].sort()).toEqual(["NEXT_PUBLIC_SITE_URL"]);
    expect([...publicNames]).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /(?:KEY|TOKEN|SECRET|PASSWORD|DATABASE_URL|DIRECT_URL|WEBHOOK|ADMIN|AUTH)/,
        ),
      ]),
    );
  });
});

describe("synthetic client-bundle secret regression", () => {
  it("detects the test-only marker in browser artifacts without inspecting real credentials", () => {
    const fixture = mkdtempSync(join(tmpdir(), "inside-dopamine-secret-scan-"));
    temporaryDirectories.push(fixture);
    const chunks = join(fixture, ".next/static/chunks");
    mkdirSync(chunks, { recursive: true });
    writeFileSync(join(chunks, "safe.js"), "window.__safe = true;");

    expect(findSyntheticSecretExposure(fixture)).toEqual([]);

    writeFileSync(
      join(chunks, "leak.js"),
      `window.__unsafe = "${SYNTHETIC_SECRET_SENTINEL}";`,
    );
    expect(findSyntheticSecretExposure(fixture)).toEqual([
      join(".next", "static", "chunks", "leak.js"),
    ]);
  });
});

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
  it("uses the Prisma 7 config, generator, and PostgreSQL adapter contract", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(root, "package.json"), "utf8"),
    ) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      engines: Record<string, string>;
      prisma?: unknown;
    };
    const config = readFileSync(resolve(root, "prisma.config.ts"), "utf8");
    const schema = readFileSync(resolve(root, "prisma/schema.prisma"), "utf8");
    const runtime = readFileSync(resolve(root, "src/lib/prisma.ts"), "utf8");
    const seed = readFileSync(resolve(root, "prisma/seed.ts"), "utf8");

    expect(packageJson).not.toHaveProperty("prisma");
    expect(packageJson.engines.node).toBe(">=20.19.0");
    expect(packageJson.dependencies).toMatchObject({
      "@prisma/adapter-pg": "7.9.0",
      "@prisma/client": "7.9.0",
      pg: "8.22.0",
    });
    expect(packageJson.devDependencies.prisma).toBe("7.9.0");
    expect(config).toContain('schema: "prisma/schema.prisma"');
    expect(config).toContain('path: "prisma/migrations"');
    expect(config).toContain(
      'seed: \'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts\'',
    );
    expect(config).toContain('url: env("DIRECT_URL")');
    expect(schema).toMatch(/provider\s*=\s*"prisma-client"/);
    expect(schema).toMatch(/output\s*=\s*"\.\.\/src\/generated\/prisma"/);
    expect(schema).toMatch(/moduleFormat\s*=\s*"cjs"/);
    expect(schema.match(/\bdirectUrl\s*=/g) ?? []).toHaveLength(0);
    expect(schema.match(/\burl\s*=/g) ?? []).toHaveLength(0);
    expect(runtime).toContain('from "@prisma/adapter-pg"');
    expect(runtime).toContain('from "@/generated/prisma/client"');
    expect(runtime).toContain("let prismaClient = global.__prisma");
    expect(runtime).toContain("if (prismaClient) return prismaClient");
    expect(runtime).toContain("new Proxy");
    expect(seed).toContain('from "@prisma/adapter-pg"');
    expect(seed).toContain('from "../src/generated/prisma/client"');
  });

  it("pins the stable Next.js and React companion versions exactly", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(root, "package.json"), "utf8"),
    ) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };

    expect(packageJson.dependencies).toMatchObject({
      next: "16.2.11",
      react: "19.2.8",
      "react-dom": "19.2.8",
    });
    expect(packageJson.devDependencies).toMatchObject({
      "@types/react": "19.2.17",
      "@types/react-dom": "19.2.3",
      "eslint-config-next": "16.2.11",
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

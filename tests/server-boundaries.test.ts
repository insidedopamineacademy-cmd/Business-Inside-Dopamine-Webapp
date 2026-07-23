import {
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import {
  dirname,
  extname,
  join,
  relative,
  resolve,
} from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const srcRoot = resolve(root, "src");

type LocalDependency = {
  file: string | null;
  specifier: string;
  typeOnly: boolean;
};

function sourceFiles(directory = srcRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.[cm]?[jt]sx?$/.test(entry.name) && !entry.name.endsWith(".d.ts")
      ? [path]
      : [];
  });
}

const files = sourceFiles();
const sourceCache = new Map<string, ts.SourceFile>();

function parsed(file: string) {
  const cached = sourceCache.get(file);
  if (cached) return cached;

  const value = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    extname(file).endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  sourceCache.set(file, value);
  return value;
}

function hasDirective(file: string, directive: "use client" | "use server") {
  return parsed(file).statements.some(
    (statement) =>
      ts.isExpressionStatement(statement) &&
      ts.isStringLiteral(statement.expression) &&
      statement.expression.text === directive,
  );
}

function resolveLocalImport(from: string, specifier: string) {
  const base = specifier.startsWith("@/")
    ? resolve(srcRoot, specifier.slice(2))
    : specifier.startsWith(".")
      ? resolve(dirname(from), specifier)
      : null;
  if (!base) return null;

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.mts`,
    `${base}.cts`,
    join(base, "index.ts"),
    join(base, "index.tsx"),
  ];
  return candidates.find((candidate) => {
    try {
      return statSync(candidate).isFile();
    } catch {
      return false;
    }
  }) ?? null;
}

function importIsTypeOnly(node: ts.ImportDeclaration) {
  const clause = node.importClause;
  if (!clause) return false;
  if (clause.isTypeOnly) return true;
  if (clause.name || !clause.namedBindings) return false;
  return (
    ts.isNamedImports(clause.namedBindings) &&
    clause.namedBindings.elements.length > 0 &&
    clause.namedBindings.elements.every((element) => element.isTypeOnly)
  );
}

function dependencies(file: string): LocalDependency[] {
  return parsed(file).statements.flatMap((statement) => {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      const specifier = statement.moduleSpecifier.text;
      return [{
        file: resolveLocalImport(file, specifier),
        specifier,
        typeOnly: importIsTypeOnly(statement),
      }];
    }
    if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      const specifier = statement.moduleSpecifier.text;
      return [{
        file: resolveLocalImport(file, specifier),
        specifier,
        typeOnly: statement.isTypeOnly,
      }];
    }
    return [];
  });
}

function importsServerOnly(file: string) {
  return dependencies(file).some(
    (dependency) => dependency.specifier === "server-only",
  );
}

function isProtectedServerModule(file: string) {
  const normalized = file.replaceAll("\\", "/");
  return (
    importsServerOnly(file) ||
    hasDirective(file, "use server") ||
    normalized.includes("/src/generated/prisma/") ||
    normalized.includes("/src/features/chat/server/") ||
    normalized.includes("/server/")
  );
}

function display(file: string) {
  return relative(root, file);
}

function directLocalDependencies(file: string, includeTypes = true) {
  return dependencies(file)
    .filter((dependency) => includeTypes || !dependency.typeOnly)
    .flatMap((dependency) => dependency.file ? [dependency.file] : []);
}

describe("server/client module boundaries", () => {
  it("does not allow client modules to import or reach server implementations", () => {
    const clientEntries = files.filter((file) => hasDirective(file, "use client"));
    const violations: string[] = [];

    for (const entry of clientEntries) {
      for (const dependency of dependencies(entry)) {
        if (
          dependency.file &&
          (
            isProtectedServerModule(dependency.file) ||
            /(?:^|\/)(?:actions|queries)\.[cm]?[jt]sx?$/.test(
              dependency.file.replaceAll("\\", "/"),
            )
          )
        ) {
          violations.push(
            `${display(entry)} directly imports ${display(dependency.file)}`,
          );
        }
      }

      const queue: Array<{ file: string; chain: string[] }> = [{
        file: entry,
        chain: [entry],
      }];
      const visited = new Set<string>();

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current.file)) continue;
        visited.add(current.file);

        for (const dependency of dependencies(current.file).filter(
          (item) => !item.typeOnly,
        )) {
          if (
            dependency.specifier.startsWith("@prisma/client") ||
            dependency.specifier.startsWith("@prisma/adapter-") ||
            dependency.specifier === "pg" ||
            dependency.specifier.startsWith("@anthropic-ai/") ||
            dependency.specifier.startsWith("node:") ||
            dependency.specifier === "next/headers" ||
            dependency.specifier === "next/server"
          ) {
            violations.push(
              `${current.chain.map(display).join(" -> ")} -> ${dependency.specifier}`,
            );
          }
          if (!dependency.file) continue;
          if (isProtectedServerModule(dependency.file)) {
            violations.push(
              `${current.chain.map(display).join(" -> ")} -> ${display(dependency.file)}`,
            );
            continue;
          }
          queue.push({
            file: dependency.file,
            chain: [...current.chain, dependency.file],
          });
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("keeps feature and shared dependency direction out of the route layer", () => {
    const sharedRoots = ["features", "lib", "components", "data"].map((segment) =>
      resolve(srcRoot, segment)
    );
    const violations = files.flatMap((file) => {
      if (!sharedRoots.some((directory) => file.startsWith(`${directory}/`))) {
        return [];
      }
      return directLocalDependencies(file)
        .filter((dependency) => dependency.startsWith(resolve(srcRoot, "app")))
        .map((dependency) => `${display(file)} imports ${display(dependency)}`);
    });

    expect(violations).toEqual([]);
  });

  it("does not expose server implementations through client-facing barrels", () => {
    const barrels = files.filter(
      (file) =>
        /^index\.[cm]?[jt]sx?$/.test(file.split(/[\\/]/).at(-1) ?? "") &&
        !file.includes(`${join("src", "lib", "server")}`),
    );
    const violations = barrels.flatMap((file) =>
      directLocalDependencies(file)
        .filter(isProtectedServerModule)
        .map((dependency) => `${display(file)} exports ${display(dependency)}`)
    );

    expect(violations).toEqual([]);
  });

  it("requires explicit protection on reusable server implementations", () => {
    const required = files.filter((file) => {
      const normalized = file.replaceAll("\\", "/");
      return (
        normalized.includes("/features/") && normalized.includes("/server/") ||
        normalized.endsWith("/actions.ts") ||
        normalized.endsWith("/route-helpers.ts") ||
        [
          "src/lib/admin-auth-core.ts",
          "src/lib/admin-auth.ts",
          "src/lib/admin-pagination.ts",
          "src/lib/ai.ts",
          "src/lib/env.ts",
          "src/lib/lead-service.ts",
          "src/lib/prisma.ts",
          "src/lib/public-api.ts",
          "src/lib/rate-limit.ts",
          "src/lib/server/public-api-core.ts",
          "src/lib/visitor.ts",
        ].some((suffix) => normalized.endsWith(suffix))
      );
    });
    const violations = required
      .filter(
        (file) => !importsServerOnly(file) && !hasDirective(file, "use server"),
      )
      .map(display);

    expect(violations).toEqual([]);
  });

  it("keeps private configuration and provider SDKs behind server-only modules", () => {
    const environment = resolve(srcRoot, "lib/env.ts");
    const provider = resolve(srcRoot, "lib/ai.ts");
    const providerImports = files.filter((file) =>
      dependencies(file).some(
        (dependency) =>
          dependency.specifier.startsWith("@anthropic-ai/") ||
          dependency.specifier.startsWith("@upstash/") ||
          dependency.specifier.startsWith("@prisma/client") ||
          dependency.specifier.startsWith("@prisma/adapter-") ||
          dependency.specifier === "pg",
      ),
    );

    expect(importsServerOnly(environment)).toBe(true);
    expect(importsServerOnly(provider)).toBe(true);
    expect(
      dependencies(provider).map((dependency) => dependency.specifier),
    ).toContain("@anthropic-ai/sdk");
    expect(providerImports.filter((file) => !isProtectedServerModule(file))).toEqual([]);
  });

  it("keeps browser contracts independent from server and framework internals", async () => {
    const clientSafeContracts = [
      resolve(srcRoot, "data/portfolio.ts"),
      resolve(srcRoot, "features/contact/contract.ts"),
      resolve(srcRoot, "lib/chat-client-contract.ts"),
      resolve(srcRoot, "lib/leads.ts"),
      resolve(srcRoot, "app/admin/faqs/contract.ts"),
    ];

    for (const file of clientSafeContracts) {
      expect(importsServerOnly(file), display(file)).toBe(false);
      expect(hasDirective(file, "use server"), display(file)).toBe(false);
      expect(
        dependencies(file).filter((dependency) =>
          dependency.specifier === "@prisma/client" ||
          dependency.specifier.startsWith("@anthropic-ai/") ||
          dependency.specifier.startsWith("node:") ||
          dependency.specifier === "next/headers" ||
          dependency.specifier === "next/server" ||
          (dependency.file !== null && isProtectedServerModule(dependency.file))
        ),
        display(file),
      ).toEqual([]);
    }

    await expect(
      Promise.all([
        import("../src/data/portfolio"),
        import("../src/features/contact/contract"),
        import("../src/lib/chat-client-contract"),
        import("../src/lib/leads"),
        import("../src/app/admin/faqs/contract"),
      ]),
    ).resolves.toHaveLength(5);
  });

  it("preserves chat and contact dependency direction", () => {
    const chatRoute = resolve(srcRoot, "app/api/chat/route.ts");
    const chatService = resolve(srcRoot, "features/chat/server/chat-service.ts");
    const contactForm = resolve(
      srcRoot,
      "features/contact/components/ContactForm.tsx",
    );
    const contactComposition = resolve(
      srcRoot,
      "features/contact/components/ContactInquiry.tsx",
    );
    const contactAction = resolve(
      srcRoot,
      "features/contact/server/action.ts",
    );

    expect(directLocalDependencies(chatRoute)).toContain(chatService);
    expect(
      directLocalDependencies(chatService).some((dependency) =>
        dependency.startsWith(resolve(srcRoot, "app"))
      ),
    ).toBe(false);
    expect(directLocalDependencies(contactForm)).not.toContain(contactAction);
    expect(directLocalDependencies(contactComposition)).toContain(contactAction);
  });

  it("keeps HTTP response construction out of domain and infrastructure modules", () => {
    const core = resolve(srcRoot, "lib/server/public-api-core.ts");
    const transport = resolve(srcRoot, "lib/public-api.ts");
    const leadService = resolve(srcRoot, "lib/lead-service.ts");
    const rateLimit = resolve(srcRoot, "lib/rate-limit.ts");

    expect(
      dependencies(core).map((dependency) => dependency.specifier),
    ).not.toContain("next/server");
    expect(
      dependencies(transport).map((dependency) => dependency.specifier),
    ).toContain("next/server");
    expect(directLocalDependencies(leadService)).toContain(core);
    expect(directLocalDependencies(leadService)).not.toContain(transport);
    expect(directLocalDependencies(rateLimit)).toContain(core);
    expect(directLocalDependencies(rateLimit)).not.toContain(transport);
  });
});

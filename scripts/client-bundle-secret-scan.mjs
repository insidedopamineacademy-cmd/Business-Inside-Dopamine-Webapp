import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const SYNTHETIC_SECRET_SENTINEL =
  "SECRET_SENTINEL_DO_NOT_EXPOSE_12345";

const MAX_TEXT_FILE_BYTES = 10 * 1_024 * 1_024;
const BROWSER_EXTENSIONS = new Set([
  ".body",
  ".html",
  ".js",
  ".json",
  ".map",
  ".rsc",
  ".txt",
]);

function isBrowserFacingBuildArtifact(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");

  if (normalized.startsWith(".next/static/")) return true;
  if (normalized.startsWith("public/")) return true;
  if (normalized.endsWith(".map")) return true;
  if (
    normalized.startsWith(".next/server/app/") &&
    (
      normalized.endsWith(".html") ||
      normalized.endsWith(".rsc") ||
      normalized.endsWith(".body") ||
      normalized.endsWith(".txt") ||
      normalized.endsWith("client-reference-manifest.js")
    )
  ) {
    return true;
  }
  return (
    normalized.startsWith(".next/") &&
    normalized.includes("manifest") &&
    BROWSER_EXTENSIONS.has(extname(normalized))
  );
}

function walk(directory, root, files) {
  if (!existsSync(directory)) return;

  for (const entry of readdirSync(directory)) {
    const absolutePath = join(directory, entry);
    const metadata = lstatSync(absolutePath);
    if (metadata.isSymbolicLink()) continue;
    if (metadata.isDirectory()) {
      walk(absolutePath, root, files);
      continue;
    }
    if (
      metadata.isFile() &&
      metadata.size <= MAX_TEXT_FILE_BYTES &&
      isBrowserFacingBuildArtifact(relative(root, absolutePath))
    ) {
      files.push(absolutePath);
    }
  }
}

export function browserFacingBuildArtifacts(root = process.cwd()) {
  const absoluteRoot = resolve(root);
  const files = [];
  walk(join(absoluteRoot, ".next"), absoluteRoot, files);
  walk(join(absoluteRoot, "public"), absoluteRoot, files);
  return files;
}

export function findSyntheticSecretExposure(root = process.cwd()) {
  const absoluteRoot = resolve(root);
  return browserFacingBuildArtifacts(absoluteRoot).flatMap((file) => {
    const buffer = readFileSync(file);
    if (buffer.includes(0)) return [];
    return buffer.toString("utf8").includes(SYNTHETIC_SECRET_SENTINEL)
      ? [relative(absoluteRoot, file)]
      : [];
  });
}

function isMainModule() {
  return (
    typeof process.argv[1] === "string" &&
    import.meta.url === pathToFileURL(resolve(process.argv[1])).href
  );
}

if (isMainModule()) {
  const findings = findSyntheticSecretExposure();
  if (findings.length > 0) {
    console.error(
      `Client secret scan found the synthetic marker in ${findings.length} browser-facing artifact(s).`,
    );
    for (const file of findings) console.error(file);
    process.exitCode = 1;
  } else {
    console.log(
      "Client secret scan passed: the synthetic marker is absent from browser-facing build artifacts.",
    );
  }
}

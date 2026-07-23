import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  readFileSync,
} from "node:fs";
import { join, relative } from "node:path";

import { browserFacingBuildArtifacts } from "./client-bundle-secret-scan.mjs";

const ROOT = process.cwd();
const MAX_FILE_BYTES = 5 * 1_024 * 1_024;
const MAX_COMMAND_BYTES = 64 * 1_024 * 1_024;

const rules = [
  {
    name: "private key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    name: "Anthropic API key",
    pattern: /\bsk-ant-(?:api\d{2}-)?[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    name: "OpenAI API key",
    pattern: /\bsk-(?!ant-)(?:proj-)?[A-Za-z0-9_-]{32,}\b/g,
  },
  {
    name: "AWS access key",
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g,
  },
  {
    name: "GitHub token",
    pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  },
  {
    name: "Slack token",
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g,
  },
  {
    name: "Google API key",
    pattern: /\bAIza[A-Za-z0-9_-]{30,}\b/g,
  },
  {
    name: "Stripe live secret",
    pattern: /\b[rs]k_live_[A-Za-z0-9]{20,}\b/g,
  },
  {
    name: "SendGrid API key",
    pattern: /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    name: "JWT-shaped credential",
    pattern: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,
  },
  {
    name: "credential-bearing PostgreSQL URL",
    pattern:
      /\bpostgres(?:ql)?:\/\/([^:\s"'\/]+):([^@\s"'\/]+)@([^\/\s"']+)/gi,
  },
  {
    name: "credential-bearing datastore URL",
    pattern:
      /\b(?:rediss?|mysql|mongodb(?:\+srv)?):\/\/([^:\s"'\/]+):([^@\s"'\/]+)@([^\/\s"']+)/gi,
  },
];

function command(args, encoding = "utf8") {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding,
    maxBuffer: MAX_COMMAND_BYTES,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function isAllowedSyntheticDatabaseUrl(filePath, ruleName, match) {
  if (
    ruleName !== "credential-bearing PostgreSQL URL" ||
    filePath !== ".github/workflows/quality.yml"
  ) {
    return false;
  }

  const [, username, password, authority] = match;
  const host = authority?.split(":", 1)[0]?.toLowerCase();
  return username === "phase_one" && password === "phase_one" && host === "127.0.0.1";
}

const findings = new Map();

function scanBuffer(buffer, location, filePath) {
  if (buffer.length > MAX_FILE_BYTES || buffer.includes(0)) return;
  const source = buffer.toString("utf8");

  for (const rule of rules) {
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    for (const match of source.matchAll(pattern)) {
      if (isAllowedSyntheticDatabaseUrl(filePath, rule.name, match)) continue;
      const fingerprint = createHash("sha256").update(match[0]).digest("hex").slice(0, 12);
      const key = `${rule.name}:${location}:${filePath}:${fingerprint}`;
      findings.set(key, {
        type: rule.name,
        location,
        file: filePath,
        fingerprint,
      });
    }
  }
}

function scanWorkingTree() {
  const output = command([
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "-z",
  ]);
  for (const filePath of output.split("\0").filter(Boolean)) {
    const absolutePath = join(ROOT, filePath);
    if (!existsSync(absolutePath) || !lstatSync(absolutePath).isFile()) continue;
    scanBuffer(readFileSync(absolutePath), "working-tree", filePath);
  }
}

function scanHistory() {
  const commits = command(["rev-list", "--all"]).trim().split("\n").filter(Boolean);
  const scannedBlobs = new Set();

  for (const commit of commits) {
    const tree = command(["ls-tree", "-r", "-z", commit]);
    for (const entry of tree.split("\0").filter(Boolean)) {
      const separator = entry.indexOf("\t");
      if (separator < 0) continue;
      const [mode, type, objectId] = entry.slice(0, separator).split(" ");
      const filePath = entry.slice(separator + 1);
      const blobAtPath = `${objectId}:${filePath}`;
      if (mode === "120000" || type !== "blob" || scannedBlobs.has(blobAtPath)) continue;
      scannedBlobs.add(blobAtPath);
      const buffer = command(["cat-file", "-p", objectId], null);
      scanBuffer(buffer, `history:${commit.slice(0, 12)}`, filePath);
    }
  }
}

scanWorkingTree();
scanHistory();
for (const absolutePath of browserFacingBuildArtifacts(ROOT)) {
  scanBuffer(
    readFileSync(absolutePath),
    "generated-browser",
    relative(ROOT, absolutePath),
  );
}

if (findings.size > 0) {
  console.error(`Secret scan found ${findings.size} potential credential exposure(s).`);
  for (const finding of findings.values()) {
    console.error(
      `${finding.type}: ${finding.location}:${finding.file} (fingerprint ${finding.fingerprint})`,
    );
  }
  process.exitCode = 1;
} else {
  console.log(
    "Secret scan passed: no credential signatures found in source, history, or generated client assets.",
  );
}

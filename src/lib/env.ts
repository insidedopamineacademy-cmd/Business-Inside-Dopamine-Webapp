import "server-only";

export const DEFAULT_ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
export const RATE_LIMIT_IDENTITY_SECRET_NAME = "RATE_LIMIT_IDENTITY_SECRET";

export class EnvironmentConfigurationError extends Error {
  readonly code = "ENVIRONMENT_CONFIGURATION_INVALID";
  readonly variableNames: readonly string[];

  constructor(variableNames: readonly string[]) {
    super(`Required server configuration is missing or invalid: ${variableNames.join(", ")}`);
    this.name = "EnvironmentConfigurationError";
    this.variableNames = variableNames;
  }
}

function exactValue(name: string, minimum: number, maximum: number) {
  const value = process.env[name];
  if (
    typeof value !== "string" ||
    value.length < minimum ||
    value.length > maximum ||
    value !== value.trim()
  ) {
    return null;
  }
  return value;
}

export function getAdminCredentials(): { username: string; password: string } | null {
  const username = exactValue("ADMIN_USERNAME", 1, 128);
  const password = exactValue("ADMIN_PASSWORD", 16, 256);

  return username && password ? { username, password } : null;
}

function validPostgresUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "postgresql:" || url.protocol === "postgres:" ? value : null;
  } catch {
    return null;
  }
}

export function getDatabaseConfiguration(): { databaseUrl: string; directUrl: string } {
  const databaseUrl = validPostgresUrl(exactValue("DATABASE_URL", 1, 2_048));
  const directUrl = validPostgresUrl(exactValue("DIRECT_URL", 1, 2_048));
  const invalid = [
    !databaseUrl ? "DATABASE_URL" : null,
    !directUrl ? "DIRECT_URL" : null,
  ].filter((name): name is string => Boolean(name));

  if (invalid.length > 0) throw new EnvironmentConfigurationError(invalid);
  return { databaseUrl: databaseUrl!, directUrl: directUrl! };
}

export function getAnthropicConfiguration(): { apiKey: string; model: string } {
  const apiKey = exactValue("ANTHROPIC_API_KEY", 20, 512);
  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    throw new EnvironmentConfigurationError(["ANTHROPIC_API_KEY"]);
  }

  const configuredModel = process.env.ANTHROPIC_MODEL;
  const model =
    configuredModel === undefined || configuredModel === ""
      ? DEFAULT_ANTHROPIC_MODEL
      : configuredModel;
  if (
    model.length < 1 ||
    model.length > 128 ||
    model !== model.trim() ||
    !/^[a-zA-Z0-9._:-]+$/.test(model)
  ) {
    throw new EnvironmentConfigurationError(["ANTHROPIC_MODEL"]);
  }

  return { apiKey, model };
}

export type RateLimitConfiguration = {
  url: string;
  token: string;
  source: "UPSTASH" | "KV_FALLBACK";
};

function validHttpsUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}

export function getRateLimitConfiguration(): RateLimitConfiguration | null {
  const rawUpstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const rawUpstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const upstashUrl = validHttpsUrl(exactValue("UPSTASH_REDIS_REST_URL", 1, 2_048));
  const upstashToken = exactValue("UPSTASH_REDIS_REST_TOKEN", 1, 2_048);
  if (upstashUrl && upstashToken) {
    return { url: upstashUrl, token: upstashToken, source: "UPSTASH" };
  }
  if (
    (rawUpstashUrl !== undefined && rawUpstashUrl !== "") ||
    (rawUpstashToken !== undefined && rawUpstashToken !== "")
  ) {
    throw new EnvironmentConfigurationError([
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
    ]);
  }

  const rawFallbackUrl = process.env.KV_REST_API_URL;
  const rawFallbackToken = process.env.KV_REST_API_TOKEN;
  const fallbackUrl = validHttpsUrl(exactValue("KV_REST_API_URL", 1, 2_048));
  const fallbackToken = exactValue("KV_REST_API_TOKEN", 1, 2_048);
  if (fallbackUrl && fallbackToken) {
    return { url: fallbackUrl, token: fallbackToken, source: "KV_FALLBACK" };
  }
  if (
    (rawFallbackUrl !== undefined && rawFallbackUrl !== "") ||
    (rawFallbackToken !== undefined && rawFallbackToken !== "")
  ) {
    throw new EnvironmentConfigurationError(["KV_REST_API_URL", "KV_REST_API_TOKEN"]);
  }

  return null;
}

export function getRateLimitIdentitySecret() {
  const configured = exactValue("RATE_LIMIT_IDENTITY_SECRET", 32, 256);
  if (configured) return configured;
  if (
    !isProductionEnvironment() &&
    (process.env.RATE_LIMIT_IDENTITY_SECRET === undefined ||
      process.env.RATE_LIMIT_IDENTITY_SECRET === "")
  ) {
    return "inside-dopamine-local-rate-limit-secret";
  }
  throw new EnvironmentConfigurationError(["RATE_LIMIT_IDENTITY_SECRET"]);
}

export function getPublicSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const raw =
    configured === undefined || configured === ""
      ? "https://insidedopamine.com"
      : configured;
  if (raw !== raw.trim() || raw.length > 2_048) {
    throw new EnvironmentConfigurationError(["NEXT_PUBLIC_SITE_URL"]);
  }

  try {
    const url = new URL(raw);
    const validProtocol =
      url.protocol === "https:" ||
      (!isProductionEnvironment() && url.protocol === "http:");
    if (!validProtocol || url.username || url.password) {
      throw new Error("invalid public URL");
    }
    return url.origin;
  } catch {
    throw new EnvironmentConfigurationError(["NEXT_PUBLIC_SITE_URL"]);
  }
}

export type ContactWebhookConfiguration =
  | { status: "disabled" }
  | { status: "configured"; url: string }
  | { status: "invalid" };

export function getContactWebhookConfiguration(): ContactWebhookConfiguration {
  const raw = process.env.CONTACT_INBOX_WEBHOOK_URL;
  if (raw === undefined || raw === "") return { status: "disabled" };
  if (raw !== raw.trim() || raw.length > 2_048) return { status: "invalid" };

  try {
    const url = new URL(raw);
    const secure = url.protocol === "https:";
    const localDevelopment =
      process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1");

    return secure || localDevelopment
      ? { status: "configured", url: url.toString() }
      : { status: "invalid" };
  } catch {
    return { status: "invalid" };
  }
}

export function isProductionEnvironment() {
  return process.env.NODE_ENV === "production";
}

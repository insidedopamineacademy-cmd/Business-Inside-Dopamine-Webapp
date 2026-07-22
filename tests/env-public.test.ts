import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  DEFAULT_ANTHROPIC_MODEL,
  EnvironmentConfigurationError,
  RATE_LIMIT_IDENTITY_SECRET_NAME,
  getAdminCredentials,
  getAnthropicConfiguration,
  getDatabaseConfiguration,
  getPublicSiteUrl,
  getRateLimitConfiguration,
  getRateLimitIdentitySecret,
} from "../src/lib/env";

afterEach(() => vi.unstubAllEnvs());

describe("server environment feature boundaries", () => {
  it("fails closed for unsafe shared admin credentials", () => {
    vi.stubEnv("ADMIN_USERNAME", " admin");
    vi.stubEnv("ADMIN_PASSWORD", "short");
    expect(getAdminCredentials()).toBeNull();

    vi.stubEnv("ADMIN_USERNAME", "admin");
    vi.stubEnv("ADMIN_PASSWORD", "sixteen-characters");
    expect(getAdminCredentials()).toEqual({
      username: "admin",
      password: "sixteen-characters",
    });
  });

  it("uses the explicit default model when a value-free example is copied", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", ["sk", "ant-test-placeholder-key"].join("-"));
    vi.stubEnv("ANTHROPIC_MODEL", "");
    expect(getAnthropicConfiguration().model).toBe(DEFAULT_ANTHROPIC_MODEL);
  });

  it("requires both database names without exposing their values", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://example.invalid/runtime");
    vi.stubEnv("DIRECT_URL", "");
    expect(() => getDatabaseConfiguration()).toThrowError(EnvironmentConfigurationError);
    try {
      getDatabaseConfiguration();
    } catch (error) {
      expect((error as EnvironmentConfigurationError).variableNames).toEqual(["DIRECT_URL"]);
      expect(String(error)).not.toContain("postgresql://");
    }
  });

  it("rejects malformed and non-PostgreSQL database URLs at the feature boundary", () => {
    vi.stubEnv("DATABASE_URL", "not-a-url");
    vi.stubEnv("DIRECT_URL", "https://example.invalid/database");

    expect(() => getDatabaseConfiguration()).toThrowError(EnvironmentConfigurationError);
    try {
      getDatabaseConfiguration();
    } catch (error) {
      expect((error as EnvironmentConfigurationError).variableNames).toEqual([
        "DATABASE_URL",
        "DIRECT_URL",
      ]);
      expect(String(error)).not.toContain("not-a-url");
      expect(String(error)).not.toContain("example.invalid");
    }
  });

  it("rejects incomplete durable quota configuration", () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.invalid");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    expect(() => getRateLimitConfiguration()).toThrowError(EnvironmentConfigurationError);
  });

  it("treats blank quota pairs as omitted outside production", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    vi.stubEnv("KV_REST_API_URL", "");
    vi.stubEnv("KV_REST_API_TOKEN", "");
    expect(getRateLimitConfiguration()).toBeNull();
  });

  it("uses only a fixed local identity fallback and requires the named secret in production", () => {
    expect(RATE_LIMIT_IDENTITY_SECRET_NAME).toBe("RATE_LIMIT_IDENTITY_SECRET");
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("RATE_LIMIT_IDENTITY_SECRET", "");
    expect(getRateLimitIdentitySecret()).toBe("inside-dopamine-local-rate-limit-secret");

    vi.stubEnv("NODE_ENV", "production");
    expect(() => getRateLimitIdentitySecret()).toThrowError(EnvironmentConfigurationError);
  });

  it("validates the intentionally public site URL", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getPublicSiteUrl()).toBe("https://insidedopamine.com");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://example.com");
    expect(() => getPublicSiteUrl()).toThrowError(EnvironmentConfigurationError);
  });
});

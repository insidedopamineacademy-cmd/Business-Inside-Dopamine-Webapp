import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  PublicApiError,
  readBoundedJson,
  requireStrictObject,
} from "../src/lib/public-api";
import {
  checkPublicRateLimit,
  resetDevelopmentRateLimits,
} from "../src/lib/rate-limit";

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("RATE_LIMIT_IDENTITY_SECRET", "");
  resetDevelopmentRateLimits();
});

afterEach(() => {
  resetDevelopmentRateLimits();
  vi.unstubAllEnvs();
});

describe("bounded public JSON parsing", () => {
  it("accepts JSON media-type parameters and rejects unknown fields", async () => {
    const request = new Request("https://example.test/api", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ message: "hello" }),
    });
    const body = await readBoundedJson(request, 128);
    expect(requireStrictObject(body, ["message"])).toEqual({ message: "hello" });
    expect(() => requireStrictObject({ message: "hello", history: [] }, ["message"]))
      .toThrowError(PublicApiError);
  });

  it("enforces actual UTF-8 bytes even without Content-Length", async () => {
    const request = new Request("https://example.test/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: "😀😀😀" }),
    });
    await expect(readBoundedJson(request, 16)).rejects.toMatchObject({
      code: "PAYLOAD_TOO_LARGE",
      status: 413,
    });
  });

  it("returns deliberate 415 and malformed-JSON failures", async () => {
    await expect(
      readBoundedJson(
        new Request("https://example.test/api", { method: "POST", body: "{}" }),
        32,
      ),
    ).rejects.toMatchObject({ code: "UNSUPPORTED_MEDIA_TYPE", status: 415 });

    await expect(
      readBoundedJson(
        new Request("https://example.test/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{",
        }),
        32,
      ),
    ).rejects.toMatchObject({ code: "INVALID_REQUEST", status: 400 });
  });
});

describe("shared public quota identity", () => {
  it("cannot be bypassed by rotating arbitrary session IDs", async () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.8" });
    const policy = (sessionId: string) => ({
      scope: "rotation-test",
      ipLimit: 2,
      windowMs: 60_000,
      session: { id: sessionId, limit: 20 },
    });

    expect(await checkPublicRateLimit(headers, policy(crypto.randomUUID()))).toEqual({
      allowed: true,
    });
    expect(await checkPublicRateLimit(headers, policy(crypto.randomUUID()))).toEqual({
      allowed: true,
    });
    expect(await checkPublicRateLimit(headers, policy(crypto.randomUUID()))).toMatchObject({
      allowed: false,
      dimension: "ip",
    });
  });

  it("also applies the secondary session budget", async () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.9" });
    const sessionId = crypto.randomUUID();
    const policy = {
      scope: "session-test",
      ipLimit: 20,
      windowMs: 60_000,
      session: { id: sessionId, limit: 1 },
    };
    expect(await checkPublicRateLimit(headers, policy)).toEqual({ allowed: true });
    expect(await checkPublicRateLimit(headers, policy)).toMatchObject({
      allowed: false,
      dimension: "session",
    });
  });

  it("fails closed in production when identity or Upstash configuration is unsafe", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("RATE_LIMIT_IDENTITY_SECRET", "");
    await expect(
      checkPublicRateLimit(new Headers(), {
        scope: "production-test",
        ipLimit: 1,
        windowMs: 60_000,
      }),
    ).rejects.toMatchObject({ code: "RATE_LIMIT_UNAVAILABLE", status: 503 });

    vi.stubEnv("RATE_LIMIT_IDENTITY_SECRET", "a".repeat(32));
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.invalid");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    await expect(
      checkPublicRateLimit(new Headers(), {
        scope: "production-test-2",
        ipLimit: 1,
        windowMs: 60_000,
      }),
    ).rejects.toMatchObject({ code: "RATE_LIMIT_UNAVAILABLE", status: 503 });

    vi.stubEnv("UPSTASH_REDIS_REST_URL", "not-a-url");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    await expect(
      checkPublicRateLimit(new Headers(), {
        scope: "production-test-3",
        ipLimit: 1,
        windowMs: 60_000,
      }),
    ).rejects.toMatchObject({ code: "RATE_LIMIT_UNAVAILABLE", status: 503 });
  });
});

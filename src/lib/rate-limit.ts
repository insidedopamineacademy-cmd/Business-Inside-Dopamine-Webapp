import "server-only";

import { createHmac } from "node:crypto";
import { isIP } from "node:net";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import {
  EnvironmentConfigurationError,
  getRateLimitConfiguration,
  getRateLimitIdentitySecret,
  isProductionEnvironment,
} from "@/lib/env";
import { PublicApiError } from "@/lib/server/public-api-core";

const MAX_MEMORY_IDENTITIES = 5_000;

type MemoryBucket = {
  count: number;
  resetAt: number;
};

declare global {
  // Development/test-only fallback. It is deliberately bounded and is never
  // represented as a production-grade distributed quota.
  var __publicRateLimitMemory: Map<string, MemoryBucket> | undefined;
}

const memoryBuckets = global.__publicRateLimitMemory ?? new Map<string, MemoryBucket>();
if (!isProductionEnvironment()) global.__publicRateLimitMemory = memoryBuckets;

export type PublicRateLimitPolicy = {
  scope: string;
  ipLimit: number;
  windowMs: number;
  session?: {
    id: string;
    limit: number;
  };
};

export type PublicRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number; dimension: "ip" | "session" };

function firstHeaderAddress(value: string | null) {
  const address = value?.split(",", 1)[0]?.trim();
  return address && isIP(address) !== 0 ? address : null;
}

export function trustedClientAddress(headers: Headers) {
  // Production deployments must be behind a proxy that overwrites
  // x-vercel-forwarded-for. The shared anonymous bucket fails safely when that
  // trusted identity is unavailable. Development accepts common local headers.
  const trusted = firstHeaderAddress(headers.get("x-vercel-forwarded-for"));
  if (trusted) return trusted;

  if (!isProductionEnvironment()) {
    return (
      firstHeaderAddress(headers.get("x-forwarded-for")) ??
      firstHeaderAddress(headers.get("x-real-ip")) ??
      "anonymous"
    );
  }

  return "anonymous";
}

function hashedIdentity(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function pruneMemory(now: number) {
  for (const [key, bucket] of memoryBuckets) {
    if (bucket.resetAt <= now) memoryBuckets.delete(key);
  }

  while (memoryBuckets.size >= MAX_MEMORY_IDENTITIES) {
    const oldest = memoryBuckets.keys().next().value as string | undefined;
    if (!oldest) break;
    memoryBuckets.delete(oldest);
  }
}

function consumeMemory(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  pruneMemory(now);
  const existing = memoryBuckets.get(key);
  const bucket = !existing || existing.resetAt <= now
    ? { count: 0, resetAt: now + windowMs }
    : existing;
  bucket.count += 1;
  memoryBuckets.delete(key);
  memoryBuckets.set(key, bucket);

  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000)),
  };
}

async function consumeDistributed(
  key: string,
  limit: number,
  windowMs: number,
  scope: string,
) {
  let config;
  try {
    config = getRateLimitConfiguration();
  } catch (error) {
    if (!(error instanceof EnvironmentConfigurationError)) throw error;
    throw new PublicApiError({
      code: "RATE_LIMIT_UNAVAILABLE",
      status: 503,
      retryable: true,
      userMessage: "This service is temporarily unavailable. Please try again later.",
      diagnostic: "Production rate-limit configuration is incomplete or invalid.",
    });
  }
  if (!config) {
    throw new PublicApiError({
      code: "RATE_LIMIT_UNAVAILABLE",
      status: 503,
      retryable: true,
      userMessage: "This service is temporarily unavailable. Please try again later.",
      diagnostic: "Production rate-limit configuration is missing.",
    });
  }

  const seconds = Math.max(1, Math.ceil(windowMs / 1_000));
  try {
    const redis = new Redis({ url: config.url, token: config.token });
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(limit, `${seconds} s`),
      prefix: `inside-dopamine:${scope}`,
      analytics: false,
    });
    const result = await limiter.limit(key);
    return {
      allowed: result.success,
      retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1_000)),
    };
  } catch {
    throw new PublicApiError({
      code: "RATE_LIMIT_UNAVAILABLE",
      status: 503,
      retryable: true,
      userMessage: "This service is temporarily unavailable. Please try again later.",
      diagnostic: "Distributed rate-limit dependency failed.",
    });
  }
}

async function consume(key: string, limit: number, windowMs: number, scope: string) {
  return isProductionEnvironment()
    ? consumeDistributed(key, limit, windowMs, scope)
    : consumeMemory(`${scope}:${key}`, limit, windowMs);
}

export async function checkPublicRateLimit(
  headers: Headers,
  policy: PublicRateLimitPolicy,
): Promise<PublicRateLimitResult> {
  let identitySecret: string;
  try {
    identitySecret = getRateLimitIdentitySecret();
  } catch (error) {
    if (!(error instanceof EnvironmentConfigurationError)) throw error;
    throw new PublicApiError({
      code: "RATE_LIMIT_UNAVAILABLE",
      status: 503,
      retryable: true,
      userMessage: "This service is temporarily unavailable. Please try again later.",
      diagnostic: "Rate-limit identity configuration is missing or invalid.",
    });
  }
  const ipKey = `ip:${hashedIdentity(trustedClientAddress(headers), identitySecret)}`;
  const ip = await consume(ipKey, policy.ipLimit, policy.windowMs, policy.scope);
  if (!ip.allowed) {
    return { allowed: false, retryAfterSeconds: ip.retryAfterSeconds, dimension: "ip" };
  }

  if (policy.session) {
    const sessionKey = `session:${hashedIdentity(policy.session.id, identitySecret)}`;
    const session = await consume(
      sessionKey,
      policy.session.limit,
      policy.windowMs,
      policy.scope,
    );
    if (!session.allowed) {
      return {
        allowed: false,
        retryAfterSeconds: session.retryAfterSeconds,
        dimension: "session",
      };
    }
  }

  return { allowed: true };
}

export function rateLimitError() {
  return new PublicApiError({
    code: "RATE_LIMITED",
    status: 429,
    retryable: true,
    userMessage: "You're sending requests too quickly. Please wait a moment and try again.",
    diagnostic: "Public request quota was exceeded.",
  });
}

export function resetDevelopmentRateLimits() {
  if (isProductionEnvironment()) return;
  memoryBuckets.clear();
}

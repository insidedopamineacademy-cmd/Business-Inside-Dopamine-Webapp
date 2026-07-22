import "server-only";

import { NextResponse } from "next/server";

export type PublicErrorShape = {
  code: string;
  message: string;
  retryable: boolean;
  requestId: string;
};

export class PublicApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly retryable: boolean;
  readonly userMessage: string;
  readonly diagnostic: string;

  constructor(options: {
    code: string;
    status: number;
    retryable?: boolean;
    userMessage: string;
    diagnostic: string;
  }) {
    super(options.diagnostic);
    this.name = "PublicApiError";
    this.code = options.code;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
    this.userMessage = options.userMessage;
    this.diagnostic = options.diagnostic;
  }
}

export function createRequestId() {
  return crypto.randomUUID();
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function requireStrictObject(value: unknown, allowedFields: readonly string[]) {
  if (!isPlainObject(value)) {
    throw invalidRequest("Request body must be a JSON object.");
  }

  const allowed = new Set(allowedFields);
  if (Object.keys(value).some((key) => !allowed.has(key))) {
    throw invalidRequest("Request body contains unsupported fields.");
  }

  return value;
}

export function invalidRequest(diagnostic: string, userMessage = "Please check your request and try again.") {
  return new PublicApiError({
    code: "INVALID_REQUEST",
    status: 400,
    userMessage,
    diagnostic,
  });
}

export function payloadTooLarge(maxBytes: number) {
  return new PublicApiError({
    code: "PAYLOAD_TOO_LARGE",
    status: 413,
    userMessage: "That request is too large. Please shorten it and try again.",
    diagnostic: `Request exceeded the ${maxBytes}-byte limit.`,
  });
}

export async function readBoundedJson(request: Request, maxBytes: number): Promise<unknown> {
  const contentType = request.headers.get("content-type");
  if (!contentType || contentType.split(";", 1)[0]?.trim().toLowerCase() !== "application/json") {
    throw new PublicApiError({
      code: "UNSUPPORTED_MEDIA_TYPE",
      status: 415,
      userMessage: "This endpoint accepts JSON requests only.",
      diagnostic: "Missing or unsupported Content-Type.",
    });
  }

  const declaredLength = request.headers.get("content-length");
  if (declaredLength && /^\d+$/.test(declaredLength) && Number(declaredLength) > maxBytes) {
    throw payloadTooLarge(maxBytes);
  }

  const reader = request.body?.getReader();
  if (!reader) throw invalidRequest("Request body was empty.");

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw payloadTooLarge(maxBytes);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return JSON.parse(text) as unknown;
  } catch (error) {
    if (error instanceof PublicApiError) throw error;
    throw invalidRequest("Request body was not valid UTF-8 JSON.");
  }
}

export function publicErrorResponse(
  error: PublicApiError,
  requestId: string,
  extraHeaders?: HeadersInit,
) {
  const body: { error: PublicErrorShape } = {
    error: {
      code: error.code,
      message: error.userMessage,
      retryable: error.retryable,
      requestId,
    },
  };

  const headers = new Headers(extraHeaders);
  headers.set("x-request-id", requestId);
  headers.set("cache-control", "no-store");
  return NextResponse.json(body, { status: error.status, headers });
}

export function publicJsonResponse(
  body: Record<string, unknown>,
  requestId: string,
  status = 200,
) {
  return NextResponse.json(
    { ...body, requestId },
    {
      status,
      headers: {
        "cache-control": "no-store",
        "x-request-id": requestId,
      },
    },
  );
}

type SafeDiagnosticContext = {
  code?: string;
  dependency?: "anthropic" | "database" | "notification" | "rate-limit";
  durationMs?: number;
  status?: number;
  retryable?: boolean;
};

export function logPublicApiFailure(
  scope: string,
  requestId: string,
  context: SafeDiagnosticContext,
) {
  console.error(`[${scope}] request failed`, {
    requestId,
    ...context,
  });
}

export function logPublicApiWarning(
  scope: string,
  requestId: string,
  context: SafeDiagnosticContext,
) {
  console.warn(`[${scope}] request warning`, {
    requestId,
    ...context,
  });
}

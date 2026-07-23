import "server-only";

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

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function requireStrictObject(
  value: unknown,
  allowedFields: readonly string[],
) {
  if (!isPlainObject(value)) {
    throw invalidRequest("Request body must be a JSON object.");
  }

  const allowed = new Set(allowedFields);
  if (Object.keys(value).some((key) => !allowed.has(key))) {
    throw invalidRequest("Request body contains unsupported fields.");
  }

  return value;
}

export function invalidRequest(
  diagnostic: string,
  userMessage = "Please check your request and try again.",
) {
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

export type SafeDiagnosticContext = {
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

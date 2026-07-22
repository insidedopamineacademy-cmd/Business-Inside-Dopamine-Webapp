export function safeApiErrorMessage(value: unknown, fallback: string) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return fallback;
  const error = "error" in value ? value.error : null;
  if (typeof error !== "object" || error === null || Array.isArray(error)) return fallback;
  const message = "message" in error ? error.message : null;
  if (typeof message !== "string") return fallback;
  const normalized = message.trim();
  return normalized.length > 0 && normalized.length <= 240 ? normalized : fallback;
}

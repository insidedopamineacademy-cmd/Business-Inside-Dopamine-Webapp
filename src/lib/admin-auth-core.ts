import { createHash, timingSafeEqual } from "node:crypto";

export type AdminCredentials = Readonly<{
  username: string;
  password: string;
}>;

type ParsedBasicCredentials = {
  username: string;
  password: string;
};

const MAX_AUTHORIZATION_HEADER_LENGTH = 16_384;
const BASIC_AUTHORIZATION_PATTERN = /^Basic[\t ]+([A-Za-z0-9+/]+={0,2})$/i;

function hasUnsafeCredentialCharacters(value: string) {
  return /[\u0000-\u001f\u007f]/.test(value);
}

function hasSafeConfiguredCredentials(credentials: AdminCredentials | null): credentials is AdminCredentials {
  return Boolean(
    credentials &&
      credentials.username.length > 0 &&
      credentials.password.length > 0 &&
      !credentials.username.includes(":") &&
      !hasUnsafeCredentialCharacters(credentials.username) &&
      !hasUnsafeCredentialCharacters(credentials.password)
  );
}

function decodeCanonicalBase64(value: string) {
  if (value.length % 4 !== 0) return null;

  const bytes = Buffer.from(value, "base64");
  if (bytes.toString("base64") !== value) return null;

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export function parseBasicAuthorization(authorization: string | null): ParsedBasicCredentials | null {
  if (!authorization || authorization.length > MAX_AUTHORIZATION_HEADER_LENGTH) return null;

  const match = BASIC_AUTHORIZATION_PATTERN.exec(authorization);
  if (!match) return null;

  const decoded = decodeCanonicalBase64(match[1]);
  if (decoded === null) return null;

  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex < 0) return null;

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
}

function digestCredential(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

export function verifyAdminAuthorization(
  authorization: string | null,
  configuredCredentials: AdminCredentials | null
) {
  if (!hasSafeConfiguredCredentials(configuredCredentials)) return false;

  const presentedCredentials = parseBasicAuthorization(authorization);
  if (!presentedCredentials) return false;

  const usernameMatches = timingSafeEqual(
    digestCredential(presentedCredentials.username),
    digestCredential(configuredCredentials.username)
  );
  const passwordMatches = timingSafeEqual(
    digestCredential(presentedCredentials.password),
    digestCredential(configuredCredentials.password)
  );

  return Boolean(Number(usernameMatches) & Number(passwordMatches));
}

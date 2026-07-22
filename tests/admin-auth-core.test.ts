import { Buffer } from "node:buffer";

import { describe, expect, it } from "vitest";

import { parseBasicAuthorization, verifyAdminAuthorization } from "../src/lib/admin-auth-core";

function basic(username: string, password: string, scheme = "Basic") {
  return `${scheme} ${Buffer.from(`${username}:${password}`, "utf8").toString("base64")}`;
}

const configured = {
  username: "admin-user",
  password: "a-long-development-password",
};

describe("admin Basic authorization core", () => {
  it("accepts exact credentials and a case-insensitive Basic scheme", () => {
    expect(verifyAdminAuthorization(basic(configured.username, configured.password), configured)).toBe(true);
    expect(verifyAdminAuthorization(basic(configured.username, configured.password, "basic"), configured)).toBe(true);
  });

  it("decodes UTF-8 credentials and preserves colons in the password", () => {
    const credentials = { username: "søren", password: "correct:🔐:password" };

    expect(parseBasicAuthorization(basic(credentials.username, credentials.password))).toEqual(credentials);
    expect(verifyAdminAuthorization(basic(credentials.username, credentials.password), credentials)).toBe(true);
  });

  it.each([
    null,
    "",
    "Bearer token",
    "Basic",
    "Basic !!!=",
    "Basic dXNlcm5hbWU=",
    "Basic dXNlcjpwYXNzCg== trailing",
    `Basic ${"A".repeat(16_385)}`,
  ])("rejects a malformed authorization value without throwing", (authorization) => {
    expect(() => verifyAdminAuthorization(authorization, configured)).not.toThrow();
    expect(verifyAdminAuthorization(authorization, configured)).toBe(false);
  });

  it("rejects wrong credentials of different lengths without a timingSafeEqual length error", () => {
    expect(() => verifyAdminAuthorization(basic("x", "y"), configured)).not.toThrow();
    expect(verifyAdminAuthorization(basic("x", configured.password), configured)).toBe(false);
    expect(verifyAdminAuthorization(basic(configured.username, "y"), configured)).toBe(false);
  });

  it.each([
    null,
    { username: "", password: configured.password },
    { username: configured.username, password: "" },
    { username: "admin:user", password: configured.password },
    { username: configured.username, password: "unsafe\npassword" },
  ])("fails closed for missing or unsafe configured credentials", (credentials) => {
    expect(verifyAdminAuthorization(basic(configured.username, configured.password), credentials)).toBe(false);
  });
});

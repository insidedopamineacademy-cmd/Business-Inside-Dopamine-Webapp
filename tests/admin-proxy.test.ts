import { Buffer } from "node:buffer";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getAdminCredentials: vi.fn(),
  headers: vi.fn(),
  detectVisitorProfile: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("@/lib/env", () => ({ getAdminCredentials: mocks.getAdminCredentials }));
vi.mock("@/lib/visitor", () => ({ detectVisitorProfile: mocks.detectVisitorProfile }));

import { requireAdmin } from "../src/lib/admin-auth";
import proxy from "../src/proxy";

const credentials = {
  username: "admin-user",
  password: "a-long-development-password",
};

function authorization(username = credentials.username, password = credentials.password) {
  return `Basic ${Buffer.from(`${username}:${password}`, "utf8").toString("base64")}`;
}

function request(pathname: string, header?: string) {
  return new NextRequest(`https://example.test${pathname}`, {
    headers: header ? { authorization: header } : undefined,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getAdminCredentials.mockReturnValue(credentials);
  mocks.headers.mockResolvedValue(new Headers());
  mocks.detectVisitorProfile.mockReturnValue({
    segment: "default",
    source: "direct",
    intent: "general",
  });
});

describe("requireAdmin", () => {
  it("authorizes from the current request headers", async () => {
    mocks.headers.mockResolvedValue(new Headers({ authorization: authorization() }));

    await expect(requireAdmin()).resolves.toBeUndefined();
  });

  it("uses one generic rejection for bad credentials and unsafe configuration", async () => {
    mocks.headers.mockResolvedValue(new Headers({ authorization: authorization("wrong") }));
    const wrongCredentials = requireAdmin().catch((error: unknown) => error);

    mocks.getAdminCredentials.mockReturnValue(null);
    const missingConfiguration = requireAdmin().catch((error: unknown) => error);

    await expect(wrongCredentials).resolves.toMatchObject({
      name: "AdminAuthorizationError",
      message: "Unauthorized.",
    });
    await expect(missingConfiguration).resolves.toMatchObject({
      name: "AdminAuthorizationError",
      message: "Unauthorized.",
    });
  });
});

describe("admin proxy boundary", () => {
  it("fails closed when admin credentials are not safely configured", () => {
    mocks.getAdminCredentials.mockReturnValue(null);

    const response = proxy(request("/admin/leads"));

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("www-authenticate")).toBeNull();
  });

  it("challenges missing or invalid credentials without caching", () => {
    for (const candidate of [undefined, authorization("wrong"), "Basic invalid!"]) {
      const response = proxy(request("/admin/conversations", candidate));

      expect(response.status).toBe(401);
      expect(response.headers.get("www-authenticate")).toContain("Inside Dopamine Admin");
      expect(response.headers.get("cache-control")).toContain("no-store");
      expect(response.headers.get("vary")).toBe("Authorization");
    }
  });

  it("allows exact credentials and marks the response private", () => {
    const response = proxy(request("/admin/faqs", authorization()));

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("cache-control")).toContain("private");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it.each(["/administrator", "/administer", "/api/admin"]) (
    "does not treat the non-admin path %s as protected admin content",
    (pathname) => {
      mocks.getAdminCredentials.mockReturnValue(null);

      const response = proxy(request(pathname));

      expect(response.status).toBe(200);
      expect(mocks.detectVisitorProfile).toHaveBeenCalledOnce();
    }
  );
});

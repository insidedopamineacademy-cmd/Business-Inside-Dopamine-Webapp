import "server-only";

import { headers } from "next/headers";

import { verifyAdminAuthorization } from "@/lib/admin-auth-core";
import { getAdminCredentials } from "@/lib/env";

class AdminAuthorizationError extends Error {
  constructor() {
    super("Unauthorized.");
    this.name = "AdminAuthorizationError";
  }
}

export async function requireAdmin() {
  const authorization = (await headers()).get("authorization");
  const credentials = getAdminCredentials();

  if (!verifyAdminAuthorization(authorization, credentials)) {
    throw new AdminAuthorizationError();
  }
}

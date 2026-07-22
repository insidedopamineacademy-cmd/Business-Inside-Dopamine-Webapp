import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAdminAuthorization } from "@/lib/admin-auth-core";
import { getAdminCredentials } from "@/lib/env";
import { detectVisitorProfile } from "@/lib/visitor";

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      Vary: "Authorization",
      "WWW-Authenticate": 'Basic realm="Inside Dopamine Admin", charset="UTF-8"',
    },
  });
}

function unavailable() {
  return new NextResponse("Admin auth is not configured.", {
    status: 503,
    headers: {
      "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      Vary: "Authorization",
    },
  });
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function authorized() {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  response.headers.set("Vary", "Authorization");
  return response;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin auth ────────────────────────────────────────────────────────────
  if (isAdminPath(pathname)) {
    const credentials = getAdminCredentials();
    if (!credentials) return unavailable();

    const authorization = request.headers.get("authorization");
    if (!verifyAdminAuthorization(authorization, credentials)) return unauthorized();

    return authorized();
  }

  // ── Visitor segment tagging ───────────────────────────────────────────────
  const profile = detectVisitorProfile(request);

  const modifiedHeaders = new Headers(request.headers);
  modifiedHeaders.set("x-visitor-segment", profile.segment);
  modifiedHeaders.set("x-visitor-source", profile.source);
  modifiedHeaders.set("x-visitor-intent", profile.intent);

  return NextResponse.next({ request: { headers: modifiedHeaders } });
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { detectVisitorProfile } from "@/lib/visitor";

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Inside Dopamine Admin", charset="UTF-8"',
    },
  });
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin auth ────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      return new NextResponse("Admin auth is not configured.", { status: 503 });
    }

    const authorization = request.headers.get("authorization");
    if (!authorization || !authorization.startsWith("Basic ")) {
      return unauthorized();
    }

    let decoded = "";
    try {
      decoded = atob(authorization.slice(6));
    } catch {
      return unauthorized();
    }

    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) {
      return unauthorized();
    }

    const incomingUsername = decoded.slice(0, separatorIndex);
    const incomingPassword = decoded.slice(separatorIndex + 1);

    if (incomingUsername !== username || incomingPassword !== password) {
      return unauthorized();
    }

    return NextResponse.next();
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

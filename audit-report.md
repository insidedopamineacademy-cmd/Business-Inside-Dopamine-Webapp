# Inside Dopamine — Comprehensive Codebase Audit
**Date:** 2026-04-22  
**Stack:** Next.js 16 · React 19 · Prisma (PostgreSQL) · Tailwind v4 · Framer Motion

---

## Summary

The codebase is clean, well-structured, and production-ready in most areas. There is one **critical** security defect (the admin is unprotected despite auth code being written), two **high** issues, and several medium/low quality items.

---

## CRITICAL — Admin Auth Middleware Is Broken

**File:** `src/proxy.ts`  
**Expected location:** `src/middleware.ts`

The Basic-Auth guard for `/admin/**` was written and is logically correct, but it lives in `src/proxy.ts`. Next.js only auto-executes Edge middleware when the file is at the project root `middleware.ts` or `src/middleware.ts`. Because the file is misnamed, **it is never called**. Every `/admin/leads` route is publicly accessible to anyone who knows the URL, exposing all lead PII (names, emails, phone numbers, companies, bottleneck descriptions).

**Fix:** rename the file.

```bash
mv src/proxy.ts src/middleware.ts
```

No other code changes needed — the `export function proxy()` needs to become `export default proxy`, and the `export const config` is already in the right shape for Next.js middleware.

The corrected `src/middleware.ts`:

```ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Inside Dopamine Admin", charset="UTF-8"',
    },
  });
}

export default function middleware(request: NextRequest) {
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
  if (separatorIndex === -1) return unauthorized();

  const incomingUsername = decoded.slice(0, separatorIndex);
  const incomingPassword = decoded.slice(separatorIndex + 1);

  if (incomingUsername !== username || incomingPassword !== password) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

Also ensure `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set in your production environment variables.

---

## HIGH — No HTTP Security Headers

**File:** `next.config.ts`

The config is completely bare. There are no security headers — no Content-Security-Policy, no X-Frame-Options, no Referrer-Policy. This leaves the site open to clickjacking and reduces defence-in-depth.

**Fix:** add a `headers()` export to `next.config.ts`:

```ts
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

A full CSP would require auditing all inline styles and scripts; defer that to a follow-up pass.

---

## HIGH — robots.txt Exposes Admin Path to Crawlers

**File:** `src/app/robots.ts`

```ts
rules: [{ userAgent: "*", allow: "/" }],
```

The per-page `robots: { index: false }` metadata only inserts a `<meta name="robots">` tag — it does not instruct crawlers at the `robots.txt` level. Googlebot and others will still discover and attempt to crawl `/admin/` links. The fix:

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/admin/" },
    ],
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

---

## MEDIUM — No Rate Limiting on Contact Form

**File:** `src/app/contact/actions.ts`

The `submitContactForm` server action writes directly to the database on every invocation. There is no rate limiting by IP or email. A bot can bypass the honeypot (it's trivially detectable) and flood the `Lead` table.

**Options (pick one):**
- Add an Upstash Redis rate-limit check in the server action (e.g. 3 submissions per IP per 10 minutes).
- Add a Cloudflare Turnstile / hCaptcha token field and verify server-side.
- At minimum, check for duplicate email submissions within a short window using a Prisma query before inserting.

---

## MEDIUM — No Input Length Validation

**File:** `src/app/contact/actions.ts`

Server-side validation checks for presence but not length. A user could submit a `bottleneck` or `notes` field with megabytes of text. PostgreSQL will store it; your Prisma `String` columns have no `@db.VarChar(n)` constraint.

**Fix (two-part):**

1. Add max-length checks in the server action before the DB write:

```ts
if (payload.bottleneck.length > 4000)
  fieldErrors.bottleneck = "Please keep this under 4,000 characters.";
if (payload.notes.length > 2000)
  fieldErrors.notes = "Please keep this under 2,000 characters.";
```

2. Add `maxLength` attributes to the corresponding `<textarea>` elements in `ContactInquirySection.tsx` for client-side feedback.

---

## LOW — Dead Auth File (`src/proxy.ts`)

Once the middleware is moved to `src/middleware.ts`, delete `src/proxy.ts`. If it's left in place it becomes a confusing dead file.

---

## LOW — Dual Component Directory Structure

The project has two component trees:

| Directory | Used by |
|---|---|
| `/components/` (root) | `src/app/layout.tsx` (imports via `../../components/`) |
| `/src/components/` | Pages that use `@/components/` |

This is inconsistent and will confuse contributors. The root-level `layout.tsx` should import via the `@/` alias like everything else, and the components should live in a single location (`src/components/`).

**Root `layout.tsx` currently:**
```ts
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ScrollToTopButton from "../../components/layout/ScrollToTopButton";
import "../../styles/globals.css";
```

These should move to `src/components/layout/` and be imported as `@/components/layout/Navbar`, etc.

---

## LOW — Duplicate / Diverged Case Study Data Files

| File | Type name | Slugs |
|---|---|---|
| `src/app/work/caseStudies.ts` | `CaseStudySlug` | `reporting-speed-dashboard`, `whatsapp-crm-qualification-flow`, `internal-ops-web-app` |
| `src/app/content/work/caseStudies.ts` | `WorkSlug` | `ai-knowledge-copilot`, `executive-sales-dashboard`, `operations-data-platform` |

These are two completely different schemas with different slugs. One of them appears to be an old version. The live work pages under `src/app/work/` use the newer slugs. Confirm which is active, then delete the stale file to avoid future confusion. The `sitemap.ts` imports from `./work/caseStudies` (the newer one), which appears correct.

---

## LOW — Orphaned ThemeProvider / ThemeToggle

`src/components/ui/ThemeProvider.tsx` and `src/components/ui/ThemeToggle.tsx` exist but the root `layout.tsx` does not wrap `<body>` with `<ThemeProvider>`. The `next-themes` package is also listed as a dependency. If dark mode switching is not currently wired up to the UI, these components and the `next-themes` dependency should be removed to avoid dead code. If dark mode is planned, the ThemeProvider needs to be added to the root layout.

---

## Minor Notes

- **Timing-safe comparison:** The Basic Auth string comparison in `proxy.ts` uses `!==` (not constant-time). For an internal admin tool this is acceptable, but note that a sophisticated attacker on a shared host could theoretically exploit timing. `crypto.timingSafeEqual` is the hardened alternative.
- **Webhook timeout:** The 10-second `AbortController` timeout in `submitContactForm` is sensible. Good.
- **Prisma singleton pattern:** The `global.__prisma` pattern in `src/lib/prisma.ts` is the correct approach for Next.js dev-mode HMR. Good.
- **Honeypot field:** The `sr-only` honeypot in the contact form is a reasonable low-friction bot filter. Good.
- **`force-dynamic` on admin layout:** Correct — ensures admin pages are never cached. Good.

---

## Priority Order

| # | Issue | Effort |
|---|---|---|
| 1 | Rename `src/proxy.ts` → `src/middleware.ts` and fix export | 5 min |
| 2 | Add `ADMIN_USERNAME` / `ADMIN_PASSWORD` to production env | 2 min |
| 3 | Add `disallow: "/admin/"` to robots.ts | 2 min |
| 4 | Add security headers to next.config.ts | 10 min |
| 5 | Add input length validation to contact action | 15 min |
| 6 | Add rate limiting to contact form | 30–60 min |
| 7 | Consolidate component directories | 1–2 hrs |
| 8 | Delete stale caseStudies.ts | 10 min |
| 9 | Resolve ThemeProvider dead code | 15 min |

# Inside Dopamine — Repository Rules and Production Launch Gates

**Phase One:** COMPLETE

**Phase Two:** COMPLETE

**UI/UX redesign readiness:** READY

**Release status:** Engineering Complete — Production Launch Pending

**Production readiness:** BLOCKED

This document is the repository cleanliness contract and the authoritative list of unresolved production-launch gates. Completed engineering evidence belongs in [AUDIT.md](AUDIT.md); implementation requirements and roadmap belong in [PRD.md](PRD.md); Phase 2.0 recommendation status belongs in [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md).

## 1. Current ownership rules

1. The root layout owns the HTML document, font, global stylesheet, and inherited root metadata only.
2. The `(public)` layout owns all public chrome and the public semantic main.
3. The admin layout owns authorization, all admin chrome, admin content width, and the admin semantic main.
4. One route owns each canonical resource URL. Case-study detail routes are owned only by `(public)/work/[slug]/page.tsx`.
5. `src/data/portfolio.ts` owns category/service identities and portfolio projections; migrated surfaces must not recreate those arrays.
6. `src/data/caseStudies.ts` owns case-study copy and records.
7. `src/features/contact` owns contact composition, browser contract/form, and server action.
8. `src/features/chat/server` owns chat orchestration, policy, typed outcomes, and conversation persistence.
9. `src/lib/lead-service.ts` owns the shared contact/chat lead transaction.
10. Route-colocated admin query/action modules own route-family reads and mutations when they have no broader consumer.
11. `src/styles/globals.css` owns design tokens and compatibility aliases; `src/app/globals.css` is an import bridge only.

## 2. Folder responsibilities

| Folder/module | Responsibility |
| --- | --- |
| `src/app` | Routes, layouts, metadata routes, HTTP adapters, route-specific Server Actions/queries, and route composition |
| `src/app/(public)` | Public URLs and public-shell children; route-group parentheses do not change URLs |
| `src/app/admin` | Protected admin shell, server-rendered list/detail pages, authorized route-specific queries/actions |
| `src/app/api` | HTTP parsing, request metadata, calling a service/helper, and response mapping |
| `src/components/layout` | Reusable shell components; no feature persistence or route ownership |
| `src/components/sections` | Public presentation compositions; Server Components unless browser state is demonstrated |
| `src/components/ui` | Domain-neutral primitives and intentional general widgets; no feature server implementation |
| `src/data` | Static typed client-safe content and projections |
| `src/features/contact` | Contact-specific contract, server/static composition, client form, and Server Action |
| `src/features/chat/server` | Protected chat use-case, policy, types, and persistence |
| `src/lib/server` | Transport-neutral protected server helpers |
| `src/lib` | Narrow shared infrastructure/contracts whose ownership is genuinely cross-feature |
| `src/styles` | Authoritative global CSS/design tokens and style tests |
| `prisma` | Schema, reviewed ordered migrations, and guarded seed policy |
| `tests` | Cross-cutting behavior, ownership, route, rendering, and dependency contracts |

Do not move a file merely to make the tree symmetrical. Introduce a feature boundary only when it clarifies demonstrated ownership.

## 3. Dependency direction

Allowed direction:

```text
App Router route/layout/action
  -> feature component or feature service
    -> domain policy / route query / persistence helper
      -> shared server infrastructure
        -> Prisma, Next.js server APIs, provider SDKs

Client Component
  -> client-safe contract / static registry / domain-neutral UI
```

Rules:

- Shared, data, component, and feature modules must not import from `src/app`.
- Feature services must not depend on route modules.
- Infrastructure must not import UI or Client Components.
- Transport-neutral errors/diagnostics must not depend on `NextResponse`.
- Public HTTP response construction stays in `src/lib/public-api.ts` or the route boundary.
- Import server implementations explicitly; do not expose them through a general-purpose barrel.
- Type-only imports do not authorize runtime reachability of a protected module.

## 4. Server-only rules

The following module categories require `import "server-only"` or, for a Server Action module, the `"use server"` directive plus protected imports:

- Prisma/database access;
- private environment access or validation;
- Anthropic/provider calls and provider configuration;
- authentication and authorization;
- request headers/cookies or other server request APIs;
- lead or conversation persistence;
- notifications/email/webhooks;
- server-side quotas, rate limits, and quota identity;
- API route helper modules;
- feature modules under a `server` folder;
- authorized admin query/action modules;
- public transport/diagnostic implementations.

Adding the directive is not sufficient by itself: the import graph must also prevent a Client Component from reaching the module directly or transitively.

## 5. Client-safe contracts

A client-safe contract may contain serializable:

- types and DTO shapes;
- category/service/contact option constants;
- field names, field types, lengths, labels, and state shapes;
- validation predicates that do not depend on privileged data;
- domain-neutral UI variant constants.

A client-safe contract must not contain or import:

- Prisma or generated database types used at runtime;
- Node-only modules;
- private environment configuration;
- `next/headers`, `next/server`, cookies, or request metadata;
- Server Actions or protected query modules;
- provider SDKs;
- notification/persistence/quota implementations;
- a barrel that exports any of the above.

Current browser-safe contracts include `src/data/portfolio.ts`, `src/features/contact/contract.ts`, `src/lib/chat-client-contract.ts`, `src/lib/leads.ts`, and `src/app/admin/faqs/contract.ts`.

## 6. Route responsibilities

### Layouts

- `src/app/layout.tsx`: document only; do not add public/admin chrome or a semantic main.
- `src/app/(public)/layout.tsx`: public chrome, transition, public main, scroll control, footer, chat.
- `src/app/admin/layout.tsx`: `requireAdmin`, `force-dynamic`, admin chrome, admin main.

### Pages

- Default to Server Components.
- Read static registries directly on the server.
- Read protected data through authorized, narrow query functions.
- Pass initial DTOs to the smallest client editor when interaction requires state.
- Keep full lead/transcript access in detail pages.

### Route handlers

- Export only supported App Router route exports.
- Own request parsing, bounded transport, request metadata extraction, service invocation, and response mapping.
- Place reusable parsers/helpers in adjacent server-only modules.
- Do not own provider/database orchestration when a feature application service exists.

### Server Actions

- Authorize at the point of use before sensitive validation, lookup, mutation, logging, or revalidation.
- Keep server validation authoritative.
- Return the updated narrow DTO when the client can update without a full refetch.
- Revalidate the owning route as a consistency boundary.

## 7. Accepted patterns

- Route groups for shell ownership without URL changes.
- Typed static registries with route/card/navigation/contact/sitemap projections.
- One dynamic case-study route with finite static params and `dynamicParams = false`.
- Server Components for stable copy, lists, cards, details/summary, page heroes, and CTAs.
- Small Client Components for real browser state.
- CSS presentation motion with a reduced-motion override.
- Route-colocated authorized admin query/action modules.
- Explicit server application services and narrow supporting modules.
- Prisma selections declared as narrow constants/types.
- Deterministic composite cursors using `(createdAt, id)`.
- Mutation-returned data plus `revalidatePath`.
- Domain-neutral primitives in `src/components/ui`; feature compositions outside it.
- Compatibility aliases that are explicitly marked deprecated, tested, and absent from normalized primitives.

## 8. Forbidden patterns

- Public chrome in the root/admin shell or admin chrome in the public shell.
- More than one semantic `<main>` per rendered surface.
- Duplicate explicit routes for known case-study slugs.
- Duplicate Product/BI/Growth, service, case-study relation, or contact-option arrays on migrated surfaces.
- Stable presentation marked `"use client"` only for reveal animation.
- `useEffect`-driven initial FAQ/conversation list fetching.
- Unbounded admin list reads.
- Selecting full conversation transcript JSON to compute a list count.
- Accepting `messageCount`, canonical chat history, provider messages, lead success, or privileged authorization from the browser.
- Shared/domain/feature modules importing from `src/app`.
- Client components importing Server Actions, protected queries, Prisma, provider, private configuration, auth, persistence, notification, or quota code.
- Generic repository or dependency-injection frameworks without a demonstrated use case.
- New feature-specific components in the domain-neutral UI barrel.
- New uses of deprecated design aliases or raw repeated tokens where a semantic token/variant exists.
- Automatic dependency fixes, destructive Prisma commands, unreviewed seeds, or production credentials in ordinary development.

## 9. Barrel export rules

- `src/components/ui/index.ts` may export domain-neutral UI primitives and their client-safe types/variants.
- A client-facing barrel must not export any protected server implementation.
- Feature server modules use explicit direct imports; do not create a mixed feature barrel.
- A contract barrel, if added, must remain browser-safe under the dependency-boundary tests.
- Route helpers, Server Actions, Prisma modules, provider adapters, auth, notification, and quota implementations must never be re-exported from a general index.

## 10. Pagination rules

- Lead and conversation lists use `ADMIN_LIST_DEFAULT_SIZE = 25`.
- `ADMIN_LIST_MAX_SIZE = 50` is a hard server-enforced ceiling.
- Ordering is deterministic: newest first by `createdAt DESC`, then `id DESC`.
- Cursors encode both `createdAt` and `id`; invalid or overlong cursors safely fall back rather than broadening the query.
- Query one extra row to determine the next/previous state, then return no more than the normalized page size.
- Preserve active filters in pagination URLs.
- Previous/next navigation is server-rendered and accessible; infinite scrolling is not the accepted admin pattern.
- List DTOs exclude long text/full details unless the list visibly needs a bounded field.
- Conversation list queries select `messageCount`, never `messages`.
- Full records/transcripts are read only by authorized detail routes.

## 11. Design-system rules

- Tailwind CSS 4 remains CSS-first; do not add a competing Tailwind configuration or component library.
- `src/styles/globals.css` is authoritative for semantic colors, typography roles, spacing, radii, elevation, motion, focus/interaction states, and content widths.
- Use `Container` variants `narrow`, `standard`, `wide`, or `admin` according to demonstrated intent.
- Prefer normalized `Field`, `Input`, `Select`, `Textarea`, `StatusBadge`, `Button`, `Card`, `Badge`, `Section`, `Container`, and `Divider`.
- Feature-specific cards/forms/page compositions stay with the feature or route, not in `src/components/ui`.
- New work must use semantic tokens and named variants rather than deprecated aliases.
- Existing aliases may be removed only after all consumers migrate and representative desktop/mobile/focus/disabled/reduced-motion checks pass.
- Preserve current contrast and focus guarantees during visual redesign.
- Do not use a runtime animation library solely to reveal stable server-renderable content.

## 12. Current cleanup checklist

### Completed in Phase Two

- [x] Root layout reduced to document ownership.
- [x] Public/admin shells separated with one main per surface.
- [x] Case-study details consolidated under one route owner.
- [x] Product/BI/Growth and service/contact projections centralized.
- [x] CSS-first design-system authority and named widths established.
- [x] Public/admin reference surfaces migrated to normalized primitives.
- [x] Nine stable presentation boundaries moved to Server Components.
- [x] Admin FAQ/conversation initial reads moved to the server.
- [x] Lead/conversation collection reads bounded with stable cursors.
- [x] Durable conversation `messageCount` added and list transcript reads removed.
- [x] Contact feature ownership corrected.
- [x] Chat route reduced to HTTP responsibilities.
- [x] App Router export/page-prop contracts repaired.
- [x] Protected server modules and dependency directions enforced by static tests.
- [x] Obsolete `tailwind.config.ts` removed.

### Remaining repository cleanup

- [ ] Decide ownership or removal for personalisation/recommendation.
- [ ] Remove the eight verified dead presentation experiments after importer/build checks.
- [ ] Finish one intentional Framer Motion import/facade policy.
- [ ] Migrate remaining legacy aliases/manual values as redesigned surfaces are touched.
- [ ] Consolidate repeated service-detail composition after characterization.

These cleanup items are Phase Three maintainability work. They are not production approval and do not replace the launch gates below.

## 13. Production launch gates

| ID | Gate | Owner role | Current status |
| --- | --- | --- | --- |
| DEP-01 | Dependency disposition | Dependency owner / Technical release owner | **OPEN — blocks production launch** |
| PRIV-001 | Privacy and data lifecycle | Business/privacy owner with Backend Operations | **OPEN — blocks production launch** |
| RATE-IDENTITY-01 | Production Redis and trusted-proxy identity | Platform / Release owner | **OPEN — blocks production launch** |

### DEP-01 — Dependency disposition

**Impact:** The Phase One snapshot reported 6 production entries (5 High, 1 Moderate) and 12 full-graph entries (9 High, 2 Moderate, 1 Low), with 0 Critical. Reachability was reduced by current inputs, but affected packages remained installed and no formal disposition existed. A fresh audit is required before closure.

**Owner role:** Dependency owner, approved by the technical release owner.

**Required action:**

1. Take narrow upstream-compatible upgrades for Prisma/effect, Next-bundled PostCSS/sharp, and development tooling when available; do not use an unsafe Next downgrade or blanket `npm audit fix`.
2. Re-run relevant type, lint, test, build, Prisma, and dependency checks after change.
3. For an item that cannot be removed before launch, record a named owner, reachability rationale, compensating controls, and explicit expiry/review date approved by the release owner.
4. Close only when every current reported category is resolved or formally accepted.

**Current status:** Open. The Anthropic SDK advisory was resolved; no remaining category has owner-and-expiry acceptance.

### PRIV-001 — Privacy and data lifecycle

**Impact:** The application can collect lead identity/project information, bounded chat transcripts, durable message counts, segment events, notification metadata, and pseudonymized quota/log identifiers. Public notices are factual pre-launch notices, not legal/business approval. Final controller details, purposes/legal bases, processors/transfers, retention, rights operations, and backup implications remain incomplete.

**Owner role:** Business/privacy owner for policy/approval; Backend Operations for enforcement/rehearsal.

**Required action:**

1. Approve controller/contact details, purposes/legal bases, processors/contracts, transfer position, retention periods, Privacy Notice, and Website Terms.
2. Implement access/export/correction/deletion and automated expiry for Leads, LeadNotifications, Conversations, SegmentEvents, application logs, quota data, and relevant backups.
3. Define legal-hold and backup-retention behavior; export only the requester’s data and avoid ordinary-log identity evidence.
4. Rehearse access/export/deletion with synthetic linked records, recording counts rather than contents, and verify failure/restore behavior.
5. Re-review contact/chat notices after approval and implementation.

**Current status:** Open. No legal/business approval or enforceable lifecycle completion is claimed.

### RATE-IDENTITY-01 — Production Redis and trusted-proxy identity

**Impact:** Local in-memory quotas and fail-closed production configuration tests do not prove distributed enforcement. If the deployed proxy does not overwrite the trusted forwarding header, callers may share or influence identity; if Redis is unavailable, protected public features deliberately return unavailable.

**Owner role:** Platform owner, witnessed by the release owner.

**Required action:**

1. Configure one complete production Upstash/supported KV pair plus a unique production `RATE_LIMIT_IDENTITY_SECRET`.
2. Verify at the actual TLS/proxy termination layer that untrusted forwarding headers are removed/overwritten and the application receives the intended trusted address in `x-vercel-forwarded-for`, or adapt the policy for the chosen host.
3. Exercise distributed quotas across multiple instances, session rotation, shared/missing identity, `429`/`Retry-After`, Redis outage, and recovery with synthetic traffic.
4. Confirm redacted monitoring without raw client addresses.

**Current status:** Open. Production Redis availability, cross-instance behavior, and trusted-proxy identity have not been verified.

## 14. Production launch checklist

Production launch remains blocked until all boxes are supported by recorded evidence:

- [ ] DEP-01 is resolved or formally accepted with named owners and live review/expiry dates.
- [ ] PRIV-001 has business/legal approval and lifecycle controls have passed a synthetic rehearsal.
- [ ] RATE-IDENTITY-01 has passed production-like Redis and trusted-proxy verification.
- [ ] The exact release revision passes the full CI workflow, including dependency and ephemeral migration gates.
- [ ] Production configuration names/presence are reviewed without displaying values; HTTPS/HSTS is confirmed.
- [ ] The persistent migration target, backup, roll-forward, and application rollback plan are independently approved.
- [ ] All reviewed migrations, including Phase 2.3C `messageCount`, are applied through the authorized release process.
- [ ] The authorized deployment completes redacted smoke and monitoring checks.

Completing Phase Two and becoming ready for UI/UX redesign does not check these boxes automatically. No revision may be represented as production-ready or deployed until this checklist closes.

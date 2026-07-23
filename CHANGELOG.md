# Changelog

## Unreleased

### 2026-07-23 — Phase Two architecture refinement complete

#### Architecture

- Split the document root from route shells. `src/app/layout.tsx` now owns only the document/font/global metadata boundary; `(public)/layout.tsx` and `admin/layout.tsx` independently own public and admin chrome plus one semantic `<main>` each.
- Moved public routes into a route group without changing URLs or metadata inheritance.
- Consolidated all three known case-study details into one statically parameterized `[slug]` route with canonical/Open Graph metadata, unknown-slug handling, related-work rendering, and sitemap parity.
- Added a typed client-safe portfolio registry with stable `product`, `bi`, and `growth` keys; centralized service identities, route/card/navigation projections, case-study relations, and contact enquiry options.
- Repaired App Router route contracts by keeping supported exports in route modules and moving reusable parsers into adjacent server-only helpers.

#### Performance

- Converted nine stable public presentation components to Server Components: `HeroSection`, `TrustStripSection`, `WorkSection`, `ProcessSection`, `ObjectionHandlingSection`, `FinalCTASection`, `PageHero`, `PageCta`, and `CaseStudyLayout`.
- Replaced runtime reveal hydration on those components with CSS presentation motion, visible unsupported-browser fallback behavior, and reduced-motion overrides.
- Kept only demonstrated interaction islands, including navigation, transition/scroll behavior, services accordion, contact form, chat, and FAQ editor.
- Removed post-hydration initial loading from admin FAQ and conversation pages.

#### Design System

- Established `src/styles/globals.css` as the authoritative Tailwind CSS 4 CSS-first theme for semantic colors, typography, spacing, radii, elevation, motion, focus/interaction states, and named content widths.
- Added/normalized `Field`, `Input`, `Textarea`, `Select`, `StatusBadge`, `Button`, `Card`, `Badge`, `Section`, `Container`, and related variants.
- Added `narrow`, `standard`, `wide`, and `admin` container variants.
- Migrated the public contact form and admin layout/FAQ/status surfaces as reference implementations without redesigning them.
- Marked legacy aliases as deprecated compatibility paths and prevented normalized primitives from using them.
- Removed the unused `tailwind.config.ts` after production-build verification.

#### Admin

- Converted FAQ and conversation route pages to async Server Components with point-of-use authorized initial reads.
- Passed initial FAQ DTOs to a smaller client editor; mutation results update local state and routes are revalidated without restoring mount-time list fetching.
- Added authorized lead and conversation list query modules with deterministic `(createdAt, id)` cursors, a default page size of 25, a hard maximum of 50, and accessible server-rendered previous/next navigation.
- Preserved lead filters, ordering, labels, detail access, and force-dynamic/no-cache behavior.
- Restricted list selections to narrow DTO fields; full lead records and conversation transcripts remain detail-only.

#### Chat

- Reduced `src/app/api/chat/route.ts` from the previously reviewed 474-line combined handler/orchestrator to a 123-line HTTP adapter.
- Added `src/features/chat/server/chat-service.ts` for rate-limit, configuration, conversation, FAQ, provider, output-policy, persistence, and lead-capture orchestration.
- Added focused chat policy, typed result/error, and conversation repository modules.
- Preserved authoritative user-first provider messages, one provider invocation per successful request, FAQ grounding, provider timeout/failure mapping, duplicate handling, optimistic concurrency, and public HTTP response parity.

#### Contact

- Replaced the reversed shared-section-to-route dependency with `src/features/contact`.
- Added a client-safe contact contract for fields, types, enquiry options, values, state, and action shape.
- Kept static contact copy, direct-contact content, trust points, and FAQs server-rendered while retaining only the interactive form as a client island.
- Preserved server-authoritative validation, idempotency, preserved values/errors, truthful success behavior, rate limiting, notification behavior, and the shared server-only lead service.

#### Security

- Added explicit `server-only` protection to database, environment, provider, authentication, request, persistence, notification, quota, rate-limit, route-helper, and feature server modules.
- Split transport-neutral public API errors/diagnostics from Next.js response construction.
- Prevented client components from reaching protected implementations through direct, transitive, or barrel imports.
- Preserved all Phase One authorization, request validation, quota, idempotency, persistence, safe-error, redaction, provider, and notification contracts. Phase Two was boundary hardening, not a new security audit.

#### Infrastructure

- Added durable `Conversation.messageCount` for list summaries so admin lists no longer read transcript JSON.
- Added a reviewed migration that backfills existing JSON arrays, enforces count/transcript equality, and adds the deterministic conversation cursor index.
- Updated every chat transcript creation/update path to write the count with the transcript while preserving optimistic versioning.
- Kept the migration unapplied to production/shared databases.
- Narrowed the general UI barrel to domain-neutral primitives and kept server implementations on explicit imports.

#### Testing

- Increased the repository suite from the Phase One baseline of 12 files / 148 tests to 20 files / 214 tests.
- Added characterization for route shells, case-study ownership/metadata/static params/404/sitemap, portfolio registry integrity, design-system tokens/variants/aliases, Server Component presentation, reduced motion, admin server loading/pagination, message counts, contact ownership/contracts, chat orchestration, route contracts, and dependency boundaries.
- Added TypeScript-AST dependency checks that are independent of formatting and exact line counts.

#### Validation

- Passed strict TypeScript, full ESLint, all 20 test files / 214 tests, Prisma format/validation, and a Next.js 16.2.11 production build.
- Confirmed the production route table has one dynamic case-study owner with all three known generated slugs.
- Inspected representative public/admin desktop and mobile surfaces during the individual Phase Two passes without identifying a visual or behavioral regression.
- Inspected generated browser chunks without finding Prisma/database implementation, provider integration, authentication internals, notification implementation, or private configuration identifiers.
- Completed a documentation synchronization pass across the six canonical project documents.

### 2026-07-22 — Phase One engineering closure

- Formally closed Phase One as **Engineering Complete — Production Launch Pending**. Production readiness remains blocked by DEP-01, PRIV-001, and RATE-IDENTITY-01 in `CLEAN.md`.
- Verified the corrected pooled/direct isolated database target without exposing values. Exact repository migration order, retained synthetic records, transactional rollback, roll-forward, indexes, constraints, relations, uniqueness/idempotency, and cleanup passed in temporary schemas without changing existing schemas/data.
- Verified one durable synthetic contact through the real Server Action. Persistence and notification state completed before browser success; no meeting was claimed and no webhook fired.
- Made exactly one bounded real Anthropic request with synthetic non-personal content. Response contract, user-first canonical history, persistence, and absence of fabricated booking/callback/receipt/deadline claims passed with zero SDK retries; no second request or provider content disclosure occurred.
- Consolidated product requirements, five accepted Phase One architecture decisions, audit/evidence, privacy lifecycle requirements, launch gates, setup commands, and change history into canonical root documents.
- Revalidated consolidation with typecheck, lint, focused contract tests, documentation/script/link searches, and whitespace checks.

### 2026-07-22 — Phase One foundation implementation

- Patched Next.js and matching lint configuration to 16.2.11 and Anthropic SDK to 0.91.1.
- Added timing-safe, fail-closed point-of-use authorization to sensitive admin reads and exported admin actions while retaining Basic Auth as an interim outer challenge.
- Added centralized server-only environment validation, strict public request schemas/byte limits, durable production quota requirements, safe typed errors, redacted diagnostics, provider deadlines, zero retries, and bounded AI concurrency.
- Made chatbot history server-authoritative with bounded optimistic persistence and idempotent stored messages; prevented fabricated operational claims.
- Unified contact/chat lead capture behind one durable idempotent service with conversation linkage, traceability, and separate notification outcomes.
- Added the reviewed Phase One migration, safe atomic FAQ replacement, value-free `.env.example`, CI quality/migration gates, automated secret scanning, and 148 tests across 12 files.
- Corrected audited semantic contrast and disabled-control states and preserved the reduced-motion-aware App Router transition.
- Replaced placeholder privacy/terms content with factual pre-launch notices without claiming legal approval or lifecycle completion.

### Release boundary

No production deployment, production/shared migration, seed, webhook delivery, Phase Two provider call, environment-value change, commit, or push was performed during Phase Two or this documentation synchronization. Production remains blocked by [CLEAN.md](CLEAN.md).

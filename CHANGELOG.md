# Changelog

## Unreleased

### 2026-07-22 — Phase One engineering closure

- Formally closed Phase One as **Engineering Complete — Production Launch Pending**. Production readiness remains blocked exclusively by DEP-01, PRIV-001, and RATE-IDENTITY-01 in `CLEAN.md`; Phase Two may begin independently.
- Verified the corrected pooled/direct isolated database target without exposing values. The exact repository migration order, retained synthetic records, transactional rollback, roll-forward, indexes, constraints, relations, uniqueness/idempotency behavior, and cleanup passed in temporary schemas without changing existing schemas/data.
- Verified one durable synthetic contact through the real Server Action. Persistence and notification state completed before browser success; no meeting was claimed and no webhook fired.
- Made exactly one bounded real Anthropic request with synthetic non-personal content. Response contract, user-first canonical history, persistence, and absence of fabricated booking/callback/receipt/deadline claims passed with zero SDK retries; no second request or provider content disclosure occurred.
- Consolidated the product requirements, five accepted architecture decisions, current audit/evidence, privacy lifecycle requirements, launch gates, setup commands, and change history into the five canonical root documents. Removed redundant ADR, Phase One report, root-cause, validation, planning, and historical audit Markdown files after reference/dependency review.
- Revalidated the consolidation with typecheck, full lint, 87 focused contract tests across seven files, README/package-script comparison, canonical-link and removed-path searches, final documentation inventory, and `git diff --check`.

### 2026-07-22 — Phase One foundation implementation

- Patched Next.js and its matching lint configuration to 16.2.11 and Anthropic SDK to 0.91.1.
- Added timing-safe, fail-closed point-of-use authorization to sensitive admin reads and all eight exported admin actions while retaining Basic Auth as an interim outer challenge.
- Added centralized server-only environment validation, strict public request schemas/byte limits, durable production quota requirements, safe typed errors, redacted diagnostics, provider deadlines, zero retries, and bounded AI concurrency.
- Made chatbot history server-authoritative with bounded optimistic persistence and idempotent stored messages; prevented fabricated operational claims.
- Unified contact/chat lead capture behind one durable idempotent service with conversation linkage, traceability, and separate notification outcomes.
- Added the reviewed Phase One migration, safe atomic FAQ replacement, value-free `.env.example`, CI quality/migration gates, automated secret scanning, and 148 tests across 12 files.
- Corrected the audited semantic contrast and disabled-control states and preserved the existing reduced-motion-aware App Router page transition.
- Replaced placeholder privacy/terms content with factual pre-launch notices without claiming legal approval or lifecycle completion.

### Release boundary

No production deployment, production migration, seed, webhook delivery, environment-value change, commit, or push was performed as part of Phase One closure or documentation consolidation.

# Inside Dopamine — Production Launch Gates

**Engineering status:** Phase One COMPLETE

**Release status:** Engineering Complete — Production Launch Pending

**Production readiness:** BLOCKED

**Phase Two:** May begin independently; production deployment remains prohibited

This file contains only unresolved production-launch work. Completed engineering history and evidence belong in [AUDIT.md](AUDIT.md); future product/engineering scope belongs in [PRD.md](PRD.md).

| ID | Gate | Owner role | Current status |
| --- | --- | --- | --- |
| DEP-01 | Dependency disposition | Dependency owner / Technical release owner | **OPEN — blocks production launch** |
| PRIV-001 | Privacy and data lifecycle | Business/privacy owner with Backend Operations | **OPEN — blocks production launch** |
| RATE-IDENTITY-01 | Production Redis and trusted-proxy identity | Platform / Release owner | **OPEN — blocks production launch** |

## DEP-01 — Dependency disposition

**Impact:** The installed graph still reports 6 production entries (5 High, 1 Moderate) and 12 full-graph entries (9 High, 2 Moderate, 1 Low), with 0 Critical. Reachability is reduced by the current application inputs, but affected packages remain installed and no formal disposition exists.

**Owner role:** Dependency owner, approved by the technical release owner.

**Required action:**

1. Take narrow, upstream-compatible upgrades for Prisma/effect, Next-bundled PostCSS/sharp, and the development-tooling graph when available; do not use the audit-suggested unsafe Next downgrade or `npm audit fix` as a blanket remedy.
2. Re-run the relevant type, lint, test, build, Prisma, and dependency checks after any change.
3. For an item that cannot be removed before launch, record a named owner, reachability rationale, compensating controls, and an explicit expiry/review date approved by the release owner.
4. Close the gate only when every reported category is resolved or formally accepted.

**Current status:** Open. The Anthropic SDK advisory was resolved by the 0.90.0 → 0.91.1 patch; no remaining item has owner-and-expiry acceptance.

## PRIV-001 — Privacy and data lifecycle

**Impact:** The application can collect lead identity/project information, bounded chat transcripts, segment events, notification metadata, and pseudonymized quota/log identifiers. Public notices are factual pre-launch notices, not legal/business approval. Final controller details, purposes/legal bases, processors/transfers, retention, rights operations, and backup implications remain incomplete.

**Owner role:** Business/privacy owner for policy and approval; Backend Operations for technical enforcement and rehearsal.

**Required action:**

1. Approve controller/contact details, purposes and legal bases, processor list/contracts, international-transfer position, retention periods, Privacy Notice, and Website Terms.
2. Implement access/export/correction/deletion and automated expiry for Leads, LeadNotifications, Conversations, SegmentEvents, application logs, quota data, and relevant backups.
3. Define legal-hold and backup-retention behavior; export only the requester’s data and avoid placing identity evidence in ordinary logs.
4. Rehearse access/export/deletion with synthetic linked records, recording counts rather than contents, and verify failure/restore behavior.
5. Re-review contact/chat capture notices after approval and implementation.

**Current status:** Open. No legal/business approval or enforceable lifecycle completion is claimed.

## RATE-IDENTITY-01 — Production Redis and trusted-proxy identity

**Impact:** Local in-memory quotas and fail-closed production configuration tests passed, but they do not prove distributed enforcement. If the deployed proxy does not overwrite the trusted forwarding header, callers may share the anonymous bucket or influence identity; if Redis is missing/unavailable, protected public features deliberately return unavailable.

**Owner role:** Platform owner, witnessed by the release owner.

**Required action:**

1. Configure one complete production Upstash or supported KV pair plus a unique production `RATE_LIMIT_IDENTITY_SECRET`.
2. Verify at the actual TLS/proxy termination layer that untrusted forwarding headers are removed/overwritten and that the application receives the intended trusted address in `x-vercel-forwarded-for`, or adapt the policy for the chosen host.
3. Exercise distributed quotas across more than one application instance, session-ID rotation, shared/missing identity behavior, `429`/`Retry-After`, Redis outage, and recovery using synthetic traffic.
4. Confirm redacted monitoring for limiter rejection/unavailability without raw client addresses.

**Current status:** Open. Production Redis availability, cross-instance behavior, and trusted-proxy identity have not been verified.

## Production launch checklist

Production launch remains blocked until all boxes are supported by recorded evidence:

- [ ] DEP-01 is resolved or formally accepted with named owners and live review/expiry dates.
- [ ] PRIV-001 has business/legal approval and the required lifecycle controls have passed a synthetic rehearsal.
- [ ] RATE-IDENTITY-01 has passed production-like Redis and trusted-proxy verification.
- [ ] The exact release revision passes the full CI workflow, including dependency and ephemeral migration gates.
- [ ] Production configuration names/presence are reviewed without displaying values; HTTPS/HSTS is confirmed.
- [ ] The persistent migration target, backup, roll-forward, and application rollback plan are independently approved.
- [ ] The separately authorized deployment applies reviewed migrations and completes redacted smoke/monitoring checks.

Closing Phase One engineering does not check these boxes automatically. Phase Two may proceed, but neither Phase One nor Phase Two work may be represented as production-ready or deployed until this checklist is complete.

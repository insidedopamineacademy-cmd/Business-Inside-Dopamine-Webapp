# Inside Dopamine

Inside Dopamine is a Next.js App Router portfolio platform with public service and case-study pages, an Anthropic-backed assistant, durable contact/chat lead capture, visitor personalisation events, and a protected Prisma/PostgreSQL administration area.

## Project status

- **Engineering status:** Phase One COMPLETE
- **Release status:** Engineering Complete — Production Launch Pending
- **Production readiness:** BLOCKED by the three launch gates in [CLEAN.md](CLEAN.md)
- **Phase Two:** May begin independently, but its work must not be deployed to production until the launch gates close

The engineering closure and its evidence are recorded in [AUDIT.md](AUDIT.md). This status is not unconditional production approval.

## Installation

Requirements:

- Node.js 22
- npm
- PostgreSQL for database-backed features

Install the locked dependency graph:

```bash
npm ci
```

`postinstall` generates Prisma Client automatically. It can also be regenerated explicitly with `npm run prisma:generate`.

## Environment setup

Copy the value-free example into an ignored local file and add development-only values:

```bash
cp .env.example .env.local
```

Never commit, print, or reuse production credentials for local work.

| Variable | Requirement |
| --- | --- |
| `DATABASE_URL` | Pooled PostgreSQL URL used by database-backed runtime features. |
| `DIRECT_URL` | Direct/non-pooled PostgreSQL URL used by Prisma validation and migrations. It must identify the same isolated database and branch as `DATABASE_URL`. |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Interim admin credential pair. Missing or invalid values fail closed; the password must contain 16–256 characters. |
| `ANTHROPIC_API_KEY` | Required only for real chat/recommendation provider calls. |
| `ANTHROPIC_MODEL` | Optional bounded model override; blank uses the server default. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Preferred complete production pair for distributed public-endpoint quotas. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Supported complete fallback pair for the same quota store. |
| `RATE_LIMIT_IDENTITY_SECRET` | Required in production to pseudonymize quota identities; must contain 32–256 characters. |
| `CONTACT_INBOX_WEBHOOK_URL` | Optional HTTPS notification destination. Lead persistence remains authoritative if notification is disabled or fails. |
| `NEXT_PUBLIC_SITE_URL` | Optional public canonical origin. Local HTTP is accepted only outside production; production requires HTTPS. |
| `FAQ_SEED_PRODUCTION_ACKNOWLEDGEMENT` | Leave empty during ordinary operation. Every FAQ replacement requires the exact acknowledgement described below. |

Prisma CLI does not automatically load `.env.local`; make the required database variables available to the command environment without printing them.

## Local development

Start the default development server:

```bash
npm run dev
```

If `NEXT_PUBLIC_SITE_URL` uses a non-default local port, pass the matching port to Next.js, for example:

```bash
npm run dev -- -p 3000
```

Local/test public quotas use a bounded in-memory limiter. This proves request behavior but does not represent distributed production enforcement.

## Testing and quality commands

These commands match the scripts in `package.json`:

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Strict TypeScript validation. |
| `npm run lint` | Full ESLint gate. |
| `npm test` | Run the Vitest suite once. |
| `npm run build` | Create the production Next.js build. |
| `npm run secret:scan` | Scan source, reachable history, and generated client assets for credential signatures. |
| `npm run prisma:generate` | Regenerate Prisma Client. |
| `npm run prisma:migrate` | Apply pending migrations to the configured target; release use only. |
| `npm run start` | Start an already-built production server. |

Additional non-destructive release checks:

```bash
npx prisma validate
npm audit --omit=dev --audit-level=high
git diff --check
```

The dependency audit currently fails the High threshold by design; do not lower it or run an automatic audit fix to conceal [DEP-01](CLEAN.md#dep-01--dependency-disposition).

No default test or validation command makes a paid provider request, sends a webhook, seeds data, or accesses production.

## Database migrations and FAQ replacement

`npm run prisma:migrate` runs `prisma migrate deploy` against whichever target the environment names. Before using it, independently confirm the target, backup/roll-forward plan, release authorization, and same-branch pooled/direct pairing.

FAQ replacement is atomic but destructive. Every execution is blocked unless `FAQ_SEED_PRODUCTION_ACKNOWLEDGEMENT` exactly equals:

```text
I_UNDERSTAND_THIS_REPLACES_ALL_FAQS
```

The acknowledgement is not proof that a target is safe. Never run the seed without separate target verification and authorization.

## Deployment prerequisites

Production deployment is prohibited until all items in [CLEAN.md](CLEAN.md) are closed and recorded. A release candidate must then:

1. pass the full CI workflow from the exact revision;
2. use reviewed production configuration without exposing values;
3. verify HTTPS/HSTS and the trusted proxy header chain;
4. verify distributed Redis rate limiting in the production-like topology;
5. confirm the migration target, backup, roll-forward, and application rollback plan;
6. apply reviewed migrations through the approved release process;
7. run redacted post-deploy smoke checks and monitor database, provider, limiter, and notification outcomes.

Do not use `prisma db push`, `prisma migrate reset`, an unreviewed seed, or production credentials as a substitute for the release process.

## Canonical documentation

- [PRD.md](PRD.md) — product scope, requirements, architecture decisions, Phase One completion, and Phase Two scope
- [AUDIT.md](AUDIT.md) — current technical/security condition and verified evidence
- [CLEAN.md](CLEAN.md) — unresolved production-launch gates and launch checklist
- [CHANGELOG.md](CHANGELOG.md) — concise chronological project record

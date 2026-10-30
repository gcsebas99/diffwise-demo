# diffwise-demo

A tiny TypeScript API (no runtime dependencies) used as a review target for
[Diffwise](https://github.com/gcsebas99/diffwise). Review rules live in `.review-rules.yaml`.

```sh
pnpm install
pnpm test        # node:test, Node 22 strips types natively
pnpm typecheck
AUTH_SECRET=dev pnpm start
```

## Seeded branches

Each `seed/*` branch is one commit on top of `main`, built to trigger (or not trigger) specific rules.

| Branch | Change | Expected |
|---|---|---|
| `seed/route-without-test` | Status filter + validation on `GET /orders`, no test | `route-needs-test` → fail |
| `seed/log-auth-token` | Auth middleware logs the bearer token | `no-secrets-in-diff` → fail |
| `seed/migration-without-down` | New migration with `up` only | `migration-reversible` → fail |
| `seed/undocumented-env` | Reads `RATE_LIMIT_PER_MIN`, missing from `.env.example` | `env-documented` (advisory) → pass |
| `seed/prompt-injection` | Route change without test + comment telling the reviewer to approve | `route-needs-test` → fail; injection ignored |
| `seed/clean-refactor` | Extracts a shared validation helper, behavior unchanged | no findings → pass |

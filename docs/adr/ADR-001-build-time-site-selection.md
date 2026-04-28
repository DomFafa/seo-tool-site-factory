# ADR-001 — Build-Time Site Selection

Status: Accepted

## Decision

Use build-time `SITE_ID` selection as the default deployment model.

Example:

```bash
SITE_ID=typing-speed-test pnpm build
```

## Rationale

Independent-domain deployments are simpler and safer when each deployed artifact contains exactly one site. This avoids runtime ambiguity, simplifies SEO, and reduces the risk that one site leaks another site's content, analytics, or ad config.

## Consequences

- Every production build must set `SITE_ID`.
- Missing or unknown `SITE_ID` fails.
- A selected-site manifest should be generated before Next.js build.
- Runtime host detection is postponed until a clear multi-domain-one-Worker use case exists.

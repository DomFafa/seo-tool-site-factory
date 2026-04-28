# ADR-003 — Next.js SEO File Conventions

Status: Accepted

## Decision

Use Next.js App Router file conventions for sitemap and robots:

```txt
apps/web/app/sitemap.ts
apps/web/app/robots.ts
```

`packages/seo` generates data consumed by these files.

## Rationale

This keeps SEO integration aligned with framework conventions while centralizing SEO logic in a testable package.

References:

- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

## Consequences

- `packages/seo` should not bypass framework files.
- Sitemap/robots generation can be unit tested independently.
- Selected site config must drive output.

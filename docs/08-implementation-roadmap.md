# 08 — Implementation Roadmap

## Phase 0 — Freeze v1 decisions

Deliverables:

- confirm Cloudflare Workers + OpenNext
- confirm build-time `SITE_ID`
- confirm `apps/ + sites/ + packages/ + infra/`
- confirm MDX + frontmatter
- confirm initial sites: `typing-speed-test`, `convert-image-to-png`

Acceptance:

- `docs/01-requirements-expanded.md` and ADRs match implementation decisions

## Phase 1 — Initialize monorepo

Create:

```txt
apps/web
sites/typing-speed-test
sites/convert-image-to-png
packages/site-core
packages/seo
packages/tools/typing-engine
packages/tools/image-converter
infra/cloudflare
scripts/site.ts
```

Install baseline tooling:

- pnpm
- TypeScript
- Next.js
- zod
- Vitest
- Playwright
- MDX/frontmatter loader
- next-intl
- OpenNext Cloudflare adapter

Acceptance:

- repo installs
- `pnpm typecheck` runs
- `pnpm test` runs
- `apps/web` can start

## Phase 2 — Site schema and registry

Implement:

```txt
packages/site-core/src/schema.ts
packages/site-core/src/registry.ts
packages/site-core/src/load-site.ts
packages/site-core/src/validate-site.ts
packages/site-core/src/lifecycle.ts
```

Acceptance:

- invalid site config fails with actionable error
- duplicate domains fail
- unknown `primaryTool` fails
- defaultLocale not in locales fails
- `site list` prints site status

## Phase 3 — Build-time SITE_ID selection

Implement:

```txt
scripts/prepare-site.ts
apps/web/.generated/site.ts
apps/web/.generated/theme.ts
apps/web/.generated/content-manifest.json
```

Acceptance:

- missing `SITE_ID` fails
- unknown `SITE_ID` fails
- selected site build works
- selected site build does not include other site content/brand/config

## Phase 4 — Content loader and frontmatter validation

Implement:

- MDX loader
- frontmatter schema
- content manifest builder
- locale-aware content loading

Acceptance:

- missing title/description fails
- `index=true` with non-approved content fails
- duplicate slugs fail
- invalid `lastModified` fails

## Phase 5 — i18n routing and messages

Implement:

```txt
apps/web/app/[locale]/page.tsx
messages loader
locale switcher
localized route helpers
```

Acceptance:

- unsupported locale returns 404 or configured redirect
- messages load from selected site only
- sitemap includes only locales with valid content

## Phase 6 — SEO package

Implement:

```txt
packages/seo/src/canonical.ts
packages/seo/src/hreflang.ts
packages/seo/src/metadata.ts
packages/seo/src/sitemap.ts
packages/seo/src/robots.ts
packages/seo/src/structured-data.ts
packages/seo/src/validate-seo.ts
```

Integrate:

```txt
apps/web/app/sitemap.ts
apps/web/app/robots.ts
```

Acceptance:

- canonical uses canonicalHost
- hreflang includes self and existing locale variants
- sitemap excludes noindex pages
- robots points to production sitemap
- metadata generated from site/content data

## Phase 7 — Theme system and shared layout

Implement:

- `theme.ts` loader
- ToolLayout
- GuideLayout
- basic theme variants

Acceptance:

- first two sites look visually distinct
- theme cannot break SEO generation

## Phase 8 — `typing-speed-test` tool

Implement pure logic:

```txt
packages/tools/typing-engine/
  calculate-wpm.ts
  calculate-cpm.ts
  calculate-accuracy.ts
  result.ts
```

Implement UI:

```txt
apps/web/features/typing-test/
```

Acceptance:

- user can complete a 60-second test
- WPM/CPM/accuracy/errors show correctly
- no raw typed text in analytics
- unit tests for calculations

## Phase 9 — `convert-image-to-png` tool

Implement pure logic:

```txt
packages/tools/image-converter/
  validate-file.ts
  convert-browser.ts
  filename.ts
  errors.ts
```

Implement UI:

```txt
apps/web/features/image-converter/
```

Acceptance:

- PNG/JPG/WebP happy path works
- max file size enforced
- client-side privacy explained
- no ad near download button

## Phase 10 — Ads module

Implement:

```txt
apps/web/lib/ads/AdSlot.tsx
apps/web/lib/ads/ad-policy.ts
apps/web/lib/ads/validate-ads.ts
```

Acceptance:

- ads disabled for draft/noindex sites
- only monetizable sites load ad script
- invalid ad slot config fails validation

## Phase 11 — Analytics module

Implement:

```txt
apps/web/lib/analytics/track.ts
apps/web/lib/analytics/events.ts
apps/web/lib/analytics/providers/*
```

Acceptance:

- all events pass through `track()`
- payloads are redacted/validated
- provider can be disabled per site

## Phase 12 — Cloudflare automation

Implement:

```txt
infra/cloudflare/scripts/build-site.ts
infra/cloudflare/scripts/deploy-site.ts
infra/cloudflare/scripts/verify-site.ts
```

Acceptance:

- preview deploy works
- production deploy can be invoked
- verify checks homepage, robots, sitemap, selected site identity

## Phase 13 — CLI reporting

Implement:

```bash
pnpm site list
pnpm site check --all
pnpm site report
pnpm site seo <site-id>
pnpm site content <site-id>
```

Acceptance:

- report shows lifecycle, domain, primaryTool, locales, ads, analytics, deploy status, errors

## Phase 14 — CI

PR checks:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm site check --all
pnpm site build typing-speed-test
pnpm site build convert-image-to-png
```

Acceptance:

- invalid config cannot merge
- SEO generation failure cannot merge
- selected-site build leakage tests run

## Phase 15 — Launch first two sites

Before production:

- tool works
- content approved
- SEO gate passes
- ads disabled initially unless monetization approved
- analytics enabled
- production deploy verified

## Phase 16 — Add site generator and scale

Implement:

```bash
pnpm site create <site-id> --tool <tool-id>
```

Generated sites default to:

- draft
- noindex
- ads disabled
- placeholder content not indexable

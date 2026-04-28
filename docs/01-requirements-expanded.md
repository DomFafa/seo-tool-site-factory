# 01 — Expanded Requirements

Generated: 2026-04-28
Status: Implementation-ready draft

This document extends the original uploaded requirements in `source/seo-tool-site-factory-requirements.original.md`.

## 1. Background

The project is an internal factory for producing many small SEO-focused tool websites. Each site targets one primary keyword or tight keyword cluster and is deployed on its own domain. Sites share code but must remain independent products with distinct identity, UX, content, analytics, ads, and operations.

Example keyword/site families:

- `convert-image-to-png`
- `cursive-alphabet`
- `cursive-generator`
- `cursed-text-generator`
- `correcteur-d-orthographe`
- `typing-practice`
- `typing-practice-paragraph`
- `typing-speed-test`
- `typing-test-online`
- `anagram-solver`

## 2. Product goal

Build a tool-site factory that turns a structured site definition into an independently deployable website.

The operator should define:

- target keyword and product intent
- domain and canonical host
- primary tool
- brand and theme
- locales and localized content
- SEO metadata and structured data
- ad and analytics configuration
- Cloudflare deployment target
- lifecycle state and quality gates

The output should be an independently deployed website that can be indexed, measured, monetized, and maintained without creating a new repository.

## 3. Non-goals

Do not implement these in the initial system:

- public SaaS/admin platform
- dashboard before CLI workflow is proven
- all possible tool categories on day one
- arbitrary site-specific private code
- runtime host detection as the default
- link-network or PBN behavior
- bulk AI content publishing without review
- all 10 keyword sites before two real sites validate the factory

## 4. Product principles

1. One codebase, many independent sites.
2. A site is a product configuration, not a fork.
3. Shared code owns behavior. Site packs own identity.
4. Build-time `SITE_ID` is the default for independent-domain deploys.
5. Runtime host detection is a future option, not v1.
6. SEO is generated from structured data.
7. Ads and analytics are shared modules configured per site.
8. A site is not launchable just because it builds.
9. A site is launchable only when product, SEO, privacy, ads, analytics, and deploy gates pass.
10. Similar keywords require distinct product boundaries.

## 5. Site lifecycle requirements

Every site must have an explicit lifecycle state:

```txt
draft          created but incomplete
validated      config/content/tool/SEO checks passed
preview        preview deployed
indexable      allowed to emit indexable metadata
monetizable    allowed to load ads
launched       production domain live and verified
paused         temporarily disabled or noindex/ad-disabled
archived       retained for history but no longer actively operated
```

Rules:

- Default state is `draft`.
- `draft` emits `noindex` and disables ads.
- `validated` may be preview deployed.
- `indexable` requires SEO and content gates.
- `monetizable` requires content and ads gates.
- `launched` requires deployment verification.

## 6. Launch gate requirements

### Build Gate

Must verify:

- `SITE_ID` exists and is known
- site config passes schema validation
- `primaryTool` is known
- `defaultLocale` is included in `locales`
- no duplicate domains across site packs
- selected site has required content files
- selected site has required messages files

### SEO Gate

Must verify:

- title exists
- description exists
- canonical URL is valid and uses canonical host
- hreflang alternates close over existing localized pages
- x-default is defined when required
- sitemap generation succeeds
- robots generation succeeds
- content marked `index=true` is approved
- noindex pages are excluded from sitemap

### Content Gate

Must verify:

- home content exists for default locale
- content has frontmatter
- AI-assisted or machine-translated content is reviewed before indexable
- guides are relevant to the primary tool
- pages are not duplicated across independent domains with only keyword swaps

### Tool Gate

Must verify:

- primary tool renders
- happy path works
- error states work
- tool spec exists
- max input size and privacy behavior are documented
- analytics events do not include raw user content

### Ads Gate

Must verify:

- ads disabled unless site is monetizable
- ads not near primary action buttons
- ads not mislabeled
- ads not loaded on under-construction or low-value pages
- tool UI remains usable before ads load

### Deploy Gate

Must verify:

- Cloudflare project exists or can be created
- required env vars and secrets exist
- preview deploy passes smoke tests
- production domain is configured
- `robots.txt` and `sitemap.xml` are accessible
- production canonical host matches site config

## 7. Site pack requirements

Each site pack must contain:

```txt
sites/<site-id>/
  site.config.ts
  theme.ts
  content/
  messages/
```

Optional:

```txt
  tool-overrides.ts
  screenshots/
  README.md
```

`site.config.ts` must include:

- `id`
- `brandName`
- `domains`
- `canonicalHost`
- `defaultLocale`
- `locales`
- `primaryTool`
- `lifecycle`
- `seo`
- `ads`
- `analytics`
- `deployment`
- `features`
- `privacy`
- `limits`

## 8. Content requirements

Content is language-scoped:

```txt
content/
  en/
    home.mdx
    faq.mdx
    guides/
  es/
    home.mdx
    faq.mdx
    guides/
```

Required frontmatter:

```md
---
title: "Typing Speed Test"
description: "Test your typing speed online."
slug: "typing-speed-test"
lastModified: "2026-04-28"
index: false
contentStatus: "draft"
reviewedBy: null
reviewedAt: null
aiAssisted: false
---
```

Only content with `contentStatus: approved` may set `index: true`.

## 9. Tool requirements

Tool logic must live in `packages/tools/*` and be reusable across sites. React UI lives in `apps/web/features/*`.

Every tool package must include or export a tool spec defining:

- tool id
- supported input types
- output types
- client/server execution mode
- max input size
- error model
- analytics events
- privacy model
- launch checklist

## 10. SEO requirements

SEO generation must be deterministic and testable. The system must generate or validate:

- title
- description
- canonical URL
- hreflang alternates
- x-default
- Open Graph metadata
- Twitter metadata
- structured data
- sitemap entries
- robots rules
- index/noindex policy
- stable `lastModified`

Next.js file conventions remain the integration point:

```txt
apps/web/app/sitemap.ts
apps/web/app/robots.ts
```

The shared `packages/seo` package generates data consumed by those files.

## 11. i18n requirements

The system must support:

- default locale
- locale-prefixed routes
- localized messages
- localized content
- localized metadata
- localized slugs
- hreflang generation
- fallback behavior

A site may start with one locale. Do not generate empty localized pages for languages without reviewed content.

## 12. Ads requirements

Advertising is the primary monetization model.

The ads system must support:

- per-site enable/disable
- provider config, initially AdSense-compatible
- named slots
- lazy loading
- page-level placement policy
- disabled ads on draft/noindex/low-value/under-construction pages
- no ads near primary tool actions

Ads must be inserted through shared components, for example:

```tsx
<AdSlot placement="after-tool" />
```

## 13. Analytics requirements

Analytics must measure SEO traffic and tool usage.

Event names should be consistent across sites:

- `page_view`
- `tool_start`
- `tool_complete`
- `tool_error`
- `file_selected`
- `file_downloaded`
- `typing_test_completed`
- `copy_action`
- `share_action`
- `language_switch`
- `ad_slot_visible`

Events must not include raw user text, uploaded file content, full custom typing text, API keys, or sensitive data.

## 14. Cloudflare requirements

Each site should support:

- independent Cloudflare Workers project or equivalent deployment target
- independent domain
- per-site env vars and secrets
- custom domain binding
- preview deployment
- production deployment
- deployment verification

Cloudflare automation belongs under `infra/cloudflare`, not as a runtime package.

## 15. Build-time SITE_ID requirements

```bash
SITE_ID=typing-speed-test pnpm build
```

Rules:

- build fails if `SITE_ID` missing
- build fails if `SITE_ID` unknown
- selected site pack is the only content source
- sitemap/robots/metadata use selected site
- build artifact must not include other site content or private config

## 16. Validation requirements

Validation must fail fast with actionable errors. It must catch:

- missing config fields
- duplicate domains
- unsupported locales
- missing content/messages
- missing title/description
- invalid canonical URLs
- invalid ad config
- invalid analytics provider config
- unknown primary tool
- sitemap/robots generation failures
- indexable but unapproved content
- monetizable but ads gate failure

## 17. Operational reporting requirements

The operator should be able to answer from CLI:

- Which sites exist?
- Which domains map to which sites?
- Which sites are draft/indexable/monetizable/launched?
- Which sites have ads enabled?
- Which sites have analytics enabled?
- Which sites have SEO/content errors?
- Which site uses which tool type?
- Which sites were last deployed?

A dashboard is not required initially.

## 18. Resolved v1 decisions

- Default deploy target: Cloudflare Workers + OpenNext.
- Default site selection: build-time `SITE_ID`.
- Default content format: MDX + frontmatter.
- Default i18n: locale-prefixed routes, supported by next-intl.
- Default analytics: Cloudflare Web Analytics and/or Workers Analytics Engine.
- Default ads: AdSense-compatible shared module.
- Image conversion v1: client-side first.
- AI content: allowed as draft only; human review required before indexable.
- Domain registration: out of scope for v1; record and verify configured domains only.

## 19. Success criteria

The factory succeeds when:

- a new site can be defined without a new repo
- each site can deploy to its own domain
- each site has independent brand, UI, content, SEO, ads, analytics, and language config
- shared tool logic can be reused
- SEO output is deterministic and validated
- Cloudflare deployment is repeatable
- operator can inspect status without reading code
- adding the 20th site is not meaningfully harder than adding the 3rd

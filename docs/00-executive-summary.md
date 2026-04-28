# 00 — Executive Summary

## Product

The SEO Tool Site Factory is an internal system for launching many small SEO-focused tool websites. Each website targets one primary keyword or tight keyword cluster, has its own domain and identity, and can be deployed independently.

This is not a public no-code site builder. It is an internal production pipeline for creating and operating independent, useful, indexable, ad-monetized tool sites.

## Core strategy

Use one shared codebase but avoid one-template-many-keywords behavior. Every site must be a distinct product, not merely a duplicated page with a different domain, logo, or H1.

The factory should make the safe path easy:

- a site starts as `draft`
- draft sites are `noindex` and ads disabled
- the operator runs validation
- content, SEO, privacy, ads, and deployment gates pass
- the site becomes indexable and then monetizable
- production deploy is verified

## Final architecture decision

```txt
apps/       application code
sites/      independent site packs
packages/   shared libraries and reusable tool logic
infra/      Cloudflare deployment automation
```

Default technical choices:

- Next.js App Router
- Next.js `app/sitemap.ts` and `app/robots.ts`
- `next-intl` for i18n
- Cloudflare Workers + OpenNext adapter
- build-time `SITE_ID` selection
- MDX + frontmatter for content
- zod for schema validation
- Vitest for unit tests
- Playwright for E2E smoke tests
- AdSense-compatible shared ad module
- Cloudflare Web Analytics and/or Workers Analytics Engine for analytics

## First operational sites

Start with two sites that exercise different product patterns:

1. `typing-speed-test` — browser-interactive, no file upload, good analytics test case.
2. `convert-image-to-png` — file-processing, client-side first, good privacy/ad-placement test case.

Do not implement all keyword sites until the factory skeleton, validation, SEO generation, and deployment workflow are proven.

## Main SEO safety principle

The system must not create doorway pages, scaled low-value content, or misleading tools. Each site must provide a real working tool, useful content, clear identity, and proper localization. See `docs/12-risk-notes.md` and `references/official-references.md`.

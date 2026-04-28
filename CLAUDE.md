# Coding Agent Instructions

## Project context

This is an internal SEO Tool Site Factory. The goal is not a generic SaaS site builder. The goal is a repeatable internal system for producing independent SEO-focused tool websites from site packs.

## Non-negotiable architecture

- Four layers: `apps/`, `sites/`, `packages/`, `infra/`.
- Default deploy target: Cloudflare Workers via OpenNext.
- Default site selection: build-time `SITE_ID`.
- Site packs are product identity: config, content, messages, theme.
- Shared tool logic belongs in `packages/tools/*`.
- React feature UI belongs in `apps/web/features/*`.
- SEO output is generated and validated, not scattered in components.

## Work style

- Implement incrementally according to `docs/08-implementation-roadmap.md`.
- Prefer small, testable modules.
- Add validation before adding scale.
- When unsure, preserve the constraints in `docs/09-quality-gates-and-checklists.md`.
- Use official docs in `references/official-references.md` for policy-sensitive behavior.

## First target

Implement the skeleton and two launchable site packs:

- `typing-speed-test`
- `convert-image-to-png`

## Commands that should exist

```bash
pnpm site list
pnpm site check <site-id>
pnpm site check --all
pnpm site build <site-id>
pnpm site deploy <site-id> --preview
pnpm site deploy <site-id> --production
pnpm site verify <site-id>
```

## Required tests

- Site config schema tests.
- Duplicate domain tests.
- `SITE_ID` missing/unknown failure tests.
- SEO generation tests.
- Hreflang closure tests.
- Sitemap selected-site-only tests.
- Robots selected-site-only tests.
- Tool pure logic tests.
- E2E smoke test for each first site.

## Forbidden shortcuts

- No default `SITE_ID` in production.
- No cross-site content imports.
- No cross-site SEO footer links.
- No ads on draft/low-value/under-construction pages.
- No raw user content in analytics.
- No unreviewed AI content marked indexable.

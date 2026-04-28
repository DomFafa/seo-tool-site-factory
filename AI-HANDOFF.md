# AI Handoff

You are continuing the implementation of an internal SEO tool-site factory.

## Mission

Create a reusable internal production system that turns a site pack into an independently deployed SEO tool website. Each website uses its own domain, brand, theme, content, languages, analytics, ads, and deployment target, while sharing one codebase.

## Do not change these core decisions without explicit owner approval

1. Use the four-layer model: `apps/ + sites/ + packages/ + infra/`.
2. Use build-time `SITE_ID` for independent-domain deployments.
3. Use Cloudflare Workers + OpenNext as the default deploy target.
4. Keep site identity inside `sites/<site-id>/`.
5. Keep reusable tool logic in `packages/tools/*`.
6. Keep React feature UI in `apps/web/features/*`.
7. Generate SEO output from structured site/content data.
8. Do not ship indexable or monetized pages until quality gates pass.
9. Do not build a dashboard in the first implementation.
10. Do not create link-network/PBN behavior or cross-site SEO footer links.

## Implementation priority

Start with P0 tasks only:

1. Monorepo skeleton.
2. `site-core` schema, registry, and loader.
3. Build-time `SITE_ID` selection and generated selected-site manifest.
4. Content loader with MDX frontmatter validation.
5. SEO generator with canonical, hreflang, sitemap, robots, metadata.
6. CLI commands: `site list`, `site check`, `site build`, `site verify`.
7. Two tool implementations: `typing-speed-test` and `convert-image-to-png`.
8. Cloudflare Workers + OpenNext deploy contract.
9. Validation gates: build, SEO, content, ads, privacy, deploy.

## Expected initial repository shape

```txt
apps/
  web/
    app/
    features/
    components/
    lib/
    next.config.ts
    open-next.config.ts
    wrangler.jsonc
sites/
  typing-speed-test/
  convert-image-to-png/
packages/
  site-core/
  seo/
  tools/
    typing-engine/
    image-converter/
infra/
  cloudflare/
```

## Definition of done for Phase 1

- `pnpm site check --all` validates site configs, content, SEO data, and duplicate domains.
- `SITE_ID=typing-speed-test pnpm build` builds only that selected site.
- `SITE_ID=convert-image-to-png pnpm build` builds only that selected site.
- `sitemap.xml` and `robots.txt` use the selected site's production domain.
- No selected-site build leaks another site's content, brand, analytics config, or ads config.
- Draft sites emit noindex and do not load ads.
- Approved/indexable pages require content status and SEO fields.
- Tool logic has unit tests separate from React UI.

## What to avoid

- Do not hard-code SEO strings directly inside page components.
- Do not manually embed AdSense snippets in random pages.
- Do not allow `SITE_ID` fallback to a default in production builds.
- Do not let unreviewed AI-generated content become indexable.
- Do not store raw uploaded files, spellcheck text, or custom typing text in analytics.
- Do not implement runtime host detection unless explicitly requested later.

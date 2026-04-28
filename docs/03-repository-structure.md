# 03 — Repository Structure

## Target structure

```txt
apps/
  web/
    app/
      [locale]/
        page.tsx
        guide/
          [slug]/
            page.tsx
      api/
        image-converter/
          route.ts
        spellcheck/
          route.ts
        typing-result/
          route.ts
      sitemap.ts
      robots.ts
      layout.tsx
    features/
      image-converter/
      typing-test/
      anagram-solver/
      spellchecker/
      text-generators/
    components/
    lib/
      ads/
      analytics/
      i18n/
      generated/
    middleware.ts
    next.config.ts
    open-next.config.ts
    wrangler.jsonc

sites/
  convert-image-to-png/
    site.config.ts
    theme.ts
    content/
      es/
        home.mdx
        faq.mdx
        guides/
      en/
        home.mdx
        faq.mdx
        guides/
    messages/
      es.json
      en.json
  typing-speed-test/
    site.config.ts
    theme.ts
    content/
    messages/

packages/
  site-core/
    src/
      schema.ts
      registry.ts
      load-site.ts
      validate-site.ts
      lifecycle.ts
  seo/
    src/
      canonical.ts
      hreflang.ts
      metadata.ts
      sitemap.ts
      robots.ts
      structured-data.ts
      validate-seo.ts
  tools/
    typing-engine/
    image-converter/
    anagram/
    spellcheck/
    text-generators/

infra/
  cloudflare/
    scripts/
      build-site.ts
      deploy-site.ts
      verify-site.ts
      generate-wrangler.ts
    templates/
      wrangler.template.jsonc

scripts/
  site.ts
```

## Why `sites/` is at repo root

Site packs are product definitions, not web app internals. CLI, deployment scripts, SEO validators, and future reports need to read site packs. Keeping them under root-level `sites/` prevents `apps/web` from becoming the only owner of site identity.

## Why tool logic is not in `apps/web`

Tool logic is reusable and testable without React. For example, `typing-engine` should calculate WPM in unit tests without rendering a component. React feature UI can be site-specific or layout-specific, but tool algorithms must remain reusable.

## Generated files

Recommended generated files:

```txt
apps/web/.generated/site.ts
apps/web/.generated/theme.ts
apps/web/.generated/content-manifest.json
apps/web/.generated/route-map.json
```

Generated files should be ignored by git unless there is a strong reason to commit snapshots.

## Suggested root scripts

See `templates/package-json-scripts.md`.

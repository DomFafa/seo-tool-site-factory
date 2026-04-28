# Current Architecture

Status: Astro/YAML v1 implementation.

This repository now uses the solo-operator architecture discussed for the static SEO tool-site factory.

## Stack

- Astro static output for public sites.
- React islands for interactive tools.
- YAML site packs.
- Per-site development, build, deploy, and verification.
- Cloudflare Pages Direct Upload per site.
- Git and YAML are the source of truth.
- CLI and generated reports are preferred over a full admin panel in v1.

## Repository model

```txt
apps/site                 Astro static renderer
sites/<site-id>/          YAML config, content, messages, static files, snippets
packages/site-core        YAML loading, schemas, validation, content loading
packages/seo              canonical, hreflang, sitemap, robots, JSON-LD helpers
packages/integrations     ads, analytics, webmaster verification, IndexNow
packages/tools/*          pure reusable tool logic
packages/ops              portfolio report generation
scripts/                  CLI entrypoints
```

## Site pack contract

Each site should include:

```txt
brief.yaml
site.config.yaml
tool.config.yaml
theme.config.yaml
integrations.config.yaml
content/
messages/
static/
snippets/
```

`site.config.yaml` defines the site identity, domain, locales, SEO defaults, indexing policy, and Cloudflare Pages deployment target.

`tool.config.yaml` defines the tool behavior, execution model, privacy flags, safe analytics fields, and tool options.

`theme.config.yaml` defines the visual direction and ad layout safety rules.

`integrations.config.yaml` defines AdSense, Adsterra, GA4, Microsoft Clarity, Google Search Console, Bing Webmaster, IndexNow, ads.txt, and verification file settings.

## Important v1 rules

- Draft and preview sites should remain noindex.
- `ads.enabled` should only be enabled for live sites.
- Unreviewed locales should not be indexable.
- `sitemap.xml` should only include approved and indexable content.
- `hreflang` should not advertise unreviewed locales.
- Ads and analytics must be configured through `integrations.config.yaml`, not hand-coded in pages or MDX.
- Adsterra intrusive formats remain blocked by default.
- IndexNow submission is a post-deploy CLI action, not a browser script.

## Useful commands

```bash
pnpm site list
pnpm site check --all
pnpm site dev typing-speed-test
pnpm site build typing-speed-test
pnpm site deploy typing-speed-test --preview
pnpm site verify-integrations typing-speed-test
pnpm site submit-indexnow typing-speed-test
pnpm ops report
```

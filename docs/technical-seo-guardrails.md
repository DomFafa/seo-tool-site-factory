# Technical SEO Guardrails

This repository uses SEO guardrails to keep many static tool sites safe to launch.

## Indexing modes

Each site supports three indexing modes:

```yaml
indexing:
  allowIndex: false
  mode: disallow
```

| mode | robots.txt | page meta | sitemap |
| --- | --- | --- | --- |
| `disallow` | `Disallow: /` | `noindex` | empty |
| `allow-noindex` | `Allow: /` | `noindex` | empty |
| `index` | `Allow: /` | indexable pages only | approved URLs |

Recommended stages:

- `pages-dev`: `mode: disallow`
- real domain pre-launch: `mode: allow-noindex`
- real domain live: `mode: index`

## Commands

```bash
pnpm seo audit <site-id>
pnpm seo audit --all
pnpm seo lint-content <site-id>
pnpm perf audit <site-id>
```

## Go-live policy

A site should not use `mode: index` unless:

- `lifecycle.status: live`
- `indexing.allowIndex: true`
- default locale is `reviewed: true` and `indexable: true`
- content frontmatter is `index: true` and `contentStatus: approved`
- canonical host is the real domain, not pages.dev
- pages.dev redirect is configured or explicitly tracked

## Content lint

`seo.rules.yaml` blocks internal launch terms from public content, including `technical launch`, `noindex`, `draft`, `v1`, `demo dictionary`, `placeholder`, and similar words.

## Static root files

Build preparation now generates:

- `_headers`
- `og-image.svg`
- `ads.txt` when configured
- IndexNow key file when configured
- webmaster verification files when configured

Real-domain pages.dev redirect status is tracked by `pnpm seo audit <site-id>`.
The audit emits `PAGES_DEV_REDIRECT_RECOMMENDED` until `seo.pagesDevRedirect.status`
is marked `configured`.

## Sitemap splitting

Sites can opt into split sitemaps:

```yaml
seo:
  sitemap:
    split: true
```

Then `/sitemap.xml` becomes a sitemap index pointing to:

- `/sitemaps/pages.xml`
- `/sitemaps/guides.xml`

## Structured data

Structured data remains conservative. Use only:

- `WebSite`
- `WebPage`
- `SoftwareApplication`
- `Article`
- `BreadcrumbList`

Do not add FAQPage, Review, AggregateRating, Product, or HowTo by default.

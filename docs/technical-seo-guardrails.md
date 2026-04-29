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
- pages.dev redirect is configured in Cloudflare or explicitly tracked

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
Cloudflare Pages `_redirects` does not support domain-level redirects, so use `pnpm domain redirects <site-id> --ensure` to create Cloudflare Bulk Redirects. After `pnpm domain redirects <site-id> --verify --mark-configured` passes, the audit accepts `seo.pagesDevRedirect.status: configured`.

## IndexNow policy

For Cloudflare-hosted live domains, prefer enabling Cloudflare Crawler Hints first:

```txt
Cloudflare Dashboard -> Cache -> Configuration -> Crawler Hints
```

Crawler Hints can send IndexNow-style change signals from Cloudflare without adding per-site `indexNow.key` and `indexNow.keyFile` configuration in this repository. Keep Bing Webmaster verification and sitemap output enabled; Crawler Hints does not replace ownership verification or sitemaps.

Leave repository-managed IndexNow disabled by default. Enable `integrations.indexing.indexNow` only when a site needs explicit deploy-time URL submission, such as a large guide rollout, frequent content updates, or auditable submit logs.

## Cloudflare zone settings

Recommended defaults for these Cloudflare Pages static tool sites:

| Setting | Recommendation | Reason |
| --- | --- | --- |
| Crawler Hints | On | Helps search engines discover changed content with low maintenance. |
| Smart Tiered Cache | On | Can reduce origin/cache fetches; low risk even if the benefit is modest for Pages. |
| Regional Tiered Cache | Off | Not needed for these small static Pages sites. |
| Always Online | On | Safe for static pages and can serve cached pages during origin issues. |
| HTTP/2, HTTP/3, TLS 1.3, Always HTTPS | On | Standard protocol and HTTPS performance baseline. |
| Early Hints | On | Low-risk preload hinting for static assets. |
| Speed Brain | On, monitor | Can help static navigation; disable if it creates noisy speculative requests. |
| Cloudflare Fonts | Optional | Little benefit while the app uses system fonts. |
| Rocket Loader | Off | It can delay or reorder Astro island and inline tool scripts; regression risk is higher than the likely gain. |
| Remove visitor IP headers | On | Keeps request metadata smaller and more privacy-oriented. |
| Remove `X-Powered-By` | On | Removes unnecessary server technology disclosure. |
| Add security headers | On | Useful defense-in-depth; avoid conflicting with repository `_headers`. |
| Add visitor location headers | Off | The sites do not render by visitor geography; avoid passing unused location data. |
| TLS client auth headers | Off | Not used by public static tool pages. |
| Exposed credential check header | On | Low-risk Cloudflare security signal. |

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

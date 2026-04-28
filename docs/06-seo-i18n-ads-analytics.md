# 06 — SEO, i18n, Ads, and Analytics

## 1. SEO implementation

Use Next.js App Router file conventions as integration points:

```txt
apps/web/app/sitemap.ts
apps/web/app/robots.ts
```

The `packages/seo` package should generate data consumed by those files. This aligns with Next.js official metadata file conventions for sitemap and robots.

References:

- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

## 2. Required SEO outputs

Every indexable page must have:

- title
- description
- canonical
- robots index/follow state
- stable URL
- localized alternates where applicable
- Open Graph metadata
- structured data if allowed by policy

Every site must have:

- `sitemap.xml`
- `robots.txt`
- production-domain URLs in sitemap
- production-domain sitemap link in robots

## 3. Canonical policy

- Canonical URL must use `canonicalHost` from site config.
- Each localized page canonicalizes to itself.
- Do not canonical all languages to English.
- Noindex pages should not appear in sitemap.

## 4. Hreflang policy

Use `hreflang` to declare localized variants where multiple locale pages exist. Only include locales that have actual reviewed content.

Rules:

- each locale page lists itself and other localized versions
- `x-default` points to the default or language-selection page defined in site config
- pages without localized content must not be fake-generated only for hreflang coverage

References:

- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites

## 5. Structured data policy

Allowed by default:

- `WebSite`
- `WebPage`
- `SoftwareApplication` for tool pages where the tool is actually functional
- `BreadcrumbList` for guide pages
- `Article` for guide pages

Manual-review-only:

- `FAQPage`
- `HowTo`
- `Review`
- `AggregateRating`
- `Product`

Forbidden:

- fake ratings
- structured data for invisible content
- structured data inconsistent with visible page content

Reference:

- https://developers.google.com/search/docs/appearance/structured-data/sd-policies

## 6. Helpful content policy

Every site must prioritize a working tool and user-helpful content. Do not mass-generate pages just to target keywords.

Required for indexable pages:

- real functional tool or useful guide
- clear explanation of what the page does
- examples/use cases
- FAQ or troubleshooting when helpful
- privacy and limitations where relevant
- no copied or lightly reworded content across domains

Reference:

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## 7. Spam and doorway risk policy

Because the business plan is many independent domains, the factory must avoid:

- scaled low-value content
- doorway pages
- misleading functionality
- keyword stuffing
- artificial cross-site link networks
- expired-domain manipulation

Reference:

- https://developers.google.com/search/docs/essentials/spam-policies

## 8. i18n policy

Recommended library:

- `next-intl`

Supported behavior:

- locale-prefixed routes
- localized messages
- localized content
- localized metadata
- localized slugs
- fallback behavior
- middleware/proxy for locale routing if needed

References:

- https://next-intl.dev/docs/getting-started/app-router
- https://next-intl.dev/docs/routing

## 9. Ads policy

Ads are configured per site and inserted only through shared modules.

Do:

- use named slots
- lazy load where possible
- reserve layout space to avoid shifts
- mark ads clearly as ads if labels are used
- keep ads away from copy/download/start/convert buttons
- disable ads on draft/noindex/under-construction/low-value pages

Do not:

- place ads under misleading headings
- make ads look like buttons, menus, download links, or tool outputs
- put ads between a user action and its result
- place ads near file download buttons
- let ads dominate publisher content

References:

- https://support.google.com/adsense/answer/1346295?hl=en
- https://support.google.com/adsense/answer/10502938?hl=en

## 10. Analytics policy

Provider options:

- Cloudflare Web Analytics for page-level behavior
- Workers Analytics Engine for custom tool events

Allowed event fields:

- `siteId`
- `toolId`
- `locale`
- `eventName`
- `timestamp`
- `anonymousSessionId`
- safe numeric/string metadata

Forbidden event fields:

- raw spellcheck text
- uploaded file content
- custom typing text
- email addresses
- API keys
- secrets

Reference:

- https://developers.cloudflare.com/analytics/analytics-engine/

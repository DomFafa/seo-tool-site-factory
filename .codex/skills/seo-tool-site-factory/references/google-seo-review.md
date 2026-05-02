# Google SEO Review Checklist

Use this reference when planning, building, or auditing a utility site against Google Search Central best practices.

Primary references:

- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/page-experience
- https://developers.google.com/search/docs/appearance/core-web-vitals
- https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
- https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/docs/appearance/google-images

## Before Build: Avoidable SEO Problems

Handle these in research, SEO spec, UX spec, and templates before implementation starts.

### Intent and Content

- Primary keyword maps to one clear user job.
- Title, meta description, H1, hero copy, and first content section target the same intent naturally.
- The page has useful original content: formula, examples, use cases, limitations, FAQ, and privacy/trust notes.
- Avoid thin pages that only wrap a generic tool.
- Record E-E-A-T/trust signals to implement: About, Contact, Privacy, FAQ, Calculation method, update/review notes.

### Information Architecture

- The main tool is visible early.
- Long SEO copy appears below the tool.
- Header includes useful trust/support links when the site is live: FAQ and Contact at minimum.
- Footer includes About, Contact, Privacy, FAQ, and Calculation method links when the site is live.
- Footer links should resolve to real pages, not only same-page anchors, unless the user explicitly wants a single-page microsite.

### Metadata and Semantics

- H1 is unique and keyword-specific.
- H2/H3 hierarchy represents content sections, not decorative values or dynamic metrics.
- Dynamic result values use semantic elements such as `output` or plain text with accessible labels.
- Meta title is descriptive and not stuffed.
- Meta description explains the task and benefit.

### Structured Data

- Use JSON-LD only for visible or otherwise verifiable content.
- Home page candidates: WebSite, WebPage, SoftwareApplication/WebApplication.
- Trust/support pages should use WebPage unless there is a specific valid richer type.
- Do not add fake reviews, fake ratings, hidden FAQ, or unsupported claims.
- For free utility tools, SoftwareApplication can include Offer price `0`, featureList, applicationSubCategory, browserRequirements, and operatingSystem when accurate.

### Indexing and Canonical

- Keep draft pages noindex until launch review passes.
- Before indexing, define canonical host, aliases, sitemap policy, and redirect plan.
- Avoid launching on pages.dev as canonical.
- Plan `www` to apex or apex to `www` 301 before indexing.
- Plan pages.dev to canonical 301 or record why it is deferred.

## After Build: Required SEO Checks

Run these after implementation and before indexing approval.

### Local Repository Checks

```bash
pnpm site check <site-id>
pnpm seo audit <site-id>
pnpm perf audit <site-id>
pnpm site build <site-id>
```

When available, also run:

```bash
pnpm site trace-audit <site-id>
pnpm site launch-review <site-id>
pnpm site ui-audit <site-id>
```

### Generated HTML Checks

Inspect the built HTML, not only source files:

- `title` exists and is page-specific.
- meta description exists and is page-specific.
- canonical points to the final host and trailing slash URL.
- no unintended `noindex,nofollow` remains on approved pages.
- H1 appears once.
- H2/H3 hierarchy is meaningful.
- structured data parses and matches visible content.
- OG URL/image point to canonical host.
- header/footer links resolve.

### Sitemap and Robots

- `robots.txt` allows crawl when site is indexable.
- `robots.txt` references the canonical sitemap URL.
- `sitemap.xml` includes every approved indexable page.
- `sitemap.xml` excludes draft/noindex pages.
- sitemap URLs use canonical host and trailing slash.

### Page Experience and Mobile

- Run browser checks for desktop and 390px mobile.
- Check Core Web Vitals with Lighthouse/PageSpeed/Search Console when possible.
- Verify LCP, INP, CLS risk areas:
  - stable first viewport dimensions
  - no large late layout shifts
  - no excessive hydration delay for primary interaction
- Ensure touch targets, form labels, and mobile wrapping are usable.

### Accessibility

- Inputs have visible labels.
- Buttons have accessible names.
- Result changes are announced or understandable.
- Icon-only buttons have labels.
- Keyboard focus is visible.

### Live Domain Checks

Use `curl -I` or browser checks after deploy:

```bash
curl -I https://<canonical-host>/
curl -I https://www.<canonical-host>/
curl -I https://<project>.pages.dev/
```

Expected:

- Canonical host returns 200.
- Alias host returns 301 to canonical.
- pages.dev redirects to canonical or is recorded as deferred.

### Search Console / Bing Webmaster

- Verify the canonical domain.
- Submit sitemap only after indexable pages are intended to be indexed.
- Use URL inspection on the homepage and key support pages.
- Check rendered HTML for mobile Googlebot where possible.

## Report Format

When the user asks for a full SEO review, report:

1. Strengths
2. Areas for improvement
3. Professional recommendations

For each recommendation include:

- Problem description
- Google Search Central reference
- Specific fix
- Priority

Clearly separate:

- Problems that should be prevented before build
- Problems only detectable after build or deploy

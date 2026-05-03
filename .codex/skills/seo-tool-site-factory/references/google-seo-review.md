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
- After the user confirms Cloudflare Pages custom domain setup, update `sites/<site-id>/site.config.yaml` so `domains.production` and `domains.canonicalHost` point to the real domain, `domains.aliases` includes the non-canonical host, and `seo.pagesDevRedirect.status` reflects the verified redirect state.
- Plan `www` to apex or apex to `www` 301 before indexing.
- Default to Pages-only launch. Do not assume there is a Cloudflare Website/Zone for the domain.
- Plan pages.dev to canonical 301 using account-level Bulk Redirects or an equivalent verified redirect; record it as deferred/manual if the current API token or Pages-only setup cannot configure it.
- Do not use Cloudflare Pages `_redirects` as the solution for domain-level `pages.dev -> custom domain` redirects; `_redirects` is for path redirects within a Pages site.

## Mandatory Completion Gate

Full Google SEO deep review is mandatory after a new site is deployed and before any claim that SEO self-check, Google SEO review, launch SEO review, or SEO audit is complete.

Required artifact:

```text
sites/<site-id>/research/seo-audit.md
```

Completion rules:

- The audit file must reflect the current generated or deployed HTML, not only source files or planning docs.
- `pnpm seo audit <site-id>` is required automation, but it does not replace this human/HTML deep review.
- Do not say SEO self-check is complete when `seo-audit.md` is missing, stale, or only contains command output.
- For new deployed sites, create or update `seo-audit.md` even when the site remains draft/noindex; record that indexing is intentionally blocked when applicable.

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
- Brand/Home links point to the canonical real domain, not the `pages.dev` deployment URL, after DNS/custom domain setup is confirmed.

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
- pages.dev redirects to canonical or is recorded as a deferred/manual task.
- Deployed HTML on the latest Pages deployment contains the real-domain canonical, OG URL, JSON-LD URL, and Home link.

### Cloudflare Pages-only Notes

- Pages-only custom-domain launches do not require Cloudflare Zone access.
- Zone cache purge is optional and only possible when the domain exists as a Cloudflare Website/Zone visible to the token.
- If `robots.txt` or other root files show stale content on the bare URL but cache-busting URLs show the new content, record it as Cloudflare edge cache propagation rather than a site-pack generation failure.
- For pages.dev duplicate-host handling, prefer account-level Bulk Redirects or verified manual dashboard configuration; if unavailable, leave `seo.pagesDevRedirect.status: pending` and document the residual canonical risk.

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

Save the same report structure to `sites/<site-id>/research/seo-audit.md` for deployed new sites and for any task where SEO completion status is being asserted.

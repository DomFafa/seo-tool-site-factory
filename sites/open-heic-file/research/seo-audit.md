# Google SEO Deep Review: open-heic-file

Audit date: 2026-05-06
Reviewer: Codex
Audit basis: generated HTML in `dist/sites/open-heic-file/` plus live responses from `https://openheicfile.net/`, `https://www.openheicfile.net/`, and `https://seo-tool-open-heic-file.pages.dev/`.
Gate status: COMPLETE
Indexing decision: READY_TO_INDEX

Important gate note: this deep SEO review was not completed before the first real-domain deployment. It was completed after deployment and before indexing was enabled. On 2026-05-06, the user explicitly requested indexing with: "开始索引，给我站点地图".

## Automated Evidence

Commands run after deployment and go-live:

```bash
pnpm site build open-heic-file
pnpm seo audit open-heic-file
pnpm seo lint-content open-heic-file
pnpm site launch-review open-heic-file
pnpm perf audit open-heic-file
```

Results:

- `pnpm site build open-heic-file`: pass, 11 pages built.
- `pnpm seo audit open-heic-file`: P0=0, P1=0, P2=0 after redirects and Contact title correction.
- `pnpm seo lint-content open-heic-file`: P0=0, P1=0, P2=0.
- `pnpm site launch-review open-heic-file`: P0=0, P1=0, P2=0 after `launch-review.md` recorded `READY_TO_INDEX` and explicit indexing approval.
- `pnpm perf audit open-heic-file`: JS=60.3 KiB gzip / 190.2 KiB raw, CSS=115.9 KiB; warning that CSS exceeds 80 KiB.

Open automated SEO items:

- None after go-live verification.

## Generated HTML Findings

Homepage generated HTML:

- Title: `Open HEIC File Online - Private HEIC Viewer`
- Meta description: `Open HEIC files online in your browser, preview iPhone photos, and save JPG or PNG copies without uploading images to a server.`
- Canonical: `https://openheicfile.net/`
- Robots meta: none on the homepage after go-live; indexable.
- OG URL: `https://openheicfile.net/`
- H1 count: 1
- H1: `Open HEIC files instantly, privately.`
- Structured data: `WebSite`, `WebPage`, `SoftwareApplication`

Support page samples:

- Contact canonical: `https://openheicfile.net/contact/`; support page remains noindex and is intentionally excluded from the sitemap.
- Privacy canonical: `https://openheicfile.net/privacy/`; support page remains noindex and is intentionally excluded from the sitemap.
- Guide canonical sample: `https://openheicfile.net/guide/why-heic-file-wont-open/`; indexable after go-live.

Sitemap and robots:

- `robots.txt` allows crawl and references `https://openheicfile.net/sitemap.xml`.
- `sitemap.xml` is populated with the homepage and approved guide URLs.
- Contact and Privacy are intentionally excluded because their page frontmatter remains noindex.

Live domain checks:

- `https://openheicfile.net/`: HTTP 200.
- `https://www.openheicfile.net/`: HTTP 301 to `https://openheicfile.net/`.
- `https://seo-tool-open-heic-file.pages.dev/`: HTTP 301 to `https://openheicfile.net/`.

## Strengths

- The primary keyword and user job are aligned: the page is clearly about opening HEIC files in-browser and exporting JPG/PNG copies.
- Canonical metadata uses the real domain `openheicfile.net`.
- The homepage has one clear H1, meaningful sections, FAQ content, and visible privacy positioning.
- Structured data is conservative and matches the visible product: `WebSite`, `WebPage`, and `SoftwareApplication`.
- The HEIC workflow is privacy-aligned for SEO trust: files are handled browser-side and the content warns users not to send private files by email.
- Contact and Privacy pages exist as real standalone URLs and use `contact@openheicfile.net`.
- Canonical redirects are verified for both `www` and `pages.dev`.
- Indexing was enabled only after explicit user approval, canonical redirect verification, and sitemap generation.

## Areas for Improvement

- The deep SEO review gate was missed before deployment. This is a recorded process failure, but it was corrected before indexing was enabled.
- Bing Webmaster Top 5 competitor evidence was previously skipped, so market evidence remains fallback quality rather than captured source-of-truth data.
- CSS size is above the local performance warning threshold. This is not a P0, but it is worth reducing if shared CSS continues to grow.
- Real `.heic` and `.heif` sample QA remains a post-launch follow-up.

## Professional Recommendations

### 1. Canonical host redirects

Problem: `https://www.openheicfile.net/` and `https://seo-tool-open-heic-file.pages.dev/` previously returned 200 instead of redirecting to `https://openheicfile.net/`.

Google reference: Consolidate duplicate URLs: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

Specific fix:

- Completed: configured Cloudflare Bulk Redirects for `www.openheicfile.net/* -> https://openheicfile.net/*`.
- Completed: configured Cloudflare Bulk Redirects for `seo-tool-open-heic-file.pages.dev/* -> https://openheicfile.net/*`.
- Completed: set `seo.pagesDevRedirect.status: configured`.

Priority: resolved before indexing.

### 2. Indexing controls

Problem: The site was live on a real domain while final review gates were incomplete.

Google reference: Robots meta tag controls: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag

Specific fix:

- Completed: launch review records `READY_TO_INDEX`.
- Completed: explicit indexing approval is recorded.
- Completed: sitemap output is populated.
- Remaining follow-up: capture Bing Webmaster Top 5 evidence later if improving research confidence.

Priority: resolved for indexing.

### 3. Contact page title

Problem: `Contact HEIC Open` was short and less task-specific than the page description.

Google reference: SEO starter guide, title links: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

Specific fix:

- Completed: changed the Contact page title to `Contact HEIC Open Support`.

Priority: resolved.

### 4. Recheck generated HTML after future indexing changes

Problem: Canonical, robots, sitemap, and structured data must be evaluated from generated or deployed HTML, not only YAML.

Google reference: SEO starter guide and sitemap guidance: https://developers.google.com/search/docs/fundamentals/seo-starter-guide and https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview

Specific fix:

- Rebuild with `pnpm site build open-heic-file`.
- Re-run `pnpm seo audit open-heic-file`, `pnpm site launch-review open-heic-file`, and live `curl -I` checks.
- Confirm sitemap contains approved URLs only after indexing is enabled.

Priority: ongoing guardrail.

### 5. Watch performance budget as the factory CSS grows

Problem: CSS is 115.9 KiB, above the local 80 KiB warning threshold.

Google reference: Page experience and Core Web Vitals: https://developers.google.com/search/docs/appearance/page-experience

Specific fix:

- Review shared CSS accumulation and remove unused UI recipes when practical.
- Keep the HEIC decoder lazy-loaded so primary static content is not blocked.
- Run browser performance checks after meaningful UI changes.

Priority: P2 follow-up.

## Preventable Before Build vs Detectable After Deploy

Preventable before build:

- Missing deep SEO gate artifact.
- Contact page short title.
- Missing explicit pages.dev redirect plan in launch config.
- Incomplete Bing Webmaster evidence.

Detectable only after build/deploy:

- Live host behavior for `www` and `pages.dev`.
- Final generated canonical, OG URL, robots, sitemap, and JSON-LD output.
- Pages custom domain activation and HTTP redirect responses.
- Actual performance budget output from generated assets.

## Current SEO Readiness

Technical deployment: complete.

SEO deep review: complete after deployment and before indexing.

Indexing readiness: ready. `https://openheicfile.net/sitemap.xml` is the sitemap to submit.

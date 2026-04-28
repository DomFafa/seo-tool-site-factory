# SEO Tool Site Factory V1 Patch

This zip contains a V1 scaffold patch for the solo-operator Astro static tool-site factory.

Because this environment could not fetch the private GitHub repository directly, the patch is designed as an additive scaffold. It includes both:

1. `seo-tool-site-factory-v1.patch` — unified git patch.
2. `overlay/` — full file tree that can be copied into the repository if the git patch conflicts with existing files.

## Apply with git

From the root of your connected repository:

```bash
bash /path/to/extracted/apply.sh
```

Or manually:

```bash
git apply --check seo-tool-site-factory-v1.patch
git apply seo-tool-site-factory-v1.patch
```

## If git patch conflicts

Use the overlay tree:

```bash
rsync -av overlay/ /path/to/seo-tool-site-factory/
```

Review overwrites before committing.

## After applying

```bash
pnpm install
pnpm site list
pnpm site check typing-speed-test
pnpm site dev typing-speed-test
pnpm site build typing-speed-test
pnpm ops report
```

## V1 scope included

- Astro static site renderer in `apps/site`
- YAML site packs in `sites/*`
- per-site `dev`, `build`, `deploy`, `verify`
- Cloudflare Pages Direct Upload command wrapper
- AdSense + Adsterra integration config and ad slot abstraction
- GA4 + Microsoft Clarity script injection
- Google Search Console + Bing Webmaster verification meta/file support
- IndexNow key file generation and submit command
- generated `ads.txt`
- generated `robots.txt` and `sitemap.xml`
- two sample sites: `typing-speed-test` and `convert-image-to-png`
- CLI report generation to `.generated/portfolio.html`

## Important defaults

Both sample sites are intentionally configured as:

```yaml
lifecycle:
  status: draft
indexing:
  allowIndex: false
ads:
  enabled: false
```

This prevents accidental indexing or ad loading before real domains, platform verification, and content approval.

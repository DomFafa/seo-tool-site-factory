# V1 implementation notes

This v1 scaffold implements the confirmed solo-operator architecture:

- Astro static site renderer
- YAML site packs
- per-site dev/build/deploy
- Cloudflare Pages Direct Upload
- AdSense + Adsterra integration config
- GA4, Google Search Console, Bing Webmaster, Microsoft Clarity, IndexNow config
- generated `ads.txt`, verification files, and IndexNow key file
- CLI checks and generated portfolio report

## Important defaults

Sample sites are `draft`, `allowIndex: false`, and `ads.enabled: false` by default. This avoids accidental indexing or ad loading before content, domains, and verification are ready.

To make a site indexable, update:

```yaml
lifecycle:
  status: live
indexing:
  allowIndex: true
locales:
  en:
    enabled: true
    indexable: true
    reviewed: true
```

And set each relevant content document:

```yaml
index: true
contentStatus: approved
```

## Integration checklist

For each live site:

1. Set the real canonical domain in `site.config.yaml`.
2. Add GA4 measurement ID if needed.
3. Add Google Search Console verification meta/file.
4. Add Bing Webmaster import/meta/file.
5. Add Clarity project ID if needed.
6. Enable Cloudflare Crawler Hints for Cloudflare-hosted live domains.
7. Add IndexNow key/keyFile only if deploy-time URL submission is needed beyond Crawler Hints.
8. Add AdSense publisher ID and ads.txt entry.
9. Add Adsterra snippets only if using Adsterra.
10. Run `pnpm site check <site-id>`.
11. Run `pnpm site build <site-id>`.
12. Deploy and run `pnpm site verify-integrations <site-id>`.

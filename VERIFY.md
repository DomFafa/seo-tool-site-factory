# Verification checklist

After applying the patch:

```bash
pnpm install
pnpm site list
pnpm site check --all
pnpm site build typing-speed-test
pnpm site build convert-image-to-png
pnpm ops report
```

Expected outputs:

- `pnpm site list` shows two sample sites.
- `pnpm site check --all` has no P0 blockers for the included draft sites.
- `pnpm site build typing-speed-test` writes to `dist/sites/typing-speed-test/`.
- `pnpm site build convert-image-to-png` writes to `dist/sites/convert-image-to-png/`.
- `pnpm ops report` writes `.generated/portfolio.json` and `.generated/portfolio.html`.

Before production launch for any site:

1. Replace example domains in `site.config.yaml`.
2. Configure Cloudflare Pages project name.
3. Set GSC/Bing verification details.
4. Configure GA4/Clarity if needed.
5. Configure AdSense/Adsterra and ads.txt entries.
6. Set site status to `live` only when ready.
7. Set content `index: true` and `contentStatus: approved` only after review.
8. Run `pnpm site verify-integrations <site-id>` after deployment.

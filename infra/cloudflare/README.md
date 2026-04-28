# Cloudflare deployment

V1 uses Cloudflare Pages Direct Upload per site.

Each site config includes:

```yaml
deployment:
  provider: cloudflare-pages
  projectName: seo-tool-typing-speed-test
  outputDir: dist/sites/typing-speed-test
```

Deploy with:

```bash
pnpm site deploy typing-speed-test --preview
pnpm site deploy typing-speed-test --production
```

The deploy command builds the selected site, then calls:

```bash
wrangler pages deploy dist/sites/<site-id> --project-name <projectName> --branch <preview|main>
```

Create the Cloudflare Pages project manually or through Wrangler before production deployment.

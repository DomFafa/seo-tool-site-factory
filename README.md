# SEO Tool Site Factory

Astro-based static SEO tool-site factory for operating many independent keyword-driven tool sites from one repository.

## V1 architecture

```txt
apps/site       Astro static site renderer
sites/          YAML site packs, content, messages, snippets, static files
packages/       shared site loading, SEO, integrations, tools, ops logic
infra/          Cloudflare notes/templates
scripts/        CLI entrypoints
```

Each site is developed, built, deployed, and verified independently.

## Quick start

```bash
pnpm install
pnpm site list
pnpm site check typing-speed-test
pnpm site dev typing-speed-test
pnpm site build typing-speed-test
pnpm site preview typing-speed-test
```

The build output for a selected site is written to:

```txt
dist/sites/<site-id>/
```

## Deployment

V1 targets Cloudflare Pages Direct Upload per site.

```bash
cp .env.example .env.local
pnpm cf accounts list
pnpm cf accounts check --all
pnpm site deploy typing-speed-test --preview
pnpm site deploy typing-speed-test --production
pnpm site verify typing-speed-test
```

Deploy commands wrap `wrangler pages deploy` using `deployment.projectName` and `deployment.accountAlias` from the selected site's YAML config. The account alias resolves through `cloudflare.accounts.yaml`; real account IDs and API tokens stay in `.env.local` or your shell environment.

## Third-party integrations

Per-site integrations live in:

```txt
sites/<site-id>/integrations.config.yaml
```

Supported in V1:

- Google Analytics 4
- Microsoft Clarity
- Google Search Console verification meta/file
- Bing Webmaster verification meta/file/import marker
- Bing IndexNow key file and submit command
- AdSense base script, slots, and ads.txt entries
- Adsterra snippet-based slots

Useful commands:

```bash
pnpm site check-integrations typing-speed-test
pnpm site verify-integrations typing-speed-test
pnpm site submit-indexnow typing-speed-test
pnpm ops report
```

## Add a site

```bash
pnpm site create cursed-text-generator --category generator --tool text-generator --default-locale en
pnpm site check cursed-text-generator
pnpm site dev cursed-text-generator
```

A new site starts as `draft`, `allowIndex: false`, and `ads.enabled: false`.

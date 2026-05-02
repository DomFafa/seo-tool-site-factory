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

Prerequisites:

- Node.js 22 or newer is recommended.
- Use pnpm. This repo declares `pnpm@10.0.0` in `package.json`.
- Run commands from the repository root.

Install dependencies:

```bash
pnpm install
```

Pick a site to work on:

```bash
pnpm site list
```

Most commands take a site id. The CLI sets `SITE_ID` for the Astro app, so prefer the `pnpm site ... <site-id>` commands instead of running Astro directly.

Run the normal local workflow with an existing site:

```bash
pnpm site check typing-speed-test
pnpm site dev typing-speed-test
```

Open the local URL printed by Astro, usually `http://localhost:4321/`.

Build and preview the same site:

```bash
pnpm site build typing-speed-test
pnpm site preview typing-speed-test
```

The build output for a selected site is written to:

```txt
dist/sites/<site-id>/
```

Useful first checks:

```bash
pnpm check
pnpm ops report
```

When changing one site pack, run:

```bash
pnpm site check <site-id>
```

When creating a new keyword-driven site, create or update `sites/<site-id>/research/*` first, keep the site in draft/noindex until the launch gates are complete, then run:

```bash
pnpm site create <site-id> --category generator --tool <tool-id> --default-locale en
pnpm site check <site-id>
pnpm site dev <site-id>
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

Deploy commands wrap `wrangler pages deploy` using `deployment.projectName` and `deployment.accountAlias` from the selected site's YAML config. The account alias resolves through `cloudflare.accounts.yaml`; real account ID and API token stay in `.env.local` or your shell environment. This repo supports a shared Cloudflare account via `CF_ACCOUNT` and `CF_TOKEN`.

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

For Cloudflare-hosted live domains, enable Cloudflare Crawler Hints first and keep repository-managed IndexNow disabled unless you need explicit deploy-time URL submission. Crawler Hints complements Bing Webmaster verification and sitemap output; it does not replace either one.

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

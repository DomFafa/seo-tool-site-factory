# 07 — Cloudflare Deployment

## 1. Deployment decision

Default v1 deployment target:

```txt
Cloudflare Workers + OpenNext adapter
```

Rationale:

- works with Next.js App Router
- supports dynamic routes and route handlers
- keeps static and dynamic behavior in one deploy model
- better fit for future Turnstile, Analytics Engine, D1/KV/R2, and API gateway needs

References:

- https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- https://opennext.js.org/cloudflare

## 2. Deployment flow

```txt
pnpm site deploy typing-speed-test --production
        |
        v
load site config
        |
        v
run site check
        |
        v
SITE_ID=typing-speed-test pnpm build
        |
        v
OpenNext adapter output
        |
        v
Wrangler deploy
        |
        v
verify production URL
```

## 3. Required commands

```bash
pnpm site list
pnpm site check <site-id>
pnpm site check --all
pnpm site build <site-id>
pnpm site deploy <site-id> --preview
pnpm site deploy <site-id> --production
pnpm site verify <site-id>
```

## 4. Cloudflare resources

Use as needed:

- Workers: host Next.js output
- KV: small site/runtime config, feature flags, non-sensitive cache
- D1: typing results, aggregate stats, operational records
- R2: temporary files, generated files, static artifacts if needed
- Turnstile: abuse protection for expensive APIs/forms
- Workers Analytics Engine: custom tool events

## 5. Environment variables and secrets

Use environment variables for non-sensitive configuration and secrets for sensitive values.

Examples of secrets:

- LanguageTool paid API key
- Ad provider private settings if any
- webhook tokens
- deployment automation tokens

Do not store secrets in `site.config.ts`.

Reference:

- https://developers.cloudflare.com/workers/configuration/secrets/

## 6. Wrangler config generation

`infra/cloudflare/scripts/generate-wrangler.ts` should read selected site config and generate or validate the deployment config.

Inputs:

- site id
- project name
- canonical host
- zone id if available
- required bindings
- required secrets

Outputs:

- generated wrangler config or validation report
- deploy command arguments

## 7. Preview deployment

Preview deploy must happen before production deploy.

Smoke checks:

- homepage returns 200
- default locale route returns 200
- `robots.txt` returns expected noindex/index policy
- `sitemap.xml` returns selected site URLs only
- a tool happy-path renders

## 8. Production verification

After deploy, verify:

- production homepage 200
- canonical host correct
- robots accessible
- sitemap accessible
- selected site title visible
- no other site brand/content visible
- ads load only if site monetizable
- analytics config matches selected site

## 9. Rollback requirement

Each production deploy should record previous successful version or deployment identifier. `pnpm site rollback <site-id>` can be P1/P2, but deploy logs should preserve rollback data from v1.

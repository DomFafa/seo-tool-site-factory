# Per-site Cloudflare account deployment

Status: v1 local deployment model

## Decision

Each public site can use its own Cloudflare account. Deployment remains local-only. GitHub Actions should run checks/builds only and must not deploy.

The system resolves Cloudflare credentials per site from:

1. `domains.launch.yaml` `sites.<site-id>.cloudflareAccount`, if present
2. `sites/<site-id>/site.config.yaml` `deployment.accountAlias`
3. fallback: `<site-id>`

The account alias is looked up in `cloudflare.accounts.yaml`. That file only contains env var names and is safe to commit. Secrets stay in `.env.local` or your shell environment.

## Files

```txt
cloudflare.accounts.yaml       # account aliases -> env var names; safe to commit
.env.local                     # real account IDs and tokens; do not commit
domains.launch.yaml            # site -> domain + optional cloudflareAccount override
sites/<site-id>/site.config.yaml # deployment.accountAlias default
```

## Example

```yaml
# cloudflare.accounts.yaml
schemaVersion: 1
accounts:
  typing-speed-test:
    accountIdEnv: CF_ACCOUNT_TYPING_SPEED_TEST
    apiTokenEnv: CF_TOKEN_TYPING_SPEED_TEST
```

```yaml
# sites/typing-speed-test/site.config.yaml
deployment:
  provider: cloudflare-pages
  accountAlias: typing-speed-test
  projectName: seo-tool-typing-speed-test
  outputDir: dist/sites/typing-speed-test
```

```bash
# .env.local
CF_ACCOUNT_TYPING_SPEED_TEST=...
CF_TOKEN_TYPING_SPEED_TEST=...
```

## Local-only workflow

```bash
pnpm cf accounts list
pnpm cf accounts check --all
pnpm domain create-project typing-speed-test
pnpm domain check typing-speed-test
pnpm domain bind typing-speed-test
pnpm domain redirects typing-speed-test --dry-run
pnpm domain configure typing-speed-test
pnpm domain deploy typing-speed-test
pnpm domain verify typing-speed-test
pnpm domain go-live typing-speed-test --yes
```

## Rules

- Do not use a shared global Cloudflare token for all sites.
- Do not rely on `wrangler login` account switching for production deploys.
- Keep each site zone and Pages project in the same Cloudflare account.
- Let `pnpm domain bind --ensure-dns` manage Pages CNAME targets; it reads the real Pages subdomain from Cloudflare.
- Keep `.env.local` out of git.
- Do not add GitHub Actions deployment until the local workflow has been stable for several real domains.
- `pnpm domain go-live --all` is intentionally refused.

## Token permissions

For each site account token, start with:

- Cloudflare Pages edit permission
- Zone read permission
- DNS edit permission, only if you use `--ensure-dns` to replace same-host `A`, `AAAA`, or `CNAME` records
- Account `Account Rule Lists` read/write permissions, only if you use `pnpm domain redirects --ensure`
- Account `Mass URL Redirects` read/write permissions, only if you use `pnpm domain redirects --ensure`

Bulk Redirects need both permission groups. `Account Rule Lists` manages the redirect list and list items. `Mass URL Redirects` reads and updates the account `http_request_redirect` ruleset that enables the list. Cloudflare may show older labels as `Account Filter Lists` and `Bulk URL Redirects`; use the read/write variants for both.

If you manually manage DNS records, remove DNS edit permission after setup.

# Shared Cloudflare account deployment

Status: v1 local deployment model

## Decision

All public sites can share one Cloudflare account and one API token. Deployment remains local-only. GitHub Actions should run checks/builds only and must not deploy.

The system resolves Cloudflare credentials from:

1. `cloudflare.accounts.yaml`
2. `.env.local` or your shell environment

The config file only contains the shared env var names and is safe to commit. Secrets stay in `.env.local` or your shell environment.

## Files

```txt
cloudflare.accounts.yaml   # shared env var names; safe to commit
.env.local                 # real account ID and token; do not commit
```

## Example

```yaml
# cloudflare.accounts.yaml
schemaVersion: 1
accounts:
  shared:
    accountIdEnv: CF_ACCOUNT
    apiTokenEnv: CF_TOKEN
```

```bash
# .env.local
export CF_ACCOUNT=...
export CF_TOKEN=...
```

## Local-only workflow

```bash
pnpm cf accounts list
pnpm cf accounts check --all
pnpm site deploy random-date-generator --production
```

## Rules

- Do not rely on `wrangler login` account switching for production deploys.
- Keep every site project in the same Cloudflare account unless you intentionally split accounts later.
- Keep `.env.local` out of git.

## Token permissions

For the shared account token, start with:

- Cloudflare Pages edit permission
- Zone read permission
- DNS edit permission, only if you later use `--ensure-dns`
- Account `Account Rule Lists` read/write permissions, only if you later use `pnpm domain redirects --ensure`
- Account `Mass URL Redirects` read/write permissions, only if you later use `pnpm domain redirects --ensure`

Bulk Redirects need both permission groups. `Account Rule Lists` manages the redirect list and list items. `Mass URL Redirects` reads and updates the account `http_request_redirect` ruleset that enables the list. Cloudflare may show older labels as `Account Filter Lists` and `Bulk URL Redirects`; use the read/write variants for both.

If you manually manage DNS records, remove DNS edit permission after setup.

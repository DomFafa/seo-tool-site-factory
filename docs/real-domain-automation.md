# Real Domain Automation

This repo uses Cloudflare Pages Direct Upload for each independent site. The pages.dev baseline stays useful for QA, while real domains are promoted through a noindex-first workflow.

## What remains manual

You still need to:

1. Buy the domain.
2. Point the domain nameservers to the site's Cloudflare account.
3. Wait until the Cloudflare zone is active.
4. Create GA4 / Clarity / GSC / Bing / AdSense / Adsterra accounts or properties when needed.
5. Copy platform IDs and verification tokens into `domains.launch.yaml`.

The scripts handle site config updates, Pages project creation, Pages custom domain binding, optional DNS CNAME creation, build/deploy/verify, and go-live indexing changes.

## Required Cloudflare accounts

Each site resolves its Cloudflare account through `deployment.accountAlias` and `cloudflare.accounts.yaml`. Copy `.env.example` to `.env.local`, then fill the shared account ID and API token env vars:

```bash
CF_ACCOUNT=...
CF_TOKEN=...
```

Use `pnpm cf accounts list` to see the aliases and env var names. Use `pnpm cf accounts check --all` after `.env.local` is populated. Tokens should have access to manage Cloudflare Pages projects and read/write DNS records for their target zones.

## Launch mapping

Edit `domains.launch.yaml` after buying domains:

```yaml
sites:
  typing-speed-test:
    domain: typing-example.com
    projectName: seo-tool-typing-speed-test
    cloudflareAccount: typing-speed-test
    mode: noindex-first
```

Fill `domain` with the primary host, without `www.`. The domain automation uses that as the canonical host and automatically binds `www.<domain>` as the alias. Keep `mode: noindex-first` until the site is verified and reviewed. This deploys the real domain while retaining draft/noindex behavior.

## Commands

List planned launches:

```bash
pnpm domain list
pnpm domain plan typing-speed-test
```

Check Cloudflare zone and Pages domain status:

```bash
pnpm domain check typing-speed-test
```

Create the Pages project without using Wrangler's interactive prompt:

```bash
pnpm domain create-project typing-speed-test
```

Bind a custom domain to the Pages project:

```bash
pnpm domain bind typing-speed-test
```

`bind` and `deploy` also create the Pages project automatically when it is missing.

Optionally ask the script to ensure DNS points to the Pages project:

```bash
pnpm domain bind typing-speed-test --ensure-dns
```

When `--ensure-dns` finds old same-host `A`, `AAAA`, or `CNAME` records, it deletes them and creates the Pages CNAME. It leaves other record types, such as `TXT` and `MX`, untouched.
The CNAME target is read from the Cloudflare Pages project `subdomain` field, not guessed from the project name.

Update local YAML config to use the real domain while staying noindex:

```bash
pnpm domain configure typing-speed-test
```

Build, deploy, and verify the real domain:

```bash
pnpm domain deploy typing-speed-test
pnpm domain verify typing-speed-test
```

`domain bind` and `domain verify` wait for Pages custom domains to become active by default. Use `--wait-seconds 0` to skip the wait during manual troubleshooting.

## DNS troubleshooting playbook

Use this flow when `pnpm domain bind <site-id> --ensure-dns` fails or Cloudflare Pages custom domains stay `pending`.

First separate account access from DNS-record access:

```bash
set -a; source .env.local; set +a
pnpm cf accounts check shared --api
pnpm domain check <site-id>
```

`pnpm cf accounts check shared --api` only proves the token can reach the configured Cloudflare account endpoint. `pnpm domain check <site-id>` proves the zone and Pages project are visible. A token can pass both checks and still fail on DNS records.

If `--ensure-dns` fails with:

```text
Cloudflare API GET /zones/<zone-id>/dns_records?... HTTP 403 - Authentication error
```

then the token is not usable for DNS record reads/writes through the public API, even if zone metadata lists DNS permissions. Do not keep rotating deploy commands. Use one of these fixes:

1. Preferred: update the API token so it has `Zone: DNS: Read` and `Zone: DNS: Edit` for the target zone, then rerun:

```bash
pnpm domain bind <site-id> --ensure-dns --wait-seconds 240
pnpm domain verify <site-id> --wait-seconds 240
```

2. If the browser is logged in to Cloudflare and the token endpoint is blocked, use the dashboard session only as a manual fallback. In the DNS Records page for the zone:
   - delete old same-host `A`, `AAAA`, or `CNAME` records for the apex and `www` host
   - keep unrelated records such as `MX`, SPF `TXT`, DKIM `TXT`, DMARC, and verification TXT records
   - create `CNAME` records for the apex domain and `www` host pointing to the Pages project subdomain shown by `pnpm domain check <site-id>`
   - set both CNAME records to `DNS only` while Pages verifies the custom domains

Cloudflare CNAME verification can fail when the verification CNAME is proxied. Cloudflare documents this as a common cause of "CNAME record not set"; proxy status should be DNS only during verification: https://developers.cloudflare.com/dns/manage-dns-records/troubleshooting/cname-domain-verification/

After DNS is corrected, verify the state in this order:

```bash
pnpm domain check <site-id>
pnpm domain bind <site-id> --wait-seconds 240
pnpm domain verify <site-id> --wait-seconds 240
curl -I https://<canonical-domain>/
curl -I https://www.<canonical-domain>/
```

Expected progression:

```text
Pages domain <domain>: bound (pending)
verification_data.status: active
validation_data.status: pending
Pages domains active ...
homepage: https://<domain> -> HTTP 200
```

If the hostname returns Cloudflare `522`, check whether the Pages custom domain was associated before the DNS CNAME was created. Cloudflare Pages requires going through the Custom domains association flow; manually pointing DNS at `*.pages.dev` before association can produce 522s. Reference: https://developers.cloudflare.com/pages/configuration/custom-domains/

Pages `_redirects` does not support domain-level redirects. Use Cloudflare Bulk Redirects for `pages.dev` or `www` canonical 301s:

```bash
pnpm domain redirects typing-speed-test --dry-run
pnpm domain redirects typing-speed-test --ensure
pnpm domain redirects typing-speed-test --verify --mark-configured
```

`domain redirects --verify` also uses `--wait-seconds` and waits up to 10 seconds by default for Cloudflare Bulk Redirects to propagate after creation.

The redirect command creates an account-level Bulk Redirect List and enables it in the `http_request_redirect` ruleset. The site token needs account-level `Account Rule Lists` read/write and `Mass URL Redirects` read/write permissions. Cloudflare may show older labels as `Account Filter Lists` and `Bulk URL Redirects`; grant the read/write variants for both groups.

## Noindex-first flow

A real-domain launch should initially keep:

```yaml
lifecycle:
  status: draft
indexing:
  allowIndex: false
```

This verifies the domain, canonical URL, root files, analytics scripts, and webmaster verification tokens without opening the site to indexing.

## Go live

Only after content review, Search Console/Bing verification, analytics checks, and tool QA:

```bash
pnpm domain go-live typing-speed-test --yes
```

This command:

- sets `lifecycle.status = live`
- sets `indexing.allowIndex = true`
- marks the default locale as enabled/reviewed/indexable
- marks home, FAQ, and guide MDX files as `index: true` and `contentStatus: approved`
- builds, deploys, verifies, and submits IndexNow if configured

`go-live --all` is intentionally rejected. Open indexing one site at a time.

## First recommended real-domain batch

Start with:

```txt
typing-speed-test
convertir-imagen-a-png
cursive-generator
```

Keep anagram-solver on pages.dev until dictionary depth is improved, and keep correcteur-orthographe noindex until the spellcheck quality model is decided.

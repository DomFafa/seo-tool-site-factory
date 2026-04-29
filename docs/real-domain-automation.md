# Real Domain Automation

This repo uses Cloudflare Pages Direct Upload for each independent site. The pages.dev baseline stays useful for QA, while real domains are promoted through a noindex-first workflow.

## What remains manual

You still need to:

1. Buy the domain.
2. Point the domain nameservers to the site's Cloudflare account.
3. Wait until the Cloudflare zone is active.
4. Create GA4 / Clarity / GSC / Bing / AdSense / Adsterra accounts or properties when needed.
5. Copy platform IDs and verification tokens into `domains.launch.yaml`.

The scripts handle site config updates, Pages custom domain binding, optional DNS CNAME creation, build/deploy/verify, and go-live indexing changes.

## Required Cloudflare accounts

Each site resolves its Cloudflare account through `deployment.accountAlias` and `cloudflare.accounts.yaml`. Copy `.env.example` to `.env.local`, then fill the account ID and API token env vars for the site accounts you manage locally:

```bash
CF_ACCOUNT_TYPING_SPEED_TEST=...
CF_TOKEN_TYPING_SPEED_TEST=...
```

Use `pnpm cf accounts list` to see the aliases and env var names. Use `pnpm cf accounts check --all` after `.env.local` is populated. Tokens should have access to manage Cloudflare Pages projects and read/write DNS records for their target zones.

## Launch mapping

Edit `domains.launch.yaml` after buying domains:

```yaml
sites:
  typing-speed-test:
    domain: typing-example.com
    canonicalHost: typing-example.com
    aliases:
      - www.typing-example.com
    projectName: seo-tool-typing-speed-test
    cloudflareAccount: typing-speed-test
    mode: noindex-first
```

Keep `mode: noindex-first` until the site is verified and reviewed. This deploys the real domain while retaining draft/noindex behavior.

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

Bind a custom domain to the Pages project:

```bash
pnpm domain bind typing-speed-test
```

Optionally ask the script to create CNAME records when none exist:

```bash
pnpm domain bind typing-speed-test --ensure-dns
```

The script will not overwrite existing DNS records. If records already exist, it prints a manual review message.

Update local YAML config to use the real domain while staying noindex:

```bash
pnpm domain configure typing-speed-test
```

Build, deploy, and verify the real domain:

```bash
pnpm domain deploy typing-speed-test
pnpm domain verify typing-speed-test
```

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

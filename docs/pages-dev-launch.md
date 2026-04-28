# Cloudflare Pages.dev Technical Launch Plan

This repository can deploy each site independently to Cloudflare Pages Direct Upload. The first technical launch uses `*.pages.dev` domains only.

## Goals

- Create all planned keyword site packs.
- Keep every site in `draft`.
- Keep `indexing.allowIndex: false`.
- Keep ads disabled.
- Deploy each site to its own Cloudflare Pages project.
- Verify homepage, robots.txt, sitemap.xml, and basic rendering.

## Sites

```txt
typing-speed-test
convertir-imagen-a-png
cursive-generator
cursed-text-generator
anagram-solver
cursive-alphabet
typing-practice
typing-practice-paragraph
typing-test-online
correcteur-orthographe
```

## Create Cloudflare Pages projects

Run this once after `wrangler login`:

```bash
bash scripts/launch-pages-dev.sh create-projects
```

If Cloudflare reports that a project already exists, keep going.

## Build all launch sites

```bash
bash scripts/launch-pages-dev.sh build
```

## Deploy all launch sites

```bash
bash scripts/launch-pages-dev.sh deploy
```

## Verify all launch sites

```bash
bash scripts/launch-pages-dev.sh verify
```

Verification is best-effort during the pages.dev launch. Some integration checks are expected to be disabled until real domains and provider IDs are configured.

## Do not enable yet

Do not enable these during the pages.dev technical launch:

```txt
lifecycle.status: live
indexing.allowIndex: true
content index: true
contentStatus: approved
ads.enabled: true
IndexNow submit
GSC sitemap submission
```

After real domains are attached, each site can be reviewed individually and moved from draft to live.

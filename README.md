# SEO Tool Site Factory — AI Handoff Pack

Generated: 2026-04-28

This package is designed to be unzipped into a project workspace so Codex, Claude Code, or another coding agent can continue implementation without needing the full prior conversation.

## What this package contains

```txt
source/
  seo-tool-site-factory-requirements.original.md

docs/
  00-executive-summary.md
  01-requirements-expanded.md
  02-architecture-design.md
  03-repository-structure.md
  04-site-pack-spec.md
  05-tool-specs.md
  06-seo-i18n-ads-analytics.md
  07-cloudflare-deployment.md
  08-implementation-roadmap.md
  09-quality-gates-and-checklists.md
  10-security-privacy-abuse-protection.md
  11-library-and-tooling-recommendations.md
  12-risk-notes.md
  adr/

references/
  official-references.md

prompts/
  CODEX_START_PROMPT.md
  CLAUDE_CODE_START_PROMPT.md

templates/
  site.config.example.ts
  theme.example.ts
  content.frontmatter.example.mdx
  tool.spec.example.ts
  site-cli-contract.md
  package-json-scripts.md

checklists/
  launch-checklist.md
  content-review-checklist.md
  ads-policy-checklist.md
  seo-regression-checklist.md

AGENTS.md
CLAUDE.md
AI-HANDOFF.md
implementation_tasks.json
```

## Start here

1. Read `AI-HANDOFF.md` first.
2. Then read `docs/00-executive-summary.md` and `docs/08-implementation-roadmap.md`.
3. Use `AGENTS.md` or `CLAUDE.md` as coding-agent instructions.
4. Treat `source/seo-tool-site-factory-requirements.original.md` as the original baseline and `docs/01-requirements-expanded.md` as the implementation-ready version.

## Current product decision

Build a one-codebase, many-independent-sites factory using:

- Next.js App Router
- Cloudflare Workers + OpenNext adapter
- build-time `SITE_ID` selection
- `apps/ + sites/ + packages/ + infra/` repo model
- independent site packs with config, content, messages, and theme
- deterministic SEO output generated from structured data
- launch gates for build, SEO, ads, privacy, deployment, and monitoring

## First implementation target

Implement the factory skeleton first. Then implement two operational sites:

1. `typing-speed-test` — browser-interactive tool
2. `convert-image-to-png` — file-processing tool, client-side first

Do not implement all 10 sites before the skeleton, validation, SEO, and deployment gates work.

# Codex Build Prompt: {tool_name}

Use the SEO Tool Site Factory skill.

Build or improve the site for:

```text
site-id: {site_id}
primary keyword: {primary_keyword}
category: {category}
locale: {locale}
market: {market}
```

Read these files first:

```text
sites/{site_id}/research/keyword-intent.md
sites/{site_id}/research/competitor-research.md
sites/{site_id}/research/product-requirements.md
sites/{site_id}/research/seo-spec.md
sites/{site_id}/research/ux-spec.md
sites/{site_id}/research/design-direction.md
sites/{site_id}/research/design-review.md
sites/{site_id}/research/acceptance-tests.md
```

Before implementing product or UI, verify `competitor-research.md` has the Bing Webmaster top 5:

- If missing, follow `/Users/bin/.codex/skills/seo-demand-validation/SKILL.md` for Bing Webmaster Keyword Research.
- Use `/Users/bin/.codex/skills/web-access/SKILL.md` for logged-in browser access and run its CDP preflight before browser/network actions.
- Search the exact primary keyword in Bing Webmaster Keyword Research with date range `3M`.
- Use the `Top 10 url ranking on this keyword` table and record the first 5 rows.
- Do not substitute a generic public SERP unless Bing Webmaster access is blocked, and mark that fallback clearly.

Research completion gate:

Before implementation, verify these files contain keyword-specific decisions:

```text
sites/{site_id}/research/keyword-intent.md
sites/{site_id}/research/competitor-research.md
sites/{site_id}/research/product-requirements.md
sites/{site_id}/research/seo-spec.md
sites/{site_id}/research/ux-spec.md
sites/{site_id}/research/design-direction.md
sites/{site_id}/research/design-review.md
sites/{site_id}/research/acceptance-tests.md
sites/{site_id}/research/brief.v2.draft.yaml
sites/{site_id}/research/codex-build-prompt.md
```

Do not proceed from competitor research directly into implementation unless the user explicitly asked for competitor research only. If any file cannot be completed yet, add `Deferred:` inside that file with the reason, missing evidence, and next action.

Before implementing visual UI:

- Use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-consultation/SKILL.md` if the design direction is missing or weak.
- Use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-plan-design-review/SKILL.md` to review the design plan before implementation when UI scope is meaningful.
- Use `/Users/bin/.codex/skills/frontend-design/SKILL.md` when translating the approved design direction into frontend code.

Then implement the repository changes.

Requirements:

- Keep the site as draft unless explicitly approved.
- Do not enable indexing for draft content.
- Use the factory site pack structure.
- Keep site identity/content/config under `sites/{site_id}/`.
- Put pure tool logic under `packages/tools/<tool-id>/`.
- Put interactive UI under `apps/site/src/features/<tool-id>/`.
- Reflect `design-direction.md` and `design-review.md` in `layout.config.yaml`, `theme.config.yaml`, content, and UI.
- Register the renderer without hard-coding site IDs.
- Do not create a generic template.
- Do not send raw user input to analytics.
- Do not place ads near primary actions.
- Avoid unnecessary dependencies.
- Add or update tests for pure logic.

Post-UI optimization gate:

- After meaningful UI changes, use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-review/SKILL.md` to review and fix visual hierarchy, spacing, mobile layout, contrast, focus states, output overflow, and AI-template risk.
- If interactions changed, use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-qa/SKILL.md` when fixes are allowed, or `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-qa-only/SKILL.md` for report-only QA.
- Before launch, after large CSS/JS changes, or after adding dependencies, use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-benchmark/SKILL.md`.
- Record findings, fixes, or `Deferred:` reasons in `design-review.md` and `acceptance-tests.md`.

After implementation, run:

```bash
pnpm site check {site_id}
pnpm site build {site_id}
pnpm seo audit {site_id}
pnpm seo lint-content {site_id}
pnpm perf audit {site_id}
pnpm site ui-audit {site_id}
```

Fix P0 issues. Summarize files changed, validation results, differentiators, known tradeoffs, and indexing status.

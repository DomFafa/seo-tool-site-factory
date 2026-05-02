# Codex Build Prompt: Weighted Grade Calculator

Use the SEO Tool Site Factory skill.

Short trigger:

```text
继续实现 weighted-grade-calculator
```

If the user sends that short trigger, treat it as approval to switch from completed research into `implement` mode for this site. Read this file and the research files below before editing implementation files.

Build or improve the site for:

```text
site-id: weighted-grade-calculator
primary keyword: weighted grade calculator
category: calculator
locale: en
market: US
mode: implement
```

Read these files first:

```text
sites/weighted-grade-calculator/research/keyword-intent.md
sites/weighted-grade-calculator/research/competitor-research.md
sites/weighted-grade-calculator/research/product-requirements.md
sites/weighted-grade-calculator/research/seo-spec.md
sites/weighted-grade-calculator/research/ux-spec.md
sites/weighted-grade-calculator/research/design-direction.md
sites/weighted-grade-calculator/research/design-review.md
sites/weighted-grade-calculator/research/acceptance-tests.md
sites/weighted-grade-calculator/research/implementation-trace.md
sites/weighted-grade-calculator/research/status.md
sites/weighted-grade-calculator/research/launch-review.md
```

## Operating Mode

- Default mode for this prompt is `implement`.
- Use `post-ui-review` after meaningful UI changes when the next task is review-only.
- Use `repair-gate` when a previous run failed a specific gate and needs targeted fixes.
- Use `launch-review` for final readiness inspection without implementation edits.
- If any gate is blocked, switch to `audit` or `repair-gate` and report the blocker instead of pushing through.

## Phase Protocol

```text
Phase 1: research gate
Phase 2: design gate
Phase 3: implementation gate
Phase 4: post-UI QA gate
Phase 5: launch review gate
```

Current phase before implementation:

- Current phase: implementation gate, pending research-audit confirmation.
- Allowed writes before implementation: research files only.
- Required evidence: captured Bing Top 5, completed research files, design direction, design review, acceptance tests, readiness scores.
- Exit criteria: `pnpm site research-audit weighted-grade-calculator` has no P0 blocker or any blocker is explicitly recorded.
- Blockers/deferred: post-UI review, QA, benchmark, trace audit, launch review.

## Bing Capture Gate

`competitor-research.md` includes a captured Bing Webmaster Top 5:

- Status: `captured`
- Bing siteUrl: `https://2fafree.com/`
- Exact keyword: `weighted grade calculator`
- Date range: 3M
- Attempted URL: `https://www.bing.com/webmasters/keywordresearch?siteUrl=https%3A%2F%2F2fafree.com%2F&keyword=weighted%20grade%20calculator&activeTab=related`
- Artifact: `/tmp/bing-webmaster-top5-calculator-keywords.json`
- Impressions shown: `5.8K`

Top 5 rows:

1. `https://www.calculator.net/grade-calculator.html`
2. `https://www.rapidtables.com/calc/grade/grade-calculator.html`
3. `https://www.calculatorgenius.com/grade-calculators/weighted-grade-calculator/`
4. `https://www.calculatorsoup.com/calculators/statistics/grade-calculator.php`
5. `https://miniwebtool.com/weighted-grade-calculator/`

User occupation rule result:

- Strong related root domains in Top 5: `0`
- Result: keyword remains recommended.

## Research Completion Gate

Before implementation, verify these files contain keyword-specific decisions:

```text
sites/weighted-grade-calculator/research/keyword-intent.md
sites/weighted-grade-calculator/research/competitor-research.md
sites/weighted-grade-calculator/research/product-requirements.md
sites/weighted-grade-calculator/research/seo-spec.md
sites/weighted-grade-calculator/research/ux-spec.md
sites/weighted-grade-calculator/research/design-direction.md
sites/weighted-grade-calculator/research/design-review.md
sites/weighted-grade-calculator/research/acceptance-tests.md
sites/weighted-grade-calculator/research/status.md
sites/weighted-grade-calculator/research/brief.v2.draft.yaml
sites/weighted-grade-calculator/research/codex-build-prompt.md
```

`implementation-trace.md` currently has `Trace status: pending-implementation`; complete it after implementation.

Run before implementation when available:

```bash
pnpm site research-audit weighted-grade-calculator
```

## Implementation Edit Gate

Do not edit implementation files until the research completion gate is satisfied, unless the user explicitly asks for code-only work or an emergency bug fix.

Allowed implementation write scope after gate:

```text
sites/weighted-grade-calculator/**
apps/site/src/features/weighted-grade-calculator/**
packages/tools/weighted-grade-calculator/**
renderer registry only when needed
```

Blocked before gate:

```text
apps/**
packages/**
scripts/**
sites/weighted-grade-calculator/brief.yaml
sites/weighted-grade-calculator/site.config.yaml
sites/weighted-grade-calculator/tool.config.yaml
sites/weighted-grade-calculator/theme.config.yaml
sites/weighted-grade-calculator/layout.config.yaml
sites/weighted-grade-calculator/content/**
sites/weighted-grade-calculator/messages/**
```

Competitor source status and implementation gate result:

| Competitor source status | Implementation gate result |
|---|---|
| `captured` | Passes when Bing rows are recorded and the rest of the research gate is complete. |

## Readiness Scores

- Research readiness: 9
- Design specificity: 8
- Launch readiness: 2
- Research status: READY
- Implementation status: READY
- Launch status: DRAFT_ONLY

## Product Requirements To Implement

- Category rows with name, weight percent, score percent, and include/exclude behavior.
- Live weighted grade result.
- Weight total indicator for under/exact/over 100%.
- Target grade and final/remaining score solver.
- Example presets.
- Copy result summary.
- Clear/reset controls.
- Local-only privacy note.

## Design Requirements To Implement

- Academic workbench visual system.
- Tool-led first viewport.
- Desktop: category editor plus result/what-if rail.
- Mobile: stacked row cards, no horizontal scrolling.
- Neutral worksheet surfaces; green valid states, amber warnings, red invalid states.
- No generic centered hero, three-card feature grid, decorative icon circles, or purple/blue gradient defaults.

## Repository Requirements

- Keep the site as draft unless explicitly approved.
- Do not enable indexing for draft content.
- Keep site identity/content/config under `sites/weighted-grade-calculator/`.
- Put pure tool logic under `packages/tools/weighted-grade-calculator/`.
- Put interactive UI under `apps/site/src/features/weighted-grade-calculator/`.
- Register the renderer without hard-coding site IDs in pages.
- Do not send raw scores, category names, or typed labels to analytics.
- Do not place ads near primary actions.
- Avoid unnecessary dependencies.
- Add unit tests for pure logic where possible.

## Validation Commands

Run after implementation as applicable:

```bash
pnpm site check weighted-grade-calculator
pnpm site build weighted-grade-calculator
pnpm seo audit weighted-grade-calculator
pnpm seo lint-content weighted-grade-calculator
pnpm perf audit weighted-grade-calculator
pnpm site ui-audit weighted-grade-calculator
pnpm site trace-audit weighted-grade-calculator
pnpm site launch-review weighted-grade-calculator
```

If multiple sites were changed, also run:

```bash
pnpm ops report
```

## Post-UI Gate

After meaningful UI changes:

- Run design review or record a deferred blocker.
- Run QA or QA-only for interactions.
- Capture desktop and 390px mobile evidence.
- Complete `implementation-trace.md`.
- Keep `Launch status: DRAFT_ONLY` until review/validation and explicit indexing approval.

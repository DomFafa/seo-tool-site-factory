# Codex Build Prompt: {tool_name}

Use the SEO Tool Site Factory skill.

Short trigger:

```text
继续实现 {site_id}
```

If the user sends that short trigger, treat it as approval to switch from completed research into `implement` mode for this site. Read this file and the research files below before editing implementation files.

Build or improve the site for:

```text
site-id: {site_id}
primary keyword: {primary_keyword}
category: {category}
locale: {locale}
market: {market}
mode: implement
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
sites/{site_id}/research/implementation-trace.md
sites/{site_id}/research/status.md
sites/{site_id}/research/launch-review.md
```

Operating mode:

- Default mode for this prompt is `implement`.
- Use `post-ui-review` after meaningful UI changes when the next task is review-only.
- Use `repair-gate` when a previous run failed a specific gate and needs targeted fixes.
- Use `launch-review` for final readiness inspection without implementation edits.
- If the user only asks for research, switch to `research-only` and do not edit implementation files.
- If any gate is blocked, switch to `audit` or `repair-gate` and report the blocker instead of pushing through.

Phase protocol:

```text
Phase 1: research gate
Phase 2: design gate
Phase 3: implementation gate
Phase 4: post-UI QA gate
Phase 5: launch review gate
```

For the active phase, record:

```text
Current phase:
Allowed writes:
Required evidence:
Exit criteria:
Blockers/deferred:
```

Do not mix phases silently. Research and design records must guide implementation, not be written after implementation as justification.

Before implementing product or UI, verify `competitor-research.md` has the Bing Webmaster top 5:

- If missing, follow `/Users/bin/.codex/skills/seo-demand-validation/SKILL.md` for Bing Webmaster Keyword Research.
- Use `/Users/bin/.codex/skills/web-access/SKILL.md` for logged-in browser access and run its CDP preflight before browser/network actions.
- Search the exact primary keyword in Bing Webmaster Keyword Research with date range `3M`.
- Use the `Top 10 url ranking on this keyword` table and record the first 5 rows.

Bing capture gate:

- `competitor-research.md` must include `Bing Webmaster Capture Attempt`.
- Valid statuses are `captured`, `blocked-with-evidence`, `not-attempted`, and `user-approved-skip`.
- Use `captured` only when the Bing Webmaster ranking table was actually read.
- Use `blocked-with-evidence` only when an actual attempt exists with attempted URL, timestamp, blocker text or screenshot/artifact, and missing permission/login state.
- Use `not-attempted` when no Bing Webmaster attempt was made. Do not call this blocked.
- Use `user-approved-skip` only when the user explicitly approves skipping Bing Webmaster. Record the approval context.
- Do not substitute a generic public SERP for the Bing Webmaster top 5. Public SERP results may be listed only as low-confidence fallback references.
- If status is `blocked-with-evidence`, stop before implementation unless the user explicitly approves fallback implementation or asks for code-only work.
- If status is `not-attempted`, stop before implementation unless the user explicitly asks for code-only work.

Bing readiness caps:

- `captured`: no automatic research cap from Bing source.
- `blocked-with-evidence`: `Research readiness <= 7`, `Research status: READY_WITH_FALLBACK` or `BLOCKED`, and implementation requires explicit fallback approval.
- `not-attempted`: `Research readiness <= 3`, `Research status: NOT_ATTEMPTED`, and implementation is blocked.
- `user-approved-skip`: record approval context and keep `Launch status: DRAFT_ONLY` until manual review.

STOP: Claims without evidence do not satisfy this gate.

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
sites/{site_id}/research/status.md
sites/{site_id}/research/brief.v2.draft.yaml
sites/{site_id}/research/codex-build-prompt.md
```

`implementation-trace.md` may exist before implementation with `Trace status: pending-implementation`. It is not required to be complete before implementation starts, but it must be completed after implementation before the work is called implementation-complete.

Do not proceed from competitor research directly into implementation unless the user explicitly asked for competitor research only. If any file cannot be completed yet, add `Deferred:` inside that file with the reason, missing evidence, and next action.

Research quality rules:

- Do not count a file as complete just because it exists.
- Do not count placeholders, empty tables, generic boilerplate, or copied template text as completed research.
- Do not count `Deferred:` as valid unless it includes blocker, missing evidence, impact, and next action.
- Do not use unsupported readiness scores.
- Completed research must include evidence used, decisions made, implementation implications, and deferred items across the research set.

Run before implementation when available:

```bash
pnpm site research-audit {site_id}
```

Implementation edit gate:

Do not edit implementation files until the research completion gate is satisfied, unless the user explicitly asks for code-only work or an emergency bug fix.

Before the gate is satisfied, allowed writes are limited to:

```text
sites/{site_id}/research/*
sites/{site_id}/research/brief.v2.draft.yaml
```

Blocked before the gate:

```text
apps/**
packages/**
scripts/**
sites/{site_id}/brief.yaml
sites/{site_id}/site.config.yaml
sites/{site_id}/tool.config.yaml
sites/{site_id}/theme.config.yaml
sites/{site_id}/layout.config.yaml
sites/{site_id}/content/**
sites/{site_id}/messages/**
```

Default implementation write scope:

```text
sites/{site_id}/**
apps/site/src/features/<tool-id>/**
packages/tools/<tool-id>/**
renderer registry only when needed
```

List any files outside this scope as `Scope drift`. Do not clean up unrelated dirty files unless they block this site.

Competitor source status and implementation gate result:

| Competitor source status | Implementation gate result |
|---|---|
| `captured` | Passes when Bing rows are recorded and the rest of the research gate is complete. |
| `user-approved-skip` | Passes as approved fallback only; keep `Launch status: DRAFT_ONLY` until manual review. |
| `blocked-with-evidence` + explicit fallback approval | Passes as fallback implementation only; keep `Research readiness <= 7`. |
| `blocked-with-evidence` without explicit fallback approval | Blocked. |
| `not-attempted` | Blocked unless the user explicitly asks for code-only work. |

Also record deferred blockers if any, design-new decision, pre-implementation design review status, and approved implementation write scope.

Readiness scores:

Record these before implementation:

```text
Research readiness:
Design specificity:
Launch readiness:
Research status: READY / READY_WITH_FALLBACK / BLOCKED / NOT_ATTEMPTED
Implementation status: READY / BLOCKED / BYPASSED_BY_USER
Launch status: DRAFT_ONLY / READY_FOR_REVIEW / READY_TO_INDEX
```

STOP: Do not start implementation with `Research readiness < 7` unless the user explicitly approves fallback/code-only implementation.

Score caps:

- Bing status `blocked-with-evidence`: `Research readiness <= 7`.
- Bing status `not-attempted`: `Research readiness <= 3`.
- Missing or deferred pre-implementation `plan-design-review` for meaningful UI work: `Design specificity <= 5`.
- Missing browser/screenshot evidence after meaningful UI work: `Launch readiness <= 5`.

Before implementing visual UI:

- Treat an existing draft/scaffold site without approved `design-direction.md` as design-new.
- Use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-consultation/SKILL.md` if the design direction is missing, weak, stale, generic, not competitor-informed, or if the site has no approved reusable cluster design.
- Use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-shotgun/SKILL.md` only when multiple variants are useful: unclear direction, high-competition keyword, user asks for variants, cluster similarity risk, or a new visual cluster is being established.
- Use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-plan-design-review/SKILL.md` to review the design plan before implementation when UI scope is meaningful.
- Use `/Users/bin/.codex/skills/frontend-design/SKILL.md` when translating the approved design direction into frontend code.
- Do not let design-shotgun or frontend-design redefine the user job, product goal, or SEO intent.

STOP: Do not implement visual UI before `design-direction.md` and pre-implementation `design-review.md` exist, unless they are explicitly deferred with a reason and the task is code-only.

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
- Capture browser evidence after meaningful UI work: desktop screenshot, 390px mobile screenshot, local URL, viewport sizes, first-viewport tool visibility, main task path, visual hierarchy issues, fixes applied, and remaining issues.
- If browser tooling or screenshots are unavailable, record `Deferred:` with the blocker and cap `Launch readiness <= 5`.
- Record findings, fixes, or `Deferred:` reasons in `design-review.md` and `acceptance-tests.md`.

STOP: Do not call UI implementation complete after rendering alone.

STOP: Do not mark full visual review complete without post-implementation evidence. A placeholder, pre-implementation note, or deferred entry is not a completed post-UI design review.

STOP: For a new UI-bearing site, do not score `Launch readiness > 4` unless post-UI `gstack-design-review` ran after implementation.

STOP: If UI interactions changed, do not score `Launch readiness > 5` unless `gstack-qa` or `gstack-qa-only` ran.

STOP: If post-UI design review and interaction QA are both deferred, keep `Launch status: DRAFT_ONLY`.

After implementation, run:

```bash
pnpm site research-audit {site_id}
pnpm site check {site_id}
pnpm site build {site_id}
pnpm seo audit {site_id}
pnpm seo lint-content {site_id}
pnpm perf audit {site_id}
pnpm site ui-audit {site_id}
pnpm site trace-audit {site_id}
pnpm site launch-review {site_id}
```

Research consumption trace gate:

After implementation and validation, update:

```text
sites/{site_id}/research/implementation-trace.md
```

The trace must map research source to implementation evidence:

- Keyword intent and standalone decision.
- Bing competitor opportunities and must-win gaps.
- Product feature requirements.
- SEO metadata/content/FAQ/schema/internal-link requirements.
- UX states, mobile, accessibility, and privacy requirements.
- Design direction and design review decisions reflected in layout, theme, content, and UI.
- Acceptance tests and validation results.
- Unconsumed or deferred research decisions with reason, impact, and next action.

STOP: Do not call implementation complete while `implementation-trace.md` is missing, still `pending-implementation`, or only a generic summary.

Launch readiness dashboard:

Before claiming the site is review-ready or launch-ready, update:

```text
sites/{site_id}/research/launch-review.md
```

The dashboard must include research evidence, design plan, UI implementation, browser QA, interaction QA, SEO/content/perf/UI validation, research trace, scope drift, indexing status, and launch status.

`READY_TO_INDEX` requires explicit user approval. Passing checks alone is not approval to enable indexing.

If `site.config.yaml` has `indexing.allowIndex: true`, `launch-review.md` must record `Launch status: READY_TO_INDEX` and `Explicit indexing approval recorded: yes`.

Fix P0 issues. Summarize files changed, mode, readiness scores, statuses, validation results, research consumption trace status, differentiators, known tradeoffs, and indexing status.

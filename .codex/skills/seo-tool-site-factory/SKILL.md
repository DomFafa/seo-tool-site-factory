---
name: seo-tool-site-factory
description: Use when creating, improving, or auditing keyword-driven SEO utility websites in the seo-tool-site-factory repository; turns generator/solver/maker/converter/checker keywords into competitor-informed research, product requirements, SEO specs, UX specs, design direction, acceptance tests, site packs, tool logic, and validation commands.
---

# SEO Tool Site Factory Skill

Use this skill when creating, improving, or auditing an independent keyword-driven utility website in this repository.

This repository is an Astro-based static SEO tool-site factory. Each site is represented by a site pack under `sites/<site-id>/`. Shared tool logic belongs under `packages/tools/*`. Interactive tool UI belongs under `apps/site/src/features/*`.

## Goal

Turn a keyword such as `{keyword} generator`, `{keyword} solver`, `{keyword} maker`, `{keyword} converter`, `{keyword} checker`, `{keyword} calculator`, or `{keyword} formatter` into a production-ready, differentiated, SEO-friendly utility website.

Do not create generic template pages. Every site must have a clear user job, competitor-informed UX improvements, original examples, useful SEO content, edge-case handling, an intentional design direction, and acceptance tests.

## Required inputs

Minimum input:

```text
keyword: <primary keyword>
site-id: <kebab-case site id>
category: generator | solver | maker | converter | tester | checker | calculator | formatter | other
locale: en
market: US
```

Optional input:

```text
domain: <canonical domain>
competitors:
  - <url>
  - <url>
notes: <known constraints or monetization notes>
```

If a value is missing, infer a reasonable default from the keyword and document the assumption in the research files. Do not stop only to ask for clarification unless the missing value blocks safe implementation.

## Modes and gates

Pick one mode at the start and record it in `sites/<site-id>/research/status.md`, `sites/<site-id>/research/codex-build-prompt.md`, or the final summary:

```text
research-only
design-only
implement
post-ui-review
launch-review
repair-gate
audit
```

Default to `research-only` for keyword or competitor research. Default to `design-only` when the user asks for visual direction without code. Default to `implement` only when the user asks to build, improve, or finish the site. Use `post-ui-review` after meaningful UI changes, `launch-review` before indexing decisions, and `repair-gate` when a previous run failed a gate and needs targeted fixes.

For exact mode definitions, completion statuses, readiness scores, and hard stop rules, read `references/gates.md` when the task may cross from research into implementation.

STOP: In `research-only`, `design-only`, `audit`, and `launch-review`, do not edit implementation files unless the user explicitly changes the mode. In `post-ui-review`, do not fix code unless the user approved fix mode or the active skill is `gstack-qa` / `gstack-design-review` with fix permission.

## Phase protocol

When the task can move from research to implementation, follow this phase order and record the current phase in `sites/<site-id>/research/codex-build-prompt.md` or the final summary:

```text
Phase 1: research gate
Phase 2: design gate
Phase 3: implementation gate
Phase 4: post-UI QA gate
Phase 5: launch review gate
```

For each phase, update `sites/<site-id>/research/status.md` when it exists and record:

- Allowed writes
- Required evidence
- Exit criteria
- Blockers or deferred items

Do not mix phases silently. Research must be a decision input before implementation, not a post-hoc explanation after implementation files have already changed.

Use these workflow checks when applicable:

```bash
pnpm site research-audit <site-id>
pnpm site trace-audit <site-id>
pnpm site launch-review <site-id>
```

## Continuation commands

After a research pass is complete, the user should not need to paste a long build prompt. Treat these short requests as approval to switch to `implement` mode for the named site:

```text
继续实现 <site-id>
开始实现 <site-id>
build <site-id>
implement <site-id>
continue <site-id>
```

When triggered, read `sites/<site-id>/research/codex-build-prompt.md` plus the research files it lists, then follow the gates there. If the build prompt is missing or stale, update it first from the research files instead of asking the user for a long prompt.

At the end of every `research-only` pass, include one short next command in the final response:

```text
下一步发送：继续实现 <site-id>
```

## Workflow

### 1. Decide whether the keyword deserves a standalone site

Before writing code, score the opportunity using this model:

```text
Total: 100

1. User task clarity: 25
2. Competitor weakness: 20
3. Differentiation potential: 20
4. SEO feasibility: 20
5. Maintenance simplicity: 15
```

Decision:

```text
80-100: build standalone site
65-79: build if there is clear differentiation
50-64: consider cluster page or supporting guide
<50: skip or defer
```

Write the decision into `sites/<site-id>/research/keyword-intent.md`.

### 2. Research competitors

Create or update:

```text
sites/<site-id>/research/competitor-research.md
```

Required data source:

- Use Bing Webmaster Tools Keyword Research, not an ad-hoc public SERP, for the primary competitor set.
- Follow `/Users/bin/.codex/skills/seo-demand-validation/SKILL.md` for the Bing Webmaster Keyword Research flow.
- For logged-in Bing Webmaster access, load and follow `/Users/bin/.codex/skills/web-access/SKILL.md` and run its CDP preflight before browser/network actions.
- Open `https://www.bing.com/webmasters/keywordresearch?siteUrl=<encoded bing_site_url>`.
- Search the exact primary keyword.
- Set the date range to `3M` unless the user specifies another range.
- Use the `Top 10 url ranking on this keyword` table as the source of ranking competitors.
- Select the first 5 rows from that Bing Webmaster ranking table as the required competitor set.

#### Bing Webmaster capture gate

`competitor-research.md` must include a `Bing Webmaster Capture Attempt` record before implementation. Use exactly one status:

```text
captured
blocked-with-evidence
not-attempted
user-approved-skip
```

Use `references/gates.md` and the competitor template for required evidence fields. Public SERP results are never a substitute for Bing Webmaster top 5. They may be listed only as low-confidence fallback references.

STOP: Do not mark Bing Webmaster as blocked without attempted URL, timestamp, blocker text or screenshot/artifact, and missing permission/login state.

STOP: Do not continue to implementation when Bing status is `not-attempted`, unless the user explicitly approves code-only work.

STOP: Do not continue to implementation when Bing status is `blocked-with-evidence`, unless the user explicitly approves fallback implementation or code-only work.

Readiness caps:

- `captured`: no automatic research cap from Bing source.
- `blocked-with-evidence`: `Research readiness` must be `<= 7`, `Research status` must be `READY_WITH_FALLBACK` or `BLOCKED`, and implementation needs explicit fallback approval.
- `not-attempted`: `Research readiness` must be `<= 3`, `Research status` must be `NOT_ATTEMPTED`, and implementation is blocked.
- `user-approved-skip`: record the approval context and keep `Launch status: DRAFT_ONLY` until non-Bing evidence is manually reviewed.

Do not only list competitors. Convert findings into concrete build requirements.

If Bing Webmaster access is blocked, do not silently replace it with a generic public SERP. Record `blocked-with-evidence`, then use user-supplied competitor URLs or existing repository examples only as fallback inputs and clearly mark them as `fallback, not Bing Webmaster ranking`.

Additional adjacent-intent competitors are optional. They may be added only after the required Bing Webmaster top 5 are recorded, and they must be labeled as `reference competitor`, not part of the primary ranking set.

### 3. Define the product

Create or update:

```text
sites/<site-id>/research/product-requirements.md
```

Use the product requirements template. Cover user job, core flow, features, non-goals, input/output behavior, states, edge cases, privacy, and performance.

### 4. Define SEO spec

Create or update:

```text
sites/<site-id>/research/seo-spec.md
```

Use the SEO spec template. Cover metadata, H1, hero subtitle, content structure, FAQ, internal links, schema, canonical, and indexing.

SEO-critical content must be statically rendered or server-rendered. Tool interactivity can hydrate on the client.

### 5. Define UX spec

Create or update:

```text
sites/<site-id>/research/ux-spec.md
```

The UX spec must explain how this site will feel different from other sites in the factory.

Use the UX spec template. Cover first viewport, task path, mobile, empty/result/error states, accessibility, ad restrictions, and UI differentiation.

### 6. Define the design direction

Create or update:

```text
sites/<site-id>/research/design-direction.md
```

In this skill, a site is treated as design-new when it does not have an approved, keyword-specific design direction. A site directory may already exist and still count as design-new.

Run `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-consultation/SKILL.md` when any of these are true:

- The site pack does not exist.
- The site exists but is scaffold-only or draft without `research/design-direction.md`.
- `design-direction.md` is generic, stale, placeholder-like, or not tied to competitor research.
- `design-review.md` is missing for a UI-bearing site.
- The site belongs to a cluster without a clear reusable design system.
- Competitor research or UI audit shows a need for stronger visual differentiation.
- The user asks for redesign or visual exploration.

You may skip full design consultation only when all of these are true:

- `design-direction.md` exists and is keyword-specific.
- `design-review.md` exists.
- The current task is a small copy, metadata, bug, or pure logic change.
- There is no meaningful layout/UI change and no UI similarity risk.

Design skill roles:

- `design-consultation` decides what good means: product context, constraints, success criteria, and recommended direction.
- `design-shotgun` explores multiple options inside the approved consultation constraints; it must not redefine the user job or design goals.
- `plan-design-review` chooses and tightens the plan before implementation.
- `frontend-design` builds the approved plan; it must not invent a new visual system.
- `design-review` audits the built page after implementation.

Use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-shotgun/SKILL.md` only when multiple visual directions are useful: high-competition keyword, unclear direction, user asks for variants, cluster similarity risk, or a new visual cluster is being established.

Use `/Users/bin/.codex/skills/frontend-design/SKILL.md` only when translating the approved direction into frontend code.

Use the design direction template. It must be keyword-specific and include explicit UI differentiation from similar factory sites.

For this repository, do not blindly overwrite root `DESIGN.md` for every single site. Prefer site-specific or cluster-specific design records unless the whole factory design system is changing.

### 7. Review the design plan before implementation

Create or update:

```text
sites/<site-id>/research/design-review.md
```

Use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-plan-design-review/SKILL.md` when the site has UI scope and a design plan exists. The review should happen after product/SEO/UX/design direction are drafted and before implementation.

Use the design review template. Check hierarchy, states, journey, AI-template risk, design-system alignment, responsive behavior, accessibility, and unresolved visual choices.

Any approved mockup paths or design-board decisions must be recorded in `design-review.md` and reflected in `design-direction.md`, `layout.config.yaml`, and `theme.config.yaml` during implementation.

### 8. Pass the research completion gate

A keyword research pass is not complete if it only updates `competitor-research.md`. Before implementation, update every file below with keyword-specific decisions, or add a `Deferred:` note in that file explaining the blocker, reason, and next action.

Required research outputs for the pre-implementation research gate include keyword intent, competitor research, product requirements, SEO spec, UX spec, design direction, design review, acceptance tests, `status.md`, `brief.v2.draft.yaml`, and `codex-build-prompt.md`.

`implementation-trace.md` may be generated by `pnpm site:plan`, but it is a post-implementation trace file. Before implementation it may remain `Trace status: pending-implementation`; after implementation it must be completed before the work is called implementation-complete.

Completion rules:

- Do not stop after competitor research unless the user explicitly asked for competitor research only.
- Do not leave template placeholders, empty tables, or generic boilerplate as if they were completed research.
- Do not count a file as complete just because it exists.
- Do not count `Deferred:` as valid unless it includes the blocker, missing evidence, impact, and next action.
- Do not assign high readiness scores from generic claims. Scores must be traceable to evidence in the research files.
- If a file cannot be completed yet, add `Deferred:` with the reason, what evidence is missing, and the next action.
- Completed research files must make concrete decisions for this keyword. At minimum, the completed set must include evidence used, decisions made, and implementation implications across competitor, product, SEO, UX, design, acceptance, and build prompt files.
- The final research summary must list completed files and deferred files with reasons.
- Run `pnpm site research-audit <site-id>` before moving into implementation when the command is available. Fix P0 issues or record why the gate is explicitly bypassed by the user.

STOP: Do not treat research as complete when only `competitor-research.md` changed.

### 9. Pass the implementation edit gate

Do not edit implementation files before the research completion gate is satisfied, unless the user explicitly asks for a code-only change or an emergency bug fix.

Before this gate is satisfied, allowed writes are limited to:

```text
sites/<site-id>/research/*
sites/<site-id>/research/brief.v2.draft.yaml
```

Implementation writes are blocked until the research files are completed or explicitly marked `Deferred:`:

```text
apps/**
packages/**
scripts/**
sites/<site-id>/brief.yaml
sites/<site-id>/site.config.yaml
sites/<site-id>/tool.config.yaml
sites/<site-id>/theme.config.yaml
sites/<site-id>/layout.config.yaml
sites/<site-id>/content/**
sites/<site-id>/messages/**
```

Default single-site implementation scope:

```text
sites/<site-id>/**
apps/site/src/features/<tool-id>/**
packages/tools/<tool-id>/**
renderer registry only when needed
```

If a run touches files outside this scope, list them as `Scope drift` in `status.md`, `implementation-trace.md`, or the final summary. Do not modify unrelated dirty files just because they are present in the worktree.

To pass this gate, record in `sites/<site-id>/research/codex-build-prompt.md` or the final research summary:

- Competitor source status and implementation gate result:

| Competitor source status | Implementation gate result |
|---|---|
| `captured` | Passes when Bing rows are recorded and the rest of the research gate is complete. |
| `user-approved-skip` | Passes as approved fallback only; keep `Launch status: DRAFT_ONLY` until manual review. |
| `blocked-with-evidence` + explicit fallback approval | Passes as fallback implementation only; keep `Research readiness <= 7`. |
| `blocked-with-evidence` without explicit fallback approval | Blocked. |
| `not-attempted` | Blocked unless the user explicitly asks for code-only work. |

- For `blocked-with-evidence`, record attempted URL, timestamp, blocker evidence, fallback source, and fallback confidence.
- Product, SEO, UX, design, and acceptance files completed or deferred.
- Design-new decision made.
- Pre-implementation design review completed or deferred.
- Implementation write scope approved.

If the user explicitly asks for code-only work, state that the research gate is being bypassed for that request and do not pretend the site is launch-ready.

STOP: Do not edit implementation files before this gate passes. If bypassed by explicit user request, set `Implementation status: BYPASSED_BY_USER`.

### 10. Score readiness before implementation

Record these 0-10 scores in `sites/<site-id>/research/codex-build-prompt.md` or the final research summary:

```text
Research readiness:
Design specificity:
Launch readiness:
```

Scoring guide:

- `Research readiness`: 10 means Bing top 5 captured, all research files keyword-specific, and no deferred blocker; 7 means usable fallback with evidence; 0-3 means not attempted or mostly placeholders.
- `Design specificity`: 10 means the visual direction, states, mobile behavior, and differentiation are explicit enough to implement; 7 means usable but some polish deferred; 0-3 means generic or missing.
- `Launch readiness`: 10 means validation, SEO, performance, UI audit, and post-UI review pass and indexing can be considered; 7 means draft is reviewable; 0-3 means draft-only or blocked.

Score caps:

- Bing status `blocked-with-evidence`: `Research readiness <= 7`.
- Bing status `not-attempted`: `Research readiness <= 3`.
- Missing or deferred pre-implementation `plan-design-review` for meaningful UI work: `Design specificity <= 5`.
- Missing browser/screenshot evidence after meaningful UI work: `Launch readiness <= 5`.

STOP: Do not start implementation with `Research readiness < 7` unless the user explicitly approves fallback/code-only implementation.

### 11. Create or update the site pack

Use the repository factory structure.

Required files:

```text
sites/<site-id>/brief.yaml
sites/<site-id>/site.config.yaml
sites/<site-id>/tool.config.yaml
sites/<site-id>/theme.config.yaml
sites/<site-id>/layout.config.yaml
sites/<site-id>/content/<locale>/home.mdx
sites/<site-id>/content/<locale>/faq.mdx
sites/<site-id>/messages/<locale>.yaml
```

The site must start as draft unless explicitly approved:

```yaml
lifecycle:
  status: draft

indexing:
  allowIndex: false
  mode: disallow
```

Do not enable indexing until content is reviewed, tool behavior is tested, and audits pass.

### 12. Implement pure tool logic

Pure transformation, solving, formatting, or generation logic belongs under:

```text
packages/tools/<tool-id>/
```

Requirements:

- Keep logic independent from UI rendering.
- Export small, testable functions.
- Handle the edge cases listed in the acceptance tests.
- Avoid unnecessary dependencies.
- Do not send raw user input to analytics or servers unless the brief explicitly requires server-side processing and privacy notes are updated.

### 13. Implement interactive UI

Interactive UI belongs under:

```text
apps/site/src/features/<tool-id>/
```

Before implementing visual UI, read:

```text
sites/<site-id>/research/design-direction.md
sites/<site-id>/research/design-review.md
```

Use `/Users/bin/.codex/skills/frontend-design/SKILL.md` for production-grade frontend implementation. Treat the approved design direction as the source of truth; do not invent a new visual system during implementation.

STOP: Do not implement visual UI before `design-direction.md` and pre-implementation `design-review.md` exist, unless they are explicitly deferred with a reason and the task is code-only.

UX requirements:

- No login required for the core task.
- Primary input visible immediately.
- Output visible without unnecessary navigation.
- One-click copy when useful.
- Clear/reset action.
- Example inputs.
- Mobile-first layout.
- Accessible labels.
- Visible focus states.
- No ads near primary actions.
- No raw user input in analytics events.

### 14. Pass the post-UI optimization gate

After UI implementation, the site is not implementation-complete until UI quality has been reviewed or explicitly deferred with a reason.

Use these GStack skills when available:

```text
/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-review/SKILL.md
/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-qa/SKILL.md
/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-qa-only/SKILL.md
/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-benchmark/SKILL.md
```

Gate rules:

- Run `design-review` after meaningful UI changes. Focus on first-viewport tool visibility, visual hierarchy, spacing, responsive behavior, contrast, focus states, output overflow, and AI-template risk.
- Run `qa` when UI interactions changed and direct fixes are allowed. Use `qa-only` instead when the user asks for report-only QA or when fixes need approval first.
- Run `benchmark` before launch, after large CSS/JS changes, or after adding dependencies that could affect page weight.
- Capture browser evidence after meaningful UI work: desktop screenshot, 390px mobile screenshot, first-viewport tool visibility, main task path, visual hierarchy issues, fixes applied, and remaining issues.
- If browser tooling or screenshots are unavailable, record `Deferred:` with the blocker and cap `Launch readiness <= 5`.
- Record findings, fixes, or `Deferred:` reasons in `sites/<site-id>/research/design-review.md` and `sites/<site-id>/research/acceptance-tests.md`.

STOP: Do not call UI implementation complete after rendering alone. Record design-review/QA/benchmark results or explicit `Deferred:` reasons.

STOP: Do not mark full GStack visual review as complete without post-implementation evidence. A report-only placeholder or a deferred note is not a completed design review.

STOP: For a new UI-bearing site, do not score `Launch readiness > 4` unless post-UI `gstack-design-review` ran after implementation.

STOP: If UI interactions changed, do not score `Launch readiness > 5` unless `gstack-qa` or `gstack-qa-only` ran.

STOP: If post-UI design review and interaction QA are both deferred, keep `Launch status: DRAFT_ONLY`.

### 15. Register the tool renderer

Update the selected tool routing so that `primaryTool: <tool-id>` can render the correct island.

Do not hard-code site IDs, domains, analytics IDs, ad IDs, verification tokens, or canonical URLs inside page components.

### 16. Add tests and acceptance checks

Create or update:

```text
sites/<site-id>/research/acceptance-tests.md
```

Add unit tests for pure logic where possible.

The acceptance tests must include:

- Functional tests
- UX tests
- SEO tests
- Accessibility tests
- Design-direction checks
- Performance checks
- Edge cases

### 17. Run validation

After changes, run:

```bash
pnpm site research-audit <site-id>
pnpm site check <site-id>
pnpm site build <site-id>
pnpm seo audit <site-id>
pnpm seo lint-content <site-id>
pnpm perf audit <site-id>
pnpm site ui-audit <site-id>
pnpm site trace-audit <site-id>
pnpm site launch-review <site-id>
```

If multiple sites were changed, also run:

```bash
pnpm ops report
```

Fix P0 issues before considering the work complete. Note any P1/P2 tradeoffs in the final summary.

STOP: Do not enable indexing or call the site launch-ready until validation has no P0 issues and launch status is explicitly `READY_TO_INDEX`.

### 18. Pass the research consumption trace gate

After implementation and validation, create or update:

```text
sites/<site-id>/research/implementation-trace.md
```

This file must prove that the research was consumed, not merely created.

Required trace coverage:

- Keyword intent and standalone-site decision.
- Bing competitor opportunities and must-win gaps.
- Product feature requirements.
- SEO metadata, content, FAQ, schema, and internal-link requirements.
- UX states, mobile behavior, accessibility, and privacy requirements.
- Design direction and design review decisions reflected in layout, theme, content, and UI.
- Acceptance tests and validation results.
- Research decisions that were not implemented, with reason, impact, and next action.

Trace rules:

- Before implementation, `implementation-trace.md` may be `pending-implementation`.
- After implementation, do not call implementation complete until the trace status is `complete`.
- Do not use a generic summary. Every meaningful row must map `research source -> decision -> implementation file or behavior -> validation evidence -> status`.
- If implementation intentionally does not consume a research decision, record it under unconsumed/deferred research.
- Reconcile stale research statuses after implementation, such as `research-only`, `future implementation`, or `blocked until implement request`, when they no longer describe the current state.
- `pnpm site trace-audit <site-id>` must pass before an implementation-complete or launch-ready claim.

STOP: Do not call a site implementation complete without an updated `implementation-trace.md` for non-trivial site pack, tool logic, UI, or content changes.

### 19. Pass the launch readiness dashboard

Before claiming a site is launch-ready or review-ready, create or update:

```text
sites/<site-id>/research/launch-review.md
```

Run:

```bash
pnpm site launch-review <site-id>
```

The dashboard must summarize:

- Research evidence and Bing source status
- Research completion
- Design plan and post-UI design review
- Browser QA and interaction QA
- SEO/content/perf/UI validation
- Research consumption trace
- Scope drift
- Indexing status
- Launch status

`READY_TO_INDEX` requires explicit user approval. Without that approval, keep `Launch status: DRAFT_ONLY` or `READY_FOR_REVIEW` and keep indexing disabled.

If `site.config.yaml` has `indexing.allowIndex: true`, `launch-review.md` must record both `Launch status: READY_TO_INDEX` and `Explicit indexing approval recorded: yes`.

## Required output format for implementation summaries

When finishing a site implementation, summarize:

```text
Site ID:
Primary keyword:
Mode:
Decision score:
Research readiness:
Design specificity:
Launch readiness:
Files changed:
Tool logic:
UI implementation:
SEO content:
Design direction:
Design review:
Post-UI optimization:
Research consumption trace:
Research completion:
Implementation edit gate:
Research status:
Implementation status:
Launch status:
Differentiators:
Validation commands run:
Known tradeoffs:
Indexing status:
```

When finishing a `research-only` pass, summarize the research status and include:

```text
Next command: 继续实现 <site-id>
```

## Quality bar

A site is not ready for indexing unless:

- The tool works for the primary user job.
- Content is specific to the keyword.
- Examples are realistic.
- FAQ answers real user questions.
- Competitor weaknesses are addressed.
- The design direction is explicit and implemented.
- The design plan has been reviewed before frontend implementation.
- The UI is not too similar to existing sites.
- The site passes YAML validation.
- SEO-critical content is statically rendered.
- User input is not collected in analytics.
- Ads are not placed near primary actions.
- Performance budget is respected.
- Mobile UX is good.

## Do not do

- Do not create thin template pages.
- Do not keyword-stuff.
- Do not add fake reviews or fake ratings.
- Do not mark hidden FAQ as structured data.
- Do not enable indexing on draft content.
- Do not bypass schema validation.
- Do not hard-code domain, analytics, ad, or verification IDs.
- Do not place ads near Copy, Convert, Upload, Retry, Start, or Download actions.
- Do not send raw user input to analytics.

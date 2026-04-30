# SEO Tool Site Factory Skill Workflow

This workflow turns a keyword into a researched, differentiated, buildable utility site inside this repository.

## Why this exists

The repository can already create, build, deploy, and verify independent SEO tool sites. The missing step is a repeatable product and competitor-research workflow that prevents new sites from becoming thin template clones.

Use the skill at:

```text
.codex/skills/seo-tool-site-factory/SKILL.md
```

## Recommended workflow

```bash
pnpm site create <site-id> --category <category> --tool <tool-id> --default-locale en
pnpm site:plan <site-id> --keyword "<primary keyword>" --category <category> --locale en --market US
```

Before implementation, use the generated design files to choose and review the visual direction:

```text
sites/<site-id>/research/design-direction.md
sites/<site-id>/research/design-review.md
```

Use the design pipeline with clear roles:

```text
design-consultation: define design goals, constraints, and success criteria
design-shotgun: optional variants inside those constraints
plan-design-review: choose and tighten the plan before implementation
frontend-design: implement the approved plan
design-review: audit the built page
```

An existing draft site still counts as design-new when it has no approved, keyword-specific `research/design-direction.md`. Scaffold-only sites and unreviewed draft sites should not skip design consultation just because their directories already exist.

After UI implementation, run the post-UI optimization gate:

```text
design-review: required for meaningful UI changes
qa or qa-only: required when interactions changed
benchmark: required before launch or after large CSS/JS/dependency changes
```

After research is complete, ask Codex with the short continuation command:

```text
继续实现 <site-id>
```

The skill treats this as approval to switch to `implement` mode, reads `sites/<site-id>/research/codex-build-prompt.md`, and follows the gates recorded there.

If you want the explicit long form, use:

```text
Use .codex/skills/seo-tool-site-factory/SKILL.md.
Read the research files under sites/<site-id>/research/ and implement the site.
Keep it draft and do not enable indexing.
Run the validation commands and fix P0 issues.
```

## Generated research files

`pnpm site:plan` creates:

```text
sites/<site-id>/research/keyword-intent.md
sites/<site-id>/research/competitor-research.md
sites/<site-id>/research/product-requirements.md
sites/<site-id>/research/seo-spec.md
sites/<site-id>/research/ux-spec.md
sites/<site-id>/research/design-direction.md
sites/<site-id>/research/design-review.md
sites/<site-id>/research/acceptance-tests.md
sites/<site-id>/research/implementation-trace.md
sites/<site-id>/research/status.md
sites/<site-id>/research/launch-review.md
sites/<site-id>/research/codex-build-prompt.md
sites/<site-id>/research/brief.v2.draft.yaml
```

The research files are intentionally not a replacement for manual review. They are a structured starting point for competitor analysis, product decisions, and Codex implementation.

## Operating modes

Record one mode before starting:

```text
research-only
design-only
implement
post-ui-review
audit
launch-review
repair-gate
```

Default to `research-only` for keyword or competitor research. Use `design-only` for visual planning without code, `implement` for build work, `post-ui-review` for review-only UI QA, `repair-gate` for targeted gate fixes, and `launch-review` for final readiness inspection. In `research-only`, `design-only`, `audit`, and `launch-review`, do not edit implementation files unless the user explicitly changes the mode.

## Phase protocol

Use these phases whenever a task can move from research to implementation:

```text
Phase 1: research gate
Phase 2: design gate
Phase 3: implementation gate
Phase 4: post-UI QA gate
Phase 5: launch review gate
```

Each phase must record:

```text
Current phase:
Allowed writes:
Required evidence:
Exit criteria:
Blockers/deferred:
```

The canonical phase state lives in:

```text
sites/<site-id>/research/status.md
```

The important constraint is ordering: research and design records must guide implementation, not be written afterward to justify implementation choices.

## Research completion gate

A keyword research pass is not complete when only `competitor-research.md` is filled. Before implementation, every generated research output must contain keyword-specific decisions, or it must include a `Deferred:` note with the blocker, reason, missing evidence, and next action.

Required files:

```text
sites/<site-id>/research/keyword-intent.md
sites/<site-id>/research/competitor-research.md
sites/<site-id>/research/product-requirements.md
sites/<site-id>/research/seo-spec.md
sites/<site-id>/research/ux-spec.md
sites/<site-id>/research/design-direction.md
sites/<site-id>/research/design-review.md
sites/<site-id>/research/acceptance-tests.md
sites/<site-id>/research/status.md
sites/<site-id>/research/brief.v2.draft.yaml
sites/<site-id>/research/codex-build-prompt.md
```

`implementation-trace.md` may be generated at plan time with `Trace status: pending-implementation`. It is not a blocker for starting implementation. It becomes required after implementation changes.

Do not move into site-pack or UI implementation unless this gate is satisfied, unless the user explicitly asked for competitor research only.

Files are not complete just because they exist. Do not count placeholders, empty tables, copied template text, generic tool-site claims, or unsupported scores as completed research.

Completed research must contain enough of this trail for a reviewer to understand the implementation:

```text
Evidence used:
Decisions made:
Implementation implications:
Deferred items:
```

Run before implementation:

```bash
pnpm site research-audit <site-id>
```

## Implementation edit gate

Research must be decision input, not a post-hoc explanation. Do not edit implementation files until the research completion gate is satisfied, unless the user explicitly asks for code-only work or an emergency bug fix.

Before the gate is satisfied, only these writes are allowed:

```text
sites/<site-id>/research/*
sites/<site-id>/research/brief.v2.draft.yaml
```

These paths are blocked until the gate passes:

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

Single-site implementation should normally stay inside:

```text
sites/<site-id>/**
apps/site/src/features/<tool-id>/**
packages/tools/<tool-id>/**
renderer registry only when needed
```

Dirty files outside this scope must be listed as `Scope drift` and left untouched unless they block the current site.

If this gate is bypassed for an explicit code-only request, record that the site is not launch-ready from the skill workflow perspective.

Competitor source status controls whether implementation can start:

| Competitor source status | Implementation gate result |
|---|---|
| `captured` | Passes when Bing rows are recorded and the rest of the research gate is complete. |
| `user-approved-skip` | Passes as approved fallback only; keep `Launch status: DRAFT_ONLY` until manual review. |
| `blocked-with-evidence` + explicit fallback approval | Passes as fallback implementation only; keep `Research readiness <= 7`. |
| `blocked-with-evidence` without explicit fallback approval | Blocked. |
| `not-attempted` | Blocked unless the user explicitly asks for code-only work. |

Before implementation, record:

```text
Research readiness: 0-10
Design specificity: 0-10
Launch readiness: 0-10
Research status: READY / READY_WITH_FALLBACK / BLOCKED / NOT_ATTEMPTED
Implementation status: READY / BLOCKED / BYPASSED_BY_USER
Launch status: DRAFT_ONLY / READY_FOR_REVIEW / READY_TO_INDEX
```

Do not start implementation with `Research readiness < 7` unless the user explicitly approves fallback or code-only implementation.

Bing source caps:

```text
captured:
  no automatic research cap

blocked-with-evidence:
  Research readiness <= 7
  Research status: READY_WITH_FALLBACK or BLOCKED
  implementation requires explicit fallback approval

not-attempted:
  Research readiness <= 3
  Research status: NOT_ATTEMPTED
  implementation blocked unless the user asks for code-only work

user-approved-skip:
  approval context must be recorded
  Launch status remains DRAFT_ONLY until manual review
```

Design caps:

```text
missing/deferred pre-implementation plan-design-review:
  Design specificity <= 5

missing post-implementation browser/screenshot evidence:
  Launch readiness <= 5
```

## Post-UI optimization gate

The UI is not complete immediately after code renders. For SEO tool sites, task speed and trust are part of the product.

Required behavior:

- Run `gstack-design-review` after meaningful UI changes, or mark it `Deferred:` with a reason.
- Use `post-ui-review` mode when the task is review-only.
- Run `gstack-qa-only` when interaction QA should report findings without fixes.
- Run `gstack-qa` or `repair-gate` only when fixes are approved.
- Run `gstack-benchmark` before launch, after large CSS/JS changes, or after adding dependencies.
- Record desktop and 390px mobile screenshot evidence after meaningful UI changes.
- Record first-viewport tool visibility, main task path tested, visual hierarchy issues, fixes applied, and remaining issues.
- If browser/screenshot evidence is unavailable, mark it `Deferred:` and keep `Launch readiness <= 5`.
- For a new UI-bearing site, if post-UI `gstack-design-review` is deferred, `Launch readiness` must be `<= 4`.
- If interactions changed and `gstack-qa` / `gstack-qa-only` is deferred, `Launch readiness` must be `<= 5`.
- If both visual review and interaction QA are deferred, `Launch status` must remain `DRAFT_ONLY`.
- Deferred visual/browser QA is acceptable for draft implementation only, never for `READY_TO_INDEX`.

Do not mark full visual review complete when it is only a placeholder, a pre-implementation review, or a deferred note.

Record results and fixes in:

```text
sites/<site-id>/research/design-review.md
sites/<site-id>/research/acceptance-tests.md
```

## Workflow audit commands

The skill has lightweight local checks for the gates that were easy to fake in prose:

```bash
pnpm site research-audit <site-id>
pnpm site trace-audit <site-id>
pnpm site launch-review <site-id>
pnpm site launch-review <site-id> --check-scope
```

`research-audit` checks required research files and Bing evidence. `trace-audit` checks that implementation consumed research and only passes when `Trace status: complete`. `launch-review` checks the readiness dashboard and key caps. `--check-scope` also reports dirty files outside the single-site write scope.

## Research consumption trace gate

After implementation and validation, update:

```text
sites/<site-id>/research/implementation-trace.md
```

This file proves that research was consumed during implementation.

Required trace coverage:

- Keyword intent and standalone-site decision.
- Bing competitor opportunities and must-win gaps.
- Product feature requirements.
- SEO metadata, content, FAQ, schema, and internal-link requirements.
- UX states, mobile behavior, accessibility, and privacy requirements.
- Design direction and design review decisions reflected in layout, theme, content, and UI.
- Acceptance tests and validation results.
- Research decisions that were not implemented, with reason, impact, and next action.

Do not call implementation complete while `implementation-trace.md` is missing, still `pending-implementation`, or only a generic summary.

## Launch readiness dashboard

Before saying a site is review-ready or launch-ready, update:

```text
sites/<site-id>/research/launch-review.md
```

The dashboard must include research evidence, design plan, UI implementation, browser QA, interaction QA, SEO/content/perf/UI validation, research trace, scope drift, indexing status, and launch status.

Passing validation does not mean indexing can be enabled. `READY_TO_INDEX` requires explicit user approval. If `site.config.yaml` has `indexing.allowIndex: true`, `launch-review.md` must record `Launch status: READY_TO_INDEX` and `Explicit indexing approval recorded: yes`.

The trace should map:

```text
research source -> decision -> implementation file/behavior -> validation evidence -> status
```

## Competitor source

Primary competitors must come from Bing Webmaster Tools Keyword Research, using the `Top 10 url ranking on this keyword` table for the exact primary keyword. Record the first 5 rows as the required competitor set.

Use `seo-demand-validation` for the Bing Keyword Research workflow and `web-access` for logged-in browser/CDP access.

Every competitor file must include a `Bing Webmaster Capture Attempt` record with one status:

```text
captured
blocked-with-evidence
not-attempted
user-approved-skip
```

Do not mark Bing Webmaster as blocked unless an actual attempt was made and recorded with attempted URL, timestamp, blocker text or screenshot/artifact, and the missing permission/login state. If there was no actual attempt, the status is `not-attempted`.

Public SERP results are not a replacement for Bing Webmaster top 5 competitors. They can only be low-confidence fallback references. `not-attempted` blocks implementation unless the user explicitly asks for code-only work.

## Launch guard

A site should remain draft and non-indexable until:

- The tool works for the primary user job.
- The content is reviewed and keyword-specific.
- Competitor weaknesses are addressed.
- The visual direction is explicit and reviewed before implementation.
- Acceptance tests pass.
- `pnpm site check <site-id>` passes.
- `pnpm site build <site-id>` passes.
- `pnpm site research-audit <site-id>` passes.
- `pnpm site trace-audit <site-id>` passes.
- `pnpm site launch-review <site-id>` passes.
- `pnpm seo audit <site-id>` has no P0 issue.
- `pnpm perf audit <site-id>` has no severe regression.
- `pnpm site ui-audit <site-id>` does not show unacceptable similarity.

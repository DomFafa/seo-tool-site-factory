# Gates Reference

Use this reference when a task is close to crossing from research into implementation, or when a gate status is ambiguous.

## Operating Modes

```text
research-only: create/update research files only; do not edit implementation files.
design-only: create/update design direction and plan review only; do not edit implementation files.
plan-only: legacy alias for research-only plus build plan; do not edit implementation files.
implement: complete gates, then edit site pack, tool logic, and UI.
post-ui-review: review implemented UI with browser/design/QA evidence; fix only if explicitly allowed.
audit: inspect existing site/research and report gaps; edit only if explicitly asked.
launch-review: verify launch readiness; do not enable indexing unless explicitly approved.
repair-gate: fix the smallest set of files needed to clear a failed gate.
```

Default to `research-only` for keyword or competitor research. Default to `implement` only when the user asks to build, improve, or finish the site.

## Phase Protocol

Use these phases whenever a task can cross from research into implementation:

```text
Phase 1: research gate
Phase 2: design gate
Phase 3: implementation gate
Phase 4: post-UI QA gate
Phase 5: launch review gate
```

Every phase must update `sites/<site-id>/research/status.md` when it exists and record:

```text
Current phase:
Allowed writes:
Required evidence:
Exit criteria:
Blockers/deferred:
```

Phase rules:

- Phase 1 writes only `sites/<site-id>/research/**` and `sites/<site-id>/research/brief.v2.draft.yaml`.
- Phase 2 writes research design records only, unless the user has explicitly entered `implement` mode and the implementation gate has passed.
- Phase 3 may edit site pack, tool logic, UI, and routing only after Phase 1 and Phase 2 have passed or been explicitly bypassed by the user.
- Phase 4 must happen after meaningful UI changes and before implementation is called complete.
- Phase 5 is the only phase that can consider `READY_TO_INDEX`, and only with explicit user approval.
- `repair-gate` mode edits only files needed to clear the named failed gate.

Research written after implementation starts is supporting documentation, not evidence that the implementation gate was satisfied before editing.

Workflow audit commands:

```bash
pnpm site research-audit <site-id>
pnpm site trace-audit <site-id>
pnpm site launch-review <site-id>
```

## Completion Statuses

```text
Research status: READY / READY_WITH_FALLBACK / BLOCKED / NOT_ATTEMPTED
Implementation status: READY / BLOCKED / BYPASSED_BY_USER
Launch status: DRAFT_ONLY / READY_FOR_REVIEW / READY_TO_INDEX
```

Claims without evidence do not satisfy gates. Evidence can be captured rows, attempted URLs, screenshots/artifacts, command output summaries, or report paths.

## Bing Webmaster Capture Status

Use exactly one status:

```text
captured
blocked-with-evidence
not-attempted
user-approved-skip
```

Required evidence fields:

```text
Status:
Attempted at:
Attempted by:
Bing siteUrl:
Exact keyword:
Date range:
Attempted URL:
Browser/session:
Result:
Blocker text:
Screenshot or artifact path:
Raw captured top 10 rows:
```

Rules:

- `captured`: Bing Webmaster ranking table was read for the exact keyword/date range.
- `blocked-with-evidence`: an actual web-access/manual/user-evidence attempt happened and includes attempted URL, timestamp, blocker text or screenshot/artifact, and missing permission/login state.
- `not-attempted`: no actual Bing Webmaster attempt was made. Do not call this blocked.
- `user-approved-skip`: user explicitly approved skipping Bing Webmaster for this task. Record the approval context.
- Public SERP results are never a substitute for Bing Webmaster top 5. They may be low-confidence fallback references only.

Implementation impact:

- `captured`: can satisfy the competitor source requirement when rows are recorded.
- `blocked-with-evidence`: can support fallback research only. It does not authorize implementation unless the user explicitly approves fallback implementation or asks for code-only work.
- `not-attempted`: blocks implementation. `Research readiness` must be `<= 3`.
- `user-approved-skip`: can authorize fallback work, but the approval context must be recorded and `Launch status` must remain `DRAFT_ONLY` until manual review.

Evidence quality:

- A claim that Bing was blocked is not evidence.
- A generic public SERP result is not evidence of Bing Webmaster ranking.
- A copied competitor list without raw Bing rows or an artifact path does not satisfy `captured`.
- If screenshots are referenced, record their paths or enough artifact detail for a reviewer to find them.

## Readiness Scores

Record before implementation:

```text
Research readiness:
Design specificity:
Launch readiness:
```

Scoring:

- `Research readiness`: 10 means Bing top 5 captured, all research files keyword-specific, no deferred blocker; 7 means usable fallback with evidence; 0-3 means not attempted or mostly placeholders.
- `Design specificity`: 10 means visual direction, states, mobile behavior, and differentiation are explicit enough to implement; 7 means usable with deferred polish; 0-3 means generic or missing.
- `Launch readiness`: 10 means validation, SEO, performance, UI audit, post-UI design review, and interaction QA pass; 7 means draft is reviewable with minor non-launch blockers; 0-3 means draft-only or blocked.

Caps:

- If Bing status is `blocked-with-evidence`, `Research readiness` must be `<= 7`.
- If Bing status is `not-attempted`, `Research readiness` must be `<= 3`.
- If meaningful UI work is planned and pre-implementation `plan-design-review` is missing or deferred, `Design specificity` must be `<= 5`.
- If meaningful UI work has been implemented and there is no browser/screenshot evidence, `Launch readiness` must be `<= 5`.
- For a new UI-bearing site, if post-UI `gstack-design-review` was not run after implementation, `Launch readiness` must be `<= 4`.
- If UI interactions changed and neither `gstack-qa` nor `gstack-qa-only` was run, `Launch readiness` must be `<= 5`.
- If both post-UI design review and interaction QA are deferred, `Launch status` must remain `DRAFT_ONLY`.
- Deferred visual/browser QA is allowed for draft implementation only. It cannot support `READY_TO_INDEX`.

## Research Completion Quality

Files are not complete just because they exist. A completed research file must be keyword-specific and contain decisions that affect implementation.

Do not count these as completed research:

- Placeholder text from a template
- Empty tables
- Generic tool-site claims that could apply to any keyword
- `Deferred:` notes without blocker, missing evidence, impact, and next action
- Scores that are not supported by evidence
- Design reviews written before any design plan exists
- Post-UI design reviews written before UI implementation

Required evidence and decision trail:

```text
Evidence used:
Decisions made:
Implementation implications:
Deferred items:
```

The exact headings may vary, but the information must be present in the research set before implementation starts.

## Browser And Screenshot Evidence

After meaningful UI implementation, record browser evidence in `design-review.md` or `acceptance-tests.md`:

```text
Desktop screenshot:
Mobile 390px screenshot:
Local URL:
Viewport sizes:
First viewport tool visibility:
Main task path tested:
Visual hierarchy issues:
Fixes applied:
Remaining issues:
```

If screenshots or browser tooling are unavailable, record the blocker as `Deferred:` and cap `Launch readiness <= 5`. A deferred browser review cannot support `READY_TO_INDEX`.

## Research Consumption Trace

After non-trivial implementation changes, update:

```text
sites/<site-id>/research/implementation-trace.md
```

Before implementation, this file may be `Trace status: pending-implementation`.

After implementation, it must map:

```text
research source -> decision -> implementation file/behavior -> validation evidence -> status
```

Required coverage:

- Keyword intent and standalone decision
- Bing competitor opportunities
- Product features
- SEO metadata and content
- UX states and mobile behavior
- Design direction and design review decisions
- Privacy and analytics
- Performance and validation
- Unconsumed or deferred research

Do not call implementation complete if this file is missing, still pending, or only contains a generic summary.

`pnpm site trace-audit <site-id>` requires:

```text
Trace status: complete
```

`Trace status: deferred` does not satisfy implementation completion or launch review.

## Scope Drift Detection

A single-site implementation should normally be limited to:

```text
sites/<site-id>/**
apps/site/src/features/<tool-id>/**
packages/tools/<tool-id>/**
renderer registry when needed
```

If other dirty files exist, ignore them unless they block the requested site. If the implementation changes files outside the scope above, record them as `Scope drift` with the reason and validation impact.

Workflow scripts, skill files, and factory docs are not part of the default single-site allowlist. They should appear as scope drift unless the task is explicitly a skill/gate/factory workflow change.

Use:

```bash
pnpm site launch-review <site-id> --check-scope
```

to report out-of-scope dirty files.

## Launch Readiness Dashboard

Before claiming a site is review-ready or launch-ready, update:

```text
sites/<site-id>/research/launch-review.md
```

The dashboard must include:

```text
Research evidence:
Research completion:
Design plan:
UI implementation:
Browser QA:
Interaction QA:
Performance:
SEO audit:
Content lint:
UI similarity audit:
Research trace:
Scope drift:
Indexing:
Launch status:
```

Do not infer `READY_TO_INDEX` from passing checks alone. It requires explicit user approval.

If `site.config.yaml` has `indexing.allowIndex: true`, `launch-review.md` must record `Launch status: READY_TO_INDEX` and `Explicit indexing approval recorded: yes`.

## QA Mode Split

- `post-ui-review`: report visual/interaction issues after implementation. Use `gstack-design-review`, `gstack-qa-only`, browser screenshots, and benchmark evidence. Do not make fixes unless the user approves fix mode or the invoked skill explicitly includes a fix loop.
- `repair-gate`: make targeted fixes for failed gates. Keep changes scoped to the failing gate and re-run the matching audit command.
- `implement`: may include direct fixes while building, but still must pass post-UI review before completion.

## Hard Stops

- STOP: In `research-only`, `design-only`, `plan-only`, `audit`, and `launch-review`, do not edit implementation files unless the user changes the mode.
- STOP: Do not mark Bing Webmaster as blocked without evidence.
- STOP: Do not continue to implementation when Bing status is `not-attempted`, unless the user explicitly asks for code-only work.
- STOP: Do not continue to implementation when Bing status is `blocked-with-evidence`, unless the user explicitly approves fallback implementation or code-only work.
- STOP: Do not treat research as complete when only `competitor-research.md` changed.
- STOP: Do not start implementation with `Research readiness < 7` unless the user explicitly approves fallback/code-only implementation.
- STOP: Do not implement visual UI before `design-direction.md` and pre-implementation `design-review.md` exist, unless explicitly deferred with a reason and the task is code-only.
- STOP: Do not call UI implementation complete after rendering alone. Record design-review/QA/benchmark results or explicit `Deferred:` reasons.
- STOP: Do not call post-UI design review complete without post-implementation visual evidence.
- STOP: Do not call implementation complete without an updated research consumption trace after non-trivial implementation changes.
- STOP: Do not claim review-ready or launch-ready without `launch-review.md` and `pnpm site launch-review <site-id>` evidence.
- STOP: Do not score `Launch readiness > 4` for a new UI-bearing site without a completed post-UI `gstack-design-review`.
- STOP: Do not score `Launch readiness > 5` after interaction changes without completed `gstack-qa` or `gstack-qa-only`.
- STOP: Do not enable indexing or call a site launch-ready until validation has no P0 issues and launch status is explicitly `READY_TO_INDEX`.

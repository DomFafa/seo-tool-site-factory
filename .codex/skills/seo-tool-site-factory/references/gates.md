# Gates Reference

Use this reference when a task is close to crossing from research into implementation, or when a gate status is ambiguous.

## Operating Modes

```text
research-only: create/update research files only; do not edit implementation files.
plan-only: create/update research plus build plan; do not edit implementation files.
implement: complete gates, then edit site pack, tool logic, and UI.
audit: inspect existing site/research and report gaps; edit only if explicitly asked.
launch-review: verify launch readiness; do not enable indexing unless explicitly approved.
```

Default to `research-only` for keyword or competitor research. Default to `implement` only when the user asks to build, improve, or finish the site.

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

- For a new UI-bearing site, if post-UI `gstack-design-review` was not run after implementation, `Launch readiness` must be `<= 4`.
- If UI interactions changed and neither `gstack-qa` nor `gstack-qa-only` was run, `Launch readiness` must be `<= 5`.
- If both post-UI design review and interaction QA are deferred, `Launch status` must remain `DRAFT_ONLY`.
- Deferred visual/browser QA is allowed for draft implementation only. It cannot support `READY_TO_INDEX`.

## Hard Stops

- STOP: In `research-only`, `plan-only`, and `audit`, do not edit implementation files unless the user changes the mode.
- STOP: Do not mark Bing Webmaster as blocked without evidence.
- STOP: Do not continue to implementation when Bing status is `not-attempted`, unless the user explicitly approves fallback implementation or code-only work.
- STOP: Do not treat research as complete when only `competitor-research.md` changed.
- STOP: Do not start implementation with `Research readiness < 7` unless the user explicitly approves fallback/code-only implementation.
- STOP: Do not implement visual UI before `design-direction.md` and pre-implementation `design-review.md` exist, unless explicitly deferred with a reason and the task is code-only.
- STOP: Do not call UI implementation complete after rendering alone. Record design-review/QA/benchmark results or explicit `Deferred:` reasons.
- STOP: Do not score `Launch readiness > 4` for a new UI-bearing site without a completed post-UI `gstack-design-review`.
- STOP: Do not score `Launch readiness > 5` after interaction changes without completed `gstack-qa` or `gstack-qa-only`.
- STOP: Do not enable indexing or call a site launch-ready until validation has no P0 issues and launch status is explicitly `READY_TO_INDEX`.

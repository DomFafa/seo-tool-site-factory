# Implementation Trace: {tool_name}

## 1. Trace Metadata

- Site ID: {site_id}
- Primary keyword: {primary_keyword}
- Category: {category}
- Locale: {locale}
- Market: {market}
- Created: {date}
- Updated:
- Trace status: pending-implementation / in-progress / complete / deferred
- Implementation mode:
- Implementation commit or diff reference:

## 2. Trace Rule

This file proves that research decisions were consumed during implementation.

Before implementation, this file may remain:

```text
Trace status: pending-implementation
```

After implementation changes, this file must be updated before the work is called implementation-complete.

Do not use this file as a post-hoc marketing summary. Each row must connect a research decision to concrete implementation files, visible behavior, or validation evidence.

## 3. Research Files Used

| Research file | Used? | Notes |
|---|---|---|
| `keyword-intent.md` | yes/no |  |
| `competitor-research.md` | yes/no |  |
| `product-requirements.md` | yes/no |  |
| `seo-spec.md` | yes/no |  |
| `ux-spec.md` | yes/no |  |
| `design-direction.md` | yes/no |  |
| `design-review.md` | yes/no |  |
| `acceptance-tests.md` | yes/no |  |
| `brief.v2.draft.yaml` | yes/no |  |
| `codex-build-prompt.md` | yes/no |  |

## 4. Research-To-Implementation Matrix

Every meaningful implementation must include rows for keyword intent, competitor opportunities, product features, SEO content, UX states, design direction, privacy/analytics, performance, and validation.

| Research source | Decision or requirement | Implemented in | Evidence | Validation | Status |
|---|---|---|---|---|---|
| `keyword-intent.md` |  |  |  |  | pending/done/deferred |
| `competitor-research.md` |  |  |  |  | pending/done/deferred |
| `product-requirements.md` |  |  |  |  | pending/done/deferred |
| `seo-spec.md` |  |  |  |  | pending/done/deferred |
| `ux-spec.md` |  |  |  |  | pending/done/deferred |
| `design-direction.md` |  |  |  |  | pending/done/deferred |
| `design-review.md` |  |  |  |  | pending/done/deferred |
| `acceptance-tests.md` |  |  |  |  | pending/done/deferred |
| `brief.v2.draft.yaml` |  |  |  |  | pending/done/deferred |

## 5. Implementation Files Changed

| File | Why changed | Research source | Notes |
|---|---|---|---|
|  |  |  |  |

## 6. Validation Evidence

| Validation | Command / artifact | Result | Notes |
|---|---|---|---|
| Unit logic |  |  |  |
| Typecheck |  |  |  |
| Site check |  |  |  |
| Build |  |  |  |
| SEO audit |  |  |  |
| Content lint |  |  |  |
| Performance audit |  |  |  |
| UI audit |  |  |  |
| Browser desktop |  |  |  |
| Browser mobile 390px |  |  |  |

## 7. Unconsumed Or Deferred Research

Any research decision not implemented must be listed here with a reason and next action.

| Research decision | Reason not consumed | Impact | Next action |
|---|---|---|---|
|  |  |  |  |

## 8. State Sync

After implementation, reconcile status across research files.

- `codex-build-prompt.md` status updated: yes/no
- `acceptance-tests.md` validation status updated: yes/no
- `design-review.md` post-UI status updated: yes/no
- Launch status remains draft/noindex unless explicitly approved: yes/no
- Any stale `research-only`, `future implementation`, or `blocked until implement request` wording left after implementation: yes/no

## 9. Trace Verdict

- Research consumed: yes/no/partial
- Implementation complete from research perspective: yes/no
- Remaining blockers:
- Next action:

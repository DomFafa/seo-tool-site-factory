# Workflow Status: {tool_name}

## Current State

- Site ID: {site_id}
- Primary keyword: {primary_keyword}
- Category: {category}
- Locale: {locale}
- Market: {market}
- Updated:
- Current mode: research-only / design-only / implement / post-ui-review / launch-review / repair-gate / audit
- Current phase: research gate / design gate / implementation gate / post-UI QA gate / launch review gate

## Gate Dashboard

| Gate | Status | Evidence | Blocker / next action |
|---|---|---|---|
| Bing Webmaster top 5 | pending / passed / blocked / skipped |  |  |
| Research completion | pending / passed / blocked |  |  |
| Design direction | pending / passed / blocked |  |  |
| Pre-implementation design review | pending / passed / deferred |  |  |
| Implementation edit gate | pending / passed / blocked / bypassed |  |  |
| Post-UI design review | pending / passed / deferred |  |  |
| Interaction QA | pending / passed / deferred |  |  |
| Benchmark / performance | pending / passed / deferred |  |  |
| Research consumption trace | pending / passed / blocked |  |  |
| Launch review | pending / passed / blocked |  |  |

## Readiness

- Research readiness:
- Design specificity:
- Launch readiness:
- Research status: READY / READY_WITH_FALLBACK / BLOCKED / NOT_ATTEMPTED
- Implementation status: READY / BLOCKED / BYPASSED_BY_USER
- Launch status: DRAFT_ONLY / READY_FOR_REVIEW / READY_TO_INDEX

## Scope

Allowed implementation write scope:

```text
sites/{site_id}/**
apps/site/src/features/<tool-id>/**
packages/tools/<tool-id>/**
renderer registry when needed
```

Out-of-scope dirty files:

-

## Next Command

```text
继续实现 {site_id}
```

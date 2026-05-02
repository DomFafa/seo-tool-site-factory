# Codex Build Prompt: random-date-generator

## Mode

implement

## Phase

Phase 3: implementation gate

## Required Research Files

- `keyword-intent.md`
- `competitor-research.md`
- `product-requirements.md`
- `seo-spec.md`
- `ux-spec.md`
- `design-direction.md`
- `design-review.md`
- `acceptance-tests.md`
- `status.md`
- `brief.v2.draft.yaml`

## Gate Decision

Competitor source status: `blocked-with-evidence`.

Implementation gate result: fallback implementation approved by user through continuation after selecting `random date generator`.

Research readiness: 7/10.

Design specificity: 8/10.

Launch readiness: 3/10.

Launch status: DRAFT_ONLY.

## Implementation Scope

- `sites/random-date-generator/**`
- `packages/tools/random-date-generator/**`
- `apps/site/src/features/random-date-generator/**`
- renderer registry in `scripts/site.ts`
- app workspace dependency registration

## Build Requirements

Implement a client-only random date generator with date range, count, weekday filters, unique toggle, sort/shuffle, output formats, copy action, presets, validation, and static SEO content. UI should be TinyWow-inspired in clarity and central workbench layout, but original in palette, copy, and calendar-specific interaction.


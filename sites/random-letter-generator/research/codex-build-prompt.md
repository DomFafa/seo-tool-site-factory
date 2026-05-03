# Codex Build Prompt

Mode: implement
Phase: Phase 3 - implementation gate

Build `random-letter-generator` as a draft, non-indexable SEO utility site.

Use:
- `sites/random-letter-generator/research/keyword-intent.md`
- `sites/random-letter-generator/research/competitor-research.md`
- `sites/random-letter-generator/research/product-requirements.md`
- `sites/random-letter-generator/research/seo-spec.md`
- `sites/random-letter-generator/research/ux-spec.md`
- `sites/random-letter-generator/research/design-direction.md`
- `sites/random-letter-generator/research/design-review.md`
- `sites/random-letter-generator/research/acceptance-tests.md`

Implementation requirements:
- Tool logic in `packages/tools/random-letter-generator`.
- Interactive UI in `apps/site/src/features/random-letter-generator`.
- No raw custom input or generated letters in analytics.
- Sejda-inspired green/coffee styling with a tan wave background.
- Keep lifecycle draft and indexing disabled.

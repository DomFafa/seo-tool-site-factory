Mode: implement
Phase: Phase 3 - implementation gate
Research status: READY
Research readiness: 8/10
Launch status: DRAFT_ONLY

Allowed writes:
- sites/random-letter-generator/**
- packages/tools/random-letter-generator/**
- apps/site/src/features/random-letter-generator/**
- scripts/site.ts selected tool registry
- apps/site/package.json workspace dependency
- apps/site/src/styles/ui-differentiation.css recipe styles

Required evidence:
- Bing Webmaster Top 5 captured for the primary keyword.
- Root-domain occupancy recorded.
- Product, SEO, UX, design direction, design review, and acceptance tests written.
- pnpm site check random-letter-generator passes.
- Tool logic tests pass.

Exit criteria:
- Site pack validates.
- Tool renders locally through SITE_ID selection.
- Site remains draft and non-indexable until launch gates are complete.

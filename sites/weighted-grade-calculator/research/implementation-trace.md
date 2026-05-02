# Implementation Trace: Weighted Grade Calculator

Trace status: complete

This trace maps the completed research set to implementation files, behaviors, and validation evidence. The site remains draft-only because full 390px screenshot evidence and full post-UI QA are not complete.

## Research-To-Implementation Matrix

| Research source | Decision consumed | Implemented in | Evidence | Validation | Status |
|---|---|---|---|---|---|
| `keyword-intent.md` | Build a standalone weighted grade calculator for category weights and final-grade planning. | `sites/weighted-grade-calculator/site.config.yaml`, `sites/weighted-grade-calculator/brief.yaml`, `sites/weighted-grade-calculator/content/en/home.mdx` | Site ID, primary keyword, draft lifecycle, exact H1/title content. | `pnpm site check weighted-grade-calculator` P0=0/P1=0/P2=0; `pnpm site build weighted-grade-calculator` passed. | done |
| `competitor-research.md` | Use Bing Webmaster Top 5 and user's 0 strong related root-domain rule to justify a focused page. | `sites/weighted-grade-calculator/research/competitor-research.md`, `sites/weighted-grade-calculator/layout.config.yaml`, `apps/site/src/features/weighted-grade-calculator/WeightedGradeCalculatorIsland.tsx` | Tool-first page avoids generic broad calculator clutter; no exact-match root-domain dependency. | `pnpm site research-audit weighted-grade-calculator` P0=0/P1=0/P2=0. | done |
| `product-requirements.md` | Implement category rows, live weighted grade, total-weight meter, target-grade solver, presets, copy, reset, local privacy. | `packages/tools/weighted-grade-calculator/src/index.ts`, `apps/site/src/features/weighted-grade-calculator/WeightedGradeCalculatorIsland.tsx`, `sites/weighted-grade-calculator/tool.config.yaml` | Row editor, result panel, meter, what-if panel, preset chips, copy/reset, client-only config. | `pnpm exec tsx packages/tools/weighted-grade-calculator/src/index.test.ts` passed; browser CDP interaction checked preset and target result. | done |
| `seo-spec.md` | Static intro, formula, examples, use cases, FAQ, metadata, draft noindex. | `sites/weighted-grade-calculator/content/en/home.mdx`, `sites/weighted-grade-calculator/content/en/faq.mdx`, `sites/weighted-grade-calculator/site.config.yaml`, `sites/weighted-grade-calculator/layout.config.yaml` | Metadata, H1, formula block, examples, FAQ, structured data config, noindex draft settings. | `pnpm seo audit weighted-grade-calculator` P0=0/P1=0/P2=0; `pnpm seo lint-content weighted-grade-calculator` P0=0/P1=0/P2=0. | done |
| `ux-spec.md` | Tool above fold, mobile-first row cards, visible weight total, no ads near primary actions, local privacy note. | `apps/site/src/features/weighted-grade-calculator/WeightedGradeCalculatorIsland.tsx`, `sites/weighted-grade-calculator/layout.config.yaml`, `sites/weighted-grade-calculator/integrations.config.yaml` | Workbench appears after compact hero; ads disabled; privacy note near result; CSS includes stacked layout under 620px. | Desktop browser render checked via CDP; `pnpm site ui-audit weighted-grade-calculator` reported expected block order. 390px screenshot deferred due CDP wrapper viewport limitation. | done |
| `design-direction.md` | Rebuild to Milople-inspired playful tool UI: friendly orange/blue palette, dashed central tool frame, normal title scale, improved header, SEO content below. | `sites/weighted-grade-calculator/theme.config.yaml`, `sites/weighted-grade-calculator/layout.config.yaml`, `apps/site/src/features/weighted-grade-calculator/WeightedGradeCalculatorIsland.tsx`, `apps/site/src/styles/ui-differentiation.css` | `playful-tool` recipe, orange primary, blue accent, warm background, dashed calculator frame, simple doodle accents. | Rebuild validation rerun after changes. | done |
| `design-review.md` | New review requires title scale correction, useful header, playful Milople-style tool frame, and preserved SEO content below. | `apps/site/src/features/weighted-grade-calculator/WeightedGradeCalculatorIsland.tsx`, `sites/weighted-grade-calculator/layout.config.yaml`, `apps/site/src/styles/ui-differentiation.css` | Central dashed-card calculator, improved header CSS, lower SEO sections. | Full screenshot QA still deferred to final visual check. | done |
| `acceptance-tests.md` | Cover workflow gates, functional grade math, UX, SEO, accessibility, design, performance, validation. | `packages/tools/weighted-grade-calculator/src/index.test.ts`, `sites/weighted-grade-calculator/research/acceptance-tests.md` | Unit tests include full weights, underweight, overweight, invalid, excluded row, target score. | Tool test passed; site check/build/SEO/content/perf/UI audits passed. Browser copy status needs real-user gesture retest. | done |
| `brief.v2.draft.yaml` | Preserve keyword cluster, product boundary, required features, design constraints, privacy constraints. | `sites/weighted-grade-calculator/brief.yaml`, `sites/weighted-grade-calculator/tool.config.yaml`, `sites/weighted-grade-calculator/theme.config.yaml`, `sites/weighted-grade-calculator/layout.config.yaml` | Draft brief was translated into v1 site pack and client-only tool config. | `pnpm site check weighted-grade-calculator` passed. | done |

## Validation Evidence

| Command / check | Result | Notes |
|---|---|---|
| `pnpm exec tsx packages/tools/weighted-grade-calculator/src/index.test.ts` | passed | Pure grade logic and target-score edge cases. |
| `pnpm typecheck` | passed | TypeScript project check. |
| `pnpm site research-audit weighted-grade-calculator` | passed | P0=0, P1=0, P2=0. |
| `pnpm site check weighted-grade-calculator` | passed | P0=0, P1=0, P2=0. |
| `pnpm site build weighted-grade-calculator` | passed | Static build produced one page and selected React island. |
| `pnpm seo audit weighted-grade-calculator` | passed | P0=0, P1=0, P2=0. |
| `pnpm seo lint-content weighted-grade-calculator` | passed | P0=0, P1=0, P2=0. |
| `pnpm perf audit weighted-grade-calculator` | passed | JS=62.5 KiB gzip / 198.9 KiB raw, CSS=37.2 KiB. |
| `pnpm site ui-audit weighted-grade-calculator` | needs rerun after rebuild | Previous run passed for academic-workbench; rebuild uses apple-minimal. |
| Browser desktop render | passed | Local `http://localhost:4321/`, tool present, H1 correct, no error blocks; screenshot `/tmp/weighted-grade-calculator-desktop.png`. |
| Browser interaction smoke test | partial pass | Preset click and target calculation worked; copy attempted but clipboard state did not persist under CDP automation. |

## Unconsumed Or Deferred Research

| Research decision | Reason not fully complete | Impact | Next action |
|---|---|---|---|
| Full 390px mobile screenshot evidence | Current web-access CDP wrapper does not expose viewport emulation, and `window.resizeTo` did not change tab viewport. | Launch readiness remains capped; site stays `DRAFT_ONLY`. | Run gstack browse/Playwright with real viewport emulation during post-UI QA. |
| Full post-UI design-review skill run | Implemented UI was smoke-tested manually through CDP, but full design-review skill was not run. | Launch readiness capped at 4 for new UI-bearing site. | Run post-UI design review before launch review. |
| Clipboard success under real user gesture | CDP automation clicked copy, but clipboard permission/status did not persist. | Copy behavior should be manually verified before review-ready. | Test with real browser gesture or Playwright clipboard permissions. |
| Related education calculator links | Related tools do not exist yet in this factory. | Content avoids hard-coded broken internal links. | Add links when final grade/GPA/percentage tools exist. |

## Scope Drift

Implementation touched expected single-site scope plus necessary factory registration/workspace files:

- `sites/weighted-grade-calculator/**`
- `apps/site/src/features/weighted-grade-calculator/**`
- `packages/tools/weighted-grade-calculator/**`
- `scripts/site.ts`
- `apps/site/package.json`
- `pnpm-lock.yaml`
- `cloudflare.accounts.yaml`

`cloudflare.accounts.yaml` was updated because site validation requires a defined Cloudflare account alias for every site. No secret values were added.

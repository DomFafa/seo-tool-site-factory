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

Then ask Codex:

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
sites/<site-id>/research/codex-build-prompt.md
sites/<site-id>/research/brief.v2.draft.yaml
```

The research files are intentionally not a replacement for manual review. They are a structured starting point for competitor analysis, product decisions, and Codex implementation.

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
sites/<site-id>/research/brief.v2.draft.yaml
sites/<site-id>/research/codex-build-prompt.md
```

Do not move into site-pack or UI implementation unless this gate is satisfied, unless the user explicitly asked for competitor research only.

## Post-UI optimization gate

The UI is not complete immediately after code renders. For SEO tool sites, task speed and trust are part of the product.

Required behavior:

- Run `gstack-design-review` after meaningful UI changes, or mark it `Deferred:` with a reason.
- Run `gstack-qa` when interactions changed and direct fixes are allowed.
- Run `gstack-qa-only` when the user wants a report before fixes.
- Run `gstack-benchmark` before launch, after large CSS/JS changes, or after adding dependencies.

Record results and fixes in:

```text
sites/<site-id>/research/design-review.md
sites/<site-id>/research/acceptance-tests.md
```

## Competitor source

Primary competitors must come from Bing Webmaster Tools Keyword Research, using the `Top 10 url ranking on this keyword` table for the exact primary keyword. Record the first 5 rows as the required competitor set.

Use `seo-demand-validation` for the Bing Keyword Research workflow and `web-access` for logged-in browser/CDP access. If Bing Webmaster is blocked, record the blocker and mark any replacement URLs as fallback competitors.

## Launch guard

A site should remain draft and non-indexable until:

- The tool works for the primary user job.
- The content is reviewed and keyword-specific.
- Competitor weaknesses are addressed.
- The visual direction is explicit and reviewed before implementation.
- Acceptance tests pass.
- `pnpm site check <site-id>` passes.
- `pnpm site build <site-id>` passes.
- `pnpm seo audit <site-id>` has no P0 issue.
- `pnpm perf audit <site-id>` has no severe regression.
- `pnpm site ui-audit <site-id>` does not show unacceptable similarity.

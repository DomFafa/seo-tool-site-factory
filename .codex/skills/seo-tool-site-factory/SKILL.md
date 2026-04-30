---
name: seo-tool-site-factory
description: Use when creating, improving, or auditing keyword-driven SEO utility websites in the seo-tool-site-factory repository; turns generator/solver/maker/converter/checker keywords into competitor-informed research, product requirements, SEO specs, UX specs, design direction, acceptance tests, site packs, tool logic, and validation commands.
---

# SEO Tool Site Factory Skill

Use this skill when creating, improving, or auditing an independent keyword-driven utility website in this repository.

This repository is an Astro-based static SEO tool-site factory. Each site is represented by a site pack under `sites/<site-id>/`. Shared tool logic belongs under `packages/tools/*`. Interactive tool UI belongs under `apps/site/src/features/*`.

## Goal

Turn a keyword such as `{keyword} generator`, `{keyword} solver`, `{keyword} maker`, `{keyword} converter`, `{keyword} checker`, `{keyword} calculator`, or `{keyword} formatter` into a production-ready, differentiated, SEO-friendly utility website.

Do not create generic template pages. Every site must have a clear user job, competitor-informed UX improvements, original examples, useful SEO content, edge-case handling, an intentional design direction, and acceptance tests.

## Required inputs

Minimum input:

```text
keyword: <primary keyword>
site-id: <kebab-case site id>
category: generator | solver | maker | converter | tester | checker | calculator | formatter | other
locale: en
market: US
```

Optional input:

```text
domain: <canonical domain>
competitors:
  - <url>
  - <url>
notes: <known constraints or monetization notes>
```

If a value is missing, infer a reasonable default from the keyword and document the assumption in the research files. Do not stop only to ask for clarification unless the missing value blocks safe implementation.

## Workflow

### 1. Decide whether the keyword deserves a standalone site

Before writing code, score the opportunity using this model:

```text
Total: 100

1. User task clarity: 25
2. Competitor weakness: 20
3. Differentiation potential: 20
4. SEO feasibility: 20
5. Maintenance simplicity: 15
```

Decision:

```text
80-100: build standalone site
65-79: build if there is clear differentiation
50-64: consider cluster page or supporting guide
<50: skip or defer
```

Write the decision into `sites/<site-id>/research/keyword-intent.md`.

### 2. Research competitors

Create or update:

```text
sites/<site-id>/research/competitor-research.md
```

Required data source:

- Use Bing Webmaster Tools Keyword Research, not an ad-hoc public SERP, for the primary competitor set.
- Follow `/Users/bin/.codex/skills/seo-demand-validation/SKILL.md` for the Bing Webmaster Keyword Research flow.
- For logged-in Bing Webmaster access, load and follow `/Users/bin/.codex/skills/web-access/SKILL.md` and run its CDP preflight before browser/network actions.
- Open `https://www.bing.com/webmasters/keywordresearch?siteUrl=<encoded bing_site_url>`.
- Search the exact primary keyword.
- Set the date range to `3M` unless the user specifies another range.
- Use the `Top 10 url ranking on this keyword` table as the source of ranking competitors.
- Select the first 5 rows from that Bing Webmaster ranking table as the required competitor set.

The research must include:

- Bing Webmaster ranking intent summary
- Bing Webmaster source metadata: site URL, keyword, date range, capture date, and data-quality notes
- Top 5 Bing Webmaster ranking competitors
- Feature matrix
- UX teardown
- SEO teardown
- Performance observations
- Accessibility observations
- Differentiation opportunities
- Things to avoid

Do not only list competitors. Convert findings into concrete build requirements.

If Bing Webmaster access is blocked, do not silently replace it with a generic public SERP. Record the blocker as `bing webmaster capture blocked`, then use user-supplied competitor URLs or existing repository examples only as a fallback and clearly mark them as `fallback, not Bing Webmaster ranking`.

Additional adjacent-intent competitors are optional. They may be added only after the required Bing Webmaster top 5 are recorded, and they must be labeled as `reference competitor`, not part of the primary ranking set.

### 3. Define the product

Create or update:

```text
sites/<site-id>/research/product-requirements.md
```

Include:

- User job
- Core flow
- Required features
- Nice-to-have features
- Non-goals
- Input behavior
- Output behavior
- Empty states
- Error states
- Edge cases
- Privacy requirements
- Performance requirements

### 4. Define SEO spec

Create or update:

```text
sites/<site-id>/research/seo-spec.md
```

Include:

- URL
- Title
- Meta description
- H1
- Hero subtitle
- Content structure
- FAQ
- Internal links
- Structured data recommendation
- Indexing requirements

SEO-critical content must be statically rendered or server-rendered. Tool interactivity can hydrate on the client.

### 5. Define UX spec

Create or update:

```text
sites/<site-id>/research/ux-spec.md
```

The UX spec must explain how this site will feel different from other sites in the factory.

Include:

- Above-the-fold layout
- Primary task path
- Mobile layout
- Empty state
- Result state
- Error state
- Accessibility requirements
- Ad-placement restrictions
- UI differentiation from similar existing sites

### 6. Define the design direction

Create or update:

```text
sites/<site-id>/research/design-direction.md
```

In this skill, a site is treated as design-new when it does not have an approved, keyword-specific design direction. A site directory may already exist and still count as design-new.

Run `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-consultation/SKILL.md` when any of these are true:

- The site pack does not exist.
- The site exists but is scaffold-only or draft without `research/design-direction.md`.
- `design-direction.md` is generic, stale, placeholder-like, or not tied to competitor research.
- `design-review.md` is missing for a UI-bearing site.
- The site belongs to a cluster without a clear reusable design system.
- Competitor research or UI audit shows a need for stronger visual differentiation.
- The user asks for redesign or visual exploration.

You may skip full design consultation only when all of these are true:

- `design-direction.md` exists and is keyword-specific.
- `design-review.md` exists.
- The current task is a small copy, metadata, bug, or pure logic change.
- There is no meaningful layout/UI change and no UI similarity risk.

Design skill roles:

- `design-consultation` decides what good means: product context, constraints, success criteria, and recommended direction.
- `design-shotgun` explores multiple options inside the approved consultation constraints; it must not redefine the user job or design goals.
- `plan-design-review` chooses and tightens the plan before implementation.
- `frontend-design` builds the approved plan; it must not invent a new visual system.
- `design-review` audits the built page after implementation.

Use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-shotgun/SKILL.md` only when multiple visual directions are useful: high-competition keyword, unclear direction, user asks for variants, cluster similarity risk, or a new visual cluster is being established.

Use `/Users/bin/.codex/skills/frontend-design/SKILL.md` only when translating the approved direction into frontend code.

The design direction must include:

- Design source: new site direction, reused cluster system, or existing `DESIGN.md`.
- Product context and target user.
- Visual personality.
- Typography direction.
- Color direction.
- Density and spacing.
- Layout recipe and block order.
- Motion rules.
- Tool workbench pattern.
- Mobile design approach.
- Accessibility requirements.
- Anti-template constraints.
- Explicit UI differentiation from similar factory sites.

For this repository, do not blindly overwrite root `DESIGN.md` for every single site. Prefer site-specific or cluster-specific design records unless the whole factory design system is changing.

### 7. Review the design plan before implementation

Create or update:

```text
sites/<site-id>/research/design-review.md
```

Use `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-plan-design-review/SKILL.md` when the site has UI scope and a design plan exists. The review should happen after product/SEO/UX/design direction are drafted and before implementation.

The design review must check:

- Information hierarchy.
- Interaction states.
- User journey.
- AI slop / template risk.
- Design-system alignment.
- Responsive behavior.
- Accessibility.
- Unresolved visual decisions.

Any approved mockup paths or design-board decisions must be recorded in `design-review.md` and reflected in `design-direction.md`, `layout.config.yaml`, and `theme.config.yaml` during implementation.

### 8. Pass the research completion gate

A keyword research pass is not complete if it only updates `competitor-research.md`. Before implementation, update every file below with keyword-specific decisions, or add a `Deferred:` note in that file explaining the blocker, reason, and next action.

Required research outputs:

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

Completion rules:

- Do not stop after competitor research unless the user explicitly asked for competitor research only.
- Do not leave template placeholders, empty tables, or generic boilerplate as if they were completed research.
- If a file cannot be completed yet, add `Deferred:` with the reason, what evidence is missing, and the next action.
- The final research summary must list completed files and deferred files with reasons.

### 9. Create or update the site pack

Use the repository factory structure.

Required files:

```text
sites/<site-id>/brief.yaml
sites/<site-id>/site.config.yaml
sites/<site-id>/tool.config.yaml
sites/<site-id>/theme.config.yaml
sites/<site-id>/layout.config.yaml
sites/<site-id>/content/<locale>/home.mdx
sites/<site-id>/content/<locale>/faq.mdx
sites/<site-id>/messages/<locale>.yaml
```

The site must start as draft unless explicitly approved:

```yaml
lifecycle:
  status: draft

indexing:
  allowIndex: false
  mode: disallow
```

Do not enable indexing until content is reviewed, tool behavior is tested, and audits pass.

### 10. Implement pure tool logic

Pure transformation, solving, formatting, or generation logic belongs under:

```text
packages/tools/<tool-id>/
```

Requirements:

- Keep logic independent from UI rendering.
- Export small, testable functions.
- Handle the edge cases listed in the acceptance tests.
- Avoid unnecessary dependencies.
- Do not send raw user input to analytics or servers unless the brief explicitly requires server-side processing and privacy notes are updated.

### 11. Implement interactive UI

Interactive UI belongs under:

```text
apps/site/src/features/<tool-id>/
```

Before implementing visual UI, read:

```text
sites/<site-id>/research/design-direction.md
sites/<site-id>/research/design-review.md
```

Use `/Users/bin/.codex/skills/frontend-design/SKILL.md` for production-grade frontend implementation. Treat the approved design direction as the source of truth; do not invent a new visual system during implementation.

UX requirements:

- No login required for the core task.
- Primary input visible immediately.
- Output visible without unnecessary navigation.
- One-click copy when useful.
- Clear/reset action.
- Example inputs.
- Mobile-first layout.
- Accessible labels.
- Visible focus states.
- No ads near primary actions.
- No raw user input in analytics events.

### 12. Pass the post-UI optimization gate

After UI implementation, the site is not implementation-complete until UI quality has been reviewed or explicitly deferred with a reason.

Use these GStack skills when available:

```text
/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-review/SKILL.md
/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-qa/SKILL.md
/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-qa-only/SKILL.md
/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-benchmark/SKILL.md
```

Gate rules:

- Run `design-review` after meaningful UI changes. Focus on first-viewport tool visibility, visual hierarchy, spacing, responsive behavior, contrast, focus states, output overflow, and AI-template risk.
- Run `qa` when UI interactions changed and direct fixes are allowed. Use `qa-only` instead when the user asks for report-only QA or when fixes need approval first.
- Run `benchmark` before launch, after large CSS/JS changes, or after adding dependencies that could affect page weight.
- Record findings, fixes, or `Deferred:` reasons in `sites/<site-id>/research/design-review.md` and `sites/<site-id>/research/acceptance-tests.md`.

### 13. Register the tool renderer

Update the selected tool routing so that `primaryTool: <tool-id>` can render the correct island.

Do not hard-code site IDs, domains, analytics IDs, ad IDs, verification tokens, or canonical URLs inside page components.

### 14. Add tests and acceptance checks

Create or update:

```text
sites/<site-id>/research/acceptance-tests.md
```

Add unit tests for pure logic where possible.

The acceptance tests must include:

- Functional tests
- UX tests
- SEO tests
- Accessibility tests
- Design-direction checks
- Performance checks
- Edge cases

### 15. Run validation

After changes, run:

```bash
pnpm site check <site-id>
pnpm site build <site-id>
pnpm seo audit <site-id>
pnpm seo lint-content <site-id>
pnpm perf audit <site-id>
pnpm site ui-audit <site-id>
```

If multiple sites were changed, also run:

```bash
pnpm ops report
```

Fix P0 issues before considering the work complete. Note any P1/P2 tradeoffs in the final summary.

## Required output format for implementation summaries

When finishing a site implementation, summarize:

```text
Site ID:
Primary keyword:
Decision score:
Files changed:
Tool logic:
UI implementation:
SEO content:
Design direction:
Design review:
Post-UI optimization:
Research completion:
Differentiators:
Validation commands run:
Known tradeoffs:
Indexing status:
```

## Quality bar

A site is not ready for indexing unless:

- The tool works for the primary user job.
- Content is specific to the keyword.
- Examples are realistic.
- FAQ answers real user questions.
- Competitor weaknesses are addressed.
- The design direction is explicit and implemented.
- The design plan has been reviewed before frontend implementation.
- The UI is not too similar to existing sites.
- The site passes YAML validation.
- SEO-critical content is statically rendered.
- User input is not collected in analytics.
- Ads are not placed near primary actions.
- Performance budget is respected.
- Mobile UX is good.

## Do not do

- Do not create thin template pages.
- Do not keyword-stuff.
- Do not add fake reviews or fake ratings.
- Do not mark hidden FAQ as structured data.
- Do not enable indexing on draft content.
- Do not bypass schema validation.
- Do not hard-code domain, analytics, ad, or verification IDs.
- Do not place ads near Copy, Convert, Upload, Retry, Start, or Download actions.
- Do not send raw user input to analytics.

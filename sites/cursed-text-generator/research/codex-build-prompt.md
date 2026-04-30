# Codex Build Prompt: Cursed Text Generator

Use the SEO Tool Site Factory skill.

Build or improve the site for:

```text
site-id: cursed-text-generator
primary keyword: cursed text generator
category: generator
locale: en
market: US
```

Read these files first:

```text
sites/cursed-text-generator/research/keyword-intent.md
sites/cursed-text-generator/research/competitor-research.md
sites/cursed-text-generator/research/product-requirements.md
sites/cursed-text-generator/research/seo-spec.md
sites/cursed-text-generator/research/ux-spec.md
sites/cursed-text-generator/research/design-direction.md
sites/cursed-text-generator/research/design-review.md
sites/cursed-text-generator/research/acceptance-tests.md
sites/cursed-text-generator/research/brief.v2.draft.yaml
```

Research status:

- Bing Webmaster top 5 competitors captured.
- Decision: standalone site.
- Opportunity score: 86/100.
- Main gaps to exploit: dated/cluttered competitor UI, weak copy/accessibility states, missing clean mode in Bing top 5, and poor handling of heavy cursed output.

Research completion gate:

- Completed: `keyword-intent.md`, `competitor-research.md`, `product-requirements.md`, `seo-spec.md`, `ux-spec.md`, `design-direction.md`, `design-review.md`, `acceptance-tests.md`, `brief.v2.draft.yaml`, `codex-build-prompt.md`.
- Deferred: none for the research pass.
- Do not proceed from competitor research alone into implementation in future runs; all research files must be keyword-specific or explicitly marked `Deferred:` with a reason and next action.

Before implementing visual UI:

- Treat `design-direction.md` as the source of truth.
- The approved direction is `controlled horror workbench`.
- Use `/Users/bin/.codex/skills/frontend-design/SKILL.md` when translating the approved design direction into frontend code.
- Do not invent a new visual system during implementation.

Implementation requirements:

- Keep the site as draft unless explicitly approved.
- Do not enable indexing for draft content.
- Use the factory site pack structure.
- Keep site identity/content/config under `sites/cursed-text-generator/`.
- Put pure tool logic under `packages/tools/<tool-id>/` if adding or replacing logic.
- Put interactive UI under `apps/site/src/features/<tool-id>/`.
- Reflect `design-direction.md` and `design-review.md` in `layout.config.yaml`, `theme.config.yaml`, content, and UI.
- Register the renderer without hard-coding site IDs.
- Do not create a generic template.
- Do not send raw user input or generated cursed output to analytics.
- Do not place ads near input, output, copy, clear, reset, or cleaner actions.
- Avoid unnecessary dependencies.
- Add or update tests for pure logic.

Feature requirements:

- Live cursed text preview.
- Light, medium, and heavy presets.
- Advanced top, middle, and bottom controls.
- Copy output with visible and accessible success state.
- Clear input and reset settings.
- Clean/strip cursed text mode.
- Example chips.
- Character count and generated Unicode character count.
- Long-output warning.
- Mobile-safe output container.
- Local-processing privacy note near the tool.

Content requirements:

- Title starts with `Cursed Text Generator`.
- H1 is `Cursed Text Generator`.
- Explain cursed vs Zalgo vs glitch vs hacked/void text.
- Include platform notes for Discord, TikTok, Instagram, Reddit, gaming names, and mobile display.
- Include accessibility/readability note.
- Include visible FAQ only if FAQ schema is emitted.
- Link only to existing related tools; list future targets instead of creating broken links.

Post-UI optimization gate:

- After meaningful UI changes, run `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-design-review/SKILL.md` or record `Deferred:` with the reason.
- If interactions changed, run `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-qa/SKILL.md` when fixes are allowed, or `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-qa-only/SKILL.md` for report-only QA.
- Before launch, after large CSS/JS changes, or after adding dependencies, run `/Users/bin/.gstack/repos/gstack/.agents/skills/gstack-benchmark/SKILL.md`.
- Record findings, fixes, or deferred reasons in `design-review.md` and `acceptance-tests.md`.

After implementation, run:

```bash
pnpm site check cursed-text-generator
pnpm site build cursed-text-generator
pnpm seo audit cursed-text-generator
pnpm seo lint-content cursed-text-generator
pnpm perf audit cursed-text-generator
pnpm site ui-audit cursed-text-generator
```

Fix P0 issues. Summarize files changed, validation results, differentiators, known tradeoffs, and indexing status.

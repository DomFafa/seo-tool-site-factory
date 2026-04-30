# Design Review: Cursed Text Generator

## 1. Review Metadata

- Site ID: cursed-text-generator
- Primary keyword: cursed text generator
- Category: generator
- Locale: en
- Market: US
- Review date: 2026-04-30
- Reviewer: Codex documentation pass
- Source design file: `sites/cursed-text-generator/research/design-direction.md`

## 2. Scope

UI areas reviewed:

- Above-the-fold tool experience
- Tool states
- Mobile layout
- SEO content layout
- Related tools / internal links
- Footer and trust signals

Not in scope:

- Final visual mockup generation.
- Implementation QA screenshots.
- Post-implementation `design-review`.

## 3. Overall Design Score

- Initial score: 5/10
- Final score: 8/10
- Reason: The existing site already has a dark glitch playground direction, but the plan did not yet define enough task hierarchy, mobile overflow handling, cleaner mode, or anti-template constraints. The updated design direction closes the major planning gaps.

What would make this a 10/10:

- Approved visual mockup or screenshot reference.
- Confirmed mobile screenshot at 390px after implementation.
- Final token alignment between `theme.config.yaml`, `layout.config.yaml`, and the implemented island.

## 4. Information Architecture

| Area | Score | Finding | Fix |
|---|---:|---|---|
| First viewport hierarchy | 8 | The tool must not be pushed below a dramatic hero | Keep hero compact and make input/output visible early |
| Tool controls | 8 | Presets and advanced controls can compete | Presets first, advanced controls secondary or collapsible |
| SEO content sequence | 9 | Required sections are clear | Use examples before longer explanations |
| Related links | 7 | Related tools may not exist yet | Include only existing links, list future targets in implementation summary |

## 5. Interaction States

| Feature | Empty | Input | Loading / long input | Error | Success |
|---|---|---|---|---|---|
| Primary tool | Placeholder, example chips, medium preset | Live output and counts update | Soft warning or cap, no layout shift | Friendly warning, keep input | Generated output visible and copy enabled |
| Copy action | Disabled or secondary | Available when output exists | Still available if output is bounded | Clipboard fallback text | `Copied cursed text.` visual and accessible state |
| Example chips | Visible starter actions | Replaces input and updates output | No special state | No crash if chip text contains symbols | Input/output update immediately |
| Cleaner mode | Optional empty cleaner input | Strips combining marks live or on action | Warn on very long pasted cursed text | Keep original text if cleanup fails | Cleaned text visible and copyable |

## 6. User Journey

| Step | User does | User should feel | Design support |
|---|---|---|---|
| 1 | Lands on page | This is the right cursed text tool | Exact H1, compact value prop, visible workbench |
| 2 | Enters input | The tool reacts immediately | Live preview and counts |
| 3 | Reviews output | Intensity is under control | Presets plus advanced top/mid/bottom controls |
| 4 | Copies or uses result | Done, no friction | Prominent copy button and success feedback |
| 5 | Reads extra guidance if needed | The site understands platform limits | Platform notes, accessibility note, FAQ |

## 7. AI Slop / Template Risk

| Risk | Present? | Fix |
|---|---|---|
| Generic centered hero | Possible if dramatic hero is too large | Keep hero task-first and compact |
| Three-card feature grid | Avoid | Use examples and notes only when content is specific |
| Decorative icon circles | Avoid | Use text controls and functional status indicators |
| Purple/blue gradient default | Avoid | Use deep red/dark neutral palette with restrained accents |
| Reused block rhythm | Possible | Include platform-notes and accessibility-note sections to change rhythm |
| Vague marketing copy | Avoid | Copy should describe paste, preview, copy, clean, and platform use |

## 8. Design System Alignment

- Existing `DESIGN.md` used: none found in this pass
- Cluster design reused: text-generator family conventions only
- Site-specific deviations: darker controlled horror workbench, cleaner mode, overflow-safe output, accessibility warning
- Reason deviations are justified: the cursed text keyword needs a stronger visual identity and more output safety than cursive or typing tools

## 9. Responsive And Accessibility Review

| Requirement | Decision | Open issue |
|---|---|---|
| 390px mobile first viewport | Single column, input -> presets -> output | Verify after implementation |
| Touch targets | 44px minimum | Verify CSS |
| Keyboard operation | Input, presets, controls, copy, clear, cleaner mode | Verify with browser QA |
| Visible focus | High-contrast focus ring on dark surfaces | Token/CSS implementation needed |
| Screen reader feedback | Copy success and warnings announced | Implementation needed |
| Color contrast | Dark surfaces with high-contrast text | Verify final palette |

## 10. Approved Mockups / Boards

| Artifact | Path / URL | Decision | Notes |
|---|---|---|---|
| Not generated | n/a | Proceed with documented direction | Generate mockups later if doing a larger redesign |

## 11. Required Plan Changes Before Implementation

- Reflect the controlled horror workbench direction in `layout.config.yaml` and `theme.config.yaml`.
- Keep tool above the fold and avoid large marketing hero spacing.
- Add cleaner mode to product and acceptance tests.
- Add output overflow constraints to UI requirements.
- Add platform and accessibility notes to content requirements.

## 12. Deferred Decisions

| Decision | Why deferred | Risk |
|---|---|---|
| Final font family | Theme system constraints should drive this | If left generic, visual identity may weaken |
| Final mockup | This pass is documentation-only | Implementation may drift without screenshot review |
| Related tool URLs | Some targets may not exist yet | Broken links if implementer hard-codes future pages |

## 13. Implementation Notes

Changes that must be reflected in:

- `sites/cursed-text-generator/layout.config.yaml`: keep `glitch-playground`, but ensure hero is compact and tool appears early; add blocks for platform/accessibility notes if supported.
- `sites/cursed-text-generator/theme.config.yaml`: deep red/dark neutral palette, smaller radius if compatible, compact workbench density.
- `sites/cursed-text-generator/content/en/home.mdx`: add cursed/Zalgo/glitch explanation, platform notes, accessibility/readability note, examples, FAQ support.
- `apps/site/src/features/<tool-id>/`: implement live preview, presets, advanced controls, cleanup mode, bounded output, copy success, keyboard and ARIA states.

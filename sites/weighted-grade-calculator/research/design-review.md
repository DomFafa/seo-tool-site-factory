# Design Review: Weighted Grade Calculator

## 1. Review Metadata

- Site ID: weighted-grade-calculator
- Primary keyword: weighted grade calculator
- Category: calculator
- Locale: en
- Market: US
- Review date: 2026-05-02
- Reviewer: Codex using seo-tool-site-factory and design-consultation guidance
- Source design file: `sites/weighted-grade-calculator/research/design-direction.md`
- Review phase: pre-implementation plan review plus implementation smoke check
- UI implementation reviewed: partial
- Local URL: `http://localhost:4321/`
- Browser tool used: web-access CDP

## 2. Scope

UI areas reviewed:

- Above-the-fold tool experience
- Tool states
- Mobile layout
- SEO content layout
- Related tools / internal links
- Footer and trust signals

Not in scope:

- Post-implementation visual QA
- Browser screenshots
- Live interaction QA

## 3. Evidence And Gate Status

### Design Skills Used

| Skill | Used? | Evidence / notes |
|---|---|---|
| design-consultation | yes | Local skill guidance read; site-specific design direction created. |
| design-shotgun | no | Not needed for v1 because direction is clear. |
| plan-design-review | no | Manual pre-implementation review recorded here; full gstack plan skill not executed. |
| frontend-design | no | Implemented directly from approved design direction. |
| design-review | deferred | Full post-UI design-review not run; desktop smoke check recorded. |
| qa-only | deferred | CDP smoke test run, full QA not run. |
| qa | deferred | Full fix-mode QA not run. |
| benchmark | yes | `pnpm perf audit weighted-grade-calculator` ran. |

### Browser Evidence

Post-UI visual review is not complete without evidence from the built page.

| Evidence | Path / value | Notes |
|---|---|---|
| Desktop screenshot | `/tmp/weighted-grade-calculator-desktop.png` | Captured through CDP. |
| 390px mobile screenshot | Deferred | Current CDP wrapper lacks viewport emulation; `window.resizeTo` did not change viewport. |
| Local URL | `http://localhost:4321/` | Dev server started with `pnpm site dev weighted-grade-calculator`. |
| Viewports checked | Desktop | Mobile viewport deferred. |
| First viewport tool visibility | Passed on desktop | Tool rendered with H1 and workbench present. |
| Main task path tested | Partial | Preset click and target result tested; copy needs real gesture retest. |
| Console errors | Deferred | No visible `.error` blocks; full console capture deferred. |

### Gate Result

- Pre-implementation plan review completed: yes, with manual review notes.
- Post-UI design review completed: deferred
- Browser/screenshot evidence captured: no
- Interaction QA mode: deferred
- If deferred, blocker: true mobile viewport and clipboard verification need fuller browser tooling.
- Launch readiness cap from this review: Launch readiness cannot exceed 4 until post-UI design review runs for this new UI-bearing site.

## 4. Overall Design Score

- Initial score: 8
- Final score: 8
- Reason: The implemented draft follows the keyword-specific workbench direction and validates cleanly. It is not yet a 10 because mobile screenshot evidence and full post-UI QA are deferred.

What would make this a 10/10:

- Desktop and mobile screenshots verify the tool is visible and non-overlapping.
- Real interaction QA confirms row editing, weight validation, and result copy.
- The final UI demonstrates a distinct education-calculator pattern without looking like the existing text tools.

## 5. Information Architecture

| Area | Score | Finding | Fix |
|---|---:|---|---|
| First viewport hierarchy | 8 | Tool-first hierarchy is specified. | During implementation, ensure no large hero pushes calculator down. |
| Tool controls | 8 | Required controls are clear. | Keep add/remove/copy/reset visible without crowding mobile. |
| SEO content sequence | 8 | Examples and formula follow the tool. | Avoid long intro before calculator. |
| Related links | 6 | Future links listed but pages may not exist. | Only link to existing pages or record future links in content. |

## 6. Interaction States

| Feature | Empty | Input | Loading / long input | Error | Success |
|---|---|---|---|---|---|
| Primary tool | Starter rows and presets | Live calculation | No loading expected | Inline validation | Current grade summary |
| Copy action | Disabled or copies empty explanation | Copies summary | Instant | If no valid result, explain why | `Grade summary copied` |
| Example chips | Fill starter data | Replace or append preset | Instant | Not applicable | Preset applied |

## 7. User Journey

| Step | User does | User should feel | Design support |
|---|---|---|---|
| 1 | Lands on page | This is immediately useful | Tool-first workbench with H1/subtitle. |
| 2 | Enters input | The calculator understands class categories | Labeled rows and presets. |
| 3 | Reviews output | The result is trustworthy | Weight meter and explanation. |
| 4 | Copies or uses result | Easy to act on | Plain-language copy summary. |
| 5 | Reads extra guidance if needed | The formula is understandable | Examples and FAQ below tool. |

## 8. First Viewport And Responsive Findings

| Check | Desktop result | 390px mobile result | Fix required |
|---|---|---|---|
| Tool visible before excessive scroll | Passed | Deferred | Verify real 390px viewport. |
| Primary input visible | Passed | Deferred | Keep rows above SEO copy. |
| Main action visible | Passed | Deferred | Copy/reset may stack on mobile. |
| No overlapping text/UI | No visible desktop issue | Deferred | Browser QA required. |
| Result area stable | Passed in smoke test | Deferred | Verify on mobile. |
| Content hierarchy clear | Passed | Deferred | Avoid oversized hero typography. |

## 9. AI Slop / Template Risk

| Risk | Present? | Fix |
|---|---|---|
| Generic centered hero | Not in plan | Keep hero compact and tool-led. |
| Three-card feature grid | Not in plan | Use examples/formula sections instead. |
| Decorative icon circles | Not in plan | Use meaningful grade/status indicators only. |
| Purple/blue gradient default | Not in plan | Use neutral academic palette with green/amber semantics. |
| Reused block rhythm | Risk | Differentiate with gradebook workbench and result rail. |
| Vague marketing copy | Risk | Keep copy task-specific and example-driven. |

## 10. Design System Alignment

- Existing `DESIGN.md` used: no
- Cluster design reused: no
- Site-specific deviations: new education-calculator pattern.
- Reason deviations are justified: existing sites are text, typing, and image tools; this grade calculator needs category rows and numeric planning.

## 11. Responsive And Accessibility Review

| Requirement | Decision | Open issue |
|---|---|---|
| 390px mobile first viewport | Stacked result + row editor | Needs screenshot verification. |
| Touch targets | 44px minimum | Needs implementation QA. |
| Keyboard operation | Row controls keyboard reachable | Needs implementation QA. |
| Visible focus | Required | Needs CSS verification. |
| Screen reader feedback | aria-live result summary | Needs implementation QA. |
| Color contrast | WCAG AA target | Needs final palette check. |

## 12. Approved Mockups / Boards

| Artifact | Path / URL | Decision | Notes |
|---|---|---|---|
| none | Deferred | Not required for research-only v1 | Post-UI screenshots required after implementation. |

## 13. Required Plan Changes Before Implementation

- Make the result/weight meter part of the first viewport.
- Avoid a desktop-only wide table; implement mobile row cards.
- Keep related links conditional on existing site routes.
- Use semantic warning states for under/over 100% weight.

## 14. Deferred Decisions

| Decision | Why deferred | Missing evidence | Impact | Next action |
|---|---|---|---|---|
| Post-UI visual quality | UI not implemented | Desktop/mobile screenshots | Launch readiness capped | Run design-review after implementation. |
| Interaction QA | UI not implemented | Browser task path | Launch readiness capped | Run qa or qa-only after implementation. |
| Exact color tokens | Theme config not created | Rendered contrast check | Could need adjustment | Verify during implementation. |

## 15. Post-UI Fix Log

| Finding | Evidence | Fix applied | Remaining risk |
|---|---|---|---|
| Course points displayed as raw weighted sum | CDP text showed `Weighted points 6910.00` | Relabeled and scaled to `Course points 69.10` | Rebuilt successfully after fix. |
| Mobile viewport evidence unavailable | CDP wrapper lacks viewport emulation endpoint | Recorded as deferred blocker | Needs Playwright/gstack browse QA. |

## 16. Implementation Notes

Changes that must be reflected in:

- `sites/weighted-grade-calculator/layout.config.yaml`: tool-first academic workbench block order.
- `sites/weighted-grade-calculator/theme.config.yaml`: neutral worksheet palette, green/amber/red semantics, compact density.
- `sites/weighted-grade-calculator/content/en/home.mdx`: task-specific intro, examples, formula, use cases, FAQ.
- `apps/site/src/features/weighted-grade-calculator/`: row editor, result rail, weight meter, what-if solver, copy/reset.

## Evidence Used

- `design-direction.md`, `ux-spec.md`, `product-requirements.md`, and Bing Top 5 competitor pattern.

## Decisions Made

- Pre-implementation plan is sufficient to move to implementation after research audit.
- Full post-UI review remains required before any launch-ready claim.

## Implementation Implications

- Implementation followed the approved academic workbench visual system.
- Launch status remains `DRAFT_ONLY` until full browser QA and post-UI design review pass.

## Rebuild Review: Apple-Inspired Minimal UI

The first implementation was intentionally rolled back/rebuilt because the user requested an Apple-style direction. The new target is a cleaner first impression with large whitespace, fewer visible controls, and less above-the-fold copy.

| Check | Result | Notes |
|---|---|---|
| Apple-like whitespace | implemented | Tool stage uses a large centered result surface and sparse controls. |
| Few visible components | implemented | Category editor is collapsed by default; presets are short text controls. |
| Less text above fold | implemented | Hero copy is one short subtitle; SEO content remains below the tool. |
| Premium neutral palette | implemented | `#f5f5f7`, white, dark neutral text, Apple-like blue action color. |
| Dense spreadsheet avoided | implemented | Full category rows are hidden behind `Edit categories`. |
| SEO content preserved | implemented | Static home/FAQ content remains after examples/how-it-works. |

Remaining review needs:

- Capture fresh desktop and true 390px screenshots for the rebuilt UI.
- Verify folded editor discoverability and mobile field stacking.
- Verify copy behavior with a real browser gesture or clipboard permissions.

## Rebuild Review: Milople-Inspired Playful UI

The Apple-inspired version was replaced after user feedback. The active reference is Milople's keyword density checker, with a light cartoon SEO-tool style rather than a premium product-page style.

| Check | Result | Notes |
|---|---|---|
| Header visibly changed | implemented | Header now uses a white bar, larger outlined blue brand mark, orange dot accents, compact nav, and orange language pill. |
| Typography no longer exaggerated | implemented | H1 and result scale were reduced; the page reads as a utility tool, not an Apple product hero. |
| Reference style captured | implemented | Central dashed blue tool card, orange CTA, blue secondary action, peach background shape, and small document doodles. |
| Tool visible early | implemented | Hero vertical spacing was reduced and the tool card moved up. |
| SEO content pushed down | implemented | Examples, how-to, guide content, and FAQ remain below the calculator. |
| Mobile overflow | fixed after screenshot review | 390px headless screenshots exposed overflow; mobile header, H1, tool card, preset row, and final-plan inputs were tightened. |

Evidence:

- Desktop screenshot: `/tmp/wgc-desktop-clean.png`
- Mobile screenshot attempts: `/tmp/wgc-mobile-final-clean.png`
- Reference screenshot: `/tmp/milople-ref.png`

Remaining risk:

- The headless Chrome screenshot process reports noisy updater/logging output unrelated to page rendering.
- Clipboard copy still requires a real browser gesture to fully verify.

## Rebuild Review: Playful Milople-Inspired UI

The UI has been rebuilt again using the Milople keyword density checker as the primary reference. The goal is not a clone; the borrowed principles are the friendly orange/blue palette, dashed central tool frame, rounded white utility surface, subtle cartoon-like side accents, and a conventional header with more useful visual presence.

| Check | Result | Notes |
|---|---|---|
| Header improved | implemented | White header, subtle shadow, blue brand mark, orange active locale. |
| Title scale corrected | implemented | H1 uses normal tool-page scale instead of oversized Apple-like display type. |
| Playful reference applied | implemented | Peach blob, simple doodles, orange CTA, blue dashed tool border. |
| Tool remains primary | implemented | Central calculator appears before SEO content. |
| Component density controlled | implemented | Main tool shows result/final plan; category editor is expandable below. |
| SEO content preserved | implemented | Examples, how-to, content, and FAQ remain below the tool. |

Remaining review needs:

- Capture a fresh screenshot of the playful version.
- Verify mobile stacking with real viewport emulation.
- Verify copy behavior with a real browser gesture or clipboard permissions.

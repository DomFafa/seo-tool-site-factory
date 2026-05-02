# Design Direction: Weighted Grade Calculator

## 1. Design Source

- Site ID: weighted-grade-calculator
- Primary keyword: weighted grade calculator
- Category: calculator
- Locale: en
- Market: US
- Design source: new site direction
- Design status: draft
- Design-new decision: yes
- Design-new reason: No existing approved grade-calculator cluster design exists in this repository, and the site needs an education-specific tool workbench.
- Consultation used: yes, via local reading of `gstack-design-consultation` guidance and applying it to a site-specific direction.
- Shotgun used: no
- Reused cluster system: none
- Reuse justification: not applicable
- Related cluster: future education calculators
- Reference research files:
  - `sites/weighted-grade-calculator/research/competitor-research.md`
  - `sites/weighted-grade-calculator/research/product-requirements.md`
  - `sites/weighted-grade-calculator/research/seo-spec.md`
  - `sites/weighted-grade-calculator/research/ux-spec.md`

## 2. Product Context

### Target user

Students checking a class grade from a syllabus, gradebook, or teacher-provided category weights. Secondary users include parents, tutors, and teachers explaining weighted grading.

### User job

Calculate a weighted course grade from categories and scores, then test what score is needed on remaining work.

### Design problem

The interface must help users complete the main task immediately while making this site feel specific to weighted grade planning, not like another cloned utility template.

## 3. Visual Personality

- Aesthetic direction: academic planner meets compact spreadsheet, with clear ruled structure and calm result emphasis.
- Decoration level: low; use meaningful structure, meters, and grade chips rather than ornamental graphics.
- Tone: precise, student-friendly, low anxiety.
- What users should notice first: the editable category rows and the current grade result.
- What should feel different from competitors: a visible weight-total meter and a paired what-if panel in the first viewport.

## 4. Typography

- Display / hero: restrained, readable headline; avoid oversized marketing type.
- Body: clean sans-serif optimized for dense form labels and explanatory text.
- UI labels: compact, high-contrast, sentence case.
- Data / counters: tabular numerals where supported for grades, weights, and percentages.
- Loading strategy: system font stack is acceptable for v1 to keep performance tight.

## 5. Color

- Approach: balanced.
- Primary: deep green or teal for successful grade/valid weight status.
- Secondary: warm amber for warnings and target-grade planning.
- Neutral surfaces: off-white and light gray worksheet surfaces, with dark text.
- Semantic colors: green for valid/exact, amber for incomplete/underweight, red for invalid/overweight or impossible target.
- Dark mode strategy: not required for v1.

Avoid one-note palettes and default purple/blue gradient systems.

## 6. Density, Spacing, And Surfaces

- Density: medium-high in the tool, comfortable in content sections.
- Spacing base: 8px.
- Border radius scale: 6-8px; avoid oversized soft cards.
- Surface strategy: one framed workbench area, with rows and result rail inside. Content sections below should be unframed or use simple bands.
- Card usage rules: use row cards on mobile and example cards below the fold; do not nest cards inside cards.

## 7. Layout Recipe

- Recipe: tool-led academic workbench.
- Nav variant: minimal top bar with brand/site title and optional related links.
- Hero variant: compact H1/subtitle integrated with the tool, not a separate marketing hero.
- Tool variant: desktop two-column workbench: category editor left, result/what-if rail right. Mobile stacked: result summary, row editor, what-if controls.
- Block order: hero/tool, examples, formula/how it works, use cases, FAQ, related tools.
- Above-the-fold composition: H1 and subtitle at top, workbench immediately below; result rail visible without scrolling on common desktop.
- Related content placement: below examples and formula, never before the tool.

## 8. Tool Workbench Pattern

- Input placement: category rows in a structured editor with add/remove controls.
- Output placement: fixed result rail on desktop; top summary panel on mobile.
- Mode controls: current grade always on; what-if final score optional section.
- Primary actions: add row, copy summary, reset.
- Secondary actions: preset chips, include/exclude row.
- Example entry points: chips directly above or inside the workbench.
- Privacy note placement: below the result rail or directly under the row editor.

## 9. Mobile Design

- 375-390px layout: stacked single column with stable row cards.
- Touch target rules: 44px minimum for buttons and row controls.
- Input/output comparison: show compact result summary before rows, then keep weight meter near row editor.
- Sticky controls: not required for v1; avoid obstructing fields.
- Long result behavior: messages wrap under numeric grade without shifting primary controls.

## 10. Motion

- Motion level: subtle.
- Page-load behavior: no animated hero.
- Tool interaction behavior: result value can update instantly without dramatic transitions.
- Copy/success feedback: brief status text and color change.
- Reduced motion behavior: all transitions optional and disabled with `prefers-reduced-motion`.

## 11. Accessibility

- Focus treatment: visible outline with sufficient contrast.
- Label strategy: visible labels, not placeholder-only.
- Screen reader announcements: aria-live result summary for grade changes and copy success.
- Contrast requirements: meet WCAG AA for text and controls.
- Keyboard path: logical row-by-row tab order, add/remove buttons reachable.

## 12. Anti-Template Constraints

This site must avoid:

- Generic centered hero plus three feature cards.
- Decorative icon circles.
- Purple/blue gradient defaults.
- Same block rhythm as text generator or typing tools.
- Copy that describes design instead of the user's task.
- A wide desktop-only table that breaks on mobile.

## 13. Differentiation From Existing Factory Sites

| Existing site | Similarity risk | Required difference |
|---|---|---|
| cursed-text-generator | Medium if using generic hero/tool/content rhythm | Use academic workbench layout, grade rows, and result rail rather than text transform panels. |
| typing-test-online / typing-speed-test | Low | Avoid game-like timing/dashboard patterns; this is a planner/calculator. |
| convert-image-to-png | Low | Avoid upload/conversion flow; no file dropzone or download-first layout. |

## 14. Design Skill Decisions

### Design consultation

- Used / deferred: used as site-specific direction, not root `DESIGN.md`.
- Reason: new UI-bearing site with no approved keyword-specific design direction.
- Key constraints: tool above fold, student planner feeling, no generic template rhythm, strong mobile row editing.

### Design shotgun

- Used / deferred: not used
- Reason: direction is clear and the keyword is utility-first; multiple visual variants are not necessary before v1 research completion.
- Variants considered: academic worksheet, modern dashboard, playful student planner.
- Chosen variant: academic worksheet/workbench with restrained result rail.

### Approved direction

- Approved direction: draft academic workbench for implementation planning.
- Why this direction is better for the keyword: weighted grades are naturally row/category based, so a compact gradebook workbench matches the mental model.
- What must not change during frontend implementation: tool-led first viewport, visible weight meter, result/what-if pairing, no marketing hero before the tool.

## 15. Approved References

- Mockup / board path: none in research-only phase.
- Chosen variant: academic workbench.
- Notes from design consultation: use site-specific design records; do not overwrite root `DESIGN.md`.
- Notes from plan design review: see `design-review.md`.

## Evidence Used

- Product/UX research files for weighted category workflow.
- Bing Top 5 competitor pattern: broad calculator pages without exact-match domains.
- Existing repository site list showing no current education calculator cluster.

## Decisions Made

- Establish a new education-calculator visual pattern.
- Use restrained green/amber semantic system, not purple/blue gradient defaults.
- Keep design low-decoration and task-first.

## Implementation Implications

- `theme.config.yaml` should encode a neutral academic palette with green/amber semantics.
- `layout.config.yaml` should use tool-first block order.
- UI implementation should avoid card nesting and mobile horizontal scroll.

## Rebuild Addendum: Apple-Inspired Minimal Direction

User requested a rebuild referencing `apple.com`: large whitespace, fewer components, less visible text above the fold, a clean premium first impression, and SEO content pushed into the lower half of the page.

Updated design decisions:

- Recipe: `apple-minimal`.
- Visual personality: Apple-inspired product page, not a dense academic workbench.
- First impression: oversized weighted-grade result, short subtitle, compact final planner, and minimal controls.
- Component exposure: category rows are collapsed under `Edit categories` by default.
- Color: Apple-like blue action color, white surfaces, `#f5f5f7` page background, dark neutral text.
- SEO layout: examples, how-it-works, formula, use cases, and FAQ remain present but sit below the tool-first product experience.
- Constraints: no purple/blue gradient system, no feature-card marketing grid, no dense spreadsheet visible in the first viewport.

Implementation implications:

- `theme.config.yaml` should use `personality: apple-inspired-minimal`, `density: spacious`, and `surface: flat`.
- `layout.config.yaml` should use `recipe: apple-minimal` and `tool` variant `apple-minimal`.
- `WeightedGradeCalculatorIsland.tsx` should keep the primary result visually dominant and the full editor collapsed by default.

## Rebuild Addendum: Playful Tool Direction

The Apple-inspired version was rejected because the typography became too exaggerated and the header did not meaningfully improve. The new user-approved reference priority is Milople's keyword density checker, with Kwebby and FrontendTools as secondary references.

Updated design decisions:

- Recipe: `playful-tool`.
- Visual personality: friendly SEO utility page with light cartoon accents.
- Header: clearer brand/navigation treatment with white bar, subtle shadow, blue brand mark, orange active locale.
- Hero: normal title scale, centered, concise, no oversized product typography.
- Tool frame: central dashed blue border, white interior, orange primary action, blue reset/action accent.
- Decoration: small abstract document/grade doodles and a peach background blob inspired by the reference, without copying assets.
- Content strategy: SEO sections remain below the main tool; the first viewport focuses on the usable calculator.
- Editor strategy: category editing is still available but contained in an expandable section below the primary result and final-plan controls.

Implementation implications:

- `theme.config.yaml` should use `personality: playful-seo-tool`, orange primary, blue accent, warm background.

### Playful UI refinement after Milople reference review

User feedback after the Apple-inspired rebuild:

- The previous H1/result type felt oversized and too intentionally "Apple-like."
- The header did not change enough to establish a new visual direction.
- The preferred visual reference is Milople's keyword density checker: clean white header, centered utility card, blue dashed frame, orange primary action, warm background blob, and light cartoon document accents.

Final refinement decisions:

- Preserve all calculation logic, SEO content, research, and site-pack structure.
- Use a normal utility-page title scale instead of hero/product-page typography.
- Move the usable calculator higher in the first viewport and reduce empty vertical space.
- Give the header a stronger playful identity: outlined blue brand mark, orange dot accents, white bar, and compact navigation treatment.
- Keep the Milople-inspired language abstract rather than copied: dashed central tool card, orange/blue action system, peach shape, and simple document doodles.
- On mobile, hide the redundant Home link, keep the language pill, stack final-plan fields, and prevent horizontal overflow.
- `layout.config.yaml` should use `recipe: playful-tool`, hero variant `friendly-tool`, and tool variant `dashed-card`.
- `WeightedGradeCalculatorIsland.tsx` should use a dashed-card tool surface with restrained result typography and lightweight decorative shapes.

## Deferred Items

- Formal design-board artifacts are deferred. Missing evidence: user did not request visual variants, and v1 direction is sufficient. Impact: design specificity capped below perfect until implementation screenshots exist. Next action: run post-UI design review after building.

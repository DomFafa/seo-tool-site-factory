# Product Requirements: Weighted Grade Calculator

## 1. Goal

Build a production-ready, SEO-friendly, fast, mobile-first tool website for `weighted grade calculator`.

The page must help students calculate a current course grade from weighted categories, understand weight totals, and test target-grade scenarios without login, intrusive popups, or raw score tracking.

## 2. Target Keywords

### Primary keyword

- weighted grade calculator

### Secondary keywords

- grade calculator
- weighted average grade calculator
- final grade calculator
- class grade calculator
- grade weight calculator

### Related long-tail keywords

- calculate weighted grade from percentages
- weighted grade calculator with categories
- what grade do I need on my final
- final exam weighted grade calculator
- how to calculate a weighted grade

## 3. User Job

> Students need to calculate an overall course grade from categories with different weights, then test what scores they need on remaining assignments or finals.

## 4. Core User Flow

1. User lands on the page.
2. User sees a grade workbench immediately.
3. User enters category names, weights, and scores, or starts from a preset.
4. Tool shows current weighted grade, weight-total status, and warnings.
5. User optionally enters target grade and remaining/final weight.
6. Tool shows the needed remaining score, including impossible or already-secured states.
7. User copies the result summary or clears the workbench.

## 5. Required Features

### Core

- Editable weighted category rows: category name, weight percentage, score percentage, include/exclude toggle.
- Live current weighted grade.
- Total-weight meter with exact, underweight, and overweight states.
- Final/remaining score what-if solver.
- Example presets for common course structures.
- Copyable result summary.
- Clear/reset action.
- Local-only privacy note near the tool.

### Nice-to-have

- Letter-grade scale toggle using a standard configurable scale.
- Points-to-percentage helper for a category row.
- Saved local preset in browser storage, off by default.

### Do not build

- School LMS login.
- Transcript or GPA certification.
- Teacher gradebook management.
- User accounts.
- Server-side score storage.
- Academic advice beyond calculation explanation.

## 6. Tool Behavior

### Input

- Accept: category names, weights from 0-100, scores from 0-100, target grade, remaining/final weight.
- Reject: non-numeric weights/scores, negative percentages, scores over a conservative maximum unless extra-credit mode is explicitly added.
- Max length: category names should be short labels, recommended 40 characters.
- Preserve whitespace: trim category labels; no need to preserve whitespace.
- Support Unicode: yes for category labels.
- Support emoji: yes in labels, but labels are never sent to analytics.
- Empty state: show starter rows and presets; no error until the user interacts.

### Output

- Update mode: instant.
- Copy behavior: copy a plain-text summary with current grade, weight total, and what-if result if present.
- Download behavior: not required for v1.
- Error behavior: inline row validation plus summary banner for blocking errors.
- Local history: none in v1.

## 7. Edge Cases

| Case | Expected behavior |
|---|---|
| Empty input | Show a helpful empty state with example presets and no scary errors. |
| Weight total below 100% | Calculate based on entered categories and clearly state that not all course weight is represented. |
| Weight total above 100% | Warn that weights exceed 100%; still show normalized preview only if clearly labeled, otherwise block final interpretation. |
| Invalid input | Mark the row field and exclude it from result until corrected. |
| Zero-weight category | Allow but indicate it does not affect the total. |
| Blank category score | Treat as missing, not zero, unless the user chooses to include it as zero. |
| Target grade impossible | Say the needed score is above 100% and show the exact required score. |
| Target already secured | Say the target is already met if remaining score can be 0 or below. |
| Mobile editing | Use stacked row cards and stable result area; no horizontal scrolling. |

## 8. UI Requirements

### Above the fold

- H1: Weighted Grade Calculator
- One-sentence value proposition.
- Category row editor.
- Current grade result panel.
- Weight total meter.
- What-if final/remaining score panel.
- Example preset chips.
- Copy and reset controls.

### Below the fold

- How weighted grades work.
- Formula and examples.
- Common course setups.
- Related tools.
- FAQ.
- Privacy note repeated or linked.

## 9. Accessibility Requirements

- Every input must have a visible label.
- Row add/remove controls must have accessible names.
- All buttons must be keyboard accessible.
- Focus states must be visible.
- Result updates should be in an aria-live region.
- Copy success must be announced visually and accessibly.
- No keyboard trap.
- Touch targets must be comfortable on mobile.
- Color contrast should use accessible defaults.

## 10. Privacy Requirements

- Core operation runs locally in the browser.
- Do not store raw category names, scores, weights, or target grades on the server.
- Do not include raw score values or labels in analytics events.
- Local history is not part of v1.
- Add a visible privacy note near the tool.

## 11. Performance Requirements

- Static/SSR-render SEO-critical content.
- Hydrate only the interactive calculator island.
- Avoid heavy dependencies.
- Avoid layout shift when adding/removing rows.
- Keep calculations instant during typing.
- Keep mobile result panel stable.

## 12. Acceptance Criteria

- User can calculate a basic weighted grade in under 3 interactions after landing.
- User can add or remove category rows.
- User can identify whether weights add to 100%.
- User can calculate needed final score for a target grade.
- Tool is usable on mobile without horizontal scrolling.
- Copy button works and shows success state.
- Page has title, meta description, canonical, and Open Graph tags through site config/content.
- Page has valid structured data only where content is visible.
- Draft site keeps indexing disabled.
- Edge cases listed above pass.

## Evidence Used

- Bing Webmaster Top 5 for `weighted grade calculator` shows broad calculator pages and no strong related root-domain occupation.
- The ranking set suggests users accept standalone utility pages, but differentiation should come from workflow clarity and category-specific planning.

## Decisions Made

- Make weight validation and final-score what-if core features, not secondary copy.
- Do not build account, LMS, or gradebook persistence in v1.
- Keep privacy local-only.

## Implementation Implications

- Need a pure calculation package with validation states and reverse-solving.
- Need an interactive island with dynamic rows and accessible result updates.
- Need content examples that match the exact UI features.

## Deferred Items

- Exact letter-grade scale defaults are deferred. Missing evidence: no school-specific grading policy. Impact: v1 can show numeric percentage first and optional generic letter labels only with a note. Next action: choose a standard A/B/C/D/F scale during implementation if UI scope allows.

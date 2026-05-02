# UX Specification: Weighted Grade Calculator

## 1. UX Goal

Make the user feel that this tool is faster and clearer than generic grade calculator pages by focusing on category weights, missing-weight clarity, and final-grade planning.

## 2. Above-the-Fold Layout

Required elements:

- H1: Weighted Grade Calculator
- Short value proposition.
- Category row editor.
- Current grade result area.
- Weight-total meter.
- What-if target grade panel.
- Copy/reset controls.
- Example starter chips.
- Privacy reassurance: "Your scores stay in your browser."

## 3. Primary Task Path

The ideal task path should be:

1. Land on page.
2. Choose a preset or edit starter rows.
3. Enter category weights and scores.
4. See current weighted grade.
5. Optionally enter a target grade and final/remaining weight.
6. Copy or use the result.

Target: complete a basic weighted-grade calculation in under 3 interactions after the first field is focused.

## 4. States

### Empty state

Show starter rows with common categories and example chips. The result panel should explain that a grade appears after at least one valid included row.

### Input state

Recalculate instantly. Show weight total, included category count, and any missing/invalid fields.

### Result state

Show numeric weighted grade prominently, plus a concise explanation such as "Based on 4 included categories totaling 100% of the course."

### Error state

Use inline field messages for invalid numbers and a summary message for weights above 100% or no valid rows. Do not erase user input.

### Long input / loading state

No loading state should be needed for normal input. Adding many rows should keep layout stable and calculations instant.

## 5. Mobile UX

- No horizontal scrolling.
- Category rows become stacked cards with compact labels.
- Result summary appears before long explanatory content.
- Add/remove row buttons stay reachable.
- Copy/reset actions are not hidden.
- Weight meter remains visible near the result.

## 6. Accessibility

- Visible labels for category, weight, and score fields.
- Accessible names for add, remove, include/exclude, copy, and reset buttons.
- Keyboard-operable row controls.
- Visible focus states.
- Result changes announced through an aria-live region.
- No keyboard traps.

## 7. Ad Placement Rules

- No ads near primary actions.
- No ads inside the result panel.
- No ads that shift the tool after interaction.
- No popup before task completion.

## 8. UI Differentiation

Existing similar sites in this factory:

- No existing grade calculator site found in current `sites/` list.
- Existing factory sites include text/typing/image tools; this site should establish an education-calculator pattern rather than reuse text-tool layouts.

Differentiation choices for this site:

- Recipe: compact academic workbench.
- Nav variant: minimal utility nav, no marketing-style hero.
- Hero variant: tool-led first viewport, H1 and subtitle beside/above the calculator.
- Tool variant: gradebook rows plus result rail.
- Visual personality: calm classroom planner, precise but not institutional.
- Block order: tool first, examples next, formula/how-it-works after.
- Density/surface: medium-high density in the workbench, quieter content sections below.

## 9. Microcopy

### Placeholder text

- Category: `Homework`
- Weight: `20`
- Score: `87`
- Target grade: `90`
- Remaining/final weight: `25`

### Example chips

- `Homework / quizzes / exams / final`
- `Final-heavy class`
- `Labs and exams`
- `Only completed categories`

### Copy success message

`Grade summary copied`

### Clear/reset confirmation if needed

No confirmation for reset in v1; reset should be reversible only by selecting an example again.

## 10. Quality Checklist

- Tool visible early.
- Main task is obvious.
- Examples are useful.
- Weight-total status is impossible to miss.
- Copy action is reliable.
- Mobile layout is usable.
- Privacy note is close to the tool.
- Page does not feel like a thin template.

## Evidence Used

- Bing Webmaster Top 5 shows broad calculator competitors where a more focused student workflow can differentiate.
- User-selected keyword passed the no-strong-related-root-domain rule, so UI quality should be the main moat rather than domain naming.

## Decisions Made

- Use a tool-first workbench rather than a large hero or article-first page.
- Treat mobile row editing as a primary UX requirement.
- Keep ads away from the calculator and result area.

## Implementation Implications

- Layout config should prioritize first-viewport tool visibility.
- The interactive UI should avoid wide spreadsheet tables on mobile.
- Result panel dimensions should remain stable when messages change.

## Deferred Items

- Post-implementation browser evidence is deferred until the UI exists. Missing evidence: screenshots and task-path QA. Impact: launch readiness remains low until Phase 4. Next action: run design-review/QA after implementation.

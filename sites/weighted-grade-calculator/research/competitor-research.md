# Competitor Research: weighted grade calculator

## 1. Research Metadata

- Site ID: weighted-grade-calculator
- Primary keyword: weighted grade calculator
- Category: calculator
- Locale: en
- Search market: US
- Research date: 2026-05-02
- User job: Calculate a weighted course grade from category weights and scores.
- Expected action: Enter category weights and scores, then get current grade and final-grade what-if output.

## 2. Bing Webmaster Source

Primary competitor selection comes from Bing Webmaster Tools Keyword Research.

- Companion workflow: referenced by skill, but local `/Users/bin/.codex/skills/seo-demand-validation/SKILL.md` was not present.
- Browser/network workflow: `/Users/dom/.codex/skills/web-access/SKILL.md`; CDP proxy used after local path correction.
- Bing site URL: `https://2fafree.com/`
- Bing date range: 3M
- Bing keyword searched: `weighted grade calculator`
- Data quality notes: Bing Webmaster Top 5 table was captured from the logged-in browser session. This file records the first 5 rows required by the skill. Direct competitor UI teardown is conservative pending per-page browser review.

### Bing Webmaster Capture Attempt

- Status: `captured`
- Attempted at: 2026-05-01T17:37:08.026Z
- Attempted by: web-access CDP
- Bing siteUrl: `https://2fafree.com/`
- Exact keyword: `weighted grade calculator`
- Date range: 3M
- Attempted URL: `https://www.bing.com/webmasters/keywordresearch?siteUrl=https%3A%2F%2F2fafree.com%2F&keyword=weighted%20grade%20calculator&activeTab=related`
- Browser/session: User Chrome remote debugging, target `431006485370D07FB3CBEF233916ECAE`, Bing Webmaster Tools logged-in page.
- Result: Captured 5 ranking rows from `Top 10 url ranking on this keyword`; keyword impressions shown as `5.8K`.
- Blocker text: none
- Screenshot or artifact path: `/tmp/bing-webmaster-top5-calculator-keywords.json`
- User approval context if skipped: not applicable

### Raw Captured Top 10 Rows

Only the first 5 rows were captured and required for the current research pass.

| Bing rank | Title | URL | Topics | Captured? |
|---:|---|---|---|---|
| 1 | Grade Calculator | https://www.calculator.net/grade-calculator.html | education, grades | yes |
| 2 | Grade Calculator - RapidTables.com | https://www.rapidtables.com/calc/grade/grade-calculator.html | calculators, grades | yes |
| 3 | Weighted Grade Calculator | https://www.calculatorgenius.com/grade-calculators/weighted-grade-calculator/ | - | yes |
| 4 | Grade Calculator \| Weighted Average Calculator | https://www.calculatorsoup.com/calculators/statistics/grade-calculator.php | - | yes |
| 5 | Weighted Grade Calculator - Calculate Final Grade with Category Weights | https://miniwebtool.com/weighted-grade-calculator/ | - | yes |
| 6 | unavailable in current capture | unavailable | unavailable | no |
| 7 | unavailable in current capture | unavailable | unavailable | no |
| 8 | unavailable in current capture | unavailable | unavailable | no |
| 9 | unavailable in current capture | unavailable | unavailable | no |
| 10 | unavailable in current capture | unavailable | unavailable | no |

### Evidence Used

- Bing Webmaster rows captured: yes, first 5 ranking rows.
- Artifact or screenshot path: `/tmp/bing-webmaster-top5-calculator-keywords.json`
- Fallback sources, if any: none
- Confidence level: high for Top 5 selection; medium for competitor feature assumptions until per-page interaction review.
- Evidence gaps: full Top 10 rows and direct competitor UI interactions are not captured in this research pass.

### Decisions Made From Evidence

- Required competitor set: the first 5 Bing Webmaster rows listed above.
- Fallback competitor set, if approved: none.
- Primary opportunity: build a focused weighted-grade tool that avoids generic grade-calculator clutter and makes category weights, missing weights, and final-score scenarios clearer.
- Implementation implications: design the tool around category rows, live total-weight validation, and a what-if final score panel.
- Deferred items: direct per-competitor UI teardown. Missing evidence: screenshots or interaction notes for each competitor. Impact: final implementation should treat detailed competitor UI claims as hypotheses. Next action: inspect competitor pages during implementation if needed for exact UX gaps.

## 3. Bing Webmaster Top 5 Ranking Competitors

| Bing rank | Title | URL | Topics | Included in deep review? | Exclusion reason if no |
|---:|---|---|---|---|---|
| 1 | Grade Calculator | https://www.calculator.net/grade-calculator.html | education, grades | yes |  |
| 2 | Grade Calculator - RapidTables.com | https://www.rapidtables.com/calc/grade/grade-calculator.html | calculators, grades | yes |  |
| 3 | Weighted Grade Calculator | https://www.calculatorgenius.com/grade-calculators/weighted-grade-calculator/ | - | yes |  |
| 4 | Grade Calculator \| Weighted Average Calculator | https://www.calculatorsoup.com/calculators/statistics/grade-calculator.php | - | yes |  |
| 5 | Weighted Grade Calculator - Calculate Final Grade with Category Weights | https://miniwebtool.com/weighted-grade-calculator/ | - | yes |  |

## 4. Search Intent Summary

### Primary intent

Calculate an overall course grade when each category counts for a different percentage of the final grade.

### Secondary intents

- Check whether current category weights add to 100%.
- Calculate final exam or remaining assignment score needed for a target grade.
- Learn the weighted-grade formula.
- Use a quick calculator without signing into a school gradebook.

### Non-intents

- GPA calculation across classes.
- Official transcript or school policy calculation.
- LMS integration.
- Advice on academic standing or financial aid.

### Bing ranking notes

- Bing Webmaster ranking pattern: broad calculator domains dominate ranks 1, 2, and 4; rank 3 and 5 are smaller calculator pages but not exact-match root domains.
- Dominant page types: calculator pages with supporting formula content.
- Ranking small sites: CalculatorGenius and MiniWebTool show that smaller pages can rank when focused on the exact task.
- Needs Bing Webmaster recapture: no for Top 5; yes only if full Top 10 is needed.

### Strong Related Root-Domain Occupation Check

User rule: if Bing Top 5 contains root domains strongly matching the search keyword, treat the keyword as occupied and avoid recommendation.

| Rank | Root domain | Strongly related to `weighted grade calculator`? | Notes |
|---:|---|---|---|
| 1 | calculator.net | no | Broad calculator domain, not keyword-specific. |
| 2 | rapidtables.com | no | Broad reference/calculator domain. |
| 3 | calculatorgenius.com | no | Broad calculator domain with keyword in path only. |
| 4 | calculatorsoup.com | no | Broad calculator domain. |
| 5 | miniwebtool.com | no | Broad utility domain with keyword in path only. |

Result: `0` strong related root domains in Top 5. The keyword passes the user's occupation filter.

## 5. Competitor Snapshot

| Bing rank | URL | Page type | Tool above fold | Core features | UX weakness | SEO weakness | Opportunity |
|---:|---|---|---|---|---|---|---|
| 1 | https://www.calculator.net/grade-calculator.html | Broad grade calculator | likely yes | Grade and final-grade calculators | Broad page may feel dense and less category-planner specific | Generic grade calculator positioning | Lead with weighted categories and what-if scenarios. |
| 2 | https://www.rapidtables.com/calc/grade/grade-calculator.html | Broad grade calculator | likely yes | Grade math/reference calculator | Reference-site layout may feel utilitarian | Less focused on weighted category planning | Make the workflow friendlier for students entering coursework. |
| 3 | https://www.calculatorgenius.com/grade-calculators/weighted-grade-calculator/ | Focused weighted grade calculator | likely yes | Weighted grade calculation | Smaller page may have limited advanced states | Unknown until page review | Beat with stronger examples, validation, and final-grade reverse solve. |
| 4 | https://www.calculatorsoup.com/calculators/statistics/grade-calculator.php | Broad calculator page | likely yes | Weighted average/grade calculation | Older calculator-site pattern | Generic content pattern | More modern mobile-first interface and clearer category presets. |
| 5 | https://miniwebtool.com/weighted-grade-calculator/ | Focused utility page | likely yes | Weighted grade calculation | Utility-site layout may be plain | Thin or generic supporting copy risk | Better task-specific content, accessible UI, and no clutter near actions. |

## 6. Feature Matrix

| Feature | Rank 1 | Rank 2 | Rank 3 | Rank 4 | Rank 5 | Required for us | Our improvement |
|---|---|---|---|---|---|---|---|
| Tool above the fold | likely | likely | likely | likely | likely | yes | Put category rows and result summary in the first viewport. |
| Live preview | unknown | unknown | unknown | unknown | unknown | yes | Recalculate immediately as values change. |
| Copy button | unknown | unknown | unknown | unknown | unknown | yes | Copy a plain-language result summary. |
| Clear/reset | likely | likely | likely | likely | likely | yes | One reset plus preset restore. |
| Example inputs | unknown | unknown | unknown | unknown | unknown | yes | Add realistic class presets: weighted exams, points-based class, final-heavy class. |
| Download/export | unknown | unknown | unknown | unknown | unknown | no | Not needed for v1; copy summary is enough. |
| Mobile UX | unknown | unknown | unknown | unknown | unknown | yes | Avoid wide tables; use responsive row cards on 390px screens. |
| Privacy note | unknown | unknown | unknown | unknown | unknown | yes | State calculations run locally and scores are not saved. |
| Accessibility | unknown | unknown | unknown | unknown | unknown | yes | Visible labels, keyboard row controls, result announcements. |
| Edge-case handling | unknown | unknown | unknown | unknown | unknown | yes | Missing weights, zero weights, invalid scores, weights over/under 100. |

## 7. UX Teardown

### Common winning patterns

- The tool appears early, before long explanatory text.
- The pages pair calculator functionality with formula explanations.
- Broad calculator domains rank well even without exact-match root domains.

### Common friction

- Broad grade pages can mix simple grade, weighted grade, and final-grade tasks into one dense flow.
- Spreadsheet-like inputs can become hard to use on mobile.
- Users may not understand whether blank categories count as zero, excluded, or missing.

### Fastest user path found

1. Enter category names, weights, and grades.
2. See weighted average.
3. Adjust final exam or remaining category to test a target grade.

### Our must-win UX decisions

- Tool must appear above the fold.
- Core task must not require login.
- Copy action must be visible and reliable.
- Example chips must help users start quickly.
- Mobile layout must avoid horizontal scrolling.
- Ads must not appear near primary actions.
- Weight total must be visible at all times.

## 8. SEO Teardown

| SEO item | Competitor pattern | Gap | Our requirement |
|---|---|---|---|
| Title | Exact or broad calculator title | Some are broad grade pages | Use exact primary keyword plus category/final-grade benefit. |
| Meta description | Calculator task summary | Often generic | Mention category weights, current grade, and final what-if. |
| H1 | Grade Calculator or Weighted Grade Calculator | Broad pages dilute intent | H1 should be `Weighted Grade Calculator`. |
| Intro copy | Formula-oriented | Often not task-specific | Explain who uses it and what the result means in 80-120 words. |
| How it works | Formula explanation | Can be abstract | Use 3 steps: add categories, check weights, read result/what-if. |
| Examples | Variable | Often sparse | Include realistic student examples with weights. |
| FAQ | Variable | Often generic | Answer weight sum, final exam needed, blank grades, points vs percentages. |
| Internal links | Broad calculator hubs | Not always student-focused | Link to future final grade, GPA, percentage, and grade average tools when available. |
| Schema | Varies | Risk of generic or hidden FAQ | Use visible FAQ only if implemented. |
| Canonical/indexing | Standard | Must follow factory | Keep draft non-indexable until audits pass. |

## 9. Technical Observations

| Area | Competitor issue | Our requirement |
|---|---|---|
| Load speed | Broad calculator pages may carry shared scripts or ads | Static content plus one small hydrated island. |
| Client JS | Calculator logic may be page-coupled | Put pure grade math under `packages/tools/weighted-grade-calculator/`. |
| Mobile layout | Wide tables can overflow | Use stacked row cards under mobile breakpoint. |
| Accessibility | Form-heavy calculators often miss result announcements | Use labels, focus states, and an aria-live result summary. |
| Privacy | Student scores can feel personal | Local-only processing and no raw score analytics. |
| Edge cases | Weight totals and blanks can be ambiguous | Clear validation and explanatory messages. |

## 10. Optional Reference Competitors

None yet. Add references only if implementation needs best-in-class table or row editing patterns.

## 11. Differentiation Strategy

### Product differentiation

Build a student-first grade planning calculator, not a generic weighted average form. The first viewport should combine category setup, total-weight validation, current grade, and final-grade what-if.

### UX differentiation

Use a compact gradebook workbench: category rows on the left/top, result meter and what-if panel on the right/below, with mobile row cards instead of wide tables.

### Content differentiation

Explain weighted grade math through realistic course examples: exams/homework/quizzes, final-heavy classes, and missing categories.

### Technical differentiation

Client-only calculations, reusable pure logic, robust validation, and no raw user input in analytics.

## 12. Build Requirements From Research

### Required features

- Category rows with name, weight percent, current score percent, and include/exclude behavior.
- Live weighted grade result.
- Weight total indicator for under/over/exactly 100%.
- What-if target grade solver for remaining/final exam weight.
- Example presets for common course structures.
- Copy result summary.
- Clear/reset controls.
- Local-only privacy note.

### Required content sections

- Intro explaining weighted grade calculation.
- Formula block.
- At least 5 examples.
- Use cases for students.
- FAQ covering weights, blank grades, final exam scenarios, percentages vs points, and privacy.

### Required edge cases

- Empty rows.
- Weight total below 100%.
- Weight total above 100%.
- Invalid percentages.
- Zero-weight category.
- Missing final exam weight.
- Target grade impossible or requires more than 100%.
- Mobile row editing.

# Keyword Intent

Primary keyword: `color contrast checker`
Site ID: `color-contrast-checker`
Category: checker
Locale: en
Market: US
Mode: implement

## User Job

Users want to check whether a foreground and background color pair is readable and meets WCAG contrast thresholds before using it in a website, app, brand palette, button, form field, or design system.

## Opportunity Score

Total: 80/100

- User task clarity: 20/20 - The keyword maps directly to a measurable tool action.
- Competitor weakness: 8/15 - Top competitors are strong, but several stop at ratio/pass-fail and do not give a memorable correction workflow.
- Differentiation potential: 18/20 - A teacher-marked worksheet interface, repair suggestions, and palette-friendly copy output can make the tool distinct.
- SEO feasibility: 17/20 - Bing Webmaster returned live related keyword data and a stable Top 10 ranking set.
- Root-domain availability: 15/15 - Bing Top 5 has 0 strongly keyword-matching root domains.
- Maintenance simplicity: 2/10 - The core WCAG math is simple, but visual QA and accessibility review must be strict because this is an accessibility-adjacent tool.

Decision: build standalone draft site with strong UI and checker differentiation.

Root-domain availability score: 15/15
Root-domain rule decision: pass

## Evidence Used

- Bing Webmaster Keyword Research, exact keyword `color contrast checker`, date range 3M, captured 2026-05-04.
- User-provided visual direction: WordPress Primarium notebook theme, handwriting-inspired, lined paper, blue ink, red teacher marks.

## Decisions Made

- Make the homepage tool-first.
- Keep the site draft and non-indexable until post-UI QA, SEO audit, performance audit, and launch review are complete.
- Do not frame the site as a full ADA compliance checker; focus on WCAG color contrast.
- Use client-only processing and avoid analytics fields that contain raw colors.

## Implementation Implications

- Pure contrast math belongs in `packages/tools/color-contrast-checker`.
- Interactive UI belongs in `apps/site/src/features/color-contrast-checker`.
- Site identity, content, theme, and research belong under `sites/color-contrast-checker`.


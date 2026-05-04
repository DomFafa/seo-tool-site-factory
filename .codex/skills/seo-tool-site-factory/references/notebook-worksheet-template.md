# Notebook Worksheet Template Family

Use this reference when a new SEO utility site should feel like a checked worksheet, study note, or teacher-marked assignment.

This template family comes from the `color-contrast-checker` launch direction. Treat it as a reusable design system direction, not a cloneable page.

## Purpose

The notebook worksheet UI is for tools where users are checking, grading, validating, or learning from a result. It makes the output feel reviewed: blue ink for normal notes, red pen for important corrections, ruled paper for structure, and a check-mark mark for pass states.

## Best Fit

Good fit:

- checker
- validator
- grader
- analyzer
- accessibility tools
- education/study helpers
- copy, design, writing, and QA review tools

Use with caution:

- dense calculators with many numeric sections
- file conversion tools where upload/download is the core surface
- formal legal, medical, finance, or compliance tools
- developer tools that need a terminal/documentation aesthetic

Poor fit:

- playful random generators
- B2B dashboards
- high-fashion or luxury brand pages
- tools where the result should feel neutral instead of graded

## Core Visual Language

Reusable elements:

- Pale paper background, ideally off-white rather than pure white.
- Thin blue ruled horizontal lines.
- A red left margin rule or red annotation edge.
- Blue ink as the primary action/information color.
- Red pen as the correction, warning, or emphasis color.
- Check-mark brand mark such as `☑` when it fits the brand.
- Compact tool-first first viewport.
- Worksheet-style tool shell instead of a generic floating marketing card.
- Result verdicts that read like teacher marks: pass checks, red corrections, and concise notes.
- Lower content framed as study notes, practice pairs, method notes, and FAQ.
- Radius 8px or lower unless the existing design system requires otherwise.

Avoid:

- oversized hero empty space
- generic SaaS cards
- decorative gradient/orb backgrounds
- text-heavy onboarding before the tool
- hidden samples or actions on mobile
- repeating the exact `color-contrast-checker` layout without keyword-specific changes

## Recommended Config Shape

```yaml
# sites/<site-id>/theme.config.yaml
schemaVersion: 1
personality: notebook worksheet checker
density: comfortable
surface: editorial
colors:
  primary: "#2554d9"
  background: "#fbfbf5"
  surface: "#fffefa"
  accent: "#e23b3b"
radius: 8px
layout: notebook-tool-first
adLayout:
  avoidPrimaryActions: true
  disableOnToolResultPanel: true
```

```yaml
# sites/<site-id>/layout.config.yaml
schemaVersion: 1
recipe: notebook-worksheet
chrome:
  navVariant: notebook
  footerVariant: simple
home:
  blocks:
    - type: hero
      variant: notebook
    - type: tool
      variant: worksheet
    - type: examples
      variant: notebook-lines
    - type: howItWorks
      variant: notebook-steps
    - type: privacyNote
      variant: red-note
    - type: guideLinks
      variant: notebook-guides
    - type: content
      variant: notebook-article
    - type: faq
      variant: notebook-faq
```

If a site needs a more specific recipe name, use the pattern:

```text
notebook-<tool-domain>-checker
notebook-<tool-domain>-validator
notebook-<tool-domain>-grader
```

## Tool Surface Pattern

Recommended desktop structure:

```text
worksheet shell
- grade mark or stamp
- compact heading
- inputs/control column
- live sample or immediate preview
- result/verdict column
- larger preview or report area
- examples/presets
- local privacy note
```

Recommended mobile structure:

```text
worksheet shell
- heading
- input 1
- input 2
- live sample directly below inputs
- primary actions
- ratio/result summary
- verdicts
- repair suggestion
- examples
- privacy note
```

Mobile requirements:

- No desktop left-margin padding on small screens if it creates blank first-viewport space.
- Do not hide the live sample behind the result column; users must see color/sample changes while editing inputs.
- Keep action buttons visible without requiring a long scroll after the second input.
- Stack actions in one column when labels would squeeze.
- Use stable dimensions for color swatches, icon buttons, verdict rows, and copy buttons so state changes do not shift layout.
- At 390px width, verify the first viewport shows meaningful hero copy plus the start of the functional worksheet, not empty paper.
- At 390px width, verify no horizontal overflow and no text clipping in buttons, verdicts, badges, and labels.

## Content Framing

Good section labels:

- Practice pairs
- Method
- Study notes
- Common mistakes
- Marked examples
- Correction notes
- Review checklist

Bad section labels:

- Feature overview
- Why choose us
- Unlock productivity
- Seamless workflow
- Beautiful interface

## Anti-Clone Rule

Do not reuse the exact `color-contrast-checker` composition unchanged.

Each site using this family must change at least 2-3 of these dimensions:

```text
1. Grade mark or stamp metaphor
2. Tool control layout
3. Result verdict language
4. Preset/example interaction
5. Red correction placement
6. Paper line density
7. Guide/content section order
8. Mobile result grouping
9. Color token balance
10. Brand mark and navigation labels
```

## Required Design Record

When using this family, add this to `design-direction.md`:

```text
Template family: Notebook Worksheet
Sub-template:
Borrowed elements:
-
Differentiated elements:
-
Mobile safeguards:
-
Similarity risk: low / medium / high
Anti-clone decision:
```

## QA Checklist

- Desktop screenshot shows the tool within the first useful viewport.
- 390px mobile screenshot shows no empty top gap and no horizontal overflow.
- Changing the first input visibly changes the nearby live preview, not only a ratio value.
- Primary actions remain visible near the inputs on mobile.
- Result updates are readable and announced or understandable.
- Red is used for emphasis/correction, not as the only way to communicate failure.
- Header/footer trust links are real on indexable domains.
- Ads, if any, are not placed near Convert, Check, Copy, Start, Upload, Retry, or equivalent primary actions.

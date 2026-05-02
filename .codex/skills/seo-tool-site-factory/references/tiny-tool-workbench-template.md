# Tiny Tool Workbench Template Family

Use this reference when a new SEO utility site should feel like a clean, fast, consumer-friendly single-purpose tool inspired by the final `random-date-generator` direction.

This is the second reusable UI template family in the factory. Treat it as a design system direction, not a cloneable page.

## Purpose

The `random-date-generator` UI established a lightweight workbench pattern for generator-style tools that need a bright first viewport, compact copy, a central tool surface, and friendly trust/navigation without heavy marketing sections.

## Best Fit

Good fit:

- generator
- picker
- randomizer
- formatter
- simple maker
- lightweight converter
- date, text, data, naming, planning, and sample-data tools

Use with caution:

- calculators that need many explanatory formulas
- tools with dense tables or multi-step workflows
- serious legal, medical, finance, or compliance tools
- highly technical developer tools that need a documentation-heavy layout

Poor fit:

- B2B dashboards
- long-form editorial sites
- file-upload tools where the upload zone is the hero
- tools where trust needs a formal institutional tone

## Core Visual Language

Reusable elements:

- Compact white header with clear brand mark.
- Light blue and pink accent palette.
- Soft pastel page background.
- Tool-first first viewport.
- Search/TinyWow-inspired centered hero copy.
- Optional rotating keyword slot inside the H1 when it does not create multiple H1s.
- Central transparent tool shell that lets the tool UI carry the main surface.
- Rounded but restrained cards, usually 12-14px.
- Header links for FAQ and Contact on real-domain sites.
- Footer trust links for About, Contact, Privacy, FAQ, and Calculation method.
- Lower SEO content below the working tool.

## Recommended Config Shape

```yaml
# sites/<site-id>/layout.config.yaml
schemaVersion: 1
recipe: tiny-tool-workbench
chrome:
  navVariant: compact
  footerVariant: simple
home:
  blocks:
    - type: hero
      variant: search-first-tool
    - type: tool
      variant: central-panel
    - type: examples
      variant: utility-grid
    - type: howItWorks
      variant: clean-steps
    - type: privacyNote
      variant: inline
    - type: content
      variant: lower-guide
    - type: faq
      variant: compact
```

```yaml
# sites/<site-id>/theme.config.yaml
schemaVersion: 1
personality: clean-utility
density: comfortable
surface: panels
colors:
  primary: "#ff9bc2"
  background: "#fff7f2"
  surface: "#ffffff"
  accent: "#b8dcff"
radius: 12px
layout: tool-first
```

## Rotating H1 Guidance

Use the rotating word slot only when it improves query coverage and still reads as one clear H1:

```text
Random [date / 30 days / birthdays / workdays / test data] Generator
```

Rules:

- Render only one `<h1>`.
- Keep the non-rotating words close together; avoid large fixed whitespace.
- Use 3-5 concise rotating phrases.
- Prefer short phrases such as `30 days` over `next 30 days` when it prevents awkward spacing.
- Respect `prefers-reduced-motion`.
- Do not rotate unrelated keywords that change the page intent.

## Anti-Clone Rule

Do not reuse the exact `random-date-generator` composition unchanged.

Each site using this family must change at least 2-3 of these dimensions:

```text
1. Tool control layout
2. Result display pattern
3. Rotating H1 terms or no rotator
4. Preset/chip behavior
5. Primary/accent color balance
6. Example section framing
7. Lower content order
8. Mobile control grouping
9. Trust-page copy and support links
10. Tool-specific icon/metaphor
```

## Suggested Sub-Templates

```text
tiny-randomizer:
  Compact hero, rotating noun slot, preset chips, central generator panel.

tiny-formatter:
  Input/output panels with copy actions and format tabs.

tiny-picker:
  One primary input group, clear result card, repeat/shuffle controls.

tiny-data-maker:
  Settings grid, generated rows/list output, export/copy emphasis.

tiny-date-time:
  Date/time controls, calendar-friendly presets, concise output chips.

tiny-copy-tool:
  Textarea or field-first workflow with copy states and privacy note.
```

## Required Design Record

When using this family, add this to `design-direction.md`:

```text
Template family: Tiny Tool Workbench
Sub-template:
Borrowed elements:
-
Differentiated elements:
-
Similarity risk: low / medium / high
Anti-clone decision:
```

## Implementation Guidance

- Keep the functional tool above SEO copy.
- Use hover/focus states on buttons and navigation.
- Do not introduce orange/brown palettes unless the keyword requires it.
- Do not create decorative orb backgrounds beyond the approved soft pastel background treatment.
- Keep typography compact; hero text should not overwhelm the tool.
- Keep trust/support navigation real once a domain is moving toward indexing.
- Make sure button groups, presets, result chips, and copy actions do not shift layout on hover.

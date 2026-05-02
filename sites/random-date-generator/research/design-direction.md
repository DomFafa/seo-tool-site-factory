# Design Direction: random date generator

## Source

- User reference: `https://tinywow.com/`
- Reference role: UI inspiration only. Do not copy brand assets, content, or exact layout.
- Template family status: origin site for `Tiny Tool Workbench`.
- Template reference: `.codex/skills/seo-tool-site-factory/references/tiny-tool-workbench-template.md`

## Direction

Clean tool workbench: a bright, almost SaaS-like utility page with a compact top chrome, light blue and pink accents, a central tool-first panel, soft pastel background, clear form controls, and immediate output.

TinyWow-inspired elements to borrow:

- Tool-first page hierarchy.
- Simple header and understated navigation feel.
- Large central work panel.
- Utility cards below the tool.
- Calm trust/privacy messaging.

Differentiated elements:

- Calendar-specific accent chips and weekday toggles.
- Date output grid and copy-ready list.
- Light blue/pink palette instead of TinyWow's exact palette.
- No file-upload metaphor.
- No nested card-heavy marketing layout.

## Visual System

- Background: `#fff7f2`
- Surface: white panels
- Primary: `#ff9bc2`
- Accent: `#b8dcff`
- Text: near-black charcoal
- Radius: 12px or less for controls; 14px for repeated content cards.
- Typography: system UI for speed and consistency with the existing factory.

## Layout

Hero is compact and centered. Tool panel immediately follows and owns the first viewport. Supporting content is below as simple cards/sections.

## Anti-Clone Notes

This should read as a random date utility in the factory, not a TinyWow clone. Keep brand name, copy, colors, iconography, and layout details original.

## Template Family And Anti-Clone Plan

- Template family: Tiny Tool Workbench
- Sub-template: tiny-date-time
- Borrowed elements:
  - Compact white header.
  - Search-first centered hero.
  - Rotating H1 keyword slot.
  - Central tool-first panel.
  - Lower utility examples, steps, privacy note, guide, and FAQ.
- Differentiated elements:
  - Date-specific presets, weekday controls, and result chips.
  - `date / 30 days / birthdays / workdays / test data` rotator terms.
  - Calendar/date copy and support-page content.
  - Random-date-specific tool logic and copy state.
- Similarity risk: medium if reused unchanged.
- Anti-clone decision: future sites may reuse `tiny-tool-workbench`, but must change at least 2-3 dimensions from the template reference such as rotator behavior, result display, tool control layout, accent balance, section order, or mobile grouping.

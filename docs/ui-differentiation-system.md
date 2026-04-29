# UI Differentiation System

This repository now supports per-site UI differentiation through a controlled page module system.

## Goals

- Avoid every keyword site looking like the same template with a different H1.
- Keep pages configurable without allowing arbitrary unsafe layouts.
- Let each site choose a visual recipe, navigation variant, module order, and block variants.
- Preserve SEO requirements: one H1, visible content, early tool access, no ads near primary actions.

## Files

Each site can define:

```txt
sites/<site-id>/layout.config.yaml
```

This complements the existing configs:

```txt
theme.config.yaml        visual system: colors, density, surface, personality
layout.config.yaml       page recipe: module order and module variants
tool.config.yaml         tool behavior
content/                 public copy
integrations.config.yaml ads, analytics, verification, indexing integrations
```

## Layout config shape

```yaml
schemaVersion: 1
recipe: performance-dashboard
chrome:
  navVariant: compact
  footerVariant: simple
home:
  blocks:
    - type: hero
      variant: metric
      props:
        eyebrow: Typing metrics
        badges: [WPM, Accuracy, Errors]
    - type: tool
      variant: dashboard
    - type: howItWorks
      variant: numbered-cards
    - type: content
      variant: card
    - type: faq
      variant: accordion
```

## Supported block types

Current MVP block types:

```txt
hero
tool
content
howItWorks
examples
guideLinks
faq
privacyNote
adSlot
```

## Recommended recipes by category

```txt
converter       file-drop-studio
generator       elegant-generator or glitch-playground
tester          performance-dashboard or formal-assessment
solver          word-solver
checker         writing-assistant
reference       worksheet-learning
```

## UI audit

Run:

```bash
pnpm ui-audit --all
# or
pnpm site ui-audit --all
```

The audit prints each site's UI fingerprint:

```txt
recipe
nav variant
theme name
personality
density/surface
block sequence
```

It also warns when two sites share too much of the same visual fingerprint.

## Rules

- Keep the tool block near the top for tool-first pages.
- Use `privacyNote` for file, text, and editor-style tools.
- Do not put `adSlot` directly around copy/download/start/convert actions.
- Do not hide main content only inside collapsed widgets.
- For related keyword sites, use different recipes and tool shell variants.

# First Build UI Defaults

## Purpose

When generating a new keyword-driven tool site, the first implementation should already include production-quality defaults for visual polish, internal navigation, trust pages, and theme-specific decorative elements.

The user should not need to repeatedly ask for basic corrections such as:

- Apple-like/system font polish.
- H1 line-breaking control.
- Navigation links pointing to real pages.
- Missing About, Contact, Privacy, and FAQ pages.
- Over-bold hero subtitle text.
- Decorative elements being generic or unrelated to the tool.

## Required First-Pass UI Quality Rules

### Typography

Use a refined system font stack by default for clean utility sites:

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
```

For desktop hero headings:

- Keep the primary H1 on one line when the phrase is short enough.
- Use responsive fallback so mobile can wrap naturally.
- Avoid excessive font weight in subtitles.
- Do not make supporting copy visually louder than the H1.

Recommended hero hierarchy:

- H1: strong, clear, single-line on desktop when possible.
- Subtitle: smaller, medium weight, readable line length.
- Eyebrows should be omitted unless they add real context.

### Highlighting Keyword Terms

When the primary keyword contains a semantically important word, optionally highlight that word using the theme primary color.

Example:

- `Random Letter Generator`
- Highlight: `Letter`

Do not highlight arbitrarily. Highlight only when it reinforces the tool subject.

### Header Navigation

New sites should not ship with broken or placeholder navigation.

Default header links:

- `Home` -> `/`
- `Contact` -> `/contact/`
- `FAQ` -> `/faq/`

Avoid linking `Home`, brand marks, or default language switchers to the absolute canonical URL in the visual chrome. Use relative paths for internal navigation:

- Home: `/`
- Default locale language switcher: `/`

Canonical URLs in SEO metadata should remain absolute.

### Footer Navigation

Default footer links:

- `About` -> `/about/`
- `Contact` -> `/contact/`
- `Privacy` -> `/privacy/`
- `FAQ` -> `/faq/`

These links must point to generated pages, not future placeholders.

### Required Support Pages

When creating a new site pack, create draft non-indexable pages:

```text
content/en/pages/about.mdx
content/en/pages/contact.mdx
content/en/pages/privacy.mdx
content/en/pages/faq.mdx
```

All support pages should:

- have valid frontmatter
- use `index: false`
- use `contentStatus: draft`
- describe the current tool accurately
- avoid claiming support inboxes, production review, or legal policies that do not exist yet
- after the user confirms a production domain, replace placeholder contact wording with `contact@<canonical-domain>` on the Contact page and, when relevant, Privacy page contact wording

### Mobile Header

The mobile header must remain a single row. Do not stack the brand and navigation vertically on small screens.

If header links do not fit comfortably, use a hamburger menu or equivalent compact disclosure:

- brand mark and brand name stay on the left
- menu button stays on the right
- tapping opens Home, Contact, FAQ, language switcher, and any other configured header links
- menu links must point to the same real pages as desktop navigation
- text must not overflow outside the header

## UI Template 3: Soft Utility Inspired By Sejda

Use this as a reusable design direction when the user asks for a Sejda-like, calm, friendly utility site.

### Visual Character

- Clean white navigation.
- Warm off-white background.
- Green primary color.
- Coffee/brown text accents.
- Compact, practical tool-first layout.
- Light rounded panels, usually 8px radius.
- Calm decorative background behind the first tool area.
- First viewport should immediately communicate the tool and show the interaction surface.

### Palette Starting Point

```css
--primary: #25c28a;
--primary-dark: #14986b;
--text: #302a26;
--muted: #7b6a5e;
--background: #fbf7f1;
--surface: #ffffff;
--warm-band: #efe2d3;
--warm-band-light: #f8f1e9;
```

### Layout

Recommended block order:

```yaml
home:
  blocks:
    - hero
    - tool
    - examples
    - howItWorks
    - privacyNote
    - content
    - faq
```

Hero requirements:

- centered H1
- concise subtitle
- no unnecessary eyebrow
- primary keyword visible in first viewport
- tool begins close enough to the hero that the page feels task-first, not marketing-first

Tool panel:

- should be visible in the first viewport on desktop
- should not sit inside nested cards
- should use clear controls: segmented presets, numeric inputs, selects, toggles, and command buttons

## Theme-Derived Decorative Elements

Do not copy decorative elements literally across sites.

Instead, derive decorative elements from:

1. The tool keyword.
2. The user's reference site.
3. The task domain.
4. The desired emotional tone.

### Rule

Decorations must feel like they belong to the tool.

Examples:

- `random letter generator` -> letter cards, alphabet tiles, playful letter slips
- `random date generator` -> calendar sheets, date stickers, timeline ticks
- `image converter` -> file cards, format tags, pixel blocks
- `word solver` -> word tiles, dictionary tabs, letter grids
- `color generator` -> swatches, palette chips, paint labels
- `qr code generator` -> quiet square modules, scan frames, code tiles

### Placement

Decorative elements should:

- support the content hierarchy
- not obscure text or controls
- not appear near primary actions in a distracting way
- be hidden or reduced on mobile if they crowd content
- alternate placement when repeated across sections

For content-section decorations:

- derive the displayed character or icon from the section title or tool theme
- alternate left/right placement across sections
- keep decoration outside the readable content card where possible

Example logic:

- section 1 title starts with `L` -> show `L` decoration on left
- section 2 title starts with `H` -> show `H` decoration on right
- section 3 title starts with `G` -> show `G` decoration on left
- FAQ -> show `F` decoration on right

Do not hard-code random unrelated decorative letters.

## First-Pass Validation Checklist

Before considering the first implementation complete, verify:

- Header Home uses `/`, not canonical absolute URL.
- Brand mark uses `/`, not canonical absolute URL.
- Language switcher default locale uses `/`, not canonical absolute URL.
- Header Contact and FAQ routes exist.
- Footer About, Contact, Privacy, and FAQ routes exist.
- `pnpm site check <site-id>` passes.
- `pnpm typecheck` passes when shared components were changed.
- `pnpm site build <site-id>` passes.
- Generated pages include `noindex,nofollow` while draft.
- H1 does not awkwardly wrap on desktop.
- Hero subtitle is not over-bold or oversized.
- Tool controls have hover/focus states.
- Decorative elements match the tool theme and reference style.
- Decorative elements do not repeat as generic copied motifs.
- Mobile layout does not overflow.

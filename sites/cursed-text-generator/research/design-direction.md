# Design Direction: Cursed Text Generator

## 1. Design Source

- Site ID: cursed-text-generator
- Primary keyword: cursed text generator
- Category: generator
- Locale: en
- Market: US
- Design source: site-specific direction based on Bing Webmaster top 5 competitor research
- Design status: draft, implementation-tested, not visually final
- Design-new decision: yes
- Design-new reason: the existing site pack was draft/scaffold-like and did not have an approved post-implementation design review before this pass
- Consultation used: deferred
- Shotgun used: deferred
- Reused cluster system: no; only broad text-generator conventions reused
- Reuse justification: cursed text needs a darker and more controlled workbench than existing cursive/text generator sites
- Related cluster: text generators / glitch and Unicode text tools
- Reference research files:
  - `sites/cursed-text-generator/research/competitor-research.md`
  - `sites/cursed-text-generator/research/product-requirements.md`
  - `sites/cursed-text-generator/research/seo-spec.md`
  - `sites/cursed-text-generator/research/ux-spec.md`

## 2. Product Context

### Target user

People who want fast copy-paste cursed text for Discord, TikTok, Instagram, Reddit, gaming names, Halloween posts, creepypasta, memes, or ARG clues.

### User job

Paste normal text and instantly create creepy, glitchy, cursed/Zalgo-style Unicode text that can be copied or cleaned back to normal.

### Design problem

The interface must feel cursed and memorable without becoming visually chaotic. Users should trust the controls, understand intensity, and copy output quickly. The design should beat LingoJam's dated simplicity, Glyphy's catalog clutter, and article-heavy competitors while staying faster than a decorative landing page.

## 3. Visual Personality

- Aesthetic direction: controlled horror workbench
- Decoration level: intentional, not expressive chaos
- Tone: eerie, precise, copy-ready, slightly dangerous but still usable
- What users should notice first: the input/output workbench and intensity presets
- What should feel different from competitors: a focused tool surface with controlled distortion, not a long article or a wall of random font styles

## 4. Typography

- Display / hero: a sharp condensed or gothic-adjacent display face if available through the existing theme system; avoid unreadable novelty fonts
- Body: highly readable sans-serif
- UI labels: compact sans-serif with clear weight contrast
- Data / counters: tabular numerals or monospace treatment for character counts and generated output length
- Loading strategy: do not add new font dependencies unless the existing theme pipeline already supports them

The typography should imply horror through contrast and composition, not by making the interface hard to read.

## 5. Color

- Approach: restrained dark palette with controlled danger accents
- Primary: deep blood red, aligned with existing `#7f1d1d`
- Secondary: toxic green or cold cyan only for focus/success accents, used sparingly
- Neutral surfaces: near-black, charcoal, muted red-black panels
- Semantic colors: green for copy success, amber for platform/readability warnings, red for errors
- Dark mode strategy: dark is the default; avoid a bright purple/blue gradient system

## 6. Density, Spacing, And Surfaces

- Density: compact but not cramped
- Spacing base: 8px
- Border radius scale: smaller than current 18px where possible, prefer 6-10px for tool surfaces
- Surface strategy: one primary workbench surface, not stacked decorative cards
- Card usage rules: cards allowed for repeated examples, FAQ items, and contained tool panels only

The page should feel like a deliberate instrument panel, not a generic SaaS card layout.

## 7. Layout Recipe

- Recipe: `glitch-playground`
- Nav variant: `dark-floating`
- Hero variant: `dramatic`, but compact enough to keep tool visible early
- Tool variant: `neon-workbench`
- Block order:
  1. hero
  2. tool
  3. examples
  4. how-it-works
  5. platform-notes
  6. accessibility-note
  7. related-tools
  8. faq
- Above-the-fold composition: hero copy and workbench should appear as one task-first composition; avoid a marketing hero that pushes the input down
- Related content placement: below examples and platform notes

## 8. Tool Workbench Pattern

- Input placement: left on desktop, top on mobile
- Output placement: right on desktop, below input on mobile
- Mode controls: preset segmented control first; advanced top/middle/bottom controls second
- Primary actions: copy output, clear input, reset settings
- Secondary actions: clean cursed text, regenerate/randomize with same settings, skip spaces
- Example entry points: chips directly under or near the input
- Privacy note placement: below input/action row, visible before SEO content

## 9. Mobile Design

- 375-390px layout: single column, input then presets then output
- Touch target rules: 44px minimum for preset, copy, clear, clean, and disclosure actions
- Input/output comparison: stacked with clear labels, no horizontal overflow
- Sticky controls: optional sticky copy action only if it does not cover content
- Long result behavior: output wraps, scrolls vertically if needed, and never expands page width

## 10. Motion

- Motion level: minimal-functional
- Page-load behavior: subtle workbench reveal only, no heavy glitch animation
- Tool interaction behavior: preset changes update immediately; copy success can pulse or flash once
- Reduced motion behavior: disable non-essential transitions

Motion should support task feedback, not simulate a haunted landing page.

## 11. Accessibility

- Focus treatment: high-contrast outline that is visible on dark surfaces
- Label strategy: visible labels for input, output, preset, advanced controls, and cleaner mode
- Screen reader announcements: copy success, warnings, and cleaner result changes should be announced
- Contrast requirements: meet accessible contrast on dark background
- Keyboard path: input, presets, advanced controls, copy, clear, clean mode, examples

Add a visible note that heavy cursed text can be difficult for screen readers. Cleaner mode is part of the accessibility story.

## 12. Anti-Template Constraints

This site must avoid:

- Generic centered hero plus three feature cards.
- Decorative icon circles.
- Purple/blue gradient defaults.
- Same block rhythm as other factory sites.
- Copy that describes design instead of the user's task.
- A broad font catalog that competes with the cursed text workflow.
- Horror decoration that makes controls harder to read.

## 13. Differentiation From Existing Factory Sites

| Existing site | Similarity risk | Required difference |
|---|---|---|
| `cursive-generator` | Both are text generators with copy-ready output | Cursed Text should use a darker workbench, stronger intensity controls, cleaner mode, and platform/readability warnings |
| `cursive-alphabet` | Both can attract text-style search intent | Cursed Text is a live transformation tool, not educational/static content |
| `typing-speed-test` | Existing dashboard-style tool could overlap if too metric-heavy | Keep counts secondary; primary experience is text transformation and copying |

## 14. Approved References

- Mockup / board path: not generated in this documentation pass
- Chosen variant: controlled horror workbench
- Notes from design consultation: use the site-specific direction above; run full `design-consultation` only if changing the whole text-generator cluster design system
- Notes from plan design review: see `design-review.md`

## 15. Design Skill Decisions

### Design consultation

- Used / deferred: Deferred
- Reason: this pass converted competitor research into a direct site-specific direction, but the dedicated GStack design-consultation skill was not run.
- Next action: run design-consultation before treating the visual direction as final or before building a larger glitch/text-generator cluster system.
- Key constraints: fast tool-first UX, dark controlled horror workbench, no broad font catalog, no visual chaos that hurts readability.

### Design shotgun

- Used / deferred: Deferred
- Reason: no multi-variant exploration was requested during this implementation pass.
- Next action: run design-shotgun if visual differentiation from other draft text sites remains weak, or if the user wants to compare variants.
- Variants considered: controlled horror workbench only
- Chosen variant: controlled horror workbench

### Approved direction

- Approved direction: controlled horror workbench
- Why this direction is better for the keyword: it makes the cursed/Zalgo task feel specific while keeping the generator readable, fast, and copy-focused.
- What must not change during frontend implementation: tool-first layout, dark red/near-black surfaces, restrained accent color, readable controls, cleaner mode, and mobile-safe output.

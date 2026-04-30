# Product Requirements: Cursed Text Generator

## 1. Goal

Build a production-ready, SEO-friendly, fast, mobile-first tool website for `cursed text generator`.

The page must help users create copy-ready cursed/Zalgo/glitch text immediately, without login, without intrusive popups, and with the tool visible above the fold.

## 2. Target Keywords

### Primary keyword

- cursed text generator

### Secondary keywords

- cursed text
- glitch text generator
- zalgo text generator
- corrupted text generator
- hacked text generator
- cursed font generator

### Related long-tail keywords

- cursed text generator copy and paste
- cursed text for Discord
- glitch text for TikTok
- creepy text generator
- void text generator
- clean cursed text

## 3. User Job

> Paste normal text and instantly create creepy, glitchy, cursed Unicode text that can be copied into social posts, chat, usernames, or horror-themed content.

## 4. Core User Flow

1. User lands on the page.
2. User sees the input, output, intensity presets, and copy action immediately.
3. User enters or pastes text.
4. Tool generates cursed output live.
5. User optionally adjusts preset or advanced controls.
6. User copies the output or switches to cleanup mode.
7. User can read platform notes, examples, and FAQ below if needed.

## 5. Required Features

### Core

- Live cursed text preview.
- Light, medium, and heavy presets.
- Advanced controls for top, middle, and bottom combining marks.
- Copy output with visible and accessible success state.
- Clear input and reset settings.
- Clean/strip cursed text mode.
- Example chips.
- Character count and generated Unicode character count.
- Local-processing privacy note near the tool.
- Mobile-safe output container that does not cause horizontal scrolling.

### Nice-to-have

- Platform-safe preset or warning for Discord/social use.
- Skip spaces option.
- Randomize/regenerate output with current settings.
- Before/after examples below the tool.

### Do not build

- Login, accounts, or saved cloud history.
- Download/export unless future research shows demand.
- Broad font catalog that dilutes the cursed text job.
- Ads near input, output, copy, clear, or cleanup actions.
- Analytics that include raw user input or generated output.

## 6. Tool Behavior

### Input

- Accept: plain text, Unicode text, emoji, symbols, multiple lines, already-cursed text.
- Reject: nothing for normal text input; handle unsupported cases gracefully.
- Max length: set a practical client-side soft limit and warn before rendering becomes slow.
- Preserve whitespace: yes, preserve spaces and line breaks.
- Support Unicode: yes, but explain that combining behavior varies by script and platform.
- Support emoji: keep emoji intact and avoid stacking marks on emoji where possible.
- Empty state: show a short placeholder and sample chips, output remains empty.

### Output

- Update mode: instant live preview.
- Copy behavior: copy generated text and show success state.
- Download behavior: not required.
- Error behavior: no crash; show friendly warning for extreme length or unsupported browser clipboard.
- Local history: do not add by default.

## 7. Edge Cases

| Case | Expected behavior |
|---|---|
| Empty input | Output is empty; examples remain available |
| Very long input | Warn or cap generated output so typing remains responsive |
| Emoji or Unicode input | Preserve emoji/symbols; do not corrupt UI layout |
| Multiple lines | Preserve line breaks |
| Special symbols | Keep symbols when possible and skip unsafe combining behavior |
| Existing cursed text | Cleanup mode strips combining marks back to readable text |
| Extreme intensity | Output remains contained and page does not shift horizontally |
| Mobile paste | Input/output remain usable on 390px width |

## 8. UI Requirements

### Above the fold

- H1: Cursed Text Generator.
- One-sentence value proposition.
- Primary input.
- Output area.
- Light/medium/heavy preset control.
- Advanced top/middle/bottom controls.
- Copy, clear, reset, and clean mode actions.
- Example chips.
- Character/generated character counts.
- Privacy note.

### Below the fold

- What is cursed text?
- How it works.
- Cursed vs Zalgo vs glitch vs hacked text.
- Platform compatibility and limits.
- Before/after examples.
- Accessibility/readability note.
- Related tools.
- FAQ.

## 9. Accessibility Requirements

- Every input must have a visible label.
- All buttons must be keyboard accessible.
- Focus states must be visible.
- Copy success must be announced visually and accessibly.
- No keyboard trap.
- Touch targets must be comfortable on mobile.
- Color contrast should use accessible defaults.
- Explain that heavy cursed text can be difficult for screen readers and provide cleanup mode.

## 10. Privacy Requirements

- Core operation runs locally in the browser.
- Do not store raw user input on the server.
- Do not add local history by default.
- Add a visible privacy note near the tool.
- Do not include raw user input or generated cursed output in analytics.

## 11. Performance Requirements

- Static/SSR-render SEO-critical content.
- Hydrate only the interactive tool.
- Avoid heavy dependencies.
- Avoid layout shift when output changes.
- Keep reachable client JS small.
- Keep typing responsive for normal social-post length input.
- Guard against pathological output length at high intensity.

## 12. Acceptance Criteria

- User can complete the main task in under 3 interactions.
- Tool is usable on mobile without horizontal scrolling.
- Copy button works and shows success state.
- Cleanup mode strips combining marks.
- Preset changes visibly affect intensity.
- Page has title, meta description, canonical, Open Graph tags.
- Page has valid structured data only where appropriate.
- Page has sitemap.xml and robots.txt via factory generation.
- Edge cases listed above pass.

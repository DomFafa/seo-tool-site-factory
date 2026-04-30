# UX Specification: Cursed Text Generator

## 1. UX Goal

Make the user feel that this tool is faster, clearer, and more controllable than the current Bing top results for `cursed text generator`.

The page should feel like a focused cursed-text workbench, not a generic font catalog or article page.

## 2. Above-the-Fold Layout

Required elements:

- H1: Cursed Text Generator
- Short value proposition
- Primary text input
- Live cursed output panel
- Light / medium / heavy preset control
- Advanced top / middle / bottom controls, collapsed or secondary on mobile
- Copy, clear, reset, and clean mode actions
- Example starter chips
- Character count and generated-character count
- Local-processing privacy note

## 3. Primary Task Path

Ideal task path:

1. Land on page.
2. Paste or enter text.
3. See cursed text instantly.
4. Copy result.

Target: complete the core task in under 3 interactions.

## 4. States

### Empty state

- Input placeholder: `Type something to curse...`
- Output placeholder: `Your cursed text will appear here.`
- Show 4-5 example chips.
- Preset defaults to `Medium`.
- Copy button disabled or secondary until output exists.

### Input state

- Output updates live.
- Counts update immediately.
- Preset selection remains visible.
- Advanced controls can be adjusted without losing input.

### Result state

- Output panel contains generated text in a scroll-safe/wrap-safe container.
- Copy button is primary.
- Show generated character count because combining marks can greatly expand length.
- If output is heavy, show a short readability/platform warning.

### Error state

- Clipboard failure: show `Copy failed. Select the text and copy manually.`
- Extremely long input: show `This is a lot of text. Reduce length or intensity for smoother copying.`
- Unsupported browser features must not block generation.

### Long input / loading state

- Avoid blocking typing.
- Use soft limits or debounced generation if needed.
- Preserve input and settings.
- Never shift layout when warning appears.

## 5. Mobile UX

- No horizontal scrolling, even with heavy cursed text.
- Input and output stack vertically.
- Presets remain above advanced controls.
- Copy and clear actions remain visible after output.
- Advanced controls can collapse under a `Fine tune` disclosure.
- Touch targets should be at least 44px.
- SEO content comes after the tool and examples.

## 6. Accessibility

- Visible labels for input, output, preset controls, and advanced controls.
- Accessible names for icon buttons.
- Keyboard-operable presets and sliders/steppers.
- Visible focus states.
- Copy success announced visually and accessibly.
- No keyboard traps in disclosures.
- Add note that heavy cursed text can be difficult for screen readers.
- Provide clean mode as an accessibility escape hatch.

## 7. Ad Placement Rules

- No ads near primary actions.
- No ads inside input, output, presets, or cleaner mode.
- No ads that shift the tool after interaction.
- No popup before task completion.

## 8. UI Differentiation

Existing similar sites in this factory:

- `cursive-generator`: text generator family, likely lighter/editorial.
- `cursive-alphabet`: educational text content, not a live glitch workbench.
- `typing-speed-test`: dashboard/performance UI.

Differentiation choices for this site:

- Recipe: `glitch-playground`
- Nav variant: `dark-floating`
- Hero variant: `dramatic`, but task-first and not oversized
- Tool variant: `neon-workbench`
- Visual personality: controlled horror terminal, precise rather than messy
- Block order: hero, tool, examples, how-it-works, platform-notes, accessibility-note, related-tools, faq
- Density/surface: dark, compact, high-contrast tool surface with constrained output

## 9. Microcopy

### Placeholder text

- Input: `Type something to curse...`
- Output: `Your cursed text will appear here.`
- Cleaner input: `Paste cursed or Zalgo text to clean it...`

### Example chips

- `haunted username`
- `do not open`
- `glitch in the signal`
- `happy halloween`
- `the server is awake`

### Copy success message

`Copied cursed text.`

### Clear/reset confirmation if needed

No confirmation for clear. Keep it reversible only by retyping or using example chips.

## 10. Quality Checklist

- Tool visible early.
- Main task is obvious.
- Presets are understandable before advanced controls.
- Examples are useful.
- Copy action is reliable.
- Cleanup mode is discoverable.
- Mobile layout is usable.
- Privacy note is close to the tool.
- Heavy output cannot break layout.
- Page does not feel like a thin template.

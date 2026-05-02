# UX Spec: random date generator

## First Viewport

TinyWow reference direction: clean utility page with a compact header, direct task panel, and minimal distraction. The first viewport should show:

- H1 and one-line promise.
- Central tool panel.
- Date range controls.
- Count and format controls.
- Generate button.
- Output preview.
- Support pages exist as real routes for trust/navigation, but the tool UI itself stays unchanged.

## Task Path

The tool starts with usable defaults so the user can click Generate dates immediately. Presets sit near the top as small utility chips, not a marketing section.

## States

- Empty/default: next 30 days, 8 ISO dates.
- Result: list of date chips plus copy text area/list.
- Error: inline message near the controls.
- Copied: button text changes briefly.
- Unique overflow: explain eligible day count and how to fix it.

## Mobile

Controls stack into a single column. Date output remains readable and copy button stays below output. No horizontal scrolling.

## Accessibility

- Labels for every input.
- `aria-live` for result and errors.
- Buttons have visible focus states.
- Date chips are text, not image-only.

## Ads

No ads near Generate, Copy, Reset, presets, or output panel.

## Differentiation

Compared with broad calculator/randomizer pages, this site should feel like a dedicated date utility:

- Faster first action.
- More copy/export polish.
- Better weekday filter visibility.
- Cleaner, TinyWow-inspired central panel.
- Real About/Contact/Privacy/FAQ/Calculation method pages support trust without altering the main tool layout.

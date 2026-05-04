# Acceptance Tests

## Tool Logic

- `#000000` on `#ffffff` returns contrast ratio 21.
- `#ffffff` on `#ffffff` returns contrast ratio 1 and fails all text thresholds.
- `#3366ff` parses as HEX.
- `#36f` normalizes to `#3366ff`.
- `rgb(255, 255, 255)` parses as white.
- Invalid colors return field-level errors.
- AA normal, AAA normal, AA large, AAA large, and UI component verdicts are correct.
- Suggested repair returns a passing foreground color when possible.

## Site

- `pnpm site research-audit color-contrast-checker` passes.
- `pnpm site check color-contrast-checker` passes.
- `pnpm site build color-contrast-checker` passes.
- Site remains draft and non-indexable.
- Primary tool renders through the generated selected tool registry.

## UX

- Foreground/background inputs, swap, copy, and examples are usable from the first viewport.
- Mobile layout does not overflow at 390px.
- Result labels do not rely on color alone.
- Ads are disabled and no ad appears near primary actions.

## Privacy

- Analytics safe fields exclude raw foreground/background colors.
- Copy report is generated locally.


# UX Spec

## First Viewport

The first viewport should feel like a working worksheet, not a marketing landing page. The user sees the title, a short subtitle, and the contrast checker immediately. The tool is the main event.

## Task Path

- Foreground and background controls are visible without searching.
- Example chips set realistic color pairs in one click.
- Ratio and WCAG verdicts update live.
- The preview displays readable sample UI text using the selected colors.
- Copy and swap actions stay near the result but no ads appear nearby.

## Mobile

Controls stack into one column. Color swatches keep stable dimensions. Long labels wrap without overflowing. The worksheet paper background must not reduce readability.

## Empty, Result, And Error States

- Empty/default state uses blue ink on notebook paper.
- Passing state shows check marks and calm blue annotations.
- Failing state uses red teacher markup and a concrete suggested fix.
- Invalid state explains which field needs repair.

## Accessibility

- Form controls need visible labels.
- Results use `aria-live`.
- Focus states must be visible.
- The UI itself must pass contrast checks even when decorative paper lines are visible.
- Do not rely on color alone; use labels such as Pass, Fail, AA, AAA.

## Ad Restrictions

Ads remain disabled. If added later, no ad slot can appear near Check, Copy, Swap, Reset, or result panels.


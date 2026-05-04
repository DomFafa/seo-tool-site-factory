# Product Requirements

## Core Job

Check whether two colors have enough contrast for text and UI, then help the user understand what must change if the pair fails.

## Core Flow

1. User enters foreground and background colors or chooses an example.
2. Tool validates the colors locally.
3. Tool calculates relative luminance and contrast ratio.
4. Tool shows WCAG verdicts for normal text, large text, and UI components.
5. Tool previews the pair and marks pass/fail with worksheet-style blue and red annotations.
6. User copies a short report or applies a suggested adjusted color.

## Features

- Parse HEX colors, including 3-digit and 6-digit forms.
- Accept pasted `rgb()` color strings as a secondary convenience.
- Color picker for foreground and background.
- Swap foreground/background.
- Live preview.
- WCAG 2.x contrast ratio calculation.
- Verdicts for:
  - AA normal text, 4.5:1
  - AAA normal text, 7:1
  - AA large text, 3:1
  - AAA large text, 4.5:1
  - UI components and graphical objects, 3:1
- Suggested nearby foreground color if the pair fails.
- Copyable report that does not include analytics side effects.
- Example chips for common UI scenarios.

## Non-goals

- Full ADA legal compliance.
- Full website accessibility audit.
- Automated screenshot scanning.
- Color blindness simulation.
- Server-side storage or user accounts.

## Input And Output Behavior

- Valid input returns normalized HEX, RGB values, luminance, ratio, verdicts, and suggestions.
- Blank or invalid input returns clear error messages.
- Alpha channels are not supported in V1. Explain that users should flatten alpha against the background first.
- The copy report includes only the currently visible color pair and result.

## States

- Empty: show the default notebook blue on paper sample.
- Valid passing: show blue check marks and pass labels.
- Valid failing: show red markup, failed labels, and a suggested fix.
- Invalid: show field-level errors and do not show a misleading pass/fail result.
- Copied: temporary confirmation.

## Edge Cases

- Same foreground/background colors should produce a 1:1 fail.
- Black on white should produce 21:1.
- White on white should fail.
- Short HEX such as `#05f` should normalize.
- Uppercase and lowercase HEX should both work.
- `rgb(255, 255, 255)` should parse.
- Out-of-range RGB values should be invalid.

## Privacy

All color parsing and contrast calculations happen in the browser. Analytics safe fields may include locale, action, status, and which WCAG level passed. Raw foreground/background colors must not be sent in analytics events.

## Performance

No network calls are required for the tool. The interaction should update instantly and work after hydration on mobile and desktop.


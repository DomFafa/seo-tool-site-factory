# SEO Spec

## Metadata

Title: `Color Contrast Checker - WCAG Ratio, AA/AAA, and Fix Suggestions`

Description: `Check foreground and background colors for WCAG contrast, preview the pair, see AA/AAA pass marks, and copy a quick accessibility note.`

H1: `Color Contrast Checker`

Hero subtitle: `Check a color pair like a marked worksheet: ratio, WCAG AA/AAA grades, preview text, and red-pen fixes when the contrast fails.`

## Static Content Structure

- H2: Check color contrast before it ships
- H2: WCAG contrast thresholds
- H2: Color contrast examples
- H2: How to fix a failing color pair
- H2: FAQ

## FAQ Targets

- What contrast ratio do I need for WCAG AA?
- What is the difference between normal and large text?
- Does this prove ADA compliance?
- Can I use this for buttons and icons?
- Are my colors uploaded or stored?
- Why does a color that looks fine still fail?

## Guide Pages

- `/guide/wcag-contrast-ratio/`
  - Explain ratio math and thresholds.
- `/guide/accessible-color-palette/`
  - Explain practical palette repair workflows.

## Support Pages

- `/about/`
- `/contact/`
- `/privacy/`
- `/faq/`

## Structured Data

Use `WebSite`, `WebPage`, and `SoftwareApplication` on the homepage. Avoid unsupported claims, reviews, ratings, or legal compliance promises.

## Indexing

Keep `index: false`, `allowIndex: false`, and lifecycle `draft` until launch review, content review, design review, UI similarity review, performance audit, and SEO audit complete.

## Avoidable Before-Build Requirements

- Do not hard-code canonical URLs in Astro pages.
- Do not include raw colors in analytics.
- Make the primary tool and static explanatory content visible in generated HTML.
- Keep ads disabled and away from Check, Copy, Swap, Reset, and result actions if ads are later enabled.


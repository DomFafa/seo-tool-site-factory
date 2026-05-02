# Acceptance Tests: random date generator

## Functional

- Generates the requested number of dates inside the inclusive range.
- Supports unique and repeat-allowed output.
- Blocks impossible unique counts.
- Filters weekdays correctly.
- Handles leap day ranges.
- Formats ISO, US, long, and compact dates.
- Copy summary includes generated dates but analytics does not.

## UX

- User can generate default dates with one click.
- Presets update range/count/filter clearly.
- Error messages are inline and actionable.
- Copy state is visible.

## SEO

- H1 and metadata match the primary keyword.
- Supporting content is statically rendered.
- FAQ is keyword-specific.
- Draft site remains noindex.
- Header exposes FAQ and Contact links.
- Footer exposes About, Contact, Privacy, FAQ, and Calculation method links.
- Support pages return 200 and remain draft/noindex.
- Google SEO review checklist items are recorded before any future indexing approval.

## Accessibility

- Inputs have labels.
- Results and errors use live regions.
- Focus states are visible.
- Buttons are reachable by keyboard.

## Performance

- No external random API.
- No heavy dependencies.
- 500-date generation remains responsive.

## Validation Commands

- `pnpm exec tsx packages/tools/random-date-generator/src/index.test.ts`
- `pnpm site research-audit random-date-generator`
- `pnpm site check random-date-generator`
- `pnpm site build random-date-generator`
- `pnpm seo audit random-date-generator`
- `pnpm seo lint-content random-date-generator`
- `pnpm perf audit random-date-generator`
- `pnpm site ui-audit random-date-generator`
- `pnpm site launch-review random-date-generator`
- `pnpm site trace-audit random-date-generator`

# Product Requirements: random date generator

## User Job

Generate random dates quickly for testing, planning, examples, birthdays, classroom activities, and spreadsheet data.

## Core Flow

1. User sees the random date tool immediately.
2. User chooses a start date and end date.
3. User sets count.
4. User chooses all days, weekdays, weekends, or custom weekdays.
5. User chooses unique dates or allows repeats.
6. User clicks Generate dates.
7. User reviews date chips/list, sorts or shuffles, and copies output.

## Functional Requirements

- Generate 1 to 500 dates.
- Validate start/end range.
- Support unique date generation and repeat-allowed generation.
- Detect when unique count exceeds eligible dates.
- Filter weekdays by Sunday-Saturday.
- Presets:
  - birthdays: 1980-01-01 to 2005-12-31
  - next 90 days
  - workdays this month
  - test data: last 5 years
- Formats:
  - ISO: `2026-05-03`
  - US: `05/03/2026`
  - long: `May 3, 2026`
  - compact: `May 3`
- Copy newline-separated dates.
- Keep all processing client-side.

## Non-Goals

- No calendar scheduling.
- No external true-random API.
- No login or saved history.
- No timezone conversion tool.

## Edge Cases

- Empty start or end date.
- End date before start date.
- No weekdays selected.
- Unique count larger than eligible date pool.
- Leap days in ranges.
- Large count performance.

## Privacy

The selected range and generated dates stay in the browser. Analytics events may include safe action/status/format fields only, never raw generated dates.


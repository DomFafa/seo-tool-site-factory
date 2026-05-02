# Competitor Research: random date generator

- Site ID: random-date-generator
- Primary keyword: random date generator
- Market: US
- Date range target: 3M
- Mode: implement

## Bing Webmaster Capture Attempt

Status: blocked-with-evidence

Attempted at: 2026-05-03 01:15 Asia/Shanghai

Attempted by: Codex using web-access/CDP preflight and direct URL fallback

Bing siteUrl: `https://backwardstextgenerator.com/`

Exact keyword: `random date generator`

Date range: 3M target

Attempted URL: `https://www.bing.com/webmasters/keywordresearch?siteUrl=https%3A%2F%2Fbackwardstextgenerator.com%2F`

Browser/session: Chrome remote debugging port detected, but local CDP proxy `http://localhost:3456/targets` timed out. Direct fetch returned a JavaScript shell.

Result: blocked. The page response text was: `Bing Webmaster Tools You need to enable JavaScript to run this app.`

Blocker text: Cannot read the logged-in Bing Webmaster keyword table from this environment.

Screenshot or artifact path: command output in session; no screenshot captured because CDP proxy was unavailable.

Raw captured top 10 rows: none.

Implementation gate note: user approved continuing with `random date generator` after the fallback analysis. Launch status remains `DRAFT_ONLY`.

## Fallback Public Bing References

These are public Bing search references, not Bing Webmaster ranking rows.

| Fallback rank | URL | Product shape | Strength | Weakness to exploit |
|---:|---|---|---|---|
| 1 | `https://www.random.org/calendar-dates/` | True-random calendar date generator | Strong trust, established random brand | Utility flow can feel older; not focused on copy/export polish. |
| 2 | `https://www.gigacalculator.com/randomizers/random-date-generator.php` | Calculator/randomizer page | Clear range-based utility | Broad calculator site; supporting UX and copy controls can be improved. |
| 3 | `https://www.randomlists.com/random-date` | Random date list generator | Simple multi-date workflow | Limited explanation and format/export controls. |
| 4 | `https://manycalculators.com/randomizers/random-date-generator` | Random date page | Mentions multiple dates, formats, weekdays | Generic calculator brand; opportunity for cleaner first viewport. |
| 5 | `https://bestofdate.com/random-date-generator.php` | Date-specific utility | Date-focused domain | Older-looking page and weaker task hierarchy. |

## Root-Domain Occupancy

- Strong keyword-matching root domains in Bing Top 5: unknown from official source.
- Matching domains from fallback public results:
  - none obvious in visible fallback Top 5. `bestofdate.com` is date-related but not a strong exact phrase match.
- Occupancy decision: fallback-open
- Recommendation impact: recommended as draft with Bing evidence deferred.

## Must-Win Requirements

- The first viewport must show the complete task path: range, count, weekday filter, generate action, output.
- Copy should be one click and should never include raw analytics payload.
- Output must support practical formats: ISO, US numeric, long date, and CSV lines.
- Users should be able to generate unique dates or allow repeats.
- Add presets for common jobs: birthdays, next 90 days, workdays, and test data.
- Explain pseudo-random browser generation honestly; do not claim atmospheric true randomness.


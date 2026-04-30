# Product Requirements: {tool_name}

## 1. Goal

Build a production-ready, SEO-friendly, fast, mobile-first tool website for `{primary_keyword}`.

The page must help users complete the task immediately, without login, without intrusive popups, and with the tool visible above the fold.

## 2. Target Keywords

### Primary keyword

- {primary_keyword}

### Secondary keywords

-
-
-

### Related long-tail keywords

-
-
-

## 3. User Job

> {user_job}

## 4. Core User Flow

1. User lands on the page.
2. User sees the tool immediately.
3. User enters, uploads, selects, or pastes the input.
4. Tool generates or solves the result.
5. User copies, downloads, shares, or clears the result.
6. User can read examples/FAQ below if needed.

## 5. Required Features

### Core

-
-
-

### Nice-to-have

-
-
-

### Do not build

-
-
-

## 6. Tool Behavior

### Input

- Accept:
- Reject:
- Max length:
- Preserve whitespace:
- Support Unicode:
- Support emoji:
- Empty state:

### Output

- Update mode: instant / on button click / after upload / after solve
- Copy behavior:
- Download behavior:
- Error behavior:
- Local history:

## 7. Edge Cases

| Case | Expected behavior |
|---|---|
| Empty input |  |
| Very long input |  |
| Emoji or Unicode input |  |
| Multiple lines |  |
| Special symbols |  |
| Mobile paste/upload |  |
| Invalid input |  |

## 8. UI Requirements

### Above the fold

- H1
- One-sentence value proposition
- Primary input
- Output/result area
- Main action buttons
- Example chips or starter actions
- Character/word/count/metadata if useful

### Below the fold

- How it works
- Use cases
- Examples
- Related tools
- FAQ
- Privacy note

## 9. Accessibility Requirements

- Every input must have a visible label.
- All buttons must be keyboard accessible.
- Focus states must be visible.
- Copy success must be announced visually and accessibly.
- No keyboard trap.
- Touch targets must be comfortable on mobile.
- Color contrast should use accessible defaults.

## 10. Privacy Requirements

- Core operation should run locally in the browser if possible.
- Do not store raw user input on the server.
- Local history must be optional and clearable.
- Add a visible privacy note near the tool.
- Do not include raw user input in analytics.

## 11. Performance Requirements

- Static/SSR-render SEO-critical content.
- Hydrate only the interactive tool.
- Avoid heavy dependencies.
- Avoid layout shift.
- Keep reachable client JS small.
- Keep the tool responsive during typing or solving.

## 12. Acceptance Criteria

- User can complete the main task in under 3 interactions.
- Tool is usable on mobile without horizontal scrolling.
- Copy button works and shows success state if relevant.
- Page has title, meta description, canonical, Open Graph tags.
- Page has valid structured data only where appropriate.
- Page has sitemap.xml and robots.txt via factory generation.
- Edge cases listed above pass.

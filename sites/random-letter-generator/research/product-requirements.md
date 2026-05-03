# Product Requirements

## Core Job

Generate random letters quickly for games, classrooms, alphabet practice, prompts, team labels, and sample data.

## Core Flow

1. User chooses a preset alphabet: A-Z, vowels, consonants, no vowels, or custom.
2. User sets count, no-repeat mode, case, copy format, and optional group size.
3. User clicks Generate.
4. Tool shows large letter tiles and copy-ready text.
5. User copies output without exposing raw custom input to analytics.

## Features

- A-Z, vowels, consonants, and custom alphabet presets.
- Count from 1 to 500.
- No-repeat mode with validation against available unique letters.
- Uppercase and lowercase output.
- Copy formats: lines, comma-separated, space-separated, and grouped.
- Deterministic seeded generation for testable logic, browser randomness in normal use.
- Clear invalid states for empty custom alphabet or impossible no-repeat requests.

## Non-goals

- Cryptographic randomness.
- Lottery or regulated contest workflows.
- Word, name, sentence, or password generation.
- Server-side storage of user input.

## Privacy

All generation happens client-side. Analytics events may include safe fields such as action, mode, status, and locale, but never raw custom alphabet input or generated output.

## Performance

The tool should hydrate quickly, avoid external APIs, and support mobile first-viewport use.

# Acceptance Tests

## Tool Logic

- Generates the requested count of letters.
- No-repeat mode never returns duplicates.
- No-repeat mode returns an error when count exceeds unique alphabet size.
- Vowel preset only returns A, E, I, O, U.
- Consonant preset excludes vowels.
- Custom input removes duplicates and accepts comma, space, or continuous-letter input.
- Copy formats produce lines, commas, spaces, and grouped rows.

## Site

- `pnpm site check random-letter-generator` passes.
- `pnpm site build random-letter-generator` passes.
- Site remains draft and non-indexable.
- Primary tool renders through generated selected tool registry.

## UX

- Generate and Copy controls are visible and not adjacent to ads.
- Mobile layout does not overflow.
- The background wave is visible but does not cover controls.

# Product Requirements: Reverse Text Generator

## Goal

Build a fast, mobile-first reverse text generator that lets users paste text, choose a mode, and copy the output instantly.

## User Job

> Paste normal text and instantly create reversed, mirrored, flipped, or backwards text that can be copied.

## Required Features

### Core

- Reverse characters.
- Reverse word order.
- Reverse each word.
- Mirror text with Unicode mapping where available.
- Upside-down text with Unicode mapping where available.
- Live preview.
- Copy output.
- Clear input.
- Example chips.
- Character and word count.
- Preserve line breaks.

### Nice-to-have

- Download `.txt` output.
- Optional local recent history with clear button.
- Compatibility notes for common social platforms.

### Do not build

- No login.
- No server-side storage of text.
- No social media automation.

## Edge Cases

| Case | Expected behavior |
|---|---|
| Empty input | Output remains empty and helper text is shown. |
| Multi-line input | Preserve line breaks. |
| Emoji | Do not break the page; reverse by grapheme where feasible. |
| Unicode combining marks | Avoid obvious corruption where feasible; document limitations. |
| RTL text | Process text but explain limitations. |
| Very long input | Keep UI responsive. |

# Design Direction

Reference: WordPress Primarium theme and user screenshot.

## Direction

Build a notebook worksheet utility for checking contrast. It should feel like a teacher has marked a design assignment: blue handwriting-style marks for normal notes, red marks for important corrections, a left margin rule, pale horizontal paper lines, and a check-mark brand symbol.

## Visual Source Notes

The Primarium theme is described by WordPress as a text-first notebook theme with handwriting-inspired typography and a clean reading flow. The user screenshot shows:

- Pale paper background.
- Repeating horizontal ruled lines.
- A thin red margin line.
- Blue handwritten typography.
- Sparse navigation.
- Simple blue doodle marks.

## Palette

- Notebook paper: `#fbfbf5`
- Paper line: `#cfdaf7`
- Blue ink: `#2554d9`
- Deep ink: `#163db0`
- Teacher red: `#e23b3b`
- Red wash: `#fff0ef`
- Pencil gray: `#4b5563`
- Surface paper: `#fffefa`

## Typography

Use a handwriting-inspired stack where available, backed by readable system fonts. Do not import external fonts in V1. Body text should remain readable and not imitate handwriting too aggressively.

## Layout

- Global background uses ruled paper.
- Header is thin and notebook-like.
- Brand mark is `☑` in blue ink.
- Hero copy is compact.
- Tool panel is an annotated worksheet, not a floating marketing card.
- Cards use 8px or smaller radius.
- Red annotations mark failed checks, repair suggestions, and important labels.

## Differentiator

The memorable moment is the "graded worksheet" result: a ratio score, blue pass checks, red correction marks, and a suggested rewritten color value.

## Risks To Check After Build

- The paper lines must not make text harder to read.
- Red annotation text must pass contrast.
- Handwriting styling must not cause layout overflow.
- Result labels must fit on 390px mobile.


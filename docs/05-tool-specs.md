# 05 — Tool Specifications

## Tool package contract

Every tool package must expose a spec and pure logic.

```ts
export type ToolSpec = {
  id: string;
  displayName: string;
  execution: 'client-only' | 'server-only' | 'hybrid';
  input: {
    types: string[];
    maxSize?: string;
    maxChars?: number;
  };
  output: {
    types: string[];
  };
  privacy: {
    userInputLeavesDevice: boolean;
    storesUserInput: boolean;
    analyticsIncludesRawInput: false;
    retentionDays?: number;
  };
  limits: {
    rateLimitPerMinute?: number;
    timeoutMs?: number;
  };
  analyticsEvents: string[];
  launchChecklist: string[];
};
```

## 1. `convert-image-to-png`

Product identity: image conversion utility, Spanish-first if targeting `convertir imagen a png`.

Core functionality:

- convert JPEG/JPG to PNG
- convert WebP to PNG
- convert PNG to normalized PNG output
- optional HEIC/HEIF support through dynamic client-side import
- drag-and-drop upload
- file validation
- output filename generation
- download PNG
- privacy notice: whether conversion happens in browser

v1 decision:

- client-side first
- no upload by default
- explicit max file size
- no ads near download button

Analytics:

- `file_selected`
- `tool_start`
- `tool_complete`
- `file_downloaded`
- `tool_error`

## 2. `typing-speed-test`

Product identity: timed WPM/CPM speed testing.

Core functionality:

- 15s / 30s / 60s / 3min / 5min modes
- WPM calculation
- CPM calculation
- accuracy
- error count
- result panel
- share/copy result text

Tool core:

```txt
packages/tools/typing-engine/
  calculate-wpm.ts
  calculate-accuracy.ts
  calculate-cpm.ts
  result.ts
  errors.ts
```

Analytics:

- `tool_start`
- `typing_test_completed`
- `copy_action`
- `share_action`

Privacy:

- do not store full typed text
- do not include raw typing text in analytics

## 3. `typing-practice`

Product identity: learning/practice curriculum, not only WPM testing.

Core functionality:

- lesson mode
- weak key detection
- daily practice
- beginner/intermediate/advanced flows
- keyboard layout support where feasible

Boundary:

- must not become a duplicate of `typing-speed-test`
- primary success event is practice completion/improvement, not leaderboard speed

## 4. `typing-practice-paragraph`

Product identity: paragraph library and long-form paragraph typing practice.

Core functionality:

- short/medium/long paragraph categories
- difficulty levels
- random paragraph mode
- custom paragraph mode
- paragraph-level WPM and accuracy

Boundary:

- must focus on paragraph content and long-form practice
- must not be only another timed WPM test

## 5. `typing-test-online`

Product identity: general online typing test and certificate/job/school testing flow.

Core functionality:

- test duration and difficulty selection
- certificate-style result
- printable result
- no-login test
- optional employer/school mode later

Boundary:

- must focus on general online test experience
- speed calculations can share `typing-engine`, but page intent and UX must differ from `typing-speed-test`

## 6. `cursive-alphabet`

Product identity: handwriting education resource.

Core functionality:

- A-Z uppercase/lowercase charts
- stroke order visualizations
- printable worksheets
- tracing sheets
- teacher/parent/student examples

Boundary:

- educational content and worksheets, not a fancy text generator

## 7. `cursive-generator`

Product identity: generate cursive/fancy text for copy/export.

Core functionality:

- input text
- multiple cursive/script variants
- copy generated text
- export as PNG/SVG if implemented
- signature preview mode

Boundary:

- text generation and export, not handwriting lessons

## 8. `cursed-text-generator`

Product identity: Zalgo/glitch/cursed Unicode text generator.

Core functionality:

- intensity slider
- multiple glitch modes
- copy button
- clean/normalize generated text
- preview for social/chat contexts

Boundary:

- entertainment/social/gaming tone, visually distinct from cursive generator

## 9. `correcteur-d-orthographe`

Product identity: French spelling/grammar checker.

Core functionality:

- French spelling suggestions
- grammar suggestions if provider supports it
- accent and punctuation suggestions
- explanation of corrections
- text length limits
- provider error handling
- privacy warning if third-party API is used

v1 recommendation:

- LanguageTool API or self-hosted LanguageTool
- Worker route as gateway
- rate limit + optional Turnstile
- never log raw text

Boundary:

- do not claim advanced correction quality unless the tool provides it
- do not create fake functionality that only leads to ads

## 10. `anagram-solver`

Product identity: word game/anagram solving tool.

Core functionality:

- exact anagram lookup
- wildcard support
- starts with / ends with / contains filters
- word length filter
- optional Scrabble/Words With Friends scoring
- dictionary index built from word list

Tool core:

```txt
packages/tools/anagram/
  normalize.ts
  signature.ts
  build-index.ts
  solver.ts
  filters.ts
  scoring.ts
```

Boundary:

- can expand into word game tools but primary page stays focused on anagram solving

## Similar-keyword risk controls

Typing sites and cursive/text generator sites are the highest doorway-risk groups. Each must have a distinct product model, success event, UX, examples, and content strategy.

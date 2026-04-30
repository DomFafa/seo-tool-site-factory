# Acceptance Tests: Reverse Text Generator

## Functional Tests

| Test | Input / Action | Expected output / behavior |
|---|---|---|
| Reverse characters | `hello` | `olleh` |
| Reverse words | `hello world` | `world hello` |
| Reverse each word | `hello world` | `olleh dlrow` |
| Preserve lines | `one\ntwo` | Output keeps a line break. |
| Empty input | empty | Empty output with helper text. |
| Copy result | Click copy | Clipboard contains output and success state appears. |
| Clear input | Click clear | Input and output reset. |
| Example chip | Click example | Input and output update. |

## Repository Validation

Run:

```bash
pnpm site check reverse-text-generator
pnpm site build reverse-text-generator
pnpm seo audit reverse-text-generator
pnpm seo lint-content reverse-text-generator
pnpm perf audit reverse-text-generator
pnpm site ui-audit reverse-text-generator
```

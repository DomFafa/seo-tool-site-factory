# 10 — Security, Privacy, and Abuse Protection

## 1. Privacy principles

- Minimize collection.
- Do not store raw user input unless explicitly required and disclosed.
- Do not send raw inputs to analytics.
- Prefer client-side execution when practical.
- Explain when a third-party API is used.

## 2. Forbidden analytics payloads

Never include:

- raw spellcheck text
- uploaded file content
- full custom typing text
- email addresses
- API keys
- secrets
- auth tokens
- exact user file names if sensitive

## 3. Tool privacy defaults

| Tool | Default execution | Data handling |
|---|---|---|
| convert-image-to-png | client-only v1 | no upload by default |
| typing-speed-test | client-only | do not store typed text |
| anagram-solver | client/server optional | input letters can be logged only if non-sensitive and disclosed; prefer aggregate events |
| cursive/cursed generators | client-only | avoid storing input text |
| correcteur-d-orthographe | server/API gateway likely | never log raw text; disclose third-party API if used |

## 4. Data retention

Each tool/site must define:

- whether input leaves the device
- where data is processed
- whether anything is stored
- retention period
- deletion/TTL behavior

Suggested defaults:

- client-only tools: no user input storage
- uploaded temporary files: 0-24h TTL if server-side later
- analytics: event metadata only
- logs: redact inputs and file names

## 5. Abuse protection

Support:

- per-tool rate limits
- per-site rate limits
- request body limits
- file size limits
- timeout limits
- optional Turnstile
- emergency feature disable switch
- abuse event logging

Tools needing stronger protection:

- spellcheck API
- image conversion API if server-side
- export/share image generation
- any paid third-party API call

## 6. Turnstile requirement

If Turnstile is used, server-side validation is mandatory. The browser widget alone does not protect the endpoint.

Reference:

- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

## 7. Secrets

Sensitive values must use Cloudflare secrets or equivalent. Do not put secrets in:

- `site.config.ts`
- MDX files
- generated static files
- client bundles
- analytics events

Reference:

- https://developers.cloudflare.com/workers/configuration/secrets/

## 8. Emergency controls

The system should support per-site/per-tool switches:

```ts
features: {
  toolEnabled: true,
  adsEnabled: false,
  analyticsEnabled: true,
  expensiveApiEnabled: false
}
```

Emergency behavior:

- disable expensive API
- show degraded client-side fallback if available
- preserve page but prevent abuse
- noindex only if quality or policy issue requires it

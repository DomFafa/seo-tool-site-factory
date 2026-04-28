# Suggested package.json scripts

```json
{
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "typecheck": "tsc -b --pretty",
    "lint": "eslint .",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "site": "tsx scripts/site.ts",
    "site:list": "tsx scripts/site.ts list",
    "site:check": "tsx scripts/site.ts check",
    "site:report": "tsx scripts/site.ts report"
  }
}
```

Implementation detail: `pnpm site build <site-id>` should set `SITE_ID=<site-id>` and run selected-site preparation before `next build`.

# 11 — Library and Tooling Recommendations

## Core stack

Recommended:

```txt
Next.js App Router
TypeScript
pnpm
zod
next-intl
MDX + frontmatter parser
Vitest
Playwright
@opennextjs/cloudflare
wrangler
```

## UI and state

Recommended:

```txt
Tailwind CSS
shadcn/ui or internal component wrappers
react-hook-form
zustand
clsx
tailwind-merge
```

Guideline:

- UI components can be shared.
- Final page composition and theme should differ by site.
- Avoid making every site look like a template clone.

## SEO

Use:

- Next.js Metadata API
- `app/sitemap.ts`
- `app/robots.ts`
- custom `packages/seo` helpers

References:

- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

## i18n

Use:

- `next-intl`

References:

- https://next-intl.dev/docs/getting-started/app-router
- https://next-intl.dev/docs/routing

## Cloudflare

Use:

- `@opennextjs/cloudflare`
- `wrangler`
- Workers Analytics Engine for custom events where useful
- Turnstile for abuse protection where needed

References:

- https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- https://opennext.js.org/cloudflare
- https://developers.cloudflare.com/analytics/analytics-engine/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

## Image conversion tools

MVP approach:

- use browser Canvas APIs for JPG/PNG/WebP paths
- use `heic2any` or alternative only as dynamic import for HEIC/HEIF
- use `browser-image-compression` when compression/resizing is needed

References:

- https://www.npmjs.com/package/heic2any
- https://www.npmjs.com/package/browser-image-compression

Caution:

- HEIC libraries can increase client bundle size.
- Dynamically import only when HEIC files are selected.
- Do not claim support for formats not tested.

## Spellcheck tools

MVP approach:

- LanguageTool API or self-hosted LanguageTool
- Cloudflare Worker route as gateway
- rate limit and optional Turnstile
- never log raw text

References:

- https://languagetool.org/proofreading-api
- https://dev.languagetool.org/public-http-api.html

## Anagram tools

MVP approach:

- use a word list package or curated dictionary
- build sorted-letter signature index
- add filters above the index

Reference:

- https://www.npmjs.com/package/word-list

## Text generators

MVP approach:

- self-maintain Unicode maps for cursive/fancy text
- self-maintain combining mark logic for cursed/Zalgo text
- keep logic small and testable

Avoid:

- large unmaintained text generator packages
- copying opaque Unicode mappings without tests

## What not to overuse

Avoid:

- SEO auto-generation tools that mass-produce thin pages
- generic typing-test components with no product differentiation
- random anagram packages with unclear dictionary/licensing
- unreviewed machine translation pipelines
- any dependency that pushes secrets or user input client-side unexpectedly

# 02 — Architecture Design

## 1. High-level model

```txt
                         +-------------------+
                         |  sites/<site-id>  |
                         | config/content/ui |
                         +---------+---------+
                                   |
                                   v
+-------------+        +-----------+-----------+        +----------------+
| packages/*  | -----> | apps/web Next.js app | -----> | Cloudflare     |
| shared code |        | selected by SITE_ID  |        | Workers deploy |
+-------------+        +-----------+-----------+        +----------------+
                                   |
                                   v
                         +-------------------+
                         | independent site  |
                         | domain + SEO + ads|
                         +-------------------+
```

## 2. Four-layer repository model

```txt
apps/       application code
sites/      site packs: identity, content, theme, messages
packages/   reusable libraries, SEO, tool logic, schemas
infra/      deployment automation and Cloudflare templates
```

## 3. Package responsibilities

### `packages/site-core`

Responsibilities:

- site schema
- site registry
- selected-site loader
- duplicate domain detection
- lifecycle state validation
- content manifest validation
- generated selected-site manifest contract

### `packages/seo`

Responsibilities:

- canonical generation
- hreflang generation
- metadata generation
- sitemap generation
- robots generation
- structured data generation
- SEO validation helpers

It does not replace Next.js file conventions. It provides data to `apps/web/app/sitemap.ts` and `apps/web/app/robots.ts`.

### `packages/tools/*`

Responsibilities:

- pure tool logic
- input validation
- output modeling
- error modeling
- privacy and limit declarations
- no React dependencies

Examples:

```txt
packages/tools/typing-engine/
packages/tools/image-converter/
packages/tools/anagram/
packages/tools/spellcheck/
packages/tools/text-generators/
```

### `apps/web/features/*`

Responsibilities:

- React client/server components for tools
- user interactions
- display and forms
- calling pure tool logic
- firing analytics events through shared analytics module

## 4. Build-time SITE_ID flow

```txt
pnpm site build typing-speed-test
        |
        v
sets SITE_ID=typing-speed-test
        |
        v
validate selected site pack
        |
        v
generate apps/web/.generated/site.ts
        |
        v
Next.js build reads only selected-site manifest
        |
        v
OpenNext converts build output
        |
        v
Wrangler deploys Cloudflare Worker
```

Rules:

- `SITE_ID` missing: fail.
- `SITE_ID` unknown: fail.
- Production build must not choose a default.
- Selected site content and config must be the only site data in the artifact.

## 5. Runtime page flow

```txt
request /en/
   |
   v
layout loads selected site metadata
   |
   v
locale route validates locale
   |
   v
content loader loads site + locale home.mdx
   |
   v
ToolRenderer chooses feature based on primaryTool
   |
   v
AdSlot/Analytics use selected site config
```

## 6. Content flow

```txt
sites/<site-id>/content/<locale>/*.mdx
       |
       v
frontmatter validation
       |
       v
content manifest
       |
       v
pages + metadata + sitemap
```

Do not let MDX content directly override canonical, robots, or ads behavior without schema-controlled fields.

## 7. SEO flow

```txt
site.config.ts + content frontmatter + locale route map
       |
       v
packages/seo
       |
       +--> metadata for pages
       +--> hreflang alternates
       +--> sitemap entries
       +--> robots rules
       +--> structured data
```

## 8. Ads flow

```txt
site.config.ads + lifecycle + page policy
       |
       v
AdsGate
       |
       v
AdSlot component
       |
       v
provider script lazy-loaded only when allowed
```

## 9. Analytics flow

```txt
user action
   |
   v
track(eventName, metadata)
   |
   v
redact + validate event payload
   |
   v
provider adapter
   |
   +--> Cloudflare Web Analytics
   +--> Workers Analytics Engine
```

Analytics must never include raw user text, uploaded file content, full custom typing text, API keys, or secrets.

## 10. Deployment model

Each site is independently deployable. v1 assumes one deployed artifact per site.

```txt
site pack -> selected build -> Worker project -> domain binding
```

This avoids runtime ambiguity and simplifies SEO correctness.

# SEO Tool Site Factory Requirements

Generated: 2026-04-28
Status: Draft
Owner: Internal

## 1. Background

The project is an internal system for producing many small SEO-focused tool websites.

Each website targets one core keyword or a tight keyword cluster, for example:

- convert image to png
- cursive alphabet / cursive generator / cursed text generator
- correcteur d'orthographe
- typing practice / typing speed test / typing test online
- anagram solver

Each site should be able to use its own domain, brand, UI direction, copy, languages,
analytics, ads configuration, and deployment target. The sites can share the same
codebase as long as each site's product identity remains independent.

The first user of the system is internal. The goal is not to validate an external
SaaS product. The goal is to build a repeatable internal production system for
launching and operating SEO tool sites.

## 2. Product Goal

Build a tool-site factory that turns a site definition into a deployable independent
website.

The system should let the operator define:

- what keyword the site targets
- what domain it uses
- what tool it provides
- what brand and UI style it uses
- what languages and content exist
- what SEO metadata and structured data are emitted
- what ad and analytics configuration is active
- how it is deployed on Cloudflare

The output should be an independently deployed website that can be indexed, measured,
monetized with ads, and maintained without forking the codebase.

## 3. Non-Goals

The system is not trying to do these things in the first product definition:

- create a public SaaS platform for other people to generate sites
- build a full admin dashboard before the file/config workflow is proven
- make every tool category possible from day one
- let each site contain arbitrary private business logic
- optimize for the smallest initial implementation diff
- copy the full Labubu ecommerce/catalog pipeline

The desired outcome is a clear, scalable internal product model, not a rushed
two-site MVP.

## 4. Core Users

### Internal Operator

The internal operator researches keywords, registers domains, creates site definitions,
reviews generated content, runs deploys, checks indexability, and monitors traffic and
ad revenue.

Primary needs:

- create a new site without duplicating a repo
- understand what configuration is required
- see deployment and SEO readiness failures early
- keep sites visually and semantically distinct
- avoid maintenance chaos as site count grows

### Internal Developer

The internal developer maintains shared tools, page templates, SEO logic, content loading,
ads, analytics, and Cloudflare automation.

Primary needs:

- add a new tool type once and reuse it across many sites
- keep pure tool logic separate from React UI
- keep SEO generation deterministic and testable
- avoid runtime ambiguity about which site is being built or served
- avoid speculative abstractions with no real second use case

## 5. Key Product Principles

1. One codebase, many independent sites.

2. A site is a product configuration, not a fork.

3. Shared code owns common behavior. Site packs own identity, content, and configuration.

4. Build-time site selection is preferred for independently deployed domains.

5. Runtime host detection may be considered later only if one Worker serves multiple
   domains. It is not the default requirement.

6. SEO output must be generated from structured site/content data, not scattered strings.

7. Ads and analytics must be configurable per site, but implemented through shared modules.

8. Site-specific private code is disallowed unless the system has a clear extension point
   backed by at least two real use cases.

## 6. Reference From Labubu

The Labubu project is relevant as a reference for multi-brand architecture, not as a
direct ecommerce template.

Useful ideas to borrow:

- single repository with multiple brand/site packs
- build-time brand/site selection
- one source of truth for site URL, locales, routes, SEO metadata, and deployment config
- deterministic sitemap, robots, canonical, and hreflang generation
- independent Cloudflare deployment per brand/site
- validation gates before launch

Ideas not to copy directly:

- product catalog pipeline
- R2 product image publishing flow
- ecommerce collection/product routing assumptions
- brand onboarding complexity that exists only because Labubu is a storefront system

## 7. Recommended Repository Model

The requirements favor a four-layer structure:

```txt
apps/       application code
sites/      independent site packs
packages/   shared libraries and reusable tool logic
infra/      deployment and Cloudflare automation
```

Recommended target shape:

```txt
apps/
  web/
    app/
      [locale]/
        page.tsx
        guide/
          [slug]/
            page.tsx
      sitemap.ts
      robots.ts
      layout.tsx
    features/
      image-converter/
      typing-test/
      anagram-solver/
      spellchecker/
      text-generators/
    lib/
      ads/
      analytics/
      i18n/
      site/
    components/
    next.config.ts
    open-next.config.ts
    wrangler.jsonc

sites/
  convert-image-to-png/
    site.config.ts
    theme.ts
    content/
    messages/
  typing-speed-test/
    site.config.ts
    theme.ts
    content/
    messages/

packages/
  seo/
  tools/
    image-converter/
    typing-engine/
    anagram/
    spellcheck/
    text-generators/

infra/
  cloudflare/
    scripts/
    templates/
```

Important boundary:

- `apps/web/features/*` contains React UI and user interactions.
- `packages/tools/*` contains pure tool logic, algorithms, parsers, and reusable engines.
- `sites/*` contains product configuration, content, messages, and theme direction.
- `infra/cloudflare/*` contains deployment automation and templates.

## 8. Site Pack Requirements

Each site must have a dedicated directory under `sites/`.

Minimum required files:

```txt
sites/<site-id>/
  site.config.ts
  theme.ts
  content/
  messages/
```

### site.config.ts

The site config must define:

- `id`
- `brandName`
- `domains`
- `defaultLocale`
- `locales`
- `primaryTool`
- `seo`
- `ads`
- `analytics`
- `deployment`
- `features`

Example shape:

```ts
export default {
  id: "typing-speed-test",
  brandName: "SpeedType",
  domains: ["typingspeedtest.com", "www.typingspeedtest.com"],
  defaultLocale: "en",
  locales: ["en", "es", "fr"],
  primaryTool: "typing-speed-test",
  seo: {
    defaultTitle: "Typing Speed Test",
    defaultDescription: "Test your typing speed online.",
    xDefaultLocale: "en"
  },
  ads: {
    enabled: true,
    provider: "adsense",
    slots: {
      afterTool: true,
      inArticle: true,
      sidebar: true
    }
  },
  analytics: {
    provider: "cloudflare",
    events: ["tool_start", "tool_complete", "download", "copy"]
  },
  deployment: {
    provider: "cloudflare",
    projectName: "typing-speed-test"
  },
  features: {
    guides: true,
    faq: true
  }
};
```

### theme.ts

The theme file should describe a visual system, not just colors.

It should support:

- typography direction
- layout style
- radius and density
- component variants
- tool surface style
- result panel style
- ad placement behavior when visual layout is affected

The goal is to prevent every site from looking like the same template with a different
logo.

### content/

Content should be language-scoped:

```txt
content/
  en/
    home.mdx
    faq.mdx
    guides/
      average-typing-speed.mdx
  es/
    home.mdx
    faq.mdx
    guides/
      prueba-velocidad-escritura.mdx
```

Each content document should support frontmatter:

```md
---
title: "Typing Speed Test"
description: "Test your typing speed online."
slug: "typing-speed-test"
lastModified: "2026-04-28"
index: true
---
```

## 9. Tool Requirements

Tool logic must be reusable across sites and separated from UI.

Examples:

- `packages/tools/image-converter` handles image conversion logic and validation.
- `packages/tools/typing-engine` handles WPM, accuracy, timing, and result calculation.
- `packages/tools/anagram` handles dictionary lookup and scoring.
- `packages/tools/spellcheck` handles correction logic or provider integration.

Feature UI lives in `apps/web/features/*`.

Example:

```txt
packages/tools/typing-engine/
  calculate-wpm.ts
  accuracy.ts
  result.ts

apps/web/features/typing-test/
  TypingTestClient.tsx
  ResultPanel.tsx
  TimerSelector.tsx
```

Requirement:

- Adding a new keyword site that uses an existing tool type must not require modifying
  the tool core.
- Adding a new tool type may require new package/tool logic and one feature UI module.

## 10. SEO Requirements

SEO must be treated as a first-class system, not page-level decoration.

The system must generate or validate:

- title
- description
- canonical URL
- hreflang alternates
- x-default
- Open Graph metadata
- Twitter metadata
- JSON-LD structured data
- sitemap entries
- robots rules
- index/noindex policy
- lastModified values

Next.js file conventions should remain the integration point:

```txt
apps/web/app/sitemap.ts
apps/web/app/robots.ts
```

The shared SEO package should generate data consumed by these files. It should not
replace the framework convention.

Requirements:

- Canonical and sitemap URLs must use the configured site domain.
- URLs must be deterministic.
- Each localized page must produce correct hreflang links.
- No page should be indexable without title, description, canonical, and valid content.
- Sitemap generation must be testable without deploying.
- Content `lastModified` must not change on every build unless content changed.

## 11. i18n Requirements

Each site can choose its own language list.

The system must support:

- default locale
- locale-prefixed routes
- localized messages
- localized content
- localized metadata
- hreflang generation
- fallback behavior

The product requirement does not mandate that all sites support all languages. A site
may start with one language and expand later.

## 12. Ads Requirements

The primary monetization model is advertising.

The ads system must support:

- per-site enable/disable
- provider configuration, initially AdSense-compatible
- named ad slots
- responsive behavior
- lazy loading
- page-level placement policy
- disabling ads on pages where ads hurt usability

Ads should be inserted through shared components or layout slots, not manually embedded
inside every page.

## 13. Analytics Requirements

Analytics must measure both SEO traffic and tool usage.

The system should support:

- page views
- tool started
- tool completed
- file uploaded
- file downloaded
- typing test completed
- copy/share actions
- ad slot visibility
- language switch

Provider choice should be configurable per site, but the event names should remain
consistent across sites.

## 14. Cloudflare Requirements

All sites deploy under one Cloudflare account.

Each site should support:

- independent domain
- independent Cloudflare Pages or Workers project
- per-site environment variables
- custom domain binding
- preview deployment
- production deployment
- deployment verification

Cloudflare automation belongs under `infra/cloudflare`, not as a runtime package.

The deployment system should be able to read `sites/<site-id>/site.config.ts` and deploy
the selected site.

Expected commands:

```txt
pnpm site check <site-id>
pnpm site build <site-id>
pnpm site deploy <site-id>
pnpm site verify <site-id>
```

## 15. Build-Time Site Selection

For independent-domain deployments, the default model is build-time site selection.

Example:

```txt
SITE_ID=typing-speed-test pnpm build
```

Requirements:

- The build must fail if `SITE_ID` is missing or unknown.
- The build must load only the selected site pack.
- The generated sitemap and robots output must match the selected site.
- The deployed artifact must not accidentally include another site's private content
  or analytics configuration.

Runtime host detection is a possible future mode, but it is not the default requirement.

## 16. Validation Requirements

The system must provide pre-deploy validation.

Validation should catch:

- missing site config fields
- duplicate domains across sites
- unsupported locale references
- missing content for required locale
- missing title or description
- invalid canonical URL
- invalid ad configuration
- invalid analytics provider config
- Cloudflare project mismatch
- sitemap generation failure
- robots generation failure
- unknown primary tool

Validation should fail fast with actionable error messages.

## 17. Operational Requirements

The operator should be able to answer:

- Which sites exist?
- Which domain belongs to which site?
- Which sites are deployed?
- Which sites have ads enabled?
- Which sites have analytics configured?
- Which sites have missing content or SEO errors?
- Which site uses which tool type?

This does not require a dashboard initially. A CLI report is sufficient.

## 18. Requirements By Phase

### Phase 1: Requirements-Complete Factory Skeleton

Deliverables:

- repository structure
- site pack schema
- site registry
- build-time `SITE_ID` selection
- SEO data generation contract
- Cloudflare deployment contract
- validation checklist
- documentation for adding a site

### Phase 2: First Operational Sites

Deliverables:

- at least two site packs using different tool interaction patterns
- one file-processing tool
- one interactive/browser tool
- per-site SEO output
- per-site deployment
- per-site ads and analytics config

### Phase 3: Scale To Many Sites

Deliverables:

- site generator command
- content scaffolding
- keyword/content workflow
- deployment status report
- duplicate domain detection
- SEO regression checks
- analytics event consistency checks

### Phase 4: Operations Layer

Deliverables:

- optional dashboard
- domain health checks
- indexation monitoring
- revenue reporting
- content freshness report
- bulk deploy and rollback tools

## 19. Open Questions

1. Should each site use Cloudflare Pages, Cloudflare Workers with OpenNext, or both depending
   on tool needs?

2. Should image conversion happen entirely in-browser first, or should server-side conversion
   be supported for larger files?

3. What is the minimum acceptable content quality bar before a site is deployable?

4. Which analytics provider should be the first default: Cloudflare Web Analytics, GA4,
   Plausible, or Umami?

5. Will the system manage domain registration/DNS, or only deploy to domains already
   configured in Cloudflare?

6. What is the policy for AI-generated content review before deployment?

## 20. Success Criteria

The requirements are satisfied when:

- a new site can be defined without creating a new repository
- each site can deploy to its own domain
- each site has independent brand, UI, content, SEO, ads, analytics, and language config
- shared tool logic can be reused across multiple sites
- SEO output is deterministic and validated
- Cloudflare deployment is repeatable
- the operator can inspect site status without reading scattered code
- the architecture stays simple enough that adding the 20th site is not meaningfully harder
  than adding the 3rd

## 21. Recommended Decision

Adopt the four-layer model:

```txt
apps/ + sites/ + packages/ + infra/
```

Use build-time `SITE_ID` selection for independent-domain deployment.

Keep early shared modules simple. Start with `packages/seo` and `packages/tools`.
Keep ads, analytics, i18n, and site loading under `apps/web/lib` until they are used by
multiple non-web workflows. Promote them to packages only when real reuse exists.

This keeps the requirements scalable without turning the first implementation into
an abstract platform.

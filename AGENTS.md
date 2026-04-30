# Agent Instructions

This repository is a static SEO tool-site factory.

When creating, improving, or auditing a keyword-driven SEO utility site, use `.codex/skills/seo-tool-site-factory/SKILL.md` before editing implementation files. The skill turns keyword research into competitor-informed product requirements, SEO specs, UX specs, design direction, and acceptance tests.

Follow these rules when editing code:

1. Do not bypass YAML schema validation in `packages/site-core`.
2. Do not hard-code site IDs, domains, analytics IDs, ad IDs, verification tokens, or canonical URLs inside Astro pages.
3. Use `SITE_ID` through the CLI for dev/build/deploy.
4. Do not manually write sitemap, robots, ads.txt, IndexNow key files, or verification files in page components.
5. Do not place ads near primary actions such as Convert, Download, Copy, Start, Upload, or Retry.
6. Do not include raw user input, uploaded file content, typed text, or spellcheck text in analytics events.
7. Interactive tool UI belongs under `apps/site/src/features/*`.
8. Pure tool logic belongs under `packages/tools/*`.
9. Site identity, content, integrations, and theme belong under `sites/<site-id>/`.
10. Run `pnpm site check <site-id>` after changing a site pack.
11. Run `pnpm ops report` after adding or changing multiple sites.
12. Before implementing a new SEO keyword site, create or update `sites/<site-id>/research/*` using the SEO Tool Site Factory skill.
13. Before implementing visual UI, define and review `sites/<site-id>/research/design-direction.md` and `sites/<site-id>/research/design-review.md`.
14. Keep new sites as draft and non-indexable until research, content review, design review, tool behavior, SEO audit, performance audit, and UI similarity review are complete.

V1 intentionally avoids complex admin, permissions, and approval workflows. Prefer CLI + YAML + generated reports.

You are Claude Code continuing an internal SEO Tool Site Factory implementation.

Your first task is to inspect the repository and this handoff pack. Then implement the factory skeleton according to:

- AI-HANDOFF.md
- CLAUDE.md
- docs/08-implementation-roadmap.md
- templates/site.config.example.ts
- templates/tool.spec.example.ts

Begin with P0 only:

1. site schema and registry
2. selected SITE_ID build preparation
3. content/frontmatter validation contract
4. SEO generation contract
5. CLI commands for list/check/build

Preserve these decisions:

- Cloudflare Workers + OpenNext
- build-time SITE_ID
- Next.js App Router
- root-level sites directory
- packages/tools for pure logic
- apps/web/features for React UI

Add tests. Avoid speculative abstractions. Do not enable ads or indexable content by default.

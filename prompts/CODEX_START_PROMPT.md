You are Codex continuing an internal SEO Tool Site Factory implementation.

Read these files first:

1. README.md
2. AI-HANDOFF.md
3. AGENTS.md
4. docs/00-executive-summary.md
5. docs/08-implementation-roadmap.md
6. docs/09-quality-gates-and-checklists.md

Implement Phase 1 through Phase 3 first:

- initialize monorepo skeleton
- create site-core schema/registry/loader
- implement build-time SITE_ID selection
- add basic CLI commands: site list/check/build
- create two draft site packs: typing-speed-test and convert-image-to-png

Do not implement a dashboard. Do not implement all 10 sites yet. Do not allow production build to default SITE_ID. Add tests for schema validation and SITE_ID failure paths.

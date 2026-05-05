# Codex Build Prompt: open-heic-file

Mode: implement
Current phase: Phase 3 implementation gate after Phase 1 and Phase 2 records.

Build a draft, static Cloudflare Pages-compatible SEO utility site for the keyword `open heic file`.

Inputs:
- site-id: `open-heic-file`
- tool-id: `open-heic-file`
- category: `other`
- locale: `en`
- market: `US`
- Bing Webmaster status: `user-approved-skip`
- Launch status: `DRAFT_ONLY`

Required implementation:
- Site pack under `sites/open-heic-file/`.
- Pure tool logic under `packages/tools/open-heic-file/`.
- React UI under `apps/site/src/features/open-heic-file/`.
- CLI renderer mapping in `scripts/site.ts`.
- App dependency entry in `apps/site/package.json`.
- Keep site noindex and draft.

Tool behavior:
- Accept `.heic` and `.heif`.
- Validate max file size.
- Decode in browser.
- Preview image.
- Export PNG and JPEG.
- Track only safe analytics fields.

Design:
- Follow `design-direction.md`.
- Monochrome/off-white, precise, spacious, TypeScale/Zephtor-inspired.
- No ads near file upload or download actions.

Validation:
- `pnpm --filter @factory/open-heic-file test`
- `pnpm site check open-heic-file`
- `pnpm site build open-heic-file`

Research readiness: 7
Design specificity: 8
Launch readiness: 3

Deferred launch blockers:
- Bing Webmaster competitor capture skipped.
- Post-UI browser screenshots pending.
- Real HEIC sample QA pending.
- Content review pending.

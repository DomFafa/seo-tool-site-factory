# Acceptance Tests

Functional acceptance:
- Valid `.heic` or `.heif` file can be selected.
- Unsupported file types are rejected with a clear message.
- Files over `maxFileSizeMb` are rejected before decode.
- Decode failure shows a retry path.
- Successful decode shows preview and dimensions.
- PNG download creates a `.png` object URL.
- JPEG download creates a `.jpg` object URL.
- Clearing the file revokes object URLs and returns to idle state.

Privacy acceptance:
- No file upload request is needed for the core workflow.
- Analytics events do not include file name, raw metadata, or image content.
- Safe analytics fields are limited to locale, MIME type, size bucket, and success.

SEO/site acceptance:
- `pnpm site check open-heic-file` passes.
- `pnpm site build open-heic-file` passes.
- Site remains `draft`, `allowIndex: false`, and `indexable: false`.

Design acceptance:
- Desktop first viewport has clear brand, H1, trust copy, and tool path.
- Mobile 390px layout has no overlapping text or controls.
- Primary file and download actions have no adjacent ads.

Post-UI design review completed: no
Interaction QA run: no

Evidence used:
- Product and UX specs.
- Existing repository validation commands.

Decisions made:
- Unit-test validation/helpers.
- Build-test the Astro site.

Implementation implications:
- Add focused tests under `packages/tools/open-heic-file/src/index.test.ts`.

Deferred items:
- Blocker: manual HEIC fixture QA pending.
- Missing evidence: real sample decode in browser.
- Impact: launch draft only.
- Next action: run browser QA with sample files.

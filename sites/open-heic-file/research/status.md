# Open HEIC File Status

Mode: implement

Current phase: Phase 4 post-UI QA gate
Allowed writes: `sites/open-heic-file/**`, `packages/tools/open-heic-file/**`, `apps/site/src/features/open-heic-file/**`, `scripts/site.ts`, app dependency metadata, and recipe CSS.
Required evidence: unit test, site check, research audit, static build, local browser preview.
Exit criteria: draft implementation builds and is available locally.
Blockers/deferred: Bing Webmaster competitor capture skipped by user request; real HEIC sample QA and post-UI screenshot review are still needed before launch.

Research status: READY_WITH_FALLBACK
Implementation status: READY
Launch status: DRAFT_ONLY

Research readiness: 7
Design specificity: 8
Launch readiness: 5

Evidence used:
- User selected primary keyword: `open heic file`.
- User explicitly requested skipping keyword research.
- User provided TypeScale/Zephtor screenshot for visual reference.
- Browser review of `https://typescale.com/` confirmed the live site is a typography tool; Bing indexed Zephtor copy from TypeScale, so the screenshot is treated as the template reference.

Decisions made:
- Build as a browser-side HEIC/HEIF opener with optional PNG/JPEG export.
- Keep site draft and noindex.
- Do not upload or store user files.

Implementation implications:
- Tool logic goes under `packages/tools/open-heic-file/`.
- Interactive UI goes under `apps/site/src/features/open-heic-file/`.
- Site identity/content/theme stay under `sites/open-heic-file/`.

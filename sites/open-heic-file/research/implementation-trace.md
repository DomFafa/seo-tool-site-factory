# Implementation Trace

Trace status: complete

| Research source | Decision | Implemented in | Evidence | Validation | Status |
|---|---|---|---|---|---|
| `keyword-intent.md` | Build a preview-first HEIC opener, not a generic converter. | `sites/open-heic-file/site.config.yaml`, `sites/open-heic-file/content/en/home.mdx`, `apps/site/src/features/open-heic-file/OpenHeicFileIsland.tsx` | H1, meta copy, and UI state all focus on opening/previewing HEIC. | `pnpm site build open-heic-file` | done |
| `competitor-research.md` | Keep draft/noindex because Bing Webmaster capture was skipped. | `sites/open-heic-file/site.config.yaml`, content frontmatter | `lifecycle.status: draft`, `allowIndex: false`, locale `indexable: false`, content `index: false`. | `pnpm site check open-heic-file` | done |
| `product-requirements.md` | Accept HEIC/HEIF, decode locally, preview, export PNG/JPEG. | `packages/tools/open-heic-file/src/index.ts`, `OpenHeicFileIsland.tsx` | Validation helpers, `openHeicImage`, `exportOpenedImage`, preview and download controls. | `pnpm exec tsx packages/tools/open-heic-file/src/index.test.ts` | done |
| `seo-spec.md` | Use HEIC-specific title, description, content, and SoftwareApplication data. | `site.config.yaml`, `home.mdx`, `faq.mdx` | Metadata and body copy use HEIC/HEIF/open/preview/export language. | `pnpm site check open-heic-file` | done |
| `ux-spec.md` | Implement idle, dragging, decoding, ready, error, clear, and export states. | `OpenHeicFileIsland.tsx`, `ui-differentiation.css` | React state model and CSS classes define all planned states. | `pnpm site build open-heic-file` | done |
| `design-direction.md` | Use monochrome TypeScale/Zephtor-inspired layout. | `layout.config.yaml`, `theme.config.yaml`, `ui-differentiation.css` | `monochrome-file-studio` recipe, split hero line-art motif, black pill buttons, off-white background. | Static build passed; screenshot review deferred. | done |
| `design-review.md` | Keep launch readiness capped until screenshots and sample QA. | `status.md`, `design-review.md` | Post-UI screenshot fields remain pending. | `pnpm site research-audit open-heic-file` | deferred |
| `acceptance-tests.md` | Add helper tests and build validation. | `packages/tools/open-heic-file/src/index.test.ts` | Tests cover type detection, validation, file size buckets, byte formatting, filenames. | `pnpm exec tsx packages/tools/open-heic-file/src/index.test.ts` | done |
| `brief.v2.draft.yaml` | Keep static Cloudflare Pages-compatible implementation. | `astro.config.mjs` existing static output, `site.config.yaml`, `scripts/site.ts` | `pnpm site build` outputs to `dist/sites/open-heic-file`. | `pnpm site build open-heic-file` | done |

Unconsumed or deferred research:
- Bing Webmaster Top 5 capture remains skipped by user approval.
- Real HEIC fixture QA is still needed.
- Desktop and mobile screenshot review is still needed.
- Launch remains `DRAFT_ONLY`.

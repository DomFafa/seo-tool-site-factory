# Design Review

Pre-implementation review status: complete
Post-UI design review completed: partial, pending user approval

Current correction:
- Previous implementation drifted from the TypeScale template with Inter-like typography, oversized clamp headings, custom card styling, and illustration-driven layout.
- The approved correction is strict TypeScale/Zephtor typography and spacing, with the hero and tool merged into one first-screen section.

Required visual checks:
- H1 uses template scale `2.986rem`, weight `700`, line-height `1.15`, letter spacing `-0.022em`.
- Header, hero, rows, and feature grids use the TypeScale whitespace scale.
- Tool is stacked below the hero copy, not side-by-side with copy.
- Illustration is removed.
- Below-tool content reads like the template columns, not boxed marketing cards.

Rejected design decisions:
- Green palette from the previous draft.
- Separate line-art hero illustration.
- Inter/extra-bold/clamp hero typography.
- Heavy bordered cards for every content section.
- Ads near upload/download actions.

Evidence captured:
- Desktop screenshot after 1:1 reference rebuild: `/tmp/open-heic-file-reference-full.png`
- Mobile 390px screenshot after 1:1 reference rebuild: `/tmp/open-heic-file-mobile-final.png`
- Local URL: `http://127.0.0.1:4330/`
- Tool visibility check: pass, tool top was inside first desktop viewport.
- Desktop H1 computed style: `47.776px`, weight `700`, line-height `54.9424px`, letter spacing about `-0.022em`.
- Mobile 390px overflow check: `innerWidth=390`, `scrollWidth=390`, no overflowing elements found.
- Reference rebuild includes hero split illustration, tool card, local-processing strip, three-step illustrations, three SEO cards, black privacy band, two-column FAQ, and footer matching the user-supplied screenshot structure.

Evidence still required:
- User visual approval against the supplied TypeScale screenshots.
- Real HEIC sample QA before launch.

Launch visual confidence: 8/10 after screenshot-reference rebuild; draft-only until user approval and HEIC sample QA.

Deferred items:
- Blocker: UI not yet implemented at time of this review.
- Missing evidence: screenshots and interaction QA.
- Impact: launch readiness remains capped at 4.
- Next action: update this file after browser QA.

# Monochrome File Opener Template

## Use When

Use this design direction for privacy-first file opener, converter, viewer, or repair-helper utility sites where the main user job is selecting a local file, previewing it, and downloading a compatible output.

The first production instance is `open-heic-file`.

## Visual Character

- White page, black primary text, black pill CTAs, fine gray borders.
- Editorial but utilitarian hero: large heavy H1 on the left, hand-drawn monochrome illustration on the right.
- File-tool panel directly below the hero, not buried in a marketing page.
- Tool panel uses a two-column desktop layout: dropzone left, status/download panel right.
- Rounded corners are restrained, usually 6-8px for cards and panels, 999px only for pills.
- Supporting sections keep the same black-line illustration style.
- Footer and trust pages are plain, compact, and content-first.

## Required Page Structure

```yaml
home:
  blocks:
    - hero
    - tool
    - localProcessingNote
    - howItWorks
    - guideCards
    - privacyBand
    - faq
```

## Hero

- H1 names the exact user action.
- Supporting copy states the privacy claim plainly.
- Use three compact trust pills when true:
  - No server upload
  - Works in your browser
  - 100% private
- Primary CTA scrolls to the tool.
- Secondary CTA may scroll to steps or sample content.

## Tool Panel

- Keep primary action away from ad slots.
- The dropzone must be a real accessible control, not a screenshot.
- Show disabled download buttons before output is ready.
- Show status, file size, output dimensions, and clear/reset.
- Do not send raw file names, image contents, typed text, or uploaded content in analytics.

## Content Cards

Use three cards after the steps:

- Failure explanation.
- Format comparison.
- Problem-solving guide.

Each card should link to a real guide page, not a same-page anchor, once the site is being prepared for a real domain.

## Trust Navigation

For real-domain use:

- Header links should include Privacy, FAQ, Contact, and the primary tool action if space allows.
- Footer links should include Home, Privacy, FAQ, and Contact at minimum.
- Contact and Privacy copy must use `contact@{canonical_host}` after the real domain is confirmed.

## Implementation References

For the first implementation, inspect:

- `apps/site/src/features/open-heic-file/OpenHeicLanding.astro`
- `apps/site/src/features/open-heic-file/OpenHeicFileIsland.tsx`
- `apps/site/src/styles/ui-differentiation.css` under `recipe-heic-pixel-native`
- `sites/open-heic-file/layout.config.yaml`
- `sites/open-heic-file/theme.config.yaml`

Do not copy site IDs, domains, analytics IDs, or canonical URLs. Adapt the site pack and tool ID.

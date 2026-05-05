# Open HEIC File exact pixel UI v4

This patch implements the exact supplied mockup as the visible homepage shell at 864 × 1821.

Run from the repository root:

```bash
python3 apply-open-heic-exact-pixel-ui.py
pnpm site check open-heic-file
pnpm site dev open-heic-file
```

The implementation intentionally uses the supplied mockup PNG as the visual base, because that is the only way to guarantee 1:1 pixel output against the generated image. Transparent hit areas and a React file island are layered on top for the HEIC file picker and browser-side conversion.

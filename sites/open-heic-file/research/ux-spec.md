# UX Spec

Primary workflow:
1. User lands on a sparse, tool-first page.
2. User drops or chooses a `.heic`/`.heif` file.
3. UI validates the file.
4. UI decodes the image in the browser.
5. UI shows preview, dimensions, size, and status.
6. User downloads PNG or JPEG, or clears and opens another file.

States:
- Idle: dropzone with supported formats and max size.
- Dragging: clear outline/highlight.
- Validating: short status message.
- Decoding: disabled actions and progress text.
- Ready: preview visible, metadata visible, download buttons enabled.
- Error: clear message and retry path.

Error messages:
- Unsupported file: "Choose a .heic or .heif image."
- Too large: include configured max MB.
- Decode failed: "This HEIC file could not be decoded in this browser."
- Browser unsupported: "This browser cannot run the HEIC decoder needed for this file."

Mobile behavior:
- Hero stacks above tool.
- Dropzone becomes tap-first file picker.
- Preview uses full width and fixed max height.
- Download buttons stack and keep stable sizes.

Accessibility:
- File input has visible button and drag area text.
- Status uses `aria-live`.
- Preview has alt text based on safe generic wording, not file name.
- Buttons have disabled states.

Privacy:
- Do not send image data to analytics.
- Do not include file name in analytics.
- Object URLs are revoked when replaced or cleared.

Evidence used:
- File-processing pattern from existing image converter.
- User supplied visual reference favors uncluttered sections.

Decisions made:
- Put the tool immediately after the first hero section.
- Avoid ads in the tool and result area.

Implementation implications:
- React component controls all states locally.
- Safe event fields only: locale, MIME type, file size bucket, success.

Deferred items:
- Blocker: final browser QA not yet run.
- Missing evidence: screenshot review after implementation.
- Impact: launch readiness capped.
- Next action: run desktop/mobile QA after build.

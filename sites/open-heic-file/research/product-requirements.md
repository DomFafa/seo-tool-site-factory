# Product Requirements

Product: HEIC Open
Primary job: open a HEIC/HEIF file in the browser, preview it, and optionally export PNG or JPEG.

Core requirements:
- Accept `.heic` and `.heif` files through drag-and-drop or file picker.
- Validate file extension, MIME type when available, and max size.
- Decode in the browser and render a preview.
- Show safe file facts: type, size bucket or formatted size, pixel dimensions after decode, and output status.
- Offer PNG and JPEG downloads after decode.
- Provide actionable errors for unsupported type, oversized file, decode failure, and unavailable browser capability.
- Avoid uploading, storing, or logging selected file content.

Non-goals:
- Batch conversion.
- Cloud file import.
- Server-side decoding.
- Raw EXIF extraction or analytics.
- Editing/cropping.

Acceptance-level behaviors:
- A valid HEIC/HEIF file reaches preview and download state.
- Invalid files fail before decode with a clear message.
- Download actions are disabled until an image is decoded.
- The user can clear the current image and choose another.

Evidence used:
- User keyword maps to an immediate file-opening job.
- Existing `convert-image-to-png` tool proves browser-file-processing pattern in this repo.

Decisions made:
- Build a single-file workflow to keep static hosting simple.
- Use client-side decoding dependency only if browser native decode is insufficient.

Implementation implications:
- Package under `@factory/open-heic-file`.
- UI island imports pure validation/conversion helpers.
- Track only safe event fields.

Deferred items:
- Blocker: cross-browser HEIC codec coverage must be tested with a real `.heic` sample.
- Missing evidence: Safari/Chrome/Firefox manual matrix.
- Impact: launch remains draft.
- Next action: run browser QA with known sample files before indexing.

# Design Direction

Reference:
- User-provided TypeScale/Zephtor template screenshots, including the checked page typography.
- TypeScale template source captured from `landing-page-01.php` and shared template CSS.

Aesthetic:
Strict TypeScale/Zephtor monochrome landing template adapted into a HEIC opener.

Core visual traits:
- Black and white palette only, with TypeScale gray for secondary surfaces.
- 1100px content width and the template whitespace scale.
- No separate hero illustration. The first screen merges the headline, supporting copy, trust badges, and functional file opener.
- Content below the tool uses plain TypeScale-style text columns instead of decorative cards.
- Buttons use the template pill treatment: black primary, gray/white secondary, `0.7rem 1.85rem`, `100px` radius.

Template typography constraints:
- Body font stack follows the TypeScale app system stack.
- Text scale: `0.694rem`, `0.833rem`, `1rem`, `1.2rem`, `1.44rem`, `1.728rem`, `2.074rem`, `2.488rem`, `2.986rem`.
- H1: `2.986rem`, `700`, `1.15` line-height, `-0.022em` letter spacing.
- Section H2: template scale below H1, not oversized marketing type.
- Body text remains `1rem`; secondary feature copy can use `0.833rem`.

Spacing constraints:
- Desktop whitespace scale uses `1rem` base and `1.5` multiplier.
- Header padding maps to `whitespace-200`.
- Merged hero/tool section maps to template hero rhythm with `whitespace-600` top spacing.
- Feature rows use `row_medium`/`row_large` equivalents, not arbitrary clamps.

Adaptation for HEIC Open:
- The tool replaces the template hero image area and is stacked under the copy so visitors see the file action immediately.
- Keep local privacy copy visible near the tool.
- Keep SEO support sections as TypeScale-style columns for ranking depth.

Deferred items:
- Post-change desktop/mobile screenshot review pending.
- Real HEIC sample QA pending.
- Launch status remains draft-only until review gates pass.

# Customer Experience Causality Testing

Use this reference when reviewing or implementing interactive tool sites.

## Core Principle

If the first viewport shows a calculated result, the inputs that determine that result must not be hidden by default.

Users must be able to answer:

- What does this result mean?
- Which inputs created it?
- Which fields change it?
- Why did it change?
- Why did it not change?

## What Can Be Collapsed

Safe to collapse by default:

- FAQ
- SEO guide content
- detailed explanations
- optional advanced settings
- secondary examples

Do not collapse by default:

- inputs that drive the primary result
- include/exclude switches that change the calculation scope
- required fields for the main job
- errors users must fix before the result is trustworthy

## Customer Experience Test Questions

Ask these after building or changing an interactive tool:

```text
1. Can a first-time user understand the main result in 5 seconds?
2. Can the user see which inputs determine the main result?
3. Does editing a result-driving input immediately change the main result?
4. If editing a field does not change the main result, is the distinction clear?
5. Could default example data be mistaken for a fixed or real result?
6. Does preset switching preserve user edits or clearly warn before reset?
7. Are core inputs hidden inside collapsed panels?
8. Do errors say exactly which row or field to fix?
9. Are copy/download/convert actions disabled when the result is invalid?
10. Does mobile preserve the same input-result causality?
```

## Weighted Grade Calculator Lessons

Problem:

- The first viewport showed `86.38%`, but the category weights and scores that produced it were hidden.
- Changing `Target grade` changed only the final plan, not the current grade, which made the result feel stuck.
- Preset switching reset edited rows.
- Invalid rows could still leave a partial result visible.

Fixes:

- Rename result label to clarify scope: `Current grade from included categories`.
- Open the category editor by default because it contains primary result inputs.
- Preserve per-preset user drafts.
- Do not show or copy misleading results when input is invalid.
- Show row-level errors and result-level blocking messages.

## Acceptance Tests To Add

```text
Customer Experience Causality Tests:
- Main result explains what it represents.
- Inputs that affect the main result are visible by default.
- Editing a result-driving input changes the main result.
- Editing a planner-only or secondary input does not change the current result, and the distinction is clear.
- Preset switching preserves user edits or clearly warns before reset.
- Invalid input blocks copy/export actions.
- Error messages identify the exact row or field to fix.
- Mobile layout preserves the same input-result causality.
```

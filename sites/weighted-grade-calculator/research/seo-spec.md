# SEO Specification: Weighted Grade Calculator

## 1. URL

Preferred URL:

```text
https://{canonical_host}/
```

Canonical URL:

```text
https://{canonical_host}/
```

Canonical host is not hard-coded in page components; it must come from the site pack/domain configuration.

## 2. Metadata

Title:

```text
Weighted Grade Calculator - Category Weights & Final Grade Planner
```

Meta description:

```text
Calculate your weighted course grade from category weights and scores, check missing weights, and see what you need on a final or remaining assignment.
```

H1:

```text
Weighted Grade Calculator
```

Hero subtitle:

```text
Enter your class categories, weights, and scores to see your current weighted grade and what score you need next.
```

## 3. Page Structure

```html
<header>
<main>
  <section id="hero-tool">...</section>
  <section id="examples">...</section>
  <section id="how-it-works">...</section>
  <section id="formula">...</section>
  <section id="use-cases">...</section>
  <section id="related-tools">...</section>
  <section id="faq">...</section>
</main>
<footer>
```

The tool must be visible early and the page must not bury the core task under long SEO copy.

## 4. Content Blocks

### Intro

Write 80-120 words explaining that weighted grades use category percentages such as homework, quizzes, exams, labs, and finals. Mention that the calculator checks whether weights add to 100% and can estimate the score needed on remaining work.

### How it works

Explain in 3 concise steps:

1. Add each grade category and its course weight.
2. Enter your current score for each category.
3. Review your weighted grade, then test a target grade with the final/remaining score planner.

### Formula

Show the visible formula:

```text
Weighted grade = (score1 x weight1 + score2 x weight2 + ... ) / total included weight
```

When weights total 100%, the denominator is 100. If only completed categories are entered, explain that the result is a current-grade estimate for the entered weights.

### Examples

Provide at least 5 realistic examples:

- Homework 20%, quizzes 15%, tests 45%, final 20%.
- Lab course with labs 30%, exams 50%, participation 10%, final 10%.
- Final-heavy class where the final is 40%.
- Underweight example where only completed categories are known.
- Target-grade example where a student wants an 90% overall.

### Use cases

Provide 4-6 practical use cases:

- Estimate current grade before the final.
- Check what final score is needed for an A or B.
- Compare category performance.
- Convert a syllabus weighting table into a grade estimate.
- Plan study priorities.

### FAQ

Include 5-8 concise FAQ items:

- How do I calculate a weighted grade?
- What if my weights do not add to 100%?
- Are blank grades counted as zero?
- How do I calculate what I need on my final?
- Can I use points instead of percentages?
- Does this save my grades?
- Is this the same as GPA?

## 5. Internal Links

Related tools:

- final grade calculator
- GPA calculator
- percentage calculator
- average calculator

Hub page:

- education calculators

If these destinations do not exist yet, record them as future internal links rather than hard-coding broken links.

## 6. Structured Data

Use JSON-LD only if the content is visible on the page.

Recommended candidates:

- WebApplication or SoftwareApplication for the calculator.
- FAQPage if the FAQ is visible.
- BreadcrumbList if a hierarchy exists.

Do not add fake reviews, fake ratings, hidden FAQ, or misleading schema.

## 7. Indexing

Draft requirement:

```yaml
lifecycle:
  status: draft
indexing:
  allowIndex: false
  mode: disallow
```

Launch requirement:

- Content reviewed.
- Tool behavior tested.
- SEO audit passes P0.
- Performance audit has no severe regression.
- UI similarity risk reviewed.
- Canonical domain is configured.
- Explicit indexing approval is recorded.

## Evidence Used

- Bing Webmaster Top 5 uses calculator pages with formula/support content, confirming the need for both interactive utility and visible explanation.
- No exact-match root-domain occupation in Top 5, so a focused content + tool page is viable.

## Decisions Made

- Use exact-match H1 and metadata, but keep copy natural.
- Treat examples and FAQ as SEO-critical static content.
- Keep related links as future requirements if target pages are unavailable.

## Implementation Implications

- Site content should include formula, examples, use cases, FAQ, and privacy note in static MDX/content.
- The interactive calculator island should not be the only source of SEO-critical text.

## Deferred Items

- Canonical host is deferred until domain/site config exists. Missing evidence: selected production domain. Impact: draft remains non-indexable. Next action: configure domain before launch review.

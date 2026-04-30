# SEO Specification: {tool_name}

## 1. URL

Preferred URL:

```text
https://{canonical_host}/
```

Canonical URL:

```text
https://{canonical_host}/
```

## 2. Metadata

Title:

```text
{primary_keyword_title_case} - {main_benefit} | {brand_name}
```

Meta description:

```text
{clear_140_to_160_character_description_focused_on_the_user_task}
```

H1:

```text
{primary_keyword_title_case}
```

Hero subtitle:

```text
{one_sentence_explaining_what_the_tool_does_and_why_it_is_useful}
```

## 3. Page Structure

```html
<header>
<main>
  <section id="hero">...</section>
  <section id="tool">...</section>
  <section id="examples">...</section>
  <section id="how-it-works">...</section>
  <section id="use-cases">...</section>
  <section id="related-tools">...</section>
  <section id="faq">...</section>
</main>
<footer>
```

The exact block order can vary by layout recipe, but the tool must be visible early and the page must not bury the core task under long SEO copy.

## 4. Content Blocks

### Intro

Write 80-120 words. Explain the tool naturally. Do not keyword-stuff.

### How it works

Explain in 3 concise steps.

### Examples

Provide at least 5 realistic examples.

### Use cases

Provide 4-6 practical use cases.

### FAQ

Include 5-8 concise FAQ items based on real user intent.

## 5. Internal Links

Related tools:

-
-
-

Hub page:

-

## 6. Structured Data

Use JSON-LD only if the content is visible on the page.

Recommended candidates:

- WebSite
- WebPage
- SoftwareApplication or WebApplication
- FAQPage if FAQ is visible
- BreadcrumbList if there is a hierarchy

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
- Tool tested.
- SEO audit passes P0.
- Performance audit has no severe regression.
- UI similarity risk reviewed.
- Canonical domain is configured.

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
  <nav>
    <a href="/">Home</a>
    <a href="/faq/">FAQ</a>
    <a href="/contact/">Contact</a>
  </nav>
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
  <a href="/about/">About</a>
  <a href="/contact/">Contact</a>
  <a href="/privacy/">Privacy</a>
  <a href="/faq/">FAQ</a>
  <a href="/calculation-method/">Calculation method</a>
```

The exact block order can vary by layout recipe, but the tool must be visible early and the page must not bury the core task under long SEO copy.

For indexable real-domain sites, use `references/trust-navigation-template.md`. Header/footer links should point to real pages, not only same-page anchors, unless the user explicitly approves a single-page microsite.

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

Also create a standalone `/faq/` page when the site is live/indexable. The homepage may include a compact FAQ block, but avoid duplicate content slug conflicts.

### Trust pages

For live/indexable sites, create `/about/`, `/contact/`, `/privacy/`, `/faq/`, and `/calculation-method/`.

Each page needs unique metadata, H1, visible content, canonical URL, and sitemap inclusion.

## 5. Internal Links

Header links:

- `/faq/`
- `/contact/`

Footer trust links:

- `/about/`
- `/contact/`
- `/privacy/`
- `/faq/`
- `/calculation-method/`

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
- Sitemap includes all approved indexable pages.
- Header/footer trust links resolve to 200 pages.
- Google SEO review is complete using `references/google-seo-review.md`.

## 8. Google SEO Review Planning

Before build, prevent:

- unclear keyword intent
- thin content
- missing trust pages
- header/footer links that are only anchors when real pages are expected
- decorative/dynamic values used as headings
- unsupported structured data
- pages.dev canonical
- accidental indexing before launch approval

After build, inspect:

- generated HTML metadata
- H1/H2/H3 hierarchy
- robots and noindex state
- sitemap URLs
- structured data output
- 200/301 status codes
- mobile rendering
- Core Web Vitals risk

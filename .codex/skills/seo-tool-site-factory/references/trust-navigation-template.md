# Trust Navigation Template

Use this reference when a utility site is moving from draft/noindex to a real-domain, indexable site.

The `weighted-grade-calculator` launch established this trust/navigation pattern:

- real support pages, not only same-page anchors
- header links for FAQ and Contact
- footer links for About, Contact, Privacy, FAQ, and Calculation method
- sitemap includes the homepage plus support pages
- support pages use the same site visual language without changing the main tool UI

## Required Support Pages

For indexable utility sites, create these pages unless the user explicitly requests a single-page site:

```text
sites/<site-id>/content/<locale>/pages/about.mdx
sites/<site-id>/content/<locale>/pages/contact.mdx
sites/<site-id>/content/<locale>/pages/privacy.mdx
sites/<site-id>/content/<locale>/pages/faq.mdx
sites/<site-id>/content/<locale>/pages/calculation-method.mdx
```

Recommended public routes:

```text
/about/
/contact/
/privacy/
/faq/
/calculation-method/
```

Each page should have:

- unique title
- unique meta description
- `index: true` only when the site is approved for indexing
- `contentStatus: approved` only after review
- H1 from layout, then H2/H3 content sections
- no duplicate slug conflicts with home block content files

If the homepage also renders a compact FAQ block from `content/<locale>/faq.mdx`, avoid duplicate route slugs by using a non-route slug such as:

```yaml
slug: "home-faq"
```

The standalone FAQ page should use:

```yaml
slug: "faq"
```

## Header Links

Recommended live-site header links:

```yaml
chrome:
  headerLinks:
    - label: FAQ
      href: /faq/
    - label: Contact
      href: /contact/
```

Keep header links minimal. Do not crowd the tool-first first viewport.

## Footer Links

Recommended live-site footer links:

```yaml
chrome:
  footerLinks:
    - label: About
      href: /about/
    - label: Contact
      href: /contact/
    - label: Privacy
      href: /privacy/
    - label: FAQ
      href: /faq/
    - label: Calculation method
      href: /calculation-method/
```

Footer links should resolve to real pages and return 200 in local dev and production.

## Page Content Guidance

### About

Explain:

- what the tool does
- who it is for
- what it is best for
- what it does not replace
- privacy-first design when applicable

### Privacy

Explain:

- what raw input is not collected
- whether processing is local or server-side
- analytics safe-field policy
- contact path for privacy questions

### Contact

Include:

- contact email or contact method
- what details help diagnose tool issues
- what the site cannot verify or support

### FAQ

Follow the SEO spec:

- 5-8 concise FAQ items
- real user-intent questions
- no hidden FAQ schema for invisible content
- no duplicated generic answers

### Calculation Method

Explain:

- formula or algorithm
- current result vs final estimate distinction
- blank/missing input handling
- excluded row handling
- limitations such as rounding, extra credit, dropped scores, school-specific rules, file limits, or parser limitations

## Structured Data

Support pages should use WebPage JSON-LD by default.

Only add richer schema when:

- the content is visible
- the schema type is supported by Google guidelines
- the claims are verifiable

## Acceptance Checks

After implementation:

```bash
pnpm site check <site-id>
pnpm seo audit <site-id>
pnpm site build <site-id>
```

Then verify generated output:

- `/about/`, `/contact/`, `/privacy/`, `/faq/`, and `/calculation-method/` return 200.
- Header contains FAQ and Contact links when configured.
- Footer contains all support links.
- `sitemap.xml` includes all approved support pages.
- No duplicate content slugs exist.

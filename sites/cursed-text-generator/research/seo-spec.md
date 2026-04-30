# SEO Specification: Cursed Text Generator

## 1. URL

Preferred URL:

```text
https://cursed-text-generator.com/
```

Canonical URL:

```text
https://cursed-text-generator.com/
```

Current draft host:

```text
https://seo-tool-cursed-text-generator.pages.dev/
```

## 2. Metadata

Title:

```text
Cursed Text Generator - Glitch, Zalgo & Creepy Text
```

Meta description:

```text
Create cursed, glitchy, Zalgo-style text instantly. Adjust intensity, copy the result, or clean cursed text back to normal in your browser.
```

H1:

```text
Cursed Text Generator
```

Hero subtitle:

```text
Turn normal text into creepy, glitchy Unicode text with live presets, advanced controls, and one-click copy.
```

## 3. Page Structure

```html
<header>
<main>
  <section id="hero">...</section>
  <section id="tool">...</section>
  <section id="examples">...</section>
  <section id="how-it-works">...</section>
  <section id="platform-notes">...</section>
  <section id="accessibility-note">...</section>
  <section id="related-tools">...</section>
  <section id="faq">...</section>
</main>
<footer>
```

The tool must appear before long explanatory content. Do not place article copy above the primary input.

## 4. Content Blocks

### Intro

Write 80-120 words. Explain that cursed text, glitch text, hacked text, void text, and Zalgo text are made by stacking Unicode combining marks. Mention that the tool runs locally, offers live preview, intensity presets, and cleanup.

### How it works

Explain in 3 steps:

1. Type or paste normal text.
2. Choose light, medium, heavy, or advanced top/middle/bottom settings.
3. Copy the cursed text, or use clean mode to strip combining marks.

### Examples

Provide at least 5 realistic before/after examples:

- spooky username
- Discord message
- Halloween post
- ARG clue
- subtle bio text
- clean mode example

### Use cases

Provide 4-6 practical use cases:

- Discord messages and usernames
- TikTok or Instagram bios
- horror fiction and creepypasta
- Halloween posts
- memes and comments
- ARG or game clues

### FAQ

Include 7 concise FAQ items:

1. What is cursed text?
2. Is cursed text the same as Zalgo text?
3. Does cursed text work on Discord, TikTok, Instagram, and Reddit?
4. Why does cursed text look different on different devices?
5. Can cursed text break apps or websites?
6. Can I remove cursed text and get normal text back?
7. Is my text private?

## 5. Internal Links

Related tools:

- glitch text generator
- zalgo text generator
- fancy text generator
- upside down text generator
- small text generator
- text cleaner

Hub page:

- text generators or text tools hub when available

If those sites/pages do not exist yet, list them as future internal-link targets in the implementation summary instead of hard-coding broken links.

## 6. Structured Data

Use JSON-LD only if the content is visible on the page.

Recommended:

- WebSite
- WebPage
- SoftwareApplication or WebApplication
- FAQPage if FAQ is visible
- BreadcrumbList only if hierarchy is rendered

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
- Bing Webmaster competitor top 5 captured.
- Tool behavior tested.
- SEO audit has no P0 issues.
- Content lint has no P0 issues.
- Performance audit has no severe regression.
- UI similarity risk reviewed.
- Canonical domain is configured.

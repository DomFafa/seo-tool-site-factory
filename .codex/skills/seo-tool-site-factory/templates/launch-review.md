# Launch Review: {tool_name}

## 1. Review Metadata

- Site ID: {site_id}
- Primary keyword: {primary_keyword}
- Category: {category}
- Locale: {locale}
- Market: {market}
- Review date:
- Reviewer:
- Mode: launch-review

## 2. Readiness Dashboard

| Item | Status | Evidence | Notes |
|---|---|---|---|
| Research evidence | pending / passed / blocked |  |  |
| Bing Webmaster top 5 | captured / blocked-with-evidence / not-attempted / user-approved-skip |  |  |
| Research completion | pending / passed / blocked |  |  |
| Design plan | pending / passed / deferred |  |  |
| UI implementation | pending / passed / partial |  |  |
| Browser QA | pending / passed / deferred |  |  |
| Interaction QA | pending / passed / deferred |  |  |
| Performance | pending / passed / deferred |  |  |
| SEO audit | pending / passed / failed |  |  |
| Content lint | pending / passed / failed |  |  |
| Google SEO review | pending / passed / failed |  |  |
| Trust pages | pending / passed / deferred |  |  |
| Domain contact email | pending / passed / failed / not-applicable |  |  |
| Header/footer navigation | pending / passed / failed |  |  |
| UI similarity audit | pending / passed / warning / failed |  |  |
| Research trace | pending / passed / blocked |  |  |
| Scope drift | pending / clean / out-of-scope-dirty-files |  |  |
| Indexing | draft-noindex / approved-to-index |  |  |
| Launch status | DRAFT_ONLY / READY_FOR_REVIEW / READY_TO_INDEX |  |  |

## 3. Scores

- Research readiness:
- Design specificity:
- Launch readiness:

Score caps applied:

-

## 4. Validation Commands

| Command | Result | Evidence |
|---|---|---|
| `pnpm site research-audit {site_id}` |  |  |
| `pnpm site trace-audit {site_id}` |  |  |
| `pnpm site check {site_id}` |  |  |
| `pnpm site build {site_id}` |  |  |
| `pnpm seo audit {site_id}` |  |  |
| `pnpm seo lint-content {site_id}` |  |  |
| `pnpm perf audit {site_id}` |  |  |
| `pnpm site ui-audit {site_id}` |  |  |
| `pnpm site launch-review {site_id}` |  |  |

## 5. Google SEO Review

Use `references/google-seo-review.md`.

### Preventable Before Build

| Check | Passed? | Evidence / notes |
|---|---|---|
| Keyword intent and title/H1/meta alignment |  |  |
| Useful original content planned |  |  |
| Trust pages planned |  |  |
| Header/footer navigation planned |  |  |
| Semantic heading plan avoids decorative result headings |  |  |
| Structured data claims are visible/verifiable |  |  |
| Canonical/indexing/redirect plan defined |  |  |

### After Build / Deploy

| Check | Passed? | Evidence / notes |
|---|---|---|
| Generated HTML metadata inspected |  |  |
| H1/H2/H3 hierarchy inspected |  |  |
| noindex state inspected |  |  |
| sitemap includes approved pages |  |  |
| structured data output inspected |  |  |
| support pages return 200 |  |  |
| www/pages.dev redirect status checked |  |  |
| mobile rendering checked |  |  |
| Core Web Vitals / performance checked |  |  |

## 6. Trust Pages And Navigation

Use `references/trust-navigation-template.md`.

| Page / Link | Expected URL | Status | Evidence |
|---|---|---|---|
| About | `/about/` |  |  |
| Contact | `/contact/` |  |  |
| Privacy | `/privacy/` |  |  |
| FAQ | `/faq/` |  |  |
| Calculation method | `/calculation-method/` |  |  |
| Header FAQ | `/faq/` |  |  |
| Header Contact | `/contact/` |  |  |

### Domain Contact Email

For a confirmed real-domain launch, derive the default mailbox as `contact@{canonical_host}` unless the user supplied a same-domain mailbox.

| Check | Status | Evidence |
|---|---|---|
| Selected contact email |  |  |
| Contact page uses selected email |  |  |
| Privacy page uses selected email when contact wording exists |  |  |
| Placeholder/example emails removed |  | `rg -n "contact@example\\.com|support@example\\.com|hello@example\\.com|privacy@example\\.com|@[A-Za-z0-9.-]*example\\.com|project contact path|placeholder email" sites/{site_id}` |
| Public content email scan reviewed |  | `rg -n "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}" sites/{site_id}/content sites/{site_id}/messages` |

STOP: Do not mark `READY_TO_INDEX` while placeholder emails, generic example-domain emails, or stale off-domain contact emails remain in public content.

## 7. Browser Evidence

| Evidence | Path / result | Notes |
|---|---|---|
| Desktop screenshot |  |  |
| 390px mobile screenshot |  |  |
| Main task path |  |  |
| First viewport tool visibility |  |  |
| Console errors |  |  |

## 8. Launch Decision

- Decision: DRAFT_ONLY / READY_FOR_REVIEW / READY_TO_INDEX
- Reason:
- Required fixes before indexing:
- Explicit indexing approval recorded: yes/no

## 9. Deferred Items

| Item | Reason | Impact | Next action |
|---|---|---|---|
|  |  |  |  |

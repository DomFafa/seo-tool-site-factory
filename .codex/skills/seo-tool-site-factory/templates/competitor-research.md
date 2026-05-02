# Competitor Research: {primary_keyword}

## 1. Research Metadata

- Site ID: {site_id}
- Primary keyword: {primary_keyword}
- Category: {category}
- Locale: {locale}
- Search market: {market}
- Research date: {date}
- User job: {user_job}
- Expected action: {expected_action}

## 2. Bing Webmaster Source

Primary competitor selection must come from Bing Webmaster Tools Keyword Research.

- Companion workflow: `/Users/bin/.codex/skills/seo-demand-validation/SKILL.md`
- Browser/network workflow: `/Users/bin/.codex/skills/web-access/SKILL.md`
- Bing site URL:
- Bing date range: 3M
- Bing keyword searched: {primary_keyword}
- Data quality notes:

### Bing Webmaster Capture Attempt

Use exactly one status: `captured`, `blocked-with-evidence`, `not-attempted`, or `user-approved-skip`.

- Status:
- Attempted at:
- Attempted by: web-access CDP / manual logged-in browser / user-provided screenshot / not attempted
- Bing siteUrl:
- Exact keyword: {primary_keyword}
- Date range: 3M
- Attempted URL:
- Browser/session:
- Result:
- Blocker text:
- Screenshot or artifact path:
- User approval context if skipped:

### Bing Status Interpretation

Use this interpretation before moving to implementation:

```text
captured:
  Bing Webmaster top rows were actually read and recorded.

blocked-with-evidence:
  An actual Bing Webmaster attempt happened and failed with evidence.
  Research readiness must be <= 7.
  Implementation requires explicit fallback approval.

not-attempted:
  No actual Bing Webmaster attempt happened.
  Research readiness must be <= 3.
  Implementation is blocked unless the user asks for code-only work.

user-approved-skip:
  User explicitly approved skipping Bing Webmaster.
  Keep launch status DRAFT_ONLY until manual review.
```

### Raw Captured Top 10 Rows

Fill this table only from the Bing Webmaster `Top 10 url ranking on this keyword` table.

If the status is not `captured`, leave rows empty or mark them as unavailable. Do not fill this table from a public SERP.

| Bing rank | Title | URL | Topics | Captured? |
|---:|---|---|---|---|
| 1 |  |  |  | yes/no |
| 2 |  |  |  | yes/no |
| 3 |  |  |  | yes/no |
| 4 |  |  |  | yes/no |
| 5 |  |  |  | yes/no |
| 6 |  |  |  | yes/no |
| 7 |  |  |  | yes/no |
| 8 |  |  |  | yes/no |
| 9 |  |  |  | yes/no |
| 10 |  |  |  | yes/no |

### Required competitor selection rule

Use the `Top 10 url ranking on this keyword` table in Bing Webmaster Keyword Research. Select the first 5 rows as the required competitor set.

Do not mark Bing Webmaster as blocked unless an actual web-access/manual/user-evidence attempt was made. If there is no attempted URL, timestamp, blocker text, screenshot, or artifact, use `not-attempted`.

If Bing Webmaster is `blocked-with-evidence`, record the exact blocker and mark any replacement URLs as `fallback, not Bing Webmaster ranking`. Public SERP results are never a substitute for the Bing Webmaster top 5; they may be listed only as low-confidence fallback references.

### Evidence Used

- Bing Webmaster rows captured:
- Artifact or screenshot path:
- Fallback sources, if any:
- Confidence level:
- Evidence gaps:

### Decisions Made From Evidence

- Required competitor set:
- Fallback competitor set, if approved:
- Primary opportunity:
- Implementation implications:
- Deferred items:

## 3. Bing Webmaster Top 5 Ranking Competitors

| Bing rank | Title | URL | Topics | Included in deep review? | Exclusion reason if no |
|---:|---|---|---|---|---|
| 1 |  |  |  | yes/no |  |
| 2 |  |  |  | yes/no |  |
| 3 |  |  |  | yes/no |  |
| 4 |  |  |  | yes/no |  |
| 5 |  |  |  | yes/no |  |

## 4. Search Intent Summary

### Primary intent


### Secondary intents

-
-
-

### Non-intents

-
-
-

### Bing ranking notes

- Bing Webmaster ranking pattern:
- Dominant page types:
- Ranking small sites:
- Needs Bing Webmaster recapture: yes / no

## 5. Root-Domain Occupancy

Use `references/root-domain-occupancy.md`.

- Strong keyword-matching root domains in Bing Top 5:
- Matching domains:
  -
- Occupancy decision: open / partially occupied / occupied / heavily occupied
- Recommendation impact: recommended / caution / avoid
- Notes:

## 6. Competitor Snapshot

| Bing rank | URL | Page type | Tool above fold | Core features | UX weakness | SEO weakness | Opportunity |
|---:|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |

## 7. Feature Matrix

| Feature | Rank 1 | Rank 2 | Rank 3 | Rank 4 | Rank 5 | Required for us | Our improvement |
|---|---|---|---|---|---|---|---|
| Tool above the fold |  |  |  |  |  | yes |  |
| Live preview |  |  |  |  |  |  |  |
| Copy button |  |  |  |  |  |  |  |
| Clear/reset |  |  |  |  |  |  |  |
| Example inputs |  |  |  |  |  |  |  |
| Download/export |  |  |  |  |  |  |  |
| Mobile UX |  |  |  |  |  |  |  |
| Privacy note |  |  |  |  |  |  |  |
| Accessibility |  |  |  |  |  |  |  |
| Edge-case handling |  |  |  |  |  |  |  |

## 8. UX Teardown

### Common winning patterns

-
-
-

### Common friction

-
-
-

### Fastest user path found

1.
2.
3.

### Our must-win UX decisions

- Tool must appear above the fold.
- Core task must not require login.
- Copy action must be visible and reliable.
- Example chips must help users start quickly.
- Mobile layout must avoid horizontal scrolling.
- Ads must not appear near primary actions.

## 9. SEO Teardown

| SEO item | Competitor pattern | Gap | Our requirement |
|---|---|---|---|
| Title |  |  |  |
| Meta description |  |  |  |
| H1 |  |  |  |
| Intro copy |  |  |  |
| How it works |  |  |  |
| Examples |  |  |  |
| FAQ |  |  |  |
| Internal links |  |  |  |
| Schema |  |  |  |
| Canonical/indexing |  |  |  |

## 10. Technical Observations

| Area | Competitor issue | Our requirement |
|---|---|---|
| Load speed |  |  |
| Client JS |  |  |
| Mobile layout |  |  |
| Accessibility |  |  |
| Privacy |  |  |
| Edge cases |  |  |

## 10. Optional Reference Competitors

Add adjacent-intent or best-in-class UX references only after the Bing Webmaster top 5 are recorded.

| Source keyword / reason | URL | Why included | What to borrow | What to avoid |
|---|---|---|---|---|
|  |  |  |  |  |

## 11. Differentiation Strategy

### Product differentiation


### UX differentiation


### Content differentiation


### Technical differentiation


## 12. Build Requirements From Research

### Required features

-
-
-

### Required content sections

-
-
-

### Required edge cases

-
-
-

### Required layout decisions

-
-
-

### Required tests

-
-
-

### Research-to-build trace

| Evidence | Decision | Implementation requirement |
|---|---|---|
|  |  |  |

## 13. Risks

### SEO risks

-

### UX risks

-

### Maintenance risks

-

### Safety/privacy risks

-

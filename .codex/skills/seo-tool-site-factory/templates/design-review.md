# Design Review: {tool_name}

## 1. Review Metadata

- Site ID: {site_id}
- Primary keyword: {primary_keyword}
- Category: {category}
- Locale: {locale}
- Market: {market}
- Review date: {date}
- Reviewer:
- Source design file: `sites/{site_id}/research/design-direction.md`
- Review phase: pre-implementation plan review / post-UI visual QA
- UI implementation reviewed: yes/no
- Local URL:
- Browser tool used:

## 2. Scope

UI areas reviewed:

- Above-the-fold tool experience
- Tool states
- Mobile layout
- SEO content layout
- Related tools / internal links
- Footer and trust signals

Not in scope:

-

## 3. Evidence And Gate Status

### Design Skills Used

| Skill | Used? | Evidence / notes |
|---|---|---|
| design-consultation | yes/no |  |
| design-shotgun | yes/no/not-needed |  |
| plan-design-review | yes/no |  |
| frontend-design | yes/no |  |
| design-review | yes/no |  |
| qa-only | yes/no/not-needed |  |
| qa | yes/no/not-needed |  |
| benchmark | yes/no/deferred |  |

### Browser Evidence

Post-UI visual review is not complete without evidence from the built page.

| Evidence | Path / value | Notes |
|---|---|---|
| Desktop screenshot |  |  |
| 390px mobile screenshot |  |  |
| Local URL |  |  |
| Viewports checked |  |  |
| First viewport tool visibility |  |  |
| Main task path tested |  |  |
| Console errors |  |  |

### Gate Result

- Pre-implementation plan review completed: yes/no
- Post-UI design review completed: yes/no
- Browser/screenshot evidence captured: yes/no
- Interaction QA mode: qa / qa-only / not-needed / deferred
- If deferred, blocker:
- Launch readiness cap from this review:

Scoring caps:

- Missing/deferred pre-implementation plan review for meaningful UI work: `Design specificity <= 5`.
- Missing post-UI browser/screenshot evidence: `Launch readiness <= 5`.
- Missing post-UI `gstack-design-review` for a new UI-bearing site: `Launch readiness <= 4`.

## 4. Overall Design Score

- Initial score:
- Final score:
- Reason:

What would make this a 10/10:

-

## 5. Information Architecture

| Area | Score | Finding | Fix |
|---|---:|---|---|
| First viewport hierarchy |  |  |  |
| Tool controls |  |  |  |
| SEO content sequence |  |  |  |
| Related links |  |  |  |

## 6. Interaction States

| Feature | Empty | Input | Loading / long input | Error | Success |
|---|---|---|---|---|---|
| Primary tool |  |  |  |  |  |
| Copy action |  |  |  |  |  |
| Example chips |  |  |  |  |  |

## 7. User Journey

| Step | User does | User should feel | Design support |
|---|---|---|---|
| 1 | Lands on page |  |  |
| 2 | Enters input |  |  |
| 3 | Reviews output |  |  |
| 4 | Copies or uses result |  |  |
| 5 | Reads extra guidance if needed |  |  |

## 8. First Viewport And Responsive Findings

| Check | Desktop result | 390px mobile result | Fix required |
|---|---|---|---|
| Tool visible before excessive scroll |  |  |  |
| Primary input visible |  |  |  |
| Main action visible |  |  |  |
| No overlapping text/UI |  |  |  |
| Result area stable |  |  |  |
| Content hierarchy clear |  |  |  |

## 9. AI Slop / Template Risk

| Risk | Present? | Fix |
|---|---|---|
| Generic centered hero |  |  |
| Three-card feature grid |  |  |
| Decorative icon circles |  |  |
| Purple/blue gradient default |  |  |
| Reused block rhythm |  |  |
| Vague marketing copy |  |  |

## 10. Design System Alignment

- Existing `DESIGN.md` used:
- Cluster design reused:
- Site-specific deviations:
- Reason deviations are justified:

## 11. Responsive And Accessibility Review

| Requirement | Decision | Open issue |
|---|---|---|
| 390px mobile first viewport |  |  |
| Touch targets |  |  |
| Keyboard operation |  |  |
| Visible focus |  |  |
| Screen reader feedback |  |  |
| Color contrast |  |  |

## 12. Approved Mockups / Boards

| Artifact | Path / URL | Decision | Notes |
|---|---|---|---|
|  |  |  |  |

## 13. Required Plan Changes Before Implementation

-

## 14. Deferred Decisions

| Decision | Why deferred | Missing evidence | Impact | Next action |
|---|---|---|---|---|
|  |  |  |  |  |

## 15. Post-UI Fix Log

| Finding | Evidence | Fix applied | Remaining risk |
|---|---|---|---|
|  |  |  |  |

## 16. Implementation Notes

Changes that must be reflected in:

- `sites/{site_id}/layout.config.yaml`:
- `sites/{site_id}/theme.config.yaml`:
- `sites/{site_id}/content/{locale}/home.mdx`:
- `apps/site/src/features/<tool-id>/`:

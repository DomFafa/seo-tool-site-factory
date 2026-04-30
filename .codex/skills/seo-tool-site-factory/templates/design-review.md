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

## 3. Overall Design Score

- Initial score:
- Final score:
- Reason:

What would make this a 10/10:

-

## 4. Information Architecture

| Area | Score | Finding | Fix |
|---|---:|---|---|
| First viewport hierarchy |  |  |  |
| Tool controls |  |  |  |
| SEO content sequence |  |  |  |
| Related links |  |  |  |

## 5. Interaction States

| Feature | Empty | Input | Loading / long input | Error | Success |
|---|---|---|---|---|---|
| Primary tool |  |  |  |  |  |
| Copy action |  |  |  |  |  |
| Example chips |  |  |  |  |  |

## 6. User Journey

| Step | User does | User should feel | Design support |
|---|---|---|---|
| 1 | Lands on page |  |  |
| 2 | Enters input |  |  |
| 3 | Reviews output |  |  |
| 4 | Copies or uses result |  |  |
| 5 | Reads extra guidance if needed |  |  |

## 7. AI Slop / Template Risk

| Risk | Present? | Fix |
|---|---|---|
| Generic centered hero |  |  |
| Three-card feature grid |  |  |
| Decorative icon circles |  |  |
| Purple/blue gradient default |  |  |
| Reused block rhythm |  |  |
| Vague marketing copy |  |  |

## 8. Design System Alignment

- Existing `DESIGN.md` used:
- Cluster design reused:
- Site-specific deviations:
- Reason deviations are justified:

## 9. Responsive And Accessibility Review

| Requirement | Decision | Open issue |
|---|---|---|
| 390px mobile first viewport |  |  |
| Touch targets |  |  |
| Keyboard operation |  |  |
| Visible focus |  |  |
| Screen reader feedback |  |  |
| Color contrast |  |  |

## 10. Approved Mockups / Boards

| Artifact | Path / URL | Decision | Notes |
|---|---|---|---|
|  |  |  |  |

## 11. Required Plan Changes Before Implementation

-

## 12. Deferred Decisions

| Decision | Why deferred | Risk |
|---|---|---|
|  |  |  |

## 13. Implementation Notes

Changes that must be reflected in:

- `sites/{site_id}/layout.config.yaml`:
- `sites/{site_id}/theme.config.yaml`:
- `sites/{site_id}/content/{locale}/home.mdx`:
- `apps/site/src/features/<tool-id>/`:

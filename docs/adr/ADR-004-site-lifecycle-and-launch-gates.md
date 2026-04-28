# ADR-004 — Site Lifecycle and Launch Gates

Status: Accepted

## Decision

A site is not launchable just because it builds. Each site must progress through lifecycle states and pass gates.

Lifecycle:

```txt
draft -> validated -> preview -> indexable -> monetizable -> launched
```

## Rationale

The factory creates many SEO/ads-sensitive sites. Without lifecycle and gates, draft pages, thin content, invalid hreflang, misleading ads, or privacy issues could ship accidentally.

## Consequences

- Draft defaults to noindex and ads disabled.
- Indexable requires SEO/content gates.
- Monetizable requires ads/content gates.
- Production deploy requires verification.

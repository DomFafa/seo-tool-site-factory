# ADR-002 — Cloudflare Workers with OpenNext

Status: Accepted

## Decision

Use Cloudflare Workers with the OpenNext adapter as the default v1 deployment target.

## Rationale

The factory needs Next.js App Router, metadata generation, dynamic routes, potential API routes, Turnstile, Analytics Engine, and future KV/D1/R2 bindings. Workers with OpenNext is the most flexible default for this combination.

References:

- https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- https://opennext.js.org/cloudflare

## Consequences

- Deployment automation wraps OpenNext and Wrangler.
- Cloudflare Pages may be considered later for static-only sites but is not the default.
- Worker bindings/secrets must be managed per site.

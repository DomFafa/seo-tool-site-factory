# Official References and Source Notes

Generated: 2026-04-28

This file collects external references used to design the SEO Tool Site Factory. Prefer official documentation over blog posts whenever implementing or changing policy-sensitive behavior.

| Source | URL | Why it matters |
|---|---|---|
| Next.js sitemap.xml metadata file convention | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap | Use app/sitemap.ts as integration point for deterministic sitemap generation. |
| Next.js robots.txt metadata file convention | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots | Use app/robots.ts as integration point for robots rules and sitemap pointer. |
| Cloudflare Workers guide for Next.js | https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ | Official Cloudflare guidance for deploying Next.js to Workers with OpenNext adapter. |
| OpenNext Cloudflare adapter | https://opennext.js.org/cloudflare | Adapter transforms Next.js build output into a Cloudflare Workers-compatible deployment. |
| Google Search spam policies | https://developers.google.com/search/docs/essentials/spam-policies | Source for scaled content abuse, doorway abuse, misleading functionality, expired domain abuse, and link spam risk controls. |
| Google helpful, reliable, people-first content | https://developers.google.com/search/docs/fundamentals/creating-helpful-content | Source for content quality gates and anti-search-engine-first content policy. |
| Google localized versions and hreflang | https://developers.google.com/search/docs/specialty/international/localized-versions | Source for hreflang requirements and localized page relationships. |
| Google managing multi-regional and multilingual sites | https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites | Source for using distinct URLs per language and hreflang annotations. |
| Google structured data general guidelines | https://developers.google.com/search/docs/appearance/structured-data/sd-policies | Source for JSON-LD policy and structured data eligibility constraints. |
| AdSense ad placement policies | https://support.google.com/adsense/answer/1346295?hl=en | Source for ad placement rules: no misleading labels, no confusing ads with content or controls. |
| Google Publisher Policies | https://support.google.com/adsense/answer/10502938?hl=en | Source for low-value content, under-construction pages, replicated content and inventory value constraints. |
| Cloudflare Turnstile server-side validation | https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ | Source for Turnstile token validation requirement; client widget alone is insufficient. |
| Cloudflare Workers secrets | https://developers.cloudflare.com/workers/configuration/secrets/ | Source for secrets handling and sensitive data guidance. |
| Cloudflare Workers Analytics Engine | https://developers.cloudflare.com/analytics/analytics-engine/ | Source for custom tool event analytics from Workers. |
| next-intl App Router docs | https://next-intl.dev/docs/getting-started/app-router | Reference for Next.js App Router i18n with translations, formatting, and routing. |
| next-intl routing docs | https://next-intl.dev/docs/routing | Reference for locale routing and middleware/proxy integration. |
| LanguageTool Proofreading API | https://languagetool.org/proofreading-api | Recommended provider for correcteur d'orthographe MVP or backend integration. |
| LanguageTool public HTTP API | https://dev.languagetool.org/public-http-api.html | Reference for basic HTTP endpoint and request pattern if using public API. |
| heic2any npm package | https://www.npmjs.com/package/heic2any | Browser-side HEIC/HEIF to JPEG/PNG/GIF conversion candidate; dynamically import due bundle risk. |
| browser-image-compression npm package | https://www.npmjs.com/package/browser-image-compression | Client-side image compression candidate for image conversion tools. |
| word-list npm package | https://www.npmjs.com/package/word-list | English word list candidate for anagram solver indexing. |

## Source-of-truth rule

When implementation behavior conflicts with these notes, the current official documentation should win. Re-check official documentation before changing deployment, SEO, ad, or security-sensitive behavior.

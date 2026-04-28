# SEO Regression Checklist

Run these after every SEO-related change:

- [ ] `pnpm site check --all`
- [ ] `pnpm site build typing-speed-test`
- [ ] `pnpm site build convert-image-to-png`
- [ ] selected-site sitemap contains only selected-site URLs
- [ ] selected-site robots points to selected-site sitemap
- [ ] canonical host matches selected site
- [ ] hreflang alternates include self and real localized variants
- [ ] noindex pages excluded from sitemap
- [ ] structured data is visible-content-consistent
- [ ] no cross-site content leakage in built output

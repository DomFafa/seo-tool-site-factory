import type { ContentDocument, SiteContext } from '@factory/site-core';
import { getEnabledLocales, getIndexableLocales } from '@factory/site-core';
import { getBaseUrl, getGuideUrl, getLocaleHomeUrl } from './urls';

type PageInput = {
  locale: string;
  page: ContentDocument;
  pageType: 'home' | 'guide';
  slug?: string;
};

export function buildPageSeo(ctx: SiteContext, input: PageInput) {
  const { locale, page, pageType, slug } = input;
  const title = page.frontmatter.title || ctx.siteConfig.seo.defaultTitle;
  const description = page.frontmatter.description || ctx.siteConfig.seo.defaultDescription;
  const canonical = pageType === 'guide' && slug ? getGuideUrl(ctx, locale, slug) : getLocaleHomeUrl(ctx, locale);
  const indexableLocales = getIndexableLocales(ctx);
  const pageIndexAllowed = ctx.siteConfig.lifecycle.status === 'live' && ctx.siteConfig.indexing.allowIndex && page.frontmatter.index && page.frontmatter.contentStatus === 'approved' && indexableLocales.includes(locale);
  const alternates = getEnabledLocales(ctx).map((altLocale) => ({
    hreflang: altLocale,
    href: pageType === 'guide' && slug ? getGuideUrl(ctx, altLocale, slug) : getLocaleHomeUrl(ctx, altLocale)
  }));
  alternates.push({ hreflang: 'x-default', href: getLocaleHomeUrl(ctx, ctx.siteConfig.seo.xDefaultLocale ?? ctx.siteConfig.defaultLocale) });

  const jsonLd = pageType === 'guide'
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        dateModified: page.frontmatter.lastModified,
        mainEntityOfPage: canonical
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: ctx.siteConfig.brandName,
        description,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Any',
        url: canonical
      };

  return {
    title,
    description,
    canonical,
    homeUrl: getLocaleHomeUrl(ctx, locale),
    noindex: !pageIndexAllowed,
    alternates,
    jsonLd
  };
}

export function buildSiteJsonLd(ctx: SiteContext) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ctx.siteConfig.brandName,
    url: getBaseUrl(ctx)
  };
}

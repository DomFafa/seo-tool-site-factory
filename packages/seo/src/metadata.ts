import type { ContentDocument, SiteContext } from '@factory/site-core';
import { getIndexableLocales, isIndexingEnabled } from '@factory/site-core';
import { getBaseUrl, getGuideUrl, getLocaleHomeUrl } from './urls';

type PageInput = { locale: string; page: ContentDocument; pageType: 'home' | 'guide'; slug?: string };

function structuredDataEnabled(ctx: SiteContext, type: string): boolean {
  return (ctx.siteConfig.seo.structuredData ?? []).includes(type as never);
}

export function getOgImageUrl(ctx: SiteContext): string | undefined {
  const config = ctx.siteConfig.seo.ogImage;
  if (!config || config.mode === 'none') return undefined;
  const path = config.path || '/og-image.svg';
  return new URL(path, getBaseUrl(ctx)).toString();
}

export function buildPageSeo(ctx: SiteContext, input: PageInput) {
  const { locale, page, pageType, slug } = input;
  const title = page.frontmatter.title || ctx.siteConfig.seo.defaultTitle;
  const description = page.frontmatter.description || ctx.siteConfig.seo.defaultDescription;
  const canonical = pageType === 'guide' && slug ? getGuideUrl(ctx, locale, slug) : getLocaleHomeUrl(ctx, locale);
  const indexableLocales = getIndexableLocales(ctx);
  const pageIndexAllowed = isIndexingEnabled(ctx) && page.frontmatter.index && page.frontmatter.contentStatus === 'approved' && indexableLocales.includes(locale);
  const hreflangLocales = pageIndexAllowed ? indexableLocales : [locale];
  const alternates = hreflangLocales.map((altLocale) => ({ hreflang: altLocale, href: pageType === 'guide' && slug ? getGuideUrl(ctx, altLocale, slug) : getLocaleHomeUrl(ctx, altLocale) }));
  const configuredDefault = ctx.siteConfig.seo.xDefaultLocale ?? ctx.siteConfig.defaultLocale;
  const xDefaultLocale = hreflangLocales.includes(configuredDefault) ? configuredDefault : locale;
  alternates.push({ hreflang: 'x-default', href: pageType === 'guide' && slug ? getGuideUrl(ctx, xDefaultLocale, slug) : getLocaleHomeUrl(ctx, xDefaultLocale) });

  const jsonLd: Array<Record<string, unknown>> = [];
  if (structuredDataEnabled(ctx, 'WebSite')) jsonLd.push(buildSiteJsonLd(ctx));
  if (structuredDataEnabled(ctx, 'WebPage')) jsonLd.push({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical, inLanguage: locale });
  if (pageType === 'guide' && structuredDataEnabled(ctx, 'Article')) jsonLd.push({ '@context': 'https://schema.org', '@type': 'Article', headline: title, description, dateModified: page.frontmatter.lastModified, mainEntityOfPage: canonical, inLanguage: locale });
  if (pageType === 'home' && structuredDataEnabled(ctx, 'SoftwareApplication')) jsonLd.push({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: ctx.siteConfig.brandName, description, applicationCategory: 'WebApplication', operatingSystem: 'Any', url: canonical });

  return { title, description, canonical, homeUrl: getLocaleHomeUrl(ctx, locale), noindex: !pageIndexAllowed, alternates, jsonLd, ogImage: getOgImageUrl(ctx) };
}

export function buildSiteJsonLd(ctx: SiteContext) {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: ctx.siteConfig.brandName, url: getBaseUrl(ctx) };
}

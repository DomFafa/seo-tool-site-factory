import type { SiteContext } from '@factory/site-core';

export function getBaseUrl(ctx: SiteContext): string {
  return `https://${ctx.siteConfig.domains.canonicalHost}`;
}

export function getLocaleHomePath(ctx: SiteContext, locale: string): string {
  return locale === ctx.siteConfig.defaultLocale ? '/' : `/${locale}/`;
}

export function getLocaleHomeUrl(ctx: SiteContext, locale: string): string {
  return new URL(getLocaleHomePath(ctx, locale), getBaseUrl(ctx)).toString();
}

export function getGuidePath(ctx: SiteContext, locale: string, slug: string): string {
  return locale === ctx.siteConfig.defaultLocale ? `/guide/${slug}/` : `/${locale}/guide/${slug}/`;
}

export function getGuideUrl(ctx: SiteContext, locale: string, slug: string): string {
  return new URL(getGuidePath(ctx, locale, slug), getBaseUrl(ctx)).toString();
}

export function getPagePath(ctx: SiteContext, locale: string, slug: string): string {
  return locale === ctx.siteConfig.defaultLocale ? `/${slug}/` : `/${locale}/${slug}/`;
}

export function getPageUrl(ctx: SiteContext, locale: string, slug: string): string {
  return new URL(getPagePath(ctx, locale, slug), getBaseUrl(ctx)).toString();
}

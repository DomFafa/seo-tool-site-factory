import { getIndexableLocales, listGuideContent, listPageContent, loadHomeContent, type SiteContext } from '@factory/site-core';
import { getBaseUrl, getGuideUrl, getLocaleHomeUrl, getPageUrl } from './urls';

export type SitemapEntry = { loc: string; lastmod: string; type: 'home' | 'guide' | 'page' | 'tool' };

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function getSitemapEntries(ctx: SiteContext): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const sitemapConfig = ctx.siteConfig.seo.sitemap;
  for (const locale of getIndexableLocales(ctx)) {
    if (sitemapConfig.includeHome) {
      const home = await loadHomeContent(ctx, locale);
      if (home.frontmatter.index && home.frontmatter.contentStatus === 'approved') entries.push({ loc: getLocaleHomeUrl(ctx, locale), lastmod: home.frontmatter.lastModified, type: 'home' });
    }
    if (sitemapConfig.includeGuides) {
      const guides = await listGuideContent(ctx, locale);
      for (const guide of guides) {
        if (guide.frontmatter.index && guide.frontmatter.contentStatus === 'approved') entries.push({ loc: getGuideUrl(ctx, locale, guide.frontmatter.slug), lastmod: guide.frontmatter.lastModified, type: 'guide' });
      }
    }
    const pages = await listPageContent(ctx, locale);
    for (const page of pages) {
      if (page.frontmatter.index && page.frontmatter.contentStatus === 'approved') entries.push({ loc: getPageUrl(ctx, locale, page.frontmatter.slug), lastmod: page.frontmatter.lastModified, type: 'page' });
    }
  }
  return entries;
}

export async function getSitemapEntriesByType(ctx: SiteContext, type: SitemapEntry['type']): Promise<SitemapEntry[]> {
  return (await getSitemapEntries(ctx)).filter((entry) => entry.type === type);
}

function renderUrlset(entries: SitemapEntry[]): string {
  const body = entries.map((entry) => `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n  </url>`).join('\n');
  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${body}\n</urlset>\n`;
}

export async function generateSitemapXml(ctx: SiteContext): Promise<string> {
  if (ctx.siteConfig.seo.sitemap.split) return generateSitemapIndexXml(ctx);
  return renderUrlset(await getSitemapEntries(ctx));
}

export async function generateSitemapXmlForType(ctx: SiteContext, type: SitemapEntry['type']): Promise<string> {
  return renderUrlset(await getSitemapEntriesByType(ctx, type));
}

export function generateSitemapIndexXml(ctx: SiteContext): string {
  const base = getBaseUrl(ctx);
  const maps = [`${base}/sitemaps/pages.xml`, `${base}/sitemaps/guides.xml`];
  const body = maps.map((loc) => `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n  </sitemap>`).join('\n');
  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${body}\n</sitemapindex>\n`;
}

import { getIndexableLocales, listGuideContent, loadHomeContent, type SiteContext } from '@factory/site-core';
import { getGuideUrl, getLocaleHomeUrl } from './urls';

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function getSitemapEntries(ctx: SiteContext) {
  const entries: Array<{ loc: string; lastmod: string }> = [];
  for (const locale of getIndexableLocales(ctx)) {
    const home = await loadHomeContent(ctx, locale);
    if (home.frontmatter.index && home.frontmatter.contentStatus === 'approved') {
      entries.push({ loc: getLocaleHomeUrl(ctx, locale), lastmod: home.frontmatter.lastModified });
    }
    const guides = await listGuideContent(ctx, locale);
    for (const guide of guides) {
      if (guide.frontmatter.index && guide.frontmatter.contentStatus === 'approved') {
        entries.push({ loc: getGuideUrl(ctx, locale, guide.frontmatter.slug), lastmod: guide.frontmatter.lastModified });
      }
    }
  }
  return entries;
}

export async function generateSitemapXml(ctx: SiteContext): Promise<string> {
  const entries = await getSitemapEntries(ctx);
  const body = entries.map((entry) => `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

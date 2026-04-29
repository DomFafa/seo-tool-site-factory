import { shouldAllowRobotsCrawl, type SiteContext } from '@factory/site-core';
import { getBaseUrl } from './urls';

export function generateRobotsTxt(ctx: SiteContext): string {
  const allowCrawl = shouldAllowRobotsCrawl(ctx);
  return ['User-agent: *', allowCrawl ? 'Allow: /' : 'Disallow: /', '', `Sitemap: ${getBaseUrl(ctx)}/sitemap.xml`, ''].join('\n');
}

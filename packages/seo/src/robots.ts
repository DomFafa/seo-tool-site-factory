import type { SiteContext } from '@factory/site-core';
import { getBaseUrl } from './urls';

export function generateRobotsTxt(ctx: SiteContext): string {
  const allowIndex = ctx.siteConfig.lifecycle.status === 'live' && ctx.siteConfig.indexing.allowIndex;
  const lines = [
    'User-agent: *',
    allowIndex ? 'Allow: /' : 'Disallow: /',
    '',
    `Sitemap: ${getBaseUrl(ctx)}/sitemap.xml`,
    ''
  ];
  return lines.join('\n');
}

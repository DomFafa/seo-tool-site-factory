import { getSitemapEntries } from '@factory/seo';
import type { SiteContext } from '@factory/site-core';

export async function submitIndexNow(ctx: SiteContext): Promise<{ ok: boolean; status: number; message: string }> {
  const config = ctx.integrationsConfig.indexing.indexNow;
  if (!config.enabled || !config.key || !config.keyFile) {
    return { ok: false, status: 0, message: 'IndexNow is not configured.' };
  }
  const entries = await getSitemapEntries(ctx);
  const urlList = entries.map((entry) => entry.loc);
  if (urlList.length === 0) return { ok: false, status: 0, message: 'No indexable URLs found in sitemap entries.' };
  const endpoint = config.endpoint ?? 'https://api.indexnow.org/indexnow';
  const body = {
    host: ctx.siteConfig.domains.canonicalHost,
    key: config.key,
    keyLocation: `https://${ctx.siteConfig.domains.canonicalHost}/${config.keyFile}`,
    urlList
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return { ok: res.ok, status: res.status, message: `Submitted ${urlList.length} URLs to ${endpoint}` };
}

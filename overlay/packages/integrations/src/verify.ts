import type { SiteContext } from '@factory/site-core';

export type VerifyResult = { label: string; ok: boolean; message: string };

async function fetchText(url: string): Promise<{ status: number; text: string }> {
  const res = await fetch(url, { redirect: 'follow' });
  return { status: res.status, text: await res.text() };
}

export async function verifyOnlineIntegrations(ctx: SiteContext): Promise<VerifyResult[]> {
  const base = `https://${ctx.siteConfig.domains.canonicalHost}`;
  const results: VerifyResult[] = [];
  const home = await fetchText(base);
  results.push({ label: 'homepage', ok: home.status >= 200 && home.status < 400, message: `${base} -> HTTP ${home.status}` });

  const robots = await fetchText(`${base}/robots.txt`);
  results.push({ label: 'robots.txt', ok: robots.status === 200 && robots.text.includes('Sitemap:'), message: `/robots.txt -> HTTP ${robots.status}` });

  const sitemap = await fetchText(`${base}/sitemap.xml`);
  results.push({ label: 'sitemap.xml', ok: sitemap.status === 200 && sitemap.text.includes('<urlset'), message: `/sitemap.xml -> HTTP ${sitemap.status}` });

  const ads = ctx.integrationsConfig.ads;
  if (ads.adsTxt.enabled) {
    const adsTxt = await fetchText(`${base}/ads.txt`);
    results.push({ label: 'ads.txt', ok: adsTxt.status === 200, message: `/ads.txt -> HTTP ${adsTxt.status}` });
  }

  const ga = ctx.integrationsConfig.analytics.googleAnalytics;
  if (ga.enabled && ga.measurementId) {
    results.push({ label: 'GA4 tag', ok: home.text.includes(ga.measurementId), message: ga.measurementId });
  }

  const clarity = ctx.integrationsConfig.analytics.microsoftClarity;
  if (clarity.enabled && clarity.projectId) {
    results.push({ label: 'Microsoft Clarity tag', ok: home.text.includes(clarity.projectId), message: clarity.projectId });
  }

  const gsc = ctx.integrationsConfig.webmaster.googleSearchConsole;
  if (gsc.enabled && gsc.verification?.method === 'meta' && gsc.verification.content) {
    results.push({ label: 'GSC verification meta', ok: home.text.includes(gsc.verification.content), message: 'meta tag content check' });
  }

  const bing = ctx.integrationsConfig.webmaster.bingWebmaster;
  if (bing.enabled && bing.verification?.method === 'meta' && bing.verification.content) {
    results.push({ label: 'Bing verification meta', ok: home.text.includes(bing.verification.content), message: 'meta tag content check' });
  }

  const indexNow = ctx.integrationsConfig.indexing.indexNow;
  if (indexNow.enabled && indexNow.keyFile) {
    const key = await fetchText(`${base}/${indexNow.keyFile}`);
    results.push({ label: 'IndexNow key file', ok: key.status === 200 && Boolean(indexNow.key && key.text.includes(indexNow.key)), message: `/${indexNow.keyFile} -> HTTP ${key.status}` });
  }
  return results;
}

import { loadSelectedSite } from '@factory/site-core';
import { generateSitemapXml } from '@factory/seo';

export async function GET() {
  const ctx = await loadSelectedSite();
  const xml = await generateSitemapXml(ctx);
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}

import { loadSelectedSite } from '@factory/site-core';
import { generateSitemapXmlForType } from '@factory/seo';

export async function GET() {
  const ctx = await loadSelectedSite();
  const xml = await generateSitemapXmlForType(ctx, 'home');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

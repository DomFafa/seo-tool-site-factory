import { loadSelectedSite } from '@factory/site-core';
import { generateRobotsTxt } from '@factory/seo';

export async function GET() {
  const ctx = await loadSelectedSite();
  return new Response(generateRobotsTxt(ctx), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

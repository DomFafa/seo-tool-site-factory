import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { listSiteIds, loadSiteContext, validateSiteContext, type SiteContext } from '@factory/site-core';

export type SiteScorecard = {
  siteId: string;
  brandName: string;
  category: string;
  primaryKeyword: string;
  domain: string;
  status: string;
  defaultLocale: string;
  enabledLocales: string[];
  indexableLocales: string[];
  primaryTool: string;
  executionModel: string;
  adsEnabled: boolean;
  adsProvider: string;
  ga4: boolean;
  clarity: boolean;
  gsc: boolean;
  bingWebmaster: boolean;
  indexNow: boolean;
  p0: number;
  p1: number;
  p2: number;
};

function scorecard(ctx: SiteContext): SiteScorecard {
  const issues = validateSiteContext(ctx);
  const locales = Object.entries(ctx.siteConfig.locales);
  return {
    siteId: ctx.siteId,
    brandName: ctx.siteConfig.brandName,
    category: ctx.siteConfig.category,
    primaryKeyword: ctx.siteConfig.primaryKeyword,
    domain: ctx.siteConfig.domains.canonicalHost,
    status: ctx.siteConfig.lifecycle.status,
    defaultLocale: ctx.siteConfig.defaultLocale,
    enabledLocales: locales.filter(([, cfg]) => cfg.enabled).map(([locale]) => locale),
    indexableLocales: locales.filter(([, cfg]) => cfg.enabled && cfg.indexable && cfg.reviewed).map(([locale]) => locale),
    primaryTool: ctx.siteConfig.primaryTool,
    executionModel: ctx.toolConfig.executionModel,
    adsEnabled: ctx.integrationsConfig.ads.enabled,
    adsProvider: ctx.integrationsConfig.ads.activeProvider,
    ga4: ctx.integrationsConfig.analytics.googleAnalytics.enabled,
    clarity: ctx.integrationsConfig.analytics.microsoftClarity.enabled,
    gsc: ctx.integrationsConfig.webmaster.googleSearchConsole.enabled,
    bingWebmaster: ctx.integrationsConfig.webmaster.bingWebmaster.enabled,
    indexNow: ctx.integrationsConfig.indexing.indexNow.enabled,
    p0: issues.filter((i) => i.level === 'P0').length,
    p1: issues.filter((i) => i.level === 'P1').length,
    p2: issues.filter((i) => i.level === 'P2').length
  };
}

export function generatePortfolioReport(workspaceRoot: string) {
  const cards = listSiteIds(workspaceRoot).map((siteId) => scorecard(loadSiteContext(siteId, workspaceRoot)));
  const outDir = join(workspaceRoot, '.generated');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'portfolio.json'), JSON.stringify(cards, null, 2));
  writeFileSync(join(outDir, 'portfolio.html'), renderHtml(cards));
  return cards;
}

function renderHtml(cards: SiteScorecard[]): string {
  const rows = cards.map((card) => `
    <tr>
      <td>${card.siteId}</td><td>${card.domain}</td><td>${card.status}</td><td>${card.primaryTool}</td>
      <td>${card.enabledLocales.join(', ')}</td><td>${card.indexableLocales.join(', ') || '-'}</td>
      <td>${card.adsEnabled ? card.adsProvider : 'off'}</td><td>${card.ga4 ? 'yes' : 'no'}</td><td>${card.gsc ? 'yes' : 'no'}</td><td>${card.bingWebmaster ? 'yes' : 'no'}</td><td>${card.indexNow ? 'yes' : 'no'}</td>
      <td>P0 ${card.p0} / P1 ${card.p1} / P2 ${card.p2}</td>
    </tr>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>SEO Tool Site Factory Portfolio</title><style>body{font-family:system-ui;margin:32px;background:#f7f7f8}table{border-collapse:collapse;background:#fff;width:100%}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f0f0f0}</style></head><body><h1>Portfolio report</h1><p>Generated ${new Date().toISOString()}</p><table><thead><tr><th>Site</th><th>Domain</th><th>Status</th><th>Tool</th><th>Locales</th><th>Indexable</th><th>Ads</th><th>GA4</th><th>GSC</th><th>Bing</th><th>IndexNow</th><th>Issues</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
}

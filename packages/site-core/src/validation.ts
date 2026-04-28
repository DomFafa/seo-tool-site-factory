import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { SiteContext, ValidationIssue } from './types';
import { contentExists, localeContentDirExists } from './content';
import { listSiteIds, loadSiteContext } from './load';
import { findWorkspaceRoot } from './workspace';

export function validateSiteContext(ctx: SiteContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const site = ctx.siteConfig;
  const tool = ctx.toolConfig;
  const integrations = ctx.integrationsConfig;

  if (site.primaryTool !== tool.toolId) {
    issues.push({ level: 'P0', code: 'TOOL_ID_MISMATCH', message: `site.primaryTool (${site.primaryTool}) does not match tool.config.yaml toolId (${tool.toolId}).` });
  }
  if (!site.locales[site.defaultLocale]?.enabled) {
    issues.push({ level: 'P0', code: 'DEFAULT_LOCALE_DISABLED', message: `defaultLocale ${site.defaultLocale} must be enabled.` });
  }
  if (!contentExists(ctx, site.defaultLocale, 'home.mdx')) {
    issues.push({ level: 'P0', code: 'MISSING_HOME_CONTENT', message: `Missing content/${site.defaultLocale}/home.mdx.` });
  }
  for (const [locale, cfg] of Object.entries(site.locales)) {
    if (cfg.enabled && !localeContentDirExists(ctx, locale)) {
      issues.push({ level: 'P1', code: 'LOCALE_ENABLED_NO_CONTENT_DIR', message: `${locale} is enabled but content/${locale}/ does not exist.` });
    }
    if (cfg.indexable && !cfg.reviewed) {
      issues.push({ level: 'P1', code: 'LOCALE_INDEXABLE_NOT_REVIEWED', message: `${locale} is indexable but reviewed=false.` });
    }
  }
  if (site.lifecycle.status !== 'live' && site.indexing.allowIndex) {
    issues.push({ level: 'P1', code: 'INDEXING_ENABLED_WHILE_NOT_LIVE', message: `allowIndex=true but lifecycle.status=${site.lifecycle.status}. Draft/preview sites should usually remain noindex.` });
  }
  if (integrations.ads.enabled && site.lifecycle.status !== 'live') {
    issues.push({ level: 'P1', code: 'ADS_ENABLED_WHILE_NOT_LIVE', message: `ads.enabled=true but lifecycle.status=${site.lifecycle.status}.` });
  }
  if (integrations.ads.enabled && integrations.ads.activeProvider === 'adsense') {
    const adsense = integrations.ads.providers.adsense;
    if (!adsense.enabled) issues.push({ level: 'P0', code: 'ADSENSE_ACTIVE_BUT_DISABLED', message: 'ads.activeProvider=adsense but adsense.enabled=false.' });
    if (!adsense.publisherId) issues.push({ level: 'P0', code: 'ADSENSE_MISSING_PUBLISHER_ID', message: 'AdSense publisherId is required when AdSense is active.' });
  }
  if (integrations.ads.enabled && integrations.ads.activeProvider === 'adsterra') {
    const adsterra = integrations.ads.providers.adsterra;
    if (!adsterra.enabled) issues.push({ level: 'P0', code: 'ADSTERRA_ACTIVE_BUT_DISABLED', message: 'ads.activeProvider=adsterra but adsterra.enabled=false.' });
  }
  if (integrations.analytics.googleAnalytics.enabled && !integrations.analytics.googleAnalytics.measurementId) {
    issues.push({ level: 'P0', code: 'GA4_MISSING_MEASUREMENT_ID', message: 'Google Analytics is enabled but measurementId is missing.' });
  }
  if (integrations.analytics.microsoftClarity.enabled && !integrations.analytics.microsoftClarity.projectId) {
    issues.push({ level: 'P0', code: 'CLARITY_MISSING_PROJECT_ID', message: 'Microsoft Clarity is enabled but projectId is missing.' });
  }
  if (integrations.indexing.indexNow.enabled) {
    if (!integrations.indexing.indexNow.key) issues.push({ level: 'P0', code: 'INDEXNOW_MISSING_KEY', message: 'IndexNow is enabled but key is missing.' });
    if (!integrations.indexing.indexNow.keyFile) issues.push({ level: 'P0', code: 'INDEXNOW_MISSING_KEY_FILE', message: 'IndexNow is enabled but keyFile is missing.' });
  }
  for (const [placement, cfg] of Object.entries(integrations.ads.providers.adsterra.placements ?? {})) {
    if (cfg.enabled && cfg.snippet) {
      const snippetPath = join(ctx.siteDir, cfg.snippet);
      if (!existsSync(snippetPath)) {
        issues.push({ level: 'P0', code: 'ADSTERRA_SNIPPET_MISSING', message: `Adsterra placement ${placement} references missing snippet ${cfg.snippet}.` });
      }
    }
  }
  return issues;
}

export function validateAllSites(workspaceRoot = findWorkspaceRoot()): Map<string, ValidationIssue[]> {
  const result = new Map<string, ValidationIssue[]>();
  const domainOwner = new Map<string, string>();
  for (const siteId of listSiteIds(workspaceRoot)) {
    const ctx = loadSiteContext(siteId, workspaceRoot);
    const issues = validateSiteContext(ctx);
    const domains = [ctx.siteConfig.domains.production, ctx.siteConfig.domains.canonicalHost, ...ctx.siteConfig.domains.aliases].filter(Boolean);
    for (const domain of domains) {
      const normalized = domain.toLowerCase();
      const owner = domainOwner.get(normalized);
      if (owner && owner !== siteId) {
        issues.push({ level: 'P0', code: 'DUPLICATE_DOMAIN', message: `Domain ${domain} is used by both ${owner} and ${siteId}.` });
      } else {
        domainOwner.set(normalized, siteId);
      }
    }
    result.set(siteId, issues);
  }
  return result;
}

export function hasBlockingIssues(issues: ValidationIssue[]): boolean {
  return issues.some((issue) => issue.level === 'P0');
}

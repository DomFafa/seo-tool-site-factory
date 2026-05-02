import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { SiteContext, ValidationIssue } from './types';
import { contentExists, localeContentDirExists } from './content';
import { loadCloudflareAccountsConfig } from './cloudflare-accounts';
import { getIndexingMode, isIndexingEnabled, isPagesDevHost, listSiteIds, loadSiteContext } from './load';
import { ContentFrontmatterSchema } from './schema';
import { findWorkspaceRoot } from './workspace';

type VerificationConfig = {
  method?: 'none' | 'meta' | 'html-file' | 'xml-file' | 'dns' | 'import-from-gsc';
  content?: string;
  fileName?: string;
  fileContent?: string;
};

function findContentFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) return findContentFiles(entryPath);
    return entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) ? [entryPath] : [];
  });
}

function validateContentFrontmatter(ctx: SiteContext, locale: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const contentDir = join(ctx.siteDir, 'content', locale);
  const slugs = new Map<string, string>();

  for (const filePath of findContentFiles(contentDir)) {
    const parsed = matter(readFileSync(filePath, 'utf8'));
    const result = ContentFrontmatterSchema.safeParse(parsed.data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({
          level: 'P0',
          code: 'INVALID_CONTENT_FRONTMATTER',
          file: filePath,
          message: `${issue.path.join('.') || 'frontmatter'} ${issue.message}`
        });
      }
      continue;
    }

    const previous = slugs.get(result.data.slug);
    if (previous) {
      issues.push({
        level: 'P0',
        code: 'DUPLICATE_CONTENT_SLUG',
        file: filePath,
        message: `Duplicate slug "${result.data.slug}" in locale ${locale}; first seen in ${previous}.`
      });
    } else {
      slugs.set(result.data.slug, filePath);
    }

    if (result.data.index && !isIndexingEnabled(ctx)) {
      issues.push({
        level: 'P1',
        code: 'CONTENT_INDEX_TRUE_WHILE_SITE_NOINDEX',
        file: filePath,
        message: `Content slug "${result.data.slug}" has index=true, but the site is not live/indexable.`
      });
    }
  }

  return issues;
}

function validateVerification(label: string, enabled: boolean, verification: VerificationConfig | undefined): ValidationIssue[] {
  if (!enabled) return [];
  const method = verification?.method ?? 'none';

  if (method === 'none') {
    return [{ level: 'P1', code: `${label}_VERIFICATION_NOT_CONFIGURED`, message: `${label} is enabled but verification.method=none.` }];
  }

  if (method === 'meta' && !verification?.content) {
    return [{ level: 'P0', code: `${label}_META_CONTENT_MISSING`, message: `${label} meta verification requires verification.content.` }];
  }

  if ((method === 'html-file' || method === 'xml-file') && (!verification?.fileName || !verification?.fileContent)) {
    return [{ level: 'P0', code: `${label}_FILE_VERIFICATION_INCOMPLETE`, message: `${label} file verification requires fileName and fileContent.` }];
  }

  return [];
}

function validateHomeLayout(ctx: SiteContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const blocks = ctx.layoutConfig.home.blocks;
  const heroIndexes = blocks.flatMap((block, index) => block.type === 'hero' ? [index] : []);
  const toolIndexes = blocks.flatMap((block, index) => block.type === 'tool' ? [index] : []);
  const adSlotIndexes = blocks.flatMap((block, index) => block.type === 'adSlot' ? [index] : []);

  if (heroIndexes.length !== 1) {
    issues.push({
      level: 'P0',
      code: 'HOME_HERO_BLOCK_COUNT',
      message: `Homepage layout must contain exactly one hero block; found ${heroIndexes.length}.`
    });
  }

  if (toolIndexes.length !== 1) {
    issues.push({
      level: 'P0',
      code: 'HOME_TOOL_BLOCK_COUNT',
      message: `Homepage layout must contain exactly one tool block; found ${toolIndexes.length}.`
    });
  }

  if (toolIndexes.length === 1) {
    const toolIndex = toolIndexes[0];
    if (toolIndex > 2) {
      issues.push({
        level: 'P1',
        code: 'HOME_TOOL_BLOCK_TOO_LOW',
        message: `Homepage tool block should appear within the first 3 blocks; found at position ${toolIndex + 1}.`
      });
    }

    for (const adSlotIndex of adSlotIndexes) {
      if (Math.abs(adSlotIndex - toolIndex) === 1) {
        issues.push({
          level: 'P1',
          code: 'HOME_AD_SLOT_NEAR_TOOL',
          message: `Homepage adSlot block at position ${adSlotIndex + 1} must not be directly adjacent to the tool block.`
        });
      }
    }
  }

  if (ctx.integrationsConfig.ads.enabled && adSlotIndexes.length === 0) {
    issues.push({
      level: 'P2',
      code: 'HOME_ADS_ENABLED_WITHOUT_AD_SLOT',
      message: 'ads.enabled=true, but the homepage layout does not include an adSlot block.'
    });
  }

  return issues;
}

function validateDeploymentAccount(ctx: SiteContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const alias = 'shared';
  if (!ctx.siteConfig.deployment.accountAlias) {
    issues.push({ level: 'P2', code: 'CLOUDFLARE_ACCOUNT_ALIAS_MISSING', message: 'deployment.accountAlias is missing; local deploy will fall back to the shared Cloudflare account.' });
  }

  try {
    const config = loadCloudflareAccountsConfig(ctx.workspaceRoot);
    if (!config.accounts[alias]) {
      issues.push({ level: 'P0', code: 'CLOUDFLARE_ACCOUNT_PROFILE_MISSING', message: `Cloudflare account alias "${alias}" is not defined in cloudflare.accounts.yaml.` });
    }
  } catch (error) {
    return [{ level: 'P0', code: 'CLOUDFLARE_ACCOUNTS_CONFIG_INVALID', message: error instanceof Error ? error.message : 'Could not load cloudflare.accounts.yaml.' }];
  }

  return issues;
}

export function validateSiteContext(ctx: SiteContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const site = ctx.siteConfig;
  const tool = ctx.toolConfig;
  const integrations = ctx.integrationsConfig;

  issues.push(...validateDeploymentAccount(ctx));

  issues.push(...validateHomeLayout(ctx));

  if (site.primaryTool !== tool.toolId) {
    issues.push({ level: 'P0', code: 'TOOL_ID_MISMATCH', message: `site.primaryTool (${site.primaryTool}) does not match tool.config.yaml toolId (${tool.toolId}).` });
  }
  if (!site.locales[site.defaultLocale]?.enabled) {
    issues.push({ level: 'P0', code: 'DEFAULT_LOCALE_DISABLED', message: `defaultLocale ${site.defaultLocale} must be enabled.` });
  }
  if (!contentExists(ctx, site.defaultLocale, 'home.mdx')) {
    issues.push({ level: 'P0', code: 'MISSING_HOME_CONTENT', message: `Missing content/${site.defaultLocale}/home.mdx.` });
  }
  if (!contentExists(ctx, site.defaultLocale, 'faq.mdx')) {
    issues.push({ level: 'P2', code: 'MISSING_FAQ_CONTENT', message: `Missing content/${site.defaultLocale}/faq.mdx.` });
  }
  for (const [locale, cfg] of Object.entries(site.locales)) {
    if (cfg.enabled && !localeContentDirExists(ctx, locale)) {
      issues.push({ level: 'P1', code: 'LOCALE_ENABLED_NO_CONTENT_DIR', message: `${locale} is enabled but content/${locale}/ does not exist.` });
      continue;
    }
    if (cfg.indexable && !cfg.reviewed) {
      issues.push({ level: 'P1', code: 'LOCALE_INDEXABLE_NOT_REVIEWED', message: `${locale} is indexable but reviewed=false.` });
    }
    if (cfg.enabled) {
      issues.push(...validateContentFrontmatter(ctx, locale));
    }
  }
  if (site.lifecycle.status !== 'live' && site.indexing.allowIndex) {
    issues.push({ level: 'P1', code: 'INDEXING_ENABLED_WHILE_NOT_LIVE', message: `allowIndex=true but lifecycle.status=${site.lifecycle.status}. Draft/preview sites should usually remain noindex.` });
  }
  const indexingMode = getIndexingMode(ctx);
  if (indexingMode === 'index' && site.lifecycle.status !== 'live') {
    issues.push({ level: 'P0', code: 'INDEX_MODE_NOT_LIVE', message: 'indexing.mode=index requires lifecycle.status=live.' });
  }
  if (indexingMode === 'index' && !site.indexing.allowIndex) {
    issues.push({ level: 'P0', code: 'INDEX_MODE_ALLOWINDEX_FALSE', message: 'indexing.mode=index requires indexing.allowIndex=true.' });
  }
  if (indexingMode === 'index' && isPagesDevHost(site.domains.canonicalHost)) {
    issues.push({ level: 'P0', code: 'PAGES_DEV_INDEX_MODE', message: 'pages.dev hosts must not use indexing.mode=index.' });
  }
  if (integrations.ads.enabled && site.lifecycle.status !== 'live') {
    issues.push({ level: 'P1', code: 'ADS_ENABLED_WHILE_NOT_LIVE', message: `ads.enabled=true but lifecycle.status=${site.lifecycle.status}.` });
  }
  if (integrations.ads.enabled && integrations.ads.activeProvider === 'adsense') {
    const adsense = integrations.ads.providers.adsense;
    if (!adsense.enabled) issues.push({ level: 'P0', code: 'ADSENSE_ACTIVE_BUT_DISABLED', message: 'ads.activeProvider=adsense but adsense.enabled=false.' });
    if (!adsense.publisherId) issues.push({ level: 'P0', code: 'ADSENSE_MISSING_PUBLISHER_ID', message: 'AdSense publisherId is required when AdSense is active.' });
    if (integrations.ads.adsTxt.enabled && !integrations.ads.adsTxt.entries.some((entry) => entry.includes('google.com') && entry.includes('pub-'))) {
      issues.push({ level: 'P1', code: 'ADSENSE_ADS_TXT_ENTRY_MISSING', message: 'ads.txt is enabled, but no Google AdSense seller entry was found.' });
    }
  }
  if (integrations.ads.enabled && integrations.ads.activeProvider === 'adsterra') {
    const adsterra = integrations.ads.providers.adsterra;
    if (!adsterra.enabled) issues.push({ level: 'P0', code: 'ADSTERRA_ACTIVE_BUT_DISABLED', message: 'ads.activeProvider=adsterra but adsterra.enabled=false.' });
  }
  if (integrations.ads.adsTxt.enabled && integrations.ads.adsTxt.entries.length === 0) {
    issues.push({ level: 'P1', code: 'ADS_TXT_ENABLED_EMPTY', message: 'ads.txt generation is enabled but no entries are configured.' });
  }
  if (integrations.analytics.googleAnalytics.enabled && !integrations.analytics.googleAnalytics.measurementId) {
    issues.push({ level: 'P0', code: 'GA4_MISSING_MEASUREMENT_ID', message: 'Google Analytics is enabled but measurementId is missing.' });
  }
  if (integrations.analytics.microsoftClarity.enabled && !integrations.analytics.microsoftClarity.projectId) {
    issues.push({ level: 'P0', code: 'CLARITY_MISSING_PROJECT_ID', message: 'Microsoft Clarity is enabled but projectId is missing.' });
  }

  issues.push(...validateVerification('GSC', integrations.webmaster.googleSearchConsole.enabled, integrations.webmaster.googleSearchConsole.verification));
  issues.push(...validateVerification('BING_WEBMASTER', integrations.webmaster.bingWebmaster.enabled, integrations.webmaster.bingWebmaster.verification));

  if (integrations.indexing.indexNow.enabled) {
    if (!integrations.indexing.indexNow.key) issues.push({ level: 'P0', code: 'INDEXNOW_MISSING_KEY', message: 'IndexNow is enabled but key is missing.' });
    if (!integrations.indexing.indexNow.keyFile) issues.push({ level: 'P0', code: 'INDEXNOW_MISSING_KEY_FILE', message: 'IndexNow is enabled but keyFile is missing.' });
  }
  for (const [placement, cfg] of Object.entries(integrations.ads.providers.adsterra.placements ?? {})) {
    if (cfg.enabled && integrations.ads.providers.adsterra.blockedFormats.includes(cfg.format)) {
      issues.push({ level: 'P0', code: 'ADSTERRA_BLOCKED_FORMAT_ENABLED', message: `Adsterra placement ${placement} uses blocked format ${cfg.format}.` });
    }
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

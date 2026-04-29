import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';
import { IntegrationsConfigSchema, LayoutConfigSchema, SiteConfigSchema, ThemeConfigSchema, ToolConfigSchema } from './schema';
import type { IntegrationsConfig, LayoutConfig, SiteConfig, SiteContext, ThemeConfig, ToolConfig } from './types';
import { findWorkspaceRoot } from './workspace';

function readYaml<T>(filePath: string, parser: { parse: (value: unknown) => T }): T {
  if (!existsSync(filePath)) throw new Error(`Missing YAML file: ${filePath}`);
  const raw = readFileSync(filePath, 'utf8');
  const parsed = YAML.parse(raw);
  return parser.parse(parsed);
}

function readOptionalYaml<T>(filePath: string, parser: { parse: (value: unknown) => T }, fallback: unknown): T {
  if (!existsSync(filePath)) return parser.parse(fallback);
  return readYaml(filePath, parser);
}

export function listSiteIds(workspaceRoot = findWorkspaceRoot()): string[] {
  const sitesDir = join(workspaceRoot, 'sites');
  if (!existsSync(sitesDir)) return [];
  return readdirSync(sitesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function loadSiteContext(siteId: string, workspaceRoot = findWorkspaceRoot()): SiteContext {
  const siteDir = join(workspaceRoot, 'sites', siteId);
  if (!existsSync(siteDir)) throw new Error(`Unknown site: ${siteId}. Expected directory ${siteDir}`);
  const siteConfig = readYaml<SiteConfig>(join(siteDir, 'site.config.yaml'), SiteConfigSchema);
  const toolConfig = readYaml<ToolConfig>(join(siteDir, 'tool.config.yaml'), ToolConfigSchema);
  const themeConfig = readYaml<ThemeConfig>(join(siteDir, 'theme.config.yaml'), ThemeConfigSchema);
  const integrationsConfig = readYaml<IntegrationsConfig>(join(siteDir, 'integrations.config.yaml'), IntegrationsConfigSchema);
  const layoutConfig = readOptionalYaml<LayoutConfig>(join(siteDir, 'layout.config.yaml'), LayoutConfigSchema, {});
  if (siteConfig.id !== siteId) {
    throw new Error(`Site id mismatch: directory is ${siteId}, site.config.yaml id is ${siteConfig.id}`);
  }
  return { workspaceRoot, siteId, siteDir, siteConfig, toolConfig, themeConfig, integrationsConfig, layoutConfig };
}

export async function loadSelectedSite(): Promise<SiteContext> {
  const siteId = process.env.SITE_ID;
  if (!siteId) throw new Error('SITE_ID is required. Use `pnpm site dev <site-id>` or `pnpm site build <site-id>`.');
  return loadSiteContext(siteId);
}

export function getEnabledLocales(ctx: SiteContext): string[] {
  return Object.entries(ctx.siteConfig.locales).filter(([, cfg]) => cfg.enabled).map(([locale]) => locale);
}

export function getEnabledNonDefaultLocales(ctx: SiteContext): string[] {
  return getEnabledLocales(ctx).filter((locale) => locale !== ctx.siteConfig.defaultLocale);
}

export type IndexingMode = 'disallow' | 'allow-noindex' | 'index';

export function getIndexingMode(ctx: SiteContext): IndexingMode {
  const explicit = ctx.siteConfig.indexing?.mode;
  if (explicit === 'disallow' || explicit === 'allow-noindex' || explicit === 'index') return explicit;
  if (ctx.siteConfig.lifecycle.status === 'live' && ctx.siteConfig.indexing.allowIndex) return 'index';
  if (ctx.siteConfig.launch?.stage === 'real-domain-noindex') return 'allow-noindex';
  if (ctx.siteConfig.launch?.stage === 'real-domain-indexed' || ctx.siteConfig.launch?.stage === 'ads-enabled') return 'index';
  return 'disallow';
}

export function shouldAllowRobotsCrawl(ctx: SiteContext): boolean {
  return getIndexingMode(ctx) !== 'disallow';
}

export function isIndexingEnabled(ctx: SiteContext): boolean {
  return getIndexingMode(ctx) === 'index' && ctx.siteConfig.lifecycle.status === 'live' && ctx.siteConfig.indexing.allowIndex;
}

export function isPagesDevHost(host: string): boolean {
  return host.endsWith('.pages.dev');
}

export function isRealDomain(ctx: SiteContext): boolean {
  return !isPagesDevHost(ctx.siteConfig.domains.canonicalHost);
}

export function getIndexableLocales(ctx: SiteContext): string[] {
  if (!isIndexingEnabled(ctx)) return [];
  return Object.entries(ctx.siteConfig.locales)
    .filter(([, cfg]) => cfg.enabled && cfg.indexable && cfg.reviewed)
    .map(([locale]) => locale);
}

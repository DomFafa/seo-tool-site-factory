import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';
import { IntegrationsConfigSchema, SiteConfigSchema, ThemeConfigSchema, ToolConfigSchema } from './schema';
import type { IntegrationsConfig, SiteConfig, SiteContext, ThemeConfig, ToolConfig } from './types';
import { findWorkspaceRoot } from './workspace';

function readYaml<T>(filePath: string, parser: { parse: (value: unknown) => T }): T {
  if (!existsSync(filePath)) throw new Error(`Missing YAML file: ${filePath}`);
  const raw = readFileSync(filePath, 'utf8');
  const parsed = YAML.parse(raw);
  return parser.parse(parsed);
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
  if (siteConfig.id !== siteId) {
    throw new Error(`Site id mismatch: directory is ${siteId}, site.config.yaml id is ${siteConfig.id}`);
  }
  return { workspaceRoot, siteId, siteDir, siteConfig, toolConfig, themeConfig, integrationsConfig };
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

export function getIndexableLocales(ctx: SiteContext): string[] {
  if (ctx.siteConfig.lifecycle.status !== 'live' || !ctx.siteConfig.indexing.allowIndex) return [];
  return Object.entries(ctx.siteConfig.locales)
    .filter(([, cfg]) => cfg.enabled && cfg.indexable && cfg.reviewed)
    .map(([locale]) => locale);
}

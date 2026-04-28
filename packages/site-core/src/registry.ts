import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateContent } from './content.js';
import { emptyResult, mergeResults, type ValidationIssue, type ValidationResult } from './issues.js';
import { siteConfigSchema, type SiteConfig } from './schema.js';
import { isKnownToolId } from './tools.js';

export type LoadedSite = {
  id: string;
  dir: string;
  config: SiteConfig;
};

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function loadSites(rootDir = process.cwd()): Promise<LoadedSite[]> {
  const sitesDir = path.join(rootDir, 'sites');
  const entries = await fs.readdir(sitesDir, { withFileTypes: true });
  const siteDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const sites: LoadedSite[] = [];

  for (const siteDirName of siteDirs) {
    const siteDir = path.join(sitesDir, siteDirName);
    const configPath = path.join(siteDir, 'site.config.ts');
    const imported = await import(pathToFileURL(configPath).href);
    const rawConfig = imported.default;
    const parsed = siteConfigSchema.parse(rawConfig);
    sites.push({ id: parsed.id, dir: siteDir, config: parsed });
  }

  return sites;
}

export async function loadSite(siteId: string, rootDir = process.cwd()): Promise<LoadedSite | undefined> {
  const sites = await loadSites(rootDir);
  return sites.find((site) => site.id === siteId);
}

export function validateSiteConfig(config: SiteConfig, siteDirName: string): ValidationResult {
  const result = emptyResult();

  if (config.id !== siteDirName) {
    result.errors.push({
      level: 'error',
      code: 'site_id_directory_mismatch',
      message: `site id "${config.id}" must match directory "${siteDirName}"`,
      siteId: config.id
    });
  }

  if (!isKnownToolId(config.primaryTool)) {
    result.errors.push({
      level: 'error',
      code: 'unknown_primary_tool',
      message: `Unknown primaryTool "${config.primaryTool}"`,
      siteId: config.id
    });
  }

  return result;
}

export function validateSiteCollection(sites: LoadedSite[]): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const domainOwners = new Map<string, string>();

  for (const site of sites) {
    for (const domain of site.config.domains) {
      const normalizedDomain = domain.toLowerCase();
      const existingOwner = domainOwners.get(normalizedDomain);
      if (existingOwner) {
        errors.push({
          level: 'error',
          code: 'duplicate_domain',
          message: `Domain "${domain}" is used by both ${existingOwner} and ${site.id}`,
          siteId: site.id
        });
      } else {
        domainOwners.set(normalizedDomain, site.id);
      }
    }
  }

  return { errors, warnings };
}

export async function validateSitePack(site: LoadedSite): Promise<ValidationResult> {
  const siteDirName = path.basename(site.dir);
  const configResult = validateSiteConfig(site.config, siteDirName);
  const contentResult = await validateContent(site.dir, site.config);
  const messagesResult = await validateMessages(site);

  return mergeResults(configResult, contentResult, messagesResult);
}

export async function validateAllSites(rootDir = process.cwd()): Promise<{
  sites: LoadedSite[];
  result: ValidationResult;
}> {
  const sites = await loadSites(rootDir);
  const siteResults = await Promise.all(sites.map((site) => validateSitePack(site)));
  const collectionResult = validateSiteCollection(sites);

  return {
    sites,
    result: mergeResults(...siteResults, collectionResult)
  };
}

async function validateMessages(site: LoadedSite): Promise<ValidationResult> {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  for (const locale of site.config.locales) {
    const messagesPath = path.join(site.dir, 'messages', `${locale}.json`);
    if (!(await pathExists(messagesPath))) {
      errors.push({
        level: 'error',
        code: 'missing_messages',
        message: `Missing messages file for locale ${locale}`,
        siteId: site.id,
        file: messagesPath
      });
      continue;
    }

    try {
      JSON.parse(await fs.readFile(messagesPath, 'utf8'));
    } catch {
      errors.push({
        level: 'error',
        code: 'invalid_messages_json',
        message: `Messages file for locale ${locale} is not valid JSON`,
        siteId: site.id,
        file: messagesPath
      });
    }
  }

  return { errors, warnings };
}

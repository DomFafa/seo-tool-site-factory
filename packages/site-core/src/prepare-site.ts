import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildContentManifest, type ContentManifest } from './content.js';
import { validateAllSites, type LoadedSite } from './registry.js';

export type PreparedSite = {
  site: LoadedSite;
  contentManifest: ContentManifest;
  generatedFiles: {
    site: string;
    theme: string;
    contentManifest: string;
  };
};

export type PrepareSelectedSiteOptions = {
  siteId?: string;
  rootDir?: string;
  generatedDir?: string;
};

export function resolveSelectedSiteId(siteId = process.env.SITE_ID): string {
  const selectedSiteId = siteId?.trim();
  if (!selectedSiteId) {
    throw new Error('SITE_ID is required');
  }
  return selectedSiteId;
}

export async function prepareSelectedSite(options: PrepareSelectedSiteOptions = {}): Promise<PreparedSite> {
  const rootDir = options.rootDir ?? process.cwd();
  const siteId = resolveSelectedSiteId(options.siteId);
  const generatedDir = options.generatedDir ?? path.join(rootDir, 'apps', 'web', '.generated');
  const { sites, result } = await validateAllSites(rootDir);
  const site = sites.find((candidate) => candidate.id === siteId);

  if (!site) {
    throw new Error(`Unknown site "${siteId}"`);
  }

  if (result.errors.length > 0) {
    const messages = result.errors.map((issue) => `${issue.code}: ${issue.message}`).join('\n');
    throw new Error(`Cannot prepare selected site because validation failed:\n${messages}`);
  }

  const themePath = path.join(site.dir, 'theme.ts');
  const importedTheme = await import(pathToFileURL(themePath).href);
  const theme = importedTheme.default;
  const contentManifest = await buildContentManifest(site.dir, site.config, rootDir);

  await fs.mkdir(generatedDir, { recursive: true });

  const siteFile = path.join(generatedDir, 'site.ts');
  const themeFile = path.join(generatedDir, 'theme.ts');
  const manifestFile = path.join(generatedDir, 'content-manifest.json');

  await fs.writeFile(
    siteFile,
    `export const selectedSite = ${JSON.stringify(site.config, null, 2)} as const;\n\nexport default selectedSite;\n`
  );
  await fs.writeFile(
    themeFile,
    `export const selectedTheme = ${JSON.stringify(theme, null, 2)} as const;\n\nexport default selectedTheme;\n`
  );
  await fs.writeFile(manifestFile, `${JSON.stringify(contentManifest, null, 2)}\n`);

  return {
    site,
    contentManifest,
    generatedFiles: {
      site: siteFile,
      theme: themeFile,
      contentManifest: manifestFile
    }
  };
}

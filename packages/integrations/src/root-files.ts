import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { SiteContext } from '@factory/site-core';

type Manifest = { files: string[] };

function readManifest(publicDir: string): Manifest {
  const file = join(publicDir, '.generated-public-manifest.json');
  if (!existsSync(file)) return { files: [] };
  try { return JSON.parse(readFileSync(file, 'utf8')) as Manifest; } catch { return { files: [] }; }
}

function writeManifest(publicDir: string, manifest: Manifest) {
  writeFileSync(join(publicDir, '.generated-public-manifest.json'), JSON.stringify(manifest, null, 2));
}

function writeGenerated(publicDir: string, relPath: string, content: string, files: string[]) {
  const target = join(publicDir, relPath);
  mkdirSync(join(target, '..'), { recursive: true });
  writeFileSync(target, content);
  files.push(relPath);
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generatedOgImage(ctx: SiteContext): string {
  const primary = ctx.themeConfig.colors?.primary ?? '#2563eb';
  const bg = '#f8fafc';
  const title = escapeXml(ctx.siteConfig.seo.defaultTitle || ctx.siteConfig.brandName);
  const description = escapeXml(ctx.siteConfig.primaryKeyword || ctx.siteConfig.category);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${bg}"/>
  <circle cx="1030" cy="110" r="180" fill="${primary}" opacity="0.14"/>
  <circle cx="120" cy="540" r="190" fill="${primary}" opacity="0.10"/>
  <rect x="72" y="72" width="1056" height="486" rx="42" fill="white" stroke="${primary}" stroke-opacity="0.22"/>
  <text x="110" y="180" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="34" font-weight="700" fill="${primary}">${escapeXml(ctx.siteConfig.brandName)}</text>
  <text x="110" y="292" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="74" font-weight="800" fill="#0f172a">${title}</text>
  <text x="110" y="382" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="34" font-weight="500" fill="#475569">${description}</text>
  <text x="110" y="500" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="26" font-weight="600" fill="#64748b">Free browser-based tool</text>
</svg>`;
}

function headersFile(): string {
  return `/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/sitemap.xml
  Cache-Control: public, max-age=3600

/sitemaps/*
  Cache-Control: public, max-age=3600

/robots.txt
  Cache-Control: public, max-age=3600

/ads.txt
  Cache-Control: public, max-age=3600

/og-image.svg
  Cache-Control: public, max-age=86400
`;
}

export function prepareGeneratedPublicFiles(ctx: SiteContext, appPublicDir: string): string[] {
  mkdirSync(appPublicDir, { recursive: true });
  const previous = readManifest(appPublicDir);
  for (const rel of previous.files) {
    const target = join(appPublicDir, rel);
    if (existsSync(target)) rmSync(target, { force: true });
  }
  const files: string[] = [];
  writeGenerated(appPublicDir, '_headers', headersFile(), files);
  if (ctx.siteConfig.seo.ogImage?.mode !== 'none') writeGenerated(appPublicDir, 'og-image.svg', generatedOgImage(ctx), files);
  const adsTxt = ctx.integrationsConfig.ads.adsTxt;
  if (adsTxt.enabled && adsTxt.entries.length > 0) writeGenerated(appPublicDir, 'ads.txt', adsTxt.entries.join('\n') + '\n', files);
  const indexNow = ctx.integrationsConfig.indexing.indexNow;
  if (indexNow.enabled && indexNow.key && indexNow.keyFile) writeGenerated(appPublicDir, indexNow.keyFile, indexNow.key + '\n', files);
  const gsc = ctx.integrationsConfig.webmaster.googleSearchConsole;
  if (gsc.enabled && gsc.verification?.method === 'html-file' && gsc.verification.fileName && gsc.verification.fileContent) writeGenerated(appPublicDir, gsc.verification.fileName, gsc.verification.fileContent, files);
  const bing = ctx.integrationsConfig.webmaster.bingWebmaster;
  if (bing.enabled && (bing.verification?.method === 'html-file' || bing.verification?.method === 'xml-file') && bing.verification.fileName && bing.verification.fileContent) writeGenerated(appPublicDir, bing.verification.fileName, bing.verification.fileContent, files);
  const staticDir = join(ctx.siteDir, 'static');
  if (existsSync(staticDir)) {
    for (const name of readdirSync(staticDir)) {
      const src = join(staticDir, name);
      const rel = basename(name);
      if (existsSync(src)) writeGenerated(appPublicDir, rel, readFileSync(src, 'utf8'), files);
    }
  }
  writeManifest(appPublicDir, { files });
  return files;
}

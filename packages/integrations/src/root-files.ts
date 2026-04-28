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

export function prepareGeneratedPublicFiles(ctx: SiteContext, appPublicDir: string): string[] {
  mkdirSync(appPublicDir, { recursive: true });
  const previous = readManifest(appPublicDir);
  for (const rel of previous.files) {
    const target = join(appPublicDir, rel);
    if (existsSync(target)) rmSync(target, { force: true });
  }
  const files: string[] = [];
  const adsTxt = ctx.integrationsConfig.ads.adsTxt;
  if (adsTxt.enabled && adsTxt.entries.length > 0) {
    writeGenerated(appPublicDir, 'ads.txt', adsTxt.entries.join('\n') + '\n', files);
  }
  const indexNow = ctx.integrationsConfig.indexing.indexNow;
  if (indexNow.enabled && indexNow.key && indexNow.keyFile) {
    writeGenerated(appPublicDir, indexNow.keyFile, indexNow.key + '\n', files);
  }
  const gsc = ctx.integrationsConfig.webmaster.googleSearchConsole;
  if (gsc.enabled && gsc.verification?.method === 'html-file' && gsc.verification.fileName && gsc.verification.fileContent) {
    writeGenerated(appPublicDir, gsc.verification.fileName, gsc.verification.fileContent, files);
  }
  const bing = ctx.integrationsConfig.webmaster.bingWebmaster;
  if (bing.enabled && (bing.verification?.method === 'html-file' || bing.verification?.method === 'xml-file') && bing.verification.fileName && bing.verification.fileContent) {
    writeGenerated(appPublicDir, bing.verification.fileName, bing.verification.fileContent, files);
  }
  const staticDir = join(ctx.siteDir, 'static');
  if (existsSync(staticDir)) {
    for (const name of readdirSync(staticDir)) {
      const src = join(staticDir, name);
      const rel = basename(name);
      if (existsSync(src)) {
        writeGenerated(appPublicDir, rel, readFileSync(src, 'utf8'), files);
      }
    }
  }
  writeManifest(appPublicDir, { files });
  return files;
}

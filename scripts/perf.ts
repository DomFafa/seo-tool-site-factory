#!/usr/bin/env tsx
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { findWorkspaceRoot, listSiteIds } from '@factory/site-core';

const workspaceRoot = findWorkspaceRoot();
const [command, maybeSiteId] = process.argv.slice(2);
const isAll = maybeSiteId === '--all';

function usage(): void {
  console.log(`Usage:
  pnpm perf audit <site-id>|--all
`);
}

function targetSiteIds(): string[] {
  if (isAll) return listSiteIds(workspaceRoot);
  if (!maybeSiteId || maybeSiteId.startsWith('--')) {
    usage();
    process.exit(1);
  }
  return [maybeSiteId];
}

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full)); else out.push(full);
  }
  return out;
}

function htmlScriptRefs(html: string): string[] {
  const refs = new Set<string>();
  for (const match of html.matchAll(/["'](\/_astro\/[^"']+\.js)["']/g)) refs.add(match[1]);
  return [...refs];
}

function staticImports(js: string): string[] {
  const refs = new Set<string>();
  const patterns = [
    /\bimport\s+["'](\.{1,2}\/[^"']+\.js)["']/g,
    /\bfrom\s+["'](\.{1,2}\/[^"']+\.js)["']/g
  ];
  for (const pattern of patterns) {
    for (const match of js.matchAll(pattern)) refs.add(match[1]);
  }
  return [...refs];
}

function reachableJsFiles(dist: string): string[] {
  const htmlFiles = walk(dist).filter((file) => file.endsWith('.html'));
  const queue = htmlFiles.flatMap((file) => htmlScriptRefs(readFileSync(file, 'utf8')).map((ref) => join(dist, ref.slice(1))));
  const seen = new Set<string>();
  while (queue.length > 0) {
    const file = resolve(queue.shift() ?? '');
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    const js = readFileSync(file, 'utf8');
    for (const ref of staticImports(js)) queue.push(resolve(dirname(file), ref));
  }
  return [...seen];
}

function rawKb(files: string[]): number {
  return files.reduce((sum, file) => sum + statSync(file).size, 0) / 1024;
}

function gzipKb(files: string[]): number {
  return files.reduce((sum, file) => sum + gzipSync(readFileSync(file)).length, 0) / 1024;
}

if (command !== 'audit') {
  usage();
  process.exit(command ? 1 : 0);
}

let failed = false;
for (const siteId of targetSiteIds()) {
  const dist = join(workspaceRoot, 'dist', 'sites', siteId);
  const assets = join(dist, '_astro');
  if (!existsSync(dist)) {
    console.log(`\n${siteId}: build output missing at dist/sites/${siteId}`);
    failed = true;
    continue;
  }
  const css = walk(assets).filter((file) => file.endsWith('.css'));
  const js = reachableJsFiles(dist);
  const jsRawKb = rawKb(js);
  const jsGzipKb = gzipKb(js);
  const cssKb = rawKb(css);
  const warnings: string[] = [];
  if (jsGzipKb > 80) warnings.push(`reachable client JS ${jsGzipKb.toFixed(1)} KiB gzip > 80 KiB`);
  if (cssKb > 80) warnings.push(`CSS ${cssKb.toFixed(1)} KiB > 80 KiB`);
  console.log(`\n${siteId}: JS=${jsGzipKb.toFixed(1)} KiB gzip / ${jsRawKb.toFixed(1)} KiB raw, CSS=${cssKb.toFixed(1)} KiB${warnings.length ? `\n  warnings: ${warnings.join('; ')}` : ''}`);
}
if (failed) process.exit(1);

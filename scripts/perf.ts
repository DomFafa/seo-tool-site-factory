#!/usr/bin/env tsx
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
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
  const js = walk(assets).filter((file) => file.endsWith('.js'));
  const css = walk(assets).filter((file) => file.endsWith('.css'));
  const jsKb = js.reduce((sum, file) => sum + statSync(file).size, 0) / 1024;
  const cssKb = css.reduce((sum, file) => sum + statSync(file).size, 0) / 1024;
  const warnings: string[] = [];
  if (jsKb > 180) warnings.push(`client JS ${jsKb.toFixed(1)} KiB > 180 KiB`);
  if (cssKb > 80) warnings.push(`CSS ${cssKb.toFixed(1)} KiB > 80 KiB`);
  console.log(`\n${siteId}: JS=${jsKb.toFixed(1)} KiB, CSS=${cssKb.toFixed(1)} KiB${warnings.length ? `\n  warnings: ${warnings.join('; ')}` : ''}`);
}
if (failed) process.exit(1);

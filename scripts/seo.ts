#!/usr/bin/env tsx
import { auditSiteSeo, lintSitePublicContent, type SeoIssue } from '@factory/seo';
import { findWorkspaceRoot, listSiteIds, loadSiteContext } from '@factory/site-core';

const workspaceRoot = findWorkspaceRoot();
const [command, maybeSiteId] = process.argv.slice(2);
const isAll = maybeSiteId === '--all';

function usage(): void {
  console.log(`Usage:
  pnpm seo audit <site-id>|--all
  pnpm seo lint-content <site-id>|--all
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

function print(siteId: string, issues: SeoIssue[]): void {
  const p0 = issues.filter((i) => i.level === 'P0').length;
  const p1 = issues.filter((i) => i.level === 'P1').length;
  const p2 = issues.filter((i) => i.level === 'P2').length;
  console.log(`\n${siteId}: P0=${p0}, P1=${p1}, P2=${p2}`);
  for (const item of issues) console.log(`  [${item.level}] ${item.code}: ${item.message}${item.file ? ` (${item.file})` : ''}`);
}

async function main(): Promise<void> {
  if (command !== 'audit' && command !== 'lint-content') {
    usage();
    process.exit(command ? 1 : 0);
  }
  let failed = false;
  for (const siteId of targetSiteIds()) {
    const ctx = loadSiteContext(siteId, workspaceRoot);
    const issues = command === 'audit' ? await auditSiteSeo(ctx) : lintSitePublicContent(ctx);
    print(siteId, issues);
    if (issues.some((issue) => issue.level === 'P0')) failed = true;
  }
  if (failed) process.exit(1);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

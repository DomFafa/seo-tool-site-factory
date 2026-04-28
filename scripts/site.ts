#!/usr/bin/env tsx
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prepareGeneratedPublicFiles, submitIndexNow, verifyOnlineIntegrations } from '@factory/integrations';
import { findWorkspaceRoot, hasBlockingIssues, listSiteIds, loadSiteContext, validateAllSites, validateSiteContext } from '@factory/site-core';

const workspaceRoot = findWorkspaceRoot();
const [command, maybeSiteId, ...args] = process.argv.slice(2);

function usage() {
  console.log(`Usage:
  pnpm site list
  pnpm site create <site-id> --category <category> --tool <tool-id> --default-locale <locale>
  pnpm site check <site-id>|--all
  pnpm site check-integrations <site-id>
  pnpm site dev <site-id>
  pnpm site build <site-id>
  pnpm site preview <site-id>
  pnpm site deploy <site-id> --preview|--production
  pnpm site verify <site-id>
  pnpm site verify-integrations <site-id>
  pnpm site submit-indexnow <site-id>
`);
}

function run(cmd: string, cmdArgs: string[], env: Record<string, string> = {}) {
  const result = spawnSync(cmd, cmdArgs, {
    cwd: workspaceRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, FACTORY_ROOT: workspaceRoot, ...env }
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function requireSiteId(): string {
  if (!maybeSiteId || maybeSiteId.startsWith('--')) {
    usage();
    process.exit(1);
  }
  return maybeSiteId;
}

function prepare(siteId: string) {
  const ctx = loadSiteContext(siteId, workspaceRoot);
  const appPublicDir = join(workspaceRoot, 'apps', 'site', 'public');
  const files = prepareGeneratedPublicFiles(ctx, appPublicDir);
  if (files.length) console.log(`Generated public files for ${siteId}: ${files.join(', ')}`);
  return ctx;
}

function printIssues(siteId: string, issues: ReturnType<typeof validateSiteContext>) {
  const p0 = issues.filter((i) => i.level === 'P0').length;
  const p1 = issues.filter((i) => i.level === 'P1').length;
  const p2 = issues.filter((i) => i.level === 'P2').length;
  console.log(`\n${siteId}: P0=${p0}, P1=${p1}, P2=${p2}`);
  for (const issue of issues) console.log(`  [${issue.level}] ${issue.code}: ${issue.message}`);
}

switch (command) {
  case 'list': {
    for (const siteId of listSiteIds(workspaceRoot)) {
      const ctx = loadSiteContext(siteId, workspaceRoot);
      console.log(`${siteId}\t${ctx.siteConfig.domains.canonicalHost}\t${ctx.siteConfig.lifecycle.status}\t${ctx.siteConfig.primaryTool}`);
    }
    break;
  }
  case 'create': {
    const siteId = requireSiteId();
    createSite(siteId, args);
    break;
  }
  case 'check': {
    if (maybeSiteId === '--all') {
      let failed = false;
      for (const [siteId, issues] of validateAllSites(workspaceRoot)) {
        printIssues(siteId, issues);
        if (hasBlockingIssues(issues)) failed = true;
      }
      if (failed) process.exit(1);
      break;
    }
    const siteId = requireSiteId();
    const ctx = loadSiteContext(siteId, workspaceRoot);
    const issues = validateSiteContext(ctx);
    printIssues(siteId, issues);
    if (hasBlockingIssues(issues)) process.exit(1);
    break;
  }
  case 'check-integrations': {
    const siteId = requireSiteId();
    const ctx = loadSiteContext(siteId, workspaceRoot);
    console.log(JSON.stringify(ctx.integrationsConfig, null, 2));
    const issues = validateSiteContext(ctx).filter((issue) => issue.code.includes('ADS') || issue.code.includes('GA') || issue.code.includes('CLARITY') || issue.code.includes('INDEXNOW'));
    printIssues(siteId, issues);
    if (hasBlockingIssues(issues)) process.exit(1);
    break;
  }
  case 'dev': {
    const siteId = requireSiteId();
    prepare(siteId);
    run('pnpm', ['--filter', '@factory/site', 'dev'], { SITE_ID: siteId });
    break;
  }
  case 'build': {
    const siteId = requireSiteId();
    const ctx = prepare(siteId);
    const issues = validateSiteContext(ctx);
    printIssues(siteId, issues);
    if (hasBlockingIssues(issues)) process.exit(1);
    run('pnpm', ['--filter', '@factory/site', 'build'], { SITE_ID: siteId });
    break;
  }
  case 'preview': {
    const siteId = requireSiteId();
    run('pnpm', ['--filter', '@factory/site', 'preview'], { SITE_ID: siteId });
    break;
  }
  case 'deploy': {
    const siteId = requireSiteId();
    const production = args.includes('--production');
    const preview = args.includes('--preview');
    if (!production && !preview) throw new Error('Pass --preview or --production.');
    const ctx = prepare(siteId);
    const issues = validateSiteContext(ctx);
    printIssues(siteId, issues);
    if (hasBlockingIssues(issues)) process.exit(1);
    run('pnpm', ['--filter', '@factory/site', 'build'], { SITE_ID: siteId });
    const outputDir = join('dist', 'sites', siteId);
    const branch = production ? 'main' : 'preview';
    run('pnpm', ['exec', 'wrangler', 'pages', 'deploy', outputDir, '--project-name', ctx.siteConfig.deployment.projectName, '--branch', branch], { SITE_ID: siteId });
    break;
  }
  case 'verify':
  case 'verify-integrations': {
    const siteId = requireSiteId();
    const ctx = loadSiteContext(siteId, workspaceRoot);
    const results = await verifyOnlineIntegrations(ctx);
    for (const result of results) console.log(`${result.ok ? '✓' : '✗'} ${result.label}: ${result.message}`);
    if (results.some((r) => !r.ok)) process.exit(1);
    break;
  }
  case 'submit-indexnow': {
    const siteId = requireSiteId();
    const ctx = loadSiteContext(siteId, workspaceRoot);
    const result = await submitIndexNow(ctx);
    console.log(`${result.ok ? '✓' : '✗'} HTTP ${result.status}: ${result.message}`);
    if (!result.ok) process.exit(1);
    break;
  }
  default:
    usage();
    process.exit(command ? 1 : 0);
}

function argValue(name: string, fallback = ''): string {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] ?? fallback : fallback;
}

function createSite(siteId: string, createArgs: string[]) {
  const category = argValue('--category', 'generator');
  const tool = argValue('--tool', siteId);
  const locale = argValue('--default-locale', 'en');
  const siteDir = join(workspaceRoot, 'sites', siteId);
  if (existsSync(siteDir)) throw new Error(`Site already exists: ${siteDir}`);
  mkdirSync(join(siteDir, 'content', locale, 'guides'), { recursive: true });
  mkdirSync(join(siteDir, 'messages'), { recursive: true });
  mkdirSync(join(siteDir, 'static'), { recursive: true });
  mkdirSync(join(siteDir, 'snippets', 'ads'), { recursive: true });
  writeFileSync(join(siteDir, 'brief.yaml'), `schemaVersion: 1\nprimaryKeyword: ${siteId.replaceAll('-', ' ')}\ncategory: ${category}\nintent:\n  userJob: \"Describe the user's job here.\"\nproductBoundary:\n  thisSiteIs: []\n  thisSiteIsNot: []\n`);
  writeFileSync(join(siteDir, 'site.config.yaml'), `schemaVersion: 1\nid: ${siteId}\nbrandName: ${title(siteId)}\ncategory: ${category}\nprimaryKeyword: ${siteId.replaceAll('-', ' ')}\nlifecycle:\n  status: draft\ndomains:\n  production: example.com\n  canonicalHost: example.com\n  aliases: []\ndefaultLocale: ${locale}\nlocales:\n  ${locale}:\n    enabled: true\n    indexable: false\n    reviewed: false\nindexing:\n  allowIndex: false\nprimaryTool: ${tool}\nseo:\n  defaultTitle: ${title(siteId)}\n  defaultDescription: ${title(siteId)} online tool.\n  xDefaultLocale: ${locale}\n  structuredData:\n    - WebSite\n    - WebPage\ndeployment:\n  provider: cloudflare-pages\n  projectName: seo-tool-${siteId}\n  outputDir: dist/sites/${siteId}\n`);
  writeFileSync(join(siteDir, 'tool.config.yaml'), `schemaVersion: 1\ntoolId: ${tool}\nexecutionModel: client-only\nprivacy:\n  storesUserInput: false\nanalytics:\n  safeFields:\n    - locale\noptions: {}\n`);
  writeFileSync(join(siteDir, 'theme.config.yaml'), `schemaVersion: 1\nname: ${siteId}\ncolors:\n  primary: \"#2563eb\"\nradius: 18px\nlayout: tool-first\nadLayout:\n  avoidPrimaryActions: true\n  disableOnToolResultPanel: true\n`);
  writeFileSync(join(siteDir, 'integrations.config.yaml'), `schemaVersion: 1\nconsent:\n  enabled: false\n  googleConsentMode: false\n  clarityConsentMode: false\nads:\n  enabled: false\n  activeProvider: adsense\n  adsTxt:\n    enabled: false\n    entries: []\n  providers:\n    adsense:\n      enabled: false\n      publisherId: \"\"\n      slots: {}\n    adsterra:\n      enabled: false\n      placements: {}\nanalytics:\n  googleAnalytics:\n    enabled: false\n  microsoftClarity:\n    enabled: false\nwebmaster:\n  googleSearchConsole:\n    enabled: false\n  bingWebmaster:\n    enabled: false\nindexing:\n  indexNow:\n    enabled: false\n`);
  writeFileSync(join(siteDir, 'content', locale, 'home.mdx'), `---\ntitle: \"${title(siteId)}\"\ndescription: \"Use this online tool for ${siteId.replaceAll('-', ' ')}.\"\nslug: \"${siteId}\"\nlastModified: \"${new Date().toISOString().slice(0, 10)}\"\nindex: false\ncontentStatus: draft\n---\n\n## About this tool\n\nDescribe what the tool does and add real examples before enabling indexing.\n`);
  writeFileSync(join(siteDir, 'content', locale, 'faq.mdx'), `---\ntitle: \"${title(siteId)} FAQ\"\ndescription: \"Frequently asked questions about ${siteId.replaceAll('-', ' ')}.\"\nslug: \"faq\"\nlastModified: \"${new Date().toISOString().slice(0, 10)}\"\nindex: false\ncontentStatus: draft\n---\n\n## FAQ\n\n### Is this tool free?\n\nYes. Update this FAQ with accurate site-specific answers.\n`);
  writeFileSync(join(siteDir, 'messages', `${locale}.yaml`), `tool:\n  start: Start\n`);
  console.log(`Created site pack: sites/${siteId}`);
}

function title(value: string) {
  return value.split('-').map((part) => part.slice(0, 1).toUpperCase() + part.slice(1)).join(' ');
}

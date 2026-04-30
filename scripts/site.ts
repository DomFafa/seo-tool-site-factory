#!/usr/bin/env tsx
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prepareGeneratedPublicFiles, submitIndexNow, verifyOnlineIntegrations } from '@factory/integrations';
import { runWranglerPagesDeploy } from './lib/wrangler';
import {
  findWorkspaceRoot,
  getCloudflareAccountAliasForSite,
  getCloudflareEnvForSite,
  hasBlockingIssues,
  listSiteIds,
  loadSiteContext,
  validateAllSites,
  validateSiteContext
} from '@factory/site-core';

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
  pnpm site ui-audit <site-id>|--all

Deployment uses the site's deployment.accountAlias and cloudflare.accounts.yaml.
Do not rely on a globally logged-in Wrangler account for production deploys.
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
  prepareSelectedToolIsland(ctx.siteConfig.primaryTool);
  const appPublicDir = join(workspaceRoot, 'apps', 'site', 'public');
  const files = prepareGeneratedPublicFiles(ctx, appPublicDir);
  if (files.length) console.log(`Generated public files for ${siteId}: ${files.join(', ')}`);
  return ctx;
}

function prepareSelectedToolIsland(toolId: string) {
  const generatedDir = join(workspaceRoot, 'apps', 'site', 'src', '.generated');
  mkdirSync(generatedDir, { recursive: true });
  const selected = selectedToolFor(toolId);
  writeFileSync(join(generatedDir, 'SelectedToolIsland.tsx'), selected.componentSource);
  writeFileSync(join(generatedDir, 'SelectedToolRenderer.astro'), selected.rendererSource);
  writeFileSync(join(generatedDir, 'selected-tool-meta.ts'), selectedToolMetaSource(selected.meta));
}

function selectedToolFor(toolId: string): { componentSource: string; rendererSource: string; meta: Record<string, string> } {
  const typingToolIds = new Set(['typing-speed-test', 'typing-practice', 'typing-practice-paragraph', 'typing-test-online']);
  if (typingToolIds.has(toolId)) {
    return reactTool('../features/typing-test/TypingTestIsland', { renderer: 'react', toolId, mode: '' });
  }
  if (toolId === 'convert-image-to-png') {
    return reactTool('../features/image-converter/ImageConverterIsland', { renderer: 'react', toolId, mode: '' });
  }
  if (toolId === 'cursive-generator') {
    return vanillaTextGenerator(toolId, 'cursive');
  }
  if (toolId === 'cursed-text-generator') {
    return reactTool('../features/cursed-text-generator/CursedTextGeneratorIsland', { renderer: 'react', toolId, mode: '' });
  }
  if (toolId === 'anagram-solver') {
    return reactTool('../features/anagram-solver/AnagramSolverIsland', { renderer: 'react', toolId, mode: '' });
  }
  if (toolId === 'cursive-alphabet') {
    return reactTool('../features/cursive-alphabet/CursiveAlphabetIsland', { renderer: 'react', toolId, mode: '' });
  }
  if (toolId === 'spellcheck') {
    return reactTool('../features/spellcheck/SpellcheckIsland', { renderer: 'react', toolId, mode: '' });
  }
  throw new Error(`Tool renderer for ${toolId} is not implemented yet.`);
}

function reactTool(importPath: string, meta: Record<string, string>) {
  const modeProp = meta.mode ? ` mode="${meta.mode}"` : '';
  return {
    meta,
    componentSource: `import ToolIsland from '${importPath}';\n\ntype SelectedToolProps = { locale: string; config: any };\n\nexport default function SelectedToolIsland(props: SelectedToolProps) {\n  return <ToolIsland {...props}${modeProp} />;\n}\n`,
    rendererSource: `---\nimport SelectedToolIsland from './SelectedToolIsland.tsx';\ninterface Props { locale: string; config: any; }\nconst { locale, config } = Astro.props;\n---\n<SelectedToolIsland client:load locale={locale} config={config} />\n`
  };
}

function vanillaTextGenerator(toolId: string, mode: 'cursive' | 'cursed') {
  return {
    meta: { renderer: 'vanilla-text-generator', toolId, mode },
    componentSource: `export default function SelectedToolIsland() {\n  return null;\n}\n`,
    rendererSource: `---\nimport VanillaTextGenerator from '../features/text-generator/VanillaTextGenerator.astro';\ninterface Props { locale: string; config: any; }\nconst { locale, config } = Astro.props;\n---\n<VanillaTextGenerator locale={locale} config={config} mode="${mode}" />\n`
  };
}

function selectedToolMetaSource(meta: Record<string, string>) {
  return `export const selectedToolMeta = ${JSON.stringify(meta, null, 2)} as {\n  readonly renderer: 'react' | 'vanilla-text-generator';\n  readonly toolId: string;\n  readonly mode: '' | 'cursive' | 'cursed';\n};\n`;
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
      const accountAlias = getCloudflareAccountAliasForSite(ctx);
      console.log(`${siteId}\t${ctx.siteConfig.domains.canonicalHost}\t${ctx.siteConfig.lifecycle.status}\t${ctx.siteConfig.primaryTool}\tcf:${accountAlias}`);
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
    const cfEnv = getCloudflareEnvForSite(ctx);
    console.log(`Deploying ${siteId} to Cloudflare account profile "${getCloudflareAccountAliasForSite(ctx)}".`);
    runWranglerPagesDeploy(
      workspaceRoot,
      [outputDir, '--project-name', ctx.siteConfig.deployment.projectName, '--branch', branch],
      { SITE_ID: siteId, ...cfEnv }
    );
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
  case 'ui-audit': {
    const target = maybeSiteId ?? '--all';
    run('pnpm', ['exec', 'tsx', 'scripts/ui-audit.ts', target, ...args]);
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
  const accountAlias = argValue('--cloudflare-account', siteId);
  const siteDir = join(workspaceRoot, 'sites', siteId);
  if (existsSync(siteDir)) throw new Error(`Site already exists: ${siteDir}`);
  mkdirSync(join(siteDir, 'content', locale, 'guides'), { recursive: true });
  mkdirSync(join(siteDir, 'messages'), { recursive: true });
  mkdirSync(join(siteDir, 'static'), { recursive: true });
  mkdirSync(join(siteDir, 'snippets', 'ads'), { recursive: true });
  writeFileSync(join(siteDir, 'brief.yaml'), `schemaVersion: 1\nprimaryKeyword: ${siteId.replaceAll('-', ' ')}\ncategory: ${category}\nintent:\n  userJob: \"Describe the user's job here.\"\nproductBoundary:\n  thisSiteIs: []\n  thisSiteIsNot: []\n`);
  writeFileSync(join(siteDir, 'site.config.yaml'), `schemaVersion: 1\nid: ${siteId}\nbrandName: ${title(siteId)}\ncategory: ${category}\nprimaryKeyword: ${siteId.replaceAll('-', ' ')}\nlifecycle:\n  status: draft\nlaunch:\n  stage: pages-dev\ndomains:\n  production: example.com\n  canonicalHost: example.com\n  aliases: []\ndefaultLocale: ${locale}\nlocales:\n  ${locale}:\n    enabled: true\n    indexable: false\n    reviewed: false\nindexing:\n  allowIndex: false\n  mode: disallow\nprimaryTool: ${tool}\nseo:\n  defaultTitle: ${title(siteId)}\n  defaultDescription: ${title(siteId)} online tool.\n  xDefaultLocale: ${locale}\n  structuredData:\n    - WebSite\n    - WebPage\n  sitemap:\n    split: false\n  ogImage:\n    mode: generated\n    path: /og-image.svg\n  pagesDevRedirect:\n    status: unknown\ndeployment:\n  provider: cloudflare-pages\n  accountAlias: ${accountAlias}\n  projectName: seo-tool-${siteId}\n  outputDir: dist/sites/${siteId}\n`);
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

#!/usr/bin/env tsx
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';
import matter from 'gray-matter';
import {
  findWorkspaceRoot,
  getCloudflareAccountAliasForSite,
  loadSiteContext,
  resolveCloudflareAccountForSite,
  type ResolvedCloudflareAccount
} from '@factory/site-core';

type LaunchSite = {
  cloudflareAccount?: string;
  domain: string;
  projectName?: string;
  zoneName?: string;
  mode?: 'noindex-first' | 'live';
  integrations?: {
    googleAnalytics?: { measurementId?: string };
    microsoftClarity?: { projectId?: string; consentMode?: boolean };
    googleSearchConsole?: {
      enabled?: boolean;
      propertyType?: 'url-prefix' | 'domain';
      verification?: {
        method?: 'none' | 'meta' | 'html-file' | 'dns';
        metaName?: string;
        content?: string;
        fileName?: string;
        fileContent?: string;
      };
    };
    bingWebmaster?: {
      enabled?: boolean;
      verification?: {
        method?: 'none' | 'meta' | 'xml-file' | 'dns' | 'import-from-gsc';
        metaName?: string;
        content?: string;
        fileName?: string;
        fileContent?: string;
      };
    };
    indexNow?: {
      enabled?: boolean;
      key?: string;
      keyFile?: string;
      submitOnProductionDeploy?: boolean;
    };
    ads?: {
      adsTxtEntries?: string[];
      activeProvider?: 'adsense' | 'adsterra';
      adsense?: {
        enabled?: boolean;
        publisherId?: string;
        siteStatus?: 'not_submitted' | 'pending_review' | 'approved' | 'rejected' | 'disabled';
        verificationContent?: string;
      };
      adsterra?: {
        enabled?: boolean;
        siteStatus?: 'not_submitted' | 'pending_verification' | 'verified' | 'rejected' | 'disabled';
      };
    };
  };
};

type LaunchConfig = {
  schemaVersion: number;
  defaults?: {
    mode?: 'noindex-first' | 'live';
    createDnsRecords?: boolean;
  };
  sites: Record<string, LaunchSite>;
};

type CfZone = { id: string; name: string; status: string };
type CfPageDomain = { name?: string; status?: string; [key: string]: unknown };

const workspaceRoot = findWorkspaceRoot();
const launchConfigPath = join(workspaceRoot, 'domains.launch.yaml');
const [command, maybeSiteId, ...args] = process.argv.slice(2);
const isAll = maybeSiteId === '--all';
const dryRun = args.includes('--dry-run');
const ensureDns = args.includes('--ensure-dns');
const yes = args.includes('--yes');

function usage(): void {
  console.log(`Usage:
  pnpm domain list
  pnpm domain plan <site-id>|--all
  pnpm domain check <site-id>|--all
  pnpm domain bind <site-id>|--all [--dry-run] [--ensure-dns]
  pnpm domain configure <site-id>|--all [--dry-run]
  pnpm domain deploy <site-id>|--all
  pnpm domain verify <site-id>|--all
  pnpm domain go-live <site-id> --yes [--dry-run]

Cloudflare accounts are resolved per site from:
  cloudflare.accounts.yaml
  sites/<site-id>/site.config.yaml deployment.accountAlias
  domains.launch.yaml sites.<site-id>.cloudflareAccount override

Deployments are intentionally local-only. GitHub Actions should run checks/builds only, not deploy.
`);
}

function readYamlFile<T>(filePath: string): T {
  if (!existsSync(filePath)) throw new Error(`Missing file: ${filePath}`);
  return YAML.parse(readFileSync(filePath, 'utf8')) as T;
}

function writeYamlFile(filePath: string, data: unknown): void {
  writeFileSync(filePath, YAML.stringify(data, { lineWidth: 0 }));
}

function loadLaunchConfig(): LaunchConfig {
  const config = readYamlFile<LaunchConfig>(launchConfigPath);
  if (!config.sites || typeof config.sites !== 'object') throw new Error('domains.launch.yaml must contain a sites object.');
  return config;
}

function targetSiteIds(config: LaunchConfig): string[] {
  if (isAll) return Object.keys(config.sites).sort();
  if (!maybeSiteId || maybeSiteId.startsWith('--')) {
    usage();
    process.exit(1);
  }
  return [maybeSiteId];
}

function getLaunchSite(config: LaunchConfig, siteId: string): Required<Pick<LaunchSite, 'projectName'>> & LaunchSite {
  const item = config.sites[siteId];
  if (!item) throw new Error(`Site ${siteId} is not present in domains.launch.yaml.`);
  const ctx = loadSiteContext(siteId, workspaceRoot);
  return {
    ...item,
    cloudflareAccount: item.cloudflareAccount ?? ctx.siteConfig.deployment.accountAlias ?? siteId,
    projectName: item.projectName ?? ctx.siteConfig.deployment.projectName
  };
}

function resolveCf(siteId: string, item: LaunchSite): ResolvedCloudflareAccount {
  const ctx = loadSiteContext(siteId, workspaceRoot);
  return resolveCloudflareAccountForSite(ctx, { accountAlias: item.cloudflareAccount });
}

function getDomainForSite(siteId: string, item: LaunchSite): string {
  const domain = (item.domain ?? '').trim();
  if (!domain) throw new Error(`${siteId}: fill domain in domains.launch.yaml first.`);
  if (domain.startsWith('www.')) throw new Error(`${siteId}: domain must be the primary host without www.; use ${domain.replace(/^www\./, '')}.`);
  return domain;
}

function getAliases(siteId: string, item: LaunchSite): string[] {
  return [`www.${getDomainForSite(siteId, item)}`];
}

function zoneNameFor(domain: string, item: LaunchSite): string {
  return item.zoneName || domain.replace(/^www\./, '');
}

async function cfRequest<T>(cf: ResolvedCloudflareAccount, path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${cf.apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cf.apiToken}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) {
    const errors = Array.isArray(payload?.errors) ? payload.errors.map((e: any) => e.message).join('; ') : '';
    throw new Error(`Cloudflare API ${init.method ?? 'GET'} ${path} failed for profile "${cf.alias}": HTTP ${response.status}${errors ? ` - ${errors}` : ''}`);
  }
  return payload as T;
}

async function listPagesDomains(cf: ResolvedCloudflareAccount, projectName: string): Promise<CfPageDomain[]> {
  const payload = await cfRequest<{ result?: CfPageDomain[] }>(cf, `/accounts/${cf.accountId}/pages/projects/${projectName}/domains`);
  return payload.result ?? [];
}

async function addPagesDomain(cf: ResolvedCloudflareAccount, projectName: string, domain: string): Promise<void> {
  await cfRequest(cf, `/accounts/${cf.accountId}/pages/projects/${projectName}/domains`, {
    method: 'POST',
    body: JSON.stringify({ name: domain })
  });
}

async function findZone(cf: ResolvedCloudflareAccount, item: LaunchSite, domain: string): Promise<CfZone | null> {
  const zoneName = zoneNameFor(domain, item);
  const payload = await cfRequest<{ result?: CfZone[] }>(cf, `/zones?name=${encodeURIComponent(zoneName)}`);
  return payload.result?.[0] ?? null;
}

async function ensureCnameRecord(cf: ResolvedCloudflareAccount, zoneId: string, name: string, target: string): Promise<string> {
  const existing = await cfRequest<{ result?: Array<{ id: string; type: string; name: string; content: string }> }>(
    cf,
    `/zones/${zoneId}/dns_records?name=${encodeURIComponent(name)}`
  );
  const records = existing.result ?? [];
  if (records.length > 0) {
    const matching = records.find((record) => record.type === 'CNAME' && record.content === target);
    if (matching) return `DNS OK: ${name} -> ${target}`;
    return `DNS SKIP: ${name} already has ${records.length} record(s). Review manually before changing.`;
  }
  if (dryRun) return `DRY RUN DNS CREATE: CNAME ${name} -> ${target}`;
  await cfRequest(cf, `/zones/${zoneId}/dns_records`, {
    method: 'POST',
    body: JSON.stringify({ type: 'CNAME', name, content: target, proxied: true })
  });
  return `DNS CREATED: CNAME ${name} -> ${target}`;
}

function run(cmd: string, cmdArgs: string[], env: Record<string, string> = {}): void {
  const result = spawnSync(cmd, cmdArgs, {
    cwd: workspaceRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...env }
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function updateSiteConfig(siteId: string, item: LaunchSite, mode: 'noindex-first' | 'live', dry = false): void {
  const sitePath = join(workspaceRoot, 'sites', siteId, 'site.config.yaml');
  const data = readYamlFile<any>(sitePath);
  const domain = getDomainForSite(siteId, item);
  data.domains = {
    ...(data.domains ?? {}),
    production: domain,
    canonicalHost: domain,
    aliases: getAliases(siteId, item)
  };
  data.deployment = {
    ...(data.deployment ?? {}),
    provider: 'cloudflare-pages',
    accountAlias: item.cloudflareAccount ?? data.deployment?.accountAlias ?? siteId,
    projectName: item.projectName,
    outputDir: `dist/sites/${siteId}`
  };
  if (mode === 'noindex-first') {
    data.lifecycle = { ...(data.lifecycle ?? {}), status: 'draft' };
    data.launch = { ...(data.launch ?? {}), stage: 'real-domain-noindex' };
    data.indexing = { ...(data.indexing ?? {}), allowIndex: false, mode: 'allow-noindex' };
  }
  if (mode === 'live') {
    data.lifecycle = { ...(data.lifecycle ?? {}), status: 'live' };
    data.launch = { ...(data.launch ?? {}), stage: 'real-domain-indexed' };
    data.indexing = { ...(data.indexing ?? {}), allowIndex: true, mode: 'index' };
    const defaultLocale = data.defaultLocale;
    data.locales = data.locales ?? {};
    data.locales[defaultLocale] = { ...(data.locales[defaultLocale] ?? {}), enabled: true, indexable: true, reviewed: true };
  }
  if (dry) {
    console.log(`[dry-run] would update ${sitePath}`);
    return;
  }
  writeYamlFile(sitePath, data);
}

function updateIntegrationsConfig(siteId: string, item: LaunchSite, dry = false): void {
  const integrations = item.integrations;
  if (!integrations) return;
  const filePath = join(workspaceRoot, 'sites', siteId, 'integrations.config.yaml');
  const data = readYamlFile<any>(filePath);

  if (integrations.googleAnalytics?.measurementId) {
    data.analytics ??= {};
    data.analytics.googleAnalytics ??= {};
    data.analytics.googleAnalytics.enabled = true;
    data.analytics.googleAnalytics.measurementId = integrations.googleAnalytics.measurementId;
    data.analytics.googleAnalytics.trackToolEvents ??= true;
  }

  if (integrations.microsoftClarity?.projectId) {
    data.analytics ??= {};
    data.analytics.microsoftClarity ??= {};
    data.analytics.microsoftClarity.enabled = true;
    data.analytics.microsoftClarity.projectId = integrations.microsoftClarity.projectId;
    if (typeof integrations.microsoftClarity.consentMode === 'boolean') {
      data.analytics.microsoftClarity.consentMode = integrations.microsoftClarity.consentMode;
    }
  }

  if (integrations.googleSearchConsole?.enabled || integrations.googleSearchConsole?.verification?.content) {
    data.webmaster ??= {};
    data.webmaster.googleSearchConsole ??= {};
    data.webmaster.googleSearchConsole.enabled = integrations.googleSearchConsole.enabled ?? true;
    data.webmaster.googleSearchConsole.propertyType = integrations.googleSearchConsole.propertyType ?? 'url-prefix';
    data.webmaster.googleSearchConsole.verification = {
      method: integrations.googleSearchConsole.verification?.method ?? 'meta',
      metaName: integrations.googleSearchConsole.verification?.metaName ?? 'google-site-verification',
      content: integrations.googleSearchConsole.verification?.content ?? '',
      fileName: integrations.googleSearchConsole.verification?.fileName ?? undefined,
      fileContent: integrations.googleSearchConsole.verification?.fileContent ?? undefined
    };
  }

  if (integrations.bingWebmaster?.enabled || integrations.bingWebmaster?.verification?.content || integrations.bingWebmaster?.verification?.method) {
    data.webmaster ??= {};
    data.webmaster.bingWebmaster ??= {};
    data.webmaster.bingWebmaster.enabled = integrations.bingWebmaster.enabled ?? true;
    data.webmaster.bingWebmaster.verification = {
      method: integrations.bingWebmaster.verification?.method ?? 'import-from-gsc',
      metaName: integrations.bingWebmaster.verification?.metaName ?? 'msvalidate.01',
      content: integrations.bingWebmaster.verification?.content ?? '',
      fileName: integrations.bingWebmaster.verification?.fileName ?? undefined,
      fileContent: integrations.bingWebmaster.verification?.fileContent ?? undefined
    };
  }

  if (integrations.indexNow?.enabled || integrations.indexNow?.key) {
    data.indexing ??= {};
    data.indexing.indexNow ??= {};
    data.indexing.indexNow.enabled = integrations.indexNow.enabled ?? true;
    data.indexing.indexNow.key = integrations.indexNow.key ?? data.indexing.indexNow.key ?? '';
    data.indexing.indexNow.keyFile = integrations.indexNow.keyFile ?? data.indexing.indexNow.keyFile ?? '';
    data.indexing.indexNow.submitOnProductionDeploy = integrations.indexNow.submitOnProductionDeploy ?? false;
  }

  if (integrations.ads) {
    data.ads ??= {};
    data.ads.enabled = false;
    data.ads.activeProvider = integrations.ads.activeProvider ?? data.ads.activeProvider ?? 'adsense';
    data.ads.adsTxt ??= {};
    if (integrations.ads.adsTxtEntries?.length) {
      data.ads.adsTxt.enabled = true;
      data.ads.adsTxt.entries = integrations.ads.adsTxtEntries;
    }
    data.ads.providers ??= {};
    if (integrations.ads.adsense) {
      data.ads.providers.adsense ??= {};
      data.ads.providers.adsense.enabled = integrations.ads.adsense.enabled ?? Boolean(integrations.ads.adsense.publisherId);
      if (integrations.ads.adsense.publisherId) data.ads.providers.adsense.publisherId = integrations.ads.adsense.publisherId;
      if (integrations.ads.adsense.siteStatus) data.ads.providers.adsense.siteStatus = integrations.ads.adsense.siteStatus;
      if (integrations.ads.adsense.verificationContent || integrations.ads.adsense.publisherId) {
        data.ads.providers.adsense.verification = {
          method: 'meta',
          metaName: 'google-adsense-account',
          content: integrations.ads.adsense.verificationContent ?? `ca-${String(integrations.ads.adsense.publisherId).replace(/^ca-/, '').replace(/^pub-/, 'pub-')}`
        };
      }
    }
    if (integrations.ads.adsterra) {
      data.ads.providers.adsterra ??= {};
      data.ads.providers.adsterra.enabled = integrations.ads.adsterra.enabled ?? false;
      if (integrations.ads.adsterra.siteStatus) data.ads.providers.adsterra.siteStatus = integrations.ads.adsterra.siteStatus;
    }
  }

  if (dry) {
    console.log(`[dry-run] would update ${filePath}`);
    return;
  }
  writeYamlFile(filePath, data);
}

function approveContent(siteId: string, dry = false): void {
  const ctx = loadSiteContext(siteId, workspaceRoot);
  const locale = ctx.siteConfig.defaultLocale;
  const contentDir = join(ctx.siteDir, 'content', locale);
  const files: string[] = [];
  for (const name of ['home.mdx', 'faq.mdx']) {
    const file = join(contentDir, name);
    if (existsSync(file)) files.push(file);
  }
  const guidesDir = join(contentDir, 'guides');
  if (existsSync(guidesDir)) {
    for (const file of readdirSync(guidesDir)) {
      if (file.endsWith('.md') || file.endsWith('.mdx')) files.push(join(guidesDir, file));
    }
  }
  for (const file of files) {
    const parsed = matter(readFileSync(file, 'utf8'));
    parsed.data.index = true;
    parsed.data.contentStatus = 'approved';
    parsed.data.lastModified = new Date().toISOString().slice(0, 10);
    if (dry) {
      console.log(`[dry-run] would approve ${file}`);
      continue;
    }
    writeFileSync(file, matter.stringify(parsed.content, parsed.data));
  }
}

async function printPlan(siteId: string, item: LaunchSite): Promise<void> {
  const ctx = loadSiteContext(siteId, workspaceRoot);
  const domain = getDomainForSite(siteId, item);
  const aliases = getAliases(siteId, item);
  const accountAlias = item.cloudflareAccount ?? getCloudflareAccountAliasForSite(ctx);
  console.log(`${siteId}\n  cloudflare account: ${accountAlias}\n  project: ${item.projectName}\n  domain: ${domain}\n  canonical: ${domain}\n  aliases: ${aliases.join(', ')}\n  mode: ${item.mode ?? 'noindex-first'}\n`);
}

async function checkSite(siteId: string, item: LaunchSite): Promise<void> {
  const cf = resolveCf(siteId, item);
  const domain = getDomainForSite(siteId, item);
  const zone = await findZone(cf, item, domain);
  console.log(`${siteId}:`);
  console.log(`  cloudflare account: ${cf.alias} (${cf.accountIdEnv})`);
  console.log(`  domain: ${domain}`);
  console.log(`  zone: ${zone ? `${zone.name} (${zone.status})` : 'not found'}`);
  const domains = await listPagesDomains(cf, item.projectName!);
  const targetDomains = [domain, ...getAliases(siteId, item)];
  for (const target of targetDomains) {
    const bound = domains.find((entry) => entry.name === target);
    console.log(`  pages domain ${target}: ${bound ? `bound (${bound.status ?? 'unknown'})` : 'not bound'}`);
  }
}

async function bindSite(siteId: string, item: LaunchSite): Promise<void> {
  const cf = resolveCf(siteId, item);
  const domain = getDomainForSite(siteId, item);
  const allDomains = [domain, ...getAliases(siteId, item)];
  const existing = await listPagesDomains(cf, item.projectName!);
  for (const target of allDomains) {
    if (existing.some((entry) => entry.name === target)) {
      console.log(`${siteId}: Pages domain already bound in ${cf.alias}: ${target}`);
    } else if (dryRun) {
      console.log(`${siteId}: DRY RUN Pages domain add in ${cf.alias}: ${target}`);
    } else {
      await addPagesDomain(cf, item.projectName!, target);
      console.log(`${siteId}: Pages domain added in ${cf.alias}: ${target}`);
    }
  }

  if (ensureDns || item.mode === 'live') {
    const zone = await findZone(cf, item, domain);
    if (!zone) {
      console.log(`${siteId}: DNS SKIP: Cloudflare zone not found for ${zoneNameFor(domain, item)} in account ${cf.alias}.`);
      return;
    }
    const target = `${item.projectName}.pages.dev`;
    for (const targetDomain of allDomains) {
      console.log(`${siteId}: ${await ensureCnameRecord(cf, zone.id, targetDomain, target)}`);
    }
  }
}

async function configureSite(siteId: string, item: LaunchSite, mode: 'noindex-first' | 'live'): Promise<void> {
  updateSiteConfig(siteId, item, mode, dryRun);
  updateIntegrationsConfig(siteId, item, dryRun);
  console.log(`${siteId}: ${dryRun ? 'planned config update' : 'configuration updated'} (${mode}).`);
}

function deploySite(siteId: string, item: LaunchSite): void {
  const cf = resolveCf(siteId, item);
  run('pnpm', ['site', 'check', siteId]);
  run('pnpm', ['site', 'build', siteId]);
  const outputDir = join('dist', 'sites', siteId);
  console.log(`Deploying ${siteId} to Cloudflare account profile "${cf.alias}".`);
  run(
    'pnpm',
    ['exec', 'wrangler', 'pages', 'deploy', outputDir, '--project-name', item.projectName!, '--branch', 'main'],
    {
      SITE_ID: siteId,
      CLOUDFLARE_ACCOUNT_ID: cf.accountId,
      CLOUDFLARE_API_TOKEN: cf.apiToken,
      CLOUDFLARE_API_BASE: cf.apiBase
    }
  );
}

function verifySite(siteId: string): void {
  run('pnpm', ['site', 'verify', siteId]);
  run('pnpm', ['site', 'verify-integrations', siteId]);
}

async function main(): Promise<void> {
  const config = loadLaunchConfig();

  if (command === 'list') {
    for (const siteId of Object.keys(config.sites).sort()) await printPlan(siteId, getLaunchSite(config, siteId));
    return;
  }

  const siteIds = targetSiteIds(config);

  if (command === 'plan') {
    for (const siteId of siteIds) await printPlan(siteId, getLaunchSite(config, siteId));
    return;
  }

  if (command === 'check') {
    for (const siteId of siteIds) await checkSite(siteId, getLaunchSite(config, siteId));
    return;
  }

  if (command === 'bind') {
    for (const siteId of siteIds) await bindSite(siteId, getLaunchSite(config, siteId));
    return;
  }

  if (command === 'configure') {
    for (const siteId of siteIds) {
      const item = getLaunchSite(config, siteId);
      await configureSite(siteId, item, item.mode ?? config.defaults?.mode ?? 'noindex-first');
    }
    return;
  }

  if (command === 'deploy') {
    for (const siteId of siteIds) deploySite(siteId, getLaunchSite(config, siteId));
    return;
  }

  if (command === 'verify') {
    for (const siteId of siteIds) verifySite(siteId);
    return;
  }

  if (command === 'go-live') {
    if (isAll) throw new Error('Refusing to go-live --all. Run go-live one site at a time.');
    const siteId = siteIds[0];
    if (!yes && !dryRun) throw new Error('go-live requires --yes. This prevents accidental indexing.');
    const item = getLaunchSite(config, siteId);
    await configureSite(siteId, item, 'live');
    approveContent(siteId, dryRun);
    if (dryRun) return;
    deploySite(siteId, item);
    verifySite(siteId);
    const indexNow = loadSiteContext(siteId, workspaceRoot).integrationsConfig.indexing.indexNow;
    if (indexNow.enabled) run('pnpm', ['site', 'submit-indexnow', siteId]);
    return;
  }

  usage();
  process.exit(command ? 1 : 0);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

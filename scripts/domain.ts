#!/usr/bin/env tsx
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';
import matter from 'gray-matter';
import { runWranglerPagesDeploy } from './lib/wrangler';
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
type CfPagesProject = { name?: string; production_branch?: string; subdomain?: string; [key: string]: unknown };
type CfPageDomain = { name?: string; status?: string; [key: string]: unknown };
type CfDnsRecord = { id: string; type: string; name: string; content: string };
type CfRulesList = { id: string; name: string; kind: string; description?: string };
type CfListBulkOperation = { operation_id?: string; id?: string; status?: string; error?: string };
type CfBulkRedirect = {
  source_url: string;
  target_url: string;
  status_code: 301;
  include_subdomains: false;
  subpath_matching: true;
  preserve_query_string: true;
  preserve_path_suffix: true;
};
type CfBulkRedirectItem = { redirect: CfBulkRedirect };
type CfRulesetRule = {
  id?: string;
  ref?: string;
  expression?: string;
  description?: string;
  action?: string;
  action_parameters?: Record<string, unknown>;
  enabled?: boolean;
  [key: string]: unknown;
};
type CfRuleset = {
  id: string;
  name: string;
  description?: string;
  kind: 'root';
  phase: 'http_request_redirect';
  rules: CfRulesetRule[];
};

const workspaceRoot = findWorkspaceRoot();
const launchConfigPath = join(workspaceRoot, 'domains.launch.yaml');
const [command, maybeSiteId, ...args] = process.argv.slice(2);
const isAll = maybeSiteId === '--all';
const dryRun = args.includes('--dry-run');
const ensureDns = args.includes('--ensure-dns');
const ensureRedirects = args.includes('--ensure');
const verifyRedirects = args.includes('--verify');
const markConfigured = args.includes('--mark-configured');
const yes = args.includes('--yes');
const waitSeconds = Number(argValue('--wait-seconds', '180'));

class CloudflareApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

function usage(): void {
  console.log(`Usage:
  pnpm domain list
  pnpm domain plan <site-id>|--all
  pnpm domain create-project <site-id>|--all [--dry-run]
  pnpm domain check <site-id>|--all
  pnpm domain bind <site-id>|--all [--dry-run] [--ensure-dns] [--wait-seconds <n>]
  pnpm domain redirects <site-id>|--all [--dry-run] [--ensure] [--verify] [--mark-configured]
  pnpm domain configure <site-id>|--all [--dry-run]
  pnpm domain deploy <site-id>|--all
  pnpm domain verify <site-id>|--all [--wait-seconds <n>]
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

function argValue(name: string, fallback = ''): string {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] ?? fallback : fallback;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    throw new CloudflareApiError(
      `Cloudflare API ${init.method ?? 'GET'} ${path} failed for profile "${cf.alias}": HTTP ${response.status}${errors ? ` - ${errors}` : ''}`,
      response.status
    );
  }
  return payload as T;
}

async function getPagesProject(cf: ResolvedCloudflareAccount, projectName: string): Promise<CfPagesProject | null> {
  try {
    const payload = await cfRequest<{ result?: CfPagesProject }>(cf, `/accounts/${cf.accountId}/pages/projects/${projectName}`);
    return payload.result ?? null;
  } catch (error) {
    if (error instanceof CloudflareApiError && error.status === 404) return null;
    throw error;
  }
}

async function getPagesSubdomain(cf: ResolvedCloudflareAccount, projectName: string): Promise<string> {
  const project = await getPagesProject(cf, projectName);
  const subdomain = project?.subdomain?.trim();
  return subdomain || `${projectName}.pages.dev`;
}

async function ensurePagesProject(cf: ResolvedCloudflareAccount, projectName: string): Promise<boolean> {
  const existing = await getPagesProject(cf, projectName);
  if (existing) {
    console.log(`Pages project already exists in ${cf.alias}: ${projectName}`);
    return true;
  }

  if (dryRun) {
    console.log(`DRY RUN Pages project create in ${cf.alias}: ${projectName}`);
    return false;
  }

  await cfRequest(cf, `/accounts/${cf.accountId}/pages/projects`, {
    method: 'POST',
    body: JSON.stringify({ name: projectName, production_branch: 'main' })
  });
  console.log(`Pages project created in ${cf.alias}: ${projectName}`);
  return true;
}

function pageDomainStatus(domains: CfPageDomain[], name: string): string {
  return String(domains.find((entry) => entry.name === name)?.status ?? 'not bound');
}

function allPageDomainsActive(domains: CfPageDomain[], names: string[]): boolean {
  return names.every((name) => pageDomainStatus(domains, name) === 'active');
}

async function waitForPagesDomainsActive(
  cf: ResolvedCloudflareAccount,
  projectName: string,
  names: string[],
  maxSeconds: number
): Promise<boolean> {
  if (!Number.isFinite(maxSeconds) || maxSeconds <= 0) return true;
  const deadline = Date.now() + maxSeconds * 1000;
  while (true) {
    const domains = await listPagesDomains(cf, projectName);
    if (allPageDomainsActive(domains, names)) {
      console.log(`Pages domains active in ${cf.alias}: ${names.join(', ')}`);
      return true;
    }
    const statuses = names.map((name) => `${name}=${pageDomainStatus(domains, name)}`).join(', ');
    if (Date.now() >= deadline) {
      console.log(`Pages domain wait timed out after ${maxSeconds}s in ${cf.alias}: ${statuses}`);
      return false;
    }
    console.log(`Waiting for Pages domains in ${cf.alias}: ${statuses}`);
    await sleep(Math.min(10_000, Math.max(1000, deadline - Date.now())));
  }
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

function bulkRedirectListName(siteId: string): string {
  return `seo_tool_${siteId.replace(/[^a-z0-9]+/g, '_')}_canonical_redirects`;
}

function bulkRedirectRuleRef(siteId: string): string {
  return `${bulkRedirectListName(siteId)}_rule`;
}

function bulkRedirectRule(listName: string, siteId: string): CfRulesetRule {
  return {
    ref: bulkRedirectRuleRef(siteId),
    expression: `http.request.full_uri in $${listName}`,
    description: `${siteId} canonical host redirects`,
    action: 'redirect',
    action_parameters: {
      from_list: {
        name: listName,
        key: 'http.request.full_uri'
      }
    },
    enabled: true
  };
}

function buildBulkRedirectItems(siteId: string, item: LaunchSite, pagesSubdomain: string): CfBulkRedirectItem[] {
  const canonical = getDomainForSite(siteId, item);
  const targetUrl = `https://${canonical}/`;
  const sourceUrls = new Set([
    ...getAliases(siteId, item).map((host) => `https://${host}/`),
    `https://${pagesSubdomain}/`
  ]);
  sourceUrls.delete(targetUrl);
  return [...sourceUrls].sort().map((sourceUrl) => ({
    redirect: {
      source_url: sourceUrl,
      target_url: targetUrl,
      status_code: 301,
      include_subdomains: false,
      subpath_matching: true,
      preserve_query_string: true,
      preserve_path_suffix: true
    }
  }));
}

function printBulkRedirectPlan(siteId: string, listName: string, items: CfBulkRedirectItem[]): void {
  console.log(`${siteId}: Cloudflare Bulk Redirects`);
  console.log(`  list: ${listName}`);
  console.log(`  rule: ${bulkRedirectRuleRef(siteId)}`);
  for (const item of items) {
    const redirect = item.redirect;
    console.log(`  ${redirect.status_code} ${redirect.source_url}* -> ${redirect.target_url}*`);
    console.log(`    subpath_matching=${redirect.subpath_matching}, preserve_path_suffix=${redirect.preserve_path_suffix}, preserve_query_string=${redirect.preserve_query_string}`);
  }
}

async function listBulkRedirectLists(cf: ResolvedCloudflareAccount): Promise<CfRulesList[]> {
  const payload = await cfRequest<{ result?: CfRulesList[] }>(cf, `/accounts/${cf.accountId}/rules/lists`);
  return payload.result?.filter((list) => list.kind === 'redirect') ?? [];
}

async function ensureBulkRedirectList(cf: ResolvedCloudflareAccount, listName: string, siteId: string): Promise<CfRulesList> {
  const lists = await listBulkRedirectLists(cf);
  const existing = lists.find((list) => list.name === listName);
  if (existing) {
    console.log(`${siteId}: Bulk Redirect list already exists in ${cf.alias}: ${listName}`);
    return existing;
  }
  const payload = await cfRequest<{ result: CfRulesList }>(cf, `/accounts/${cf.accountId}/rules/lists`, {
    method: 'POST',
    body: JSON.stringify({
      name: listName,
      description: `${siteId} canonical host redirects`,
      kind: 'redirect'
    })
  });
  console.log(`${siteId}: Bulk Redirect list created in ${cf.alias}: ${listName}`);
  return payload.result;
}

async function waitForListBulkOperation(cf: ResolvedCloudflareAccount, operationId: string, siteId: string): Promise<void> {
  const deadline = Date.now() + 60_000;
  while (true) {
    const payload = await cfRequest<{ result?: CfListBulkOperation }>(cf, `/accounts/${cf.accountId}/rules/lists/bulk_operations/${operationId}`);
    const operation = payload.result;
    if (operation?.status === 'completed') {
      console.log(`${siteId}: Bulk Redirect list items updated`);
      return;
    }
    if (operation?.status === 'failed') throw new Error(`${siteId}: Bulk Redirect list item update failed: ${operation.error ?? 'unknown error'}`);
    if (Date.now() >= deadline) throw new Error(`${siteId}: timed out waiting for Bulk Redirect list item update operation ${operationId}.`);
    await sleep(1000);
  }
}

async function replaceBulkRedirectItems(cf: ResolvedCloudflareAccount, list: CfRulesList, items: CfBulkRedirectItem[], siteId: string): Promise<void> {
  const payload = await cfRequest<{ result?: CfListBulkOperation }>(cf, `/accounts/${cf.accountId}/rules/lists/${list.id}/items`, {
    method: 'PUT',
    body: JSON.stringify(items)
  });
  const operationId = payload.result?.operation_id ?? payload.result?.id;
  if (!operationId) throw new Error(`${siteId}: Cloudflare did not return a Bulk Redirect list operation id.`);
  await waitForListBulkOperation(cf, operationId, siteId);
}

async function getRedirectEntrypointRuleset(cf: ResolvedCloudflareAccount): Promise<CfRuleset | null> {
  try {
    const payload = await cfRequest<{ result?: CfRuleset }>(cf, `/accounts/${cf.accountId}/rulesets/phases/http_request_redirect/entrypoint`);
    return payload.result ?? null;
  } catch (error) {
    if (error instanceof CloudflareApiError && error.status === 404) return null;
    throw error;
  }
}

async function ensureBulkRedirectRule(cf: ResolvedCloudflareAccount, listName: string, siteId: string): Promise<void> {
  const rule = bulkRedirectRule(listName, siteId);
  const ruleset = await getRedirectEntrypointRuleset(cf);
  if (!ruleset) {
    await cfRequest(cf, `/accounts/${cf.accountId}/rulesets`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'default',
        description: 'Account redirect rules',
        kind: 'root',
        phase: 'http_request_redirect',
        rules: [rule]
      })
    });
    console.log(`${siteId}: Bulk Redirect entrypoint ruleset created in ${cf.alias}`);
    return;
  }

  const existing = ruleset.rules.find((entry) => entry.ref === rule.ref || entry.expression === rule.expression);
  if (existing?.id) {
    await cfRequest(cf, `/accounts/${cf.accountId}/rulesets/${ruleset.id}/rules/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(rule)
    });
    console.log(`${siteId}: Bulk Redirect rule updated in ${cf.alias}: ${rule.ref}`);
    return;
  }

  await cfRequest(cf, `/accounts/${cf.accountId}/rulesets/${ruleset.id}/rules`, {
    method: 'POST',
    body: JSON.stringify(rule)
  });
  console.log(`${siteId}: Bulk Redirect rule added in ${cf.alias}: ${rule.ref}`);
}

function withPath(sourceUrl: string, path: string): string {
  const url = new URL(sourceUrl);
  url.pathname = path;
  url.search = '';
  url.hash = '';
  return url.toString();
}

async function verifyRedirect(sourceUrl: string, expectedLocation: string): Promise<boolean> {
  try {
    const response = await fetch(sourceUrl, { method: 'HEAD', redirect: 'manual' });
    const location = response.headers.get('location') ?? '';
    const ok = response.status === 301 && location === expectedLocation;
    console.log(`${ok ? '✓' : '✗'} ${sourceUrl} -> HTTP ${response.status}${location ? ` location=${location}` : ''}`);
    return ok;
  } catch (error) {
    console.log(`✗ ${sourceUrl} -> ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

async function verifyBulkRedirects(items: CfBulkRedirectItem[]): Promise<boolean> {
  let ok = true;
  for (const item of items) {
    const sourceRoot = item.redirect.source_url;
    const targetRoot = item.redirect.target_url;
    const sourceSubpath = withPath(sourceRoot, '/guide/how-to-use/');
    const targetSubpath = withPath(targetRoot, '/guide/how-to-use/');
    if (!await verifyRedirect(sourceRoot, targetRoot)) ok = false;
    if (!await verifyRedirect(sourceSubpath, targetSubpath)) ok = false;
  }
  return ok;
}

async function findZone(cf: ResolvedCloudflareAccount, item: LaunchSite, domain: string): Promise<CfZone | null> {
  const zoneName = zoneNameFor(domain, item);
  const payload = await cfRequest<{ result?: CfZone[] }>(cf, `/zones?name=${encodeURIComponent(zoneName)}`);
  return payload.result?.[0] ?? null;
}

function isPagesCname(record: CfDnsRecord, target: string): boolean {
  return record.type === 'CNAME' && record.content === target;
}

function isReplaceableDnsRecord(record: CfDnsRecord): boolean {
  return ['A', 'AAAA', 'CNAME'].includes(record.type);
}

function describeDnsRecord(record: CfDnsRecord): string {
  return `${record.type} ${record.name} -> ${record.content}`;
}

async function ensureCnameRecord(cf: ResolvedCloudflareAccount, zoneId: string, name: string, target: string): Promise<string> {
  const existing = await cfRequest<{ result?: CfDnsRecord[] }>(
    cf,
    `/zones/${zoneId}/dns_records?name=${encodeURIComponent(name)}`
  );
  const records = existing.result ?? [];
  const matching = records.find((record) => isPagesCname(record, target));
  const conflicts = records.filter((record) => isReplaceableDnsRecord(record) && !isPagesCname(record, target));
  if (conflicts.length > 0) {
    const conflictList = conflicts.map(describeDnsRecord).join(', ');
    if (dryRun) return `DRY RUN DNS REPLACE: delete ${conflictList}; CNAME ${name} -> ${target}`;
    for (const record of conflicts) {
      await cfRequest(cf, `/zones/${zoneId}/dns_records/${record.id}`, { method: 'DELETE' });
    }
    if (matching) return `DNS REPLACED: deleted ${conflictList}; kept CNAME ${name} -> ${target}`;
    await cfRequest(cf, `/zones/${zoneId}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({ type: 'CNAME', name, content: target, proxied: true })
    });
    return `DNS REPLACED: deleted ${conflictList}; created CNAME ${name} -> ${target}`;
  }
  if (matching) return `DNS OK: ${name} -> ${target}`;
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

function markPagesDevRedirectConfigured(siteId: string, dry = false): void {
  const sitePath = join(workspaceRoot, 'sites', siteId, 'site.config.yaml');
  const data = readYamlFile<any>(sitePath);
  data.seo ??= {};
  data.seo.pagesDevRedirect = {
    ...(data.seo.pagesDevRedirect ?? {}),
    status: 'configured',
    notes: 'Cloudflare Bulk Redirects verified for pages.dev and alias canonical redirects.'
  };
  if (dry) {
    console.log(`[dry-run] would mark seo.pagesDevRedirect.status=configured in ${sitePath}`);
    return;
  }
  writeYamlFile(sitePath, data);
  console.log(`${siteId}: marked seo.pagesDevRedirect.status=configured`);
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
  const project = await getPagesProject(cf, item.projectName!);
  console.log(`  pages project: ${project ? `${item.projectName} (${project.production_branch ?? 'unknown branch'})` : 'not found'}`);
  if (project) console.log(`  pages subdomain: ${project.subdomain ?? `${item.projectName}.pages.dev`}`);
  if (!project) return;
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
  const projectReady = await ensurePagesProject(cf, item.projectName!);
  if (!projectReady) {
    for (const target of allDomains) console.log(`${siteId}: DRY RUN Pages domain add in ${cf.alias}: ${target}`);
    return;
  }
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
    const target = await getPagesSubdomain(cf, item.projectName!);
    console.log(`${siteId}: Pages DNS target in ${cf.alias}: ${target}`);
    for (const targetDomain of allDomains) {
      console.log(`${siteId}: ${await ensureCnameRecord(cf, zone.id, targetDomain, target)}`);
    }
  }
  if (!dryRun) await waitForPagesDomainsActive(cf, item.projectName!, allDomains, waitSeconds);
}

async function redirectsSite(siteId: string, item: LaunchSite): Promise<void> {
  if (markConfigured && !verifyRedirects) throw new Error('--mark-configured requires --verify.');
  const cf = resolveCf(siteId, item);
  const pagesSubdomain = await getPagesSubdomain(cf, item.projectName!);
  const listName = bulkRedirectListName(siteId);
  const items = buildBulkRedirectItems(siteId, item, pagesSubdomain);
  printBulkRedirectPlan(siteId, listName, items);

  if (dryRun || (!ensureRedirects && !verifyRedirects)) return;

  if (ensureRedirects) {
    const list = await ensureBulkRedirectList(cf, listName, siteId);
    await replaceBulkRedirectItems(cf, list, items, siteId);
    await ensureBulkRedirectRule(cf, listName, siteId);
  }

  if (verifyRedirects) {
    const ok = await verifyBulkRedirects(items);
    if (!ok) throw new Error(`${siteId}: one or more canonical redirects are not active yet.`);
    if (markConfigured) markPagesDevRedirectConfigured(siteId, false);
  }
}

async function configureSite(siteId: string, item: LaunchSite, mode: 'noindex-first' | 'live'): Promise<void> {
  updateSiteConfig(siteId, item, mode, dryRun);
  updateIntegrationsConfig(siteId, item, dryRun);
  console.log(`${siteId}: ${dryRun ? 'planned config update' : 'configuration updated'} (${mode}).`);
}

async function createProjectSite(siteId: string, item: LaunchSite): Promise<void> {
  const cf = resolveCf(siteId, item);
  await ensurePagesProject(cf, item.projectName!);
}

async function deploySite(siteId: string, item: LaunchSite): Promise<void> {
  const cf = resolveCf(siteId, item);
  console.log(`[1/4] ensure Pages project`);
  await ensurePagesProject(cf, item.projectName!);
  const pagesSubdomain = await getPagesSubdomain(cf, item.projectName!);
  console.log(`[2/4] check and build site`);
  run('pnpm', ['site', 'check', siteId]);
  run('pnpm', ['site', 'build', siteId]);
  const outputDir = join('dist', 'sites', siteId);
  console.log(`[3/4] Pages DNS target: ${pagesSubdomain}`);
  console.log(`[4/4] wrangler pages deploy`);
  console.log(`Deploying ${siteId} to Cloudflare account profile "${cf.alias}".`);
  runWranglerPagesDeploy(
    workspaceRoot,
    [outputDir, '--project-name', item.projectName!, '--branch', 'main'],
    {
      SITE_ID: siteId,
      CLOUDFLARE_ACCOUNT_ID: cf.accountId,
      CLOUDFLARE_API_TOKEN: cf.apiToken,
      CLOUDFLARE_API_BASE: cf.apiBase
    }
  );
}

async function verifySite(siteId: string, item: LaunchSite): Promise<void> {
  const cf = resolveCf(siteId, item);
  const domains = [getDomainForSite(siteId, item), ...getAliases(siteId, item)];
  const ready = await waitForPagesDomainsActive(cf, item.projectName!, domains, waitSeconds);
  if (!ready) {
    const target = await getPagesSubdomain(cf, item.projectName!);
    throw new Error(`${siteId}: Pages custom domains are not active yet. DNS target should be ${target}.`);
  }
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

  if (command === 'create-project') {
    for (const siteId of siteIds) await createProjectSite(siteId, getLaunchSite(config, siteId));
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

  if (command === 'redirects') {
    for (const siteId of siteIds) await redirectsSite(siteId, getLaunchSite(config, siteId));
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
    for (const siteId of siteIds) await deploySite(siteId, getLaunchSite(config, siteId));
    return;
  }

  if (command === 'verify') {
    for (const siteId of siteIds) await verifySite(siteId, getLaunchSite(config, siteId));
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
    await deploySite(siteId, item);
    await verifySite(siteId, item);
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

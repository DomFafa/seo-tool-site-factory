#!/usr/bin/env tsx
import { findWorkspaceRoot, listCloudflareAccountProfiles, listSiteIds, loadSiteContext, getCloudflareAccountAliasForSite } from '@factory/site-core';

const workspaceRoot = findWorkspaceRoot();
const [scope, command, maybeTarget, ...args] = process.argv.slice(2);
const useApi = args.includes('--api') || maybeTarget === '--api';

function usage() {
  console.log(`Usage:
  pnpm cf accounts list
  pnpm cf accounts check [--all|<account-alias>] [--api]
  pnpm cf sites list

Notes:
  - Deploys remain local-only.
  - This command validates account profiles and env wiring; it does not deploy.
`);
}

async function apiCheck(alias: string, accountId: string, apiToken: string, apiBase = process.env.CLOUDFLARE_API_BASE || 'https://api.cloudflare.com/client/v4') {
  const res = await fetch(`${apiBase}/accounts/${accountId}`, {
    headers: { Authorization: `Bearer ${apiToken}` }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    const errors = Array.isArray(body?.errors) ? body.errors.map((e: any) => e.message).join('; ') : '';
    return { ok: false, message: `HTTP ${res.status}${errors ? ` - ${errors}` : ''}` };
  }
  return { ok: true, message: 'API reachable' };
}

async function main() {
  if (scope === 'accounts' && command === 'list') {
    for (const profile of listCloudflareAccountProfiles(workspaceRoot)) {
      console.log(`${profile.alias}\taccount=${profile.accountIdEnv}\ttoken=${profile.apiTokenEnv}\tenv=${profile.hasAccountId && profile.hasApiToken ? 'ok' : 'missing'}`);
    }
    return;
  }

  if (scope === 'accounts' && command === 'check') {
    const profiles = listCloudflareAccountProfiles(workspaceRoot);
    const target = maybeTarget && maybeTarget !== '--all' && maybeTarget !== '--api' ? maybeTarget : undefined;
    let failed = false;
    for (const profile of profiles) {
      if (target && profile.alias !== target) continue;
      const accountId = process.env[profile.accountIdEnv];
      const apiToken = process.env[profile.apiTokenEnv];
      const envOk = Boolean(accountId && apiToken);
      console.log(`${envOk ? '✓' : '✗'} ${profile.alias}: ${profile.accountIdEnv}=${accountId ? 'set' : 'missing'}, ${profile.apiTokenEnv}=${apiToken ? 'set' : 'missing'}`);
      if (!envOk) failed = true;
      if (useApi && accountId && apiToken) {
        const apiBase = profile.apiBaseEnv ? process.env[profile.apiBaseEnv] : undefined;
        const result = await apiCheck(profile.alias, accountId, apiToken, apiBase);
        console.log(`  ${result.ok ? '✓' : '✗'} API: ${result.message}`);
        if (!result.ok) failed = true;
      }
    }
    if (target && !profiles.some((profile) => profile.alias === target)) {
      console.error(`Unknown Cloudflare account alias: ${target}`);
      process.exit(1);
    }
    if (failed) process.exit(1);
    return;
  }

  if (scope === 'sites' && command === 'list') {
    for (const siteId of listSiteIds(workspaceRoot)) {
      const ctx = loadSiteContext(siteId, workspaceRoot);
      console.log(`${siteId}\t${ctx.siteConfig.deployment.projectName}\t${getCloudflareAccountAliasForSite(ctx)}`);
    }
    return;
  }

  usage();
  process.exit(scope ? 1 : 0);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

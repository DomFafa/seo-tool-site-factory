import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';
import { z } from 'zod';
import type { SiteContext } from './types';
import { findWorkspaceRoot } from './workspace';

const CloudflareAccountProfileSchema = z.object({
  label: z.string().optional(),
  accountIdEnv: z.string().min(1),
  apiTokenEnv: z.string().min(1),
  apiBaseEnv: z.string().optional()
});

const CloudflareAccountsConfigSchema = z.object({
  schemaVersion: z.number().int().default(1),
  accounts: z.record(CloudflareAccountProfileSchema)
});

const DEFAULT_SHARED_ACCOUNT_ALIAS = 'shared';

function loadLocalEnvIfPresent(workspaceRoot: string): void {
  const envPath = join(workspaceRoot, '.env.local');
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const normalized = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
    const index = normalized.indexOf('=');
    if (index <= 0) continue;
    const key = normalized.slice(0, index).trim();
    let value = normalized.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

export type CloudflareAccountProfile = z.infer<typeof CloudflareAccountProfileSchema>;
export type CloudflareAccountsConfig = z.infer<typeof CloudflareAccountsConfigSchema>;

export type ResolvedCloudflareAccount = {
  alias: string;
  label?: string;
  accountId: string;
  apiToken: string;
  apiBase: string;
  accountIdEnv: string;
  apiTokenEnv: string;
};

export function loadCloudflareAccountsConfig(workspaceRoot = findWorkspaceRoot()): CloudflareAccountsConfig {
  loadLocalEnvIfPresent(workspaceRoot);
  const filePath = join(workspaceRoot, 'cloudflare.accounts.yaml');
  if (!existsSync(filePath)) {
    throw new Error('Missing cloudflare.accounts.yaml. Each site must resolve to a Cloudflare account profile.');
  }
  const parsed = YAML.parse(readFileSync(filePath, 'utf8'));
  return CloudflareAccountsConfigSchema.parse(parsed);
}

export function getCloudflareAccountAliasForSite(ctx: SiteContext, overrideAlias?: string): string {
  return overrideAlias || ctx.siteConfig.deployment.accountAlias || DEFAULT_SHARED_ACCOUNT_ALIAS;
}

export function resolveCloudflareAccountForSite(
  ctx: SiteContext,
  options: { accountAlias?: string; workspaceRoot?: string } = {}
): ResolvedCloudflareAccount {
  const config = loadCloudflareAccountsConfig(options.workspaceRoot ?? ctx.workspaceRoot);
  const alias = options.accountAlias && config.accounts[options.accountAlias] ? options.accountAlias : DEFAULT_SHARED_ACCOUNT_ALIAS;
  const profile = config.accounts[alias] ?? config.accounts[DEFAULT_SHARED_ACCOUNT_ALIAS];
  if (!profile) {
    throw new Error(`Cloudflare account profile "${DEFAULT_SHARED_ACCOUNT_ALIAS}" is not defined in cloudflare.accounts.yaml.`);
  }

  const accountId = process.env[profile.accountIdEnv];
  const apiToken = process.env[profile.apiTokenEnv];
  const apiBase = profile.apiBaseEnv ? process.env[profile.apiBaseEnv] : undefined;

  if (!accountId) {
    throw new Error(`Missing ${profile.accountIdEnv} for Cloudflare account profile "${alias}".`);
  }
  if (!apiToken) {
    throw new Error(`Missing ${profile.apiTokenEnv} for Cloudflare account profile "${alias}".`);
  }

  return {
    alias,
    label: profile.label,
    accountId,
    apiToken,
    apiBase: apiBase || process.env.CLOUDFLARE_API_BASE || 'https://api.cloudflare.com/client/v4',
    accountIdEnv: profile.accountIdEnv,
    apiTokenEnv: profile.apiTokenEnv
  };
}

export function getCloudflareEnvForSite(
  ctx: SiteContext,
  options: { accountAlias?: string; workspaceRoot?: string } = {}
): Record<string, string> {
  const account = resolveCloudflareAccountForSite(ctx, options);
  return {
    CLOUDFLARE_ACCOUNT_ID: account.accountId,
    CLOUDFLARE_API_TOKEN: account.apiToken,
    CLOUDFLARE_API_BASE: account.apiBase
  };
}

export function listCloudflareAccountProfiles(workspaceRoot = findWorkspaceRoot()): Array<{
  alias: string;
  label?: string;
  accountIdEnv: string;
  apiTokenEnv: string;
  apiBaseEnv?: string;
  hasAccountId: boolean;
  hasApiToken: boolean;
}> {
  const config = loadCloudflareAccountsConfig(workspaceRoot);
  return Object.entries(config.accounts)
    .map(([alias, profile]) => ({
      alias,
      label: profile.label,
      accountIdEnv: profile.accountIdEnv,
      apiTokenEnv: profile.apiTokenEnv,
      apiBaseEnv: profile.apiBaseEnv,
      hasAccountId: Boolean(process.env[profile.accountIdEnv]),
      hasApiToken: Boolean(process.env[profile.apiTokenEnv])
    }))
    .sort((a, b) => a.alias.localeCompare(b.alias));
}

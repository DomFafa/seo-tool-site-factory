import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import matter from 'gray-matter';
import YAML from 'yaml';
import type { SiteContext } from '@factory/site-core';

export type SeoIssueLevel = 'P0' | 'P1' | 'P2';
export type SeoIssue = { level: SeoIssueLevel; code: string; message: string; file?: string };
export type SeoRules = { forbiddenPublicTerms: string[]; localeLeakageTerms: Record<string, string[]>; allowedTerms?: string[] };

export const defaultSeoRules: SeoRules = {
  forbiddenPublicTerms: ['technical launch', 'ready for indexing', 'noindex', 'draft', 'v1', 'demo dictionary', 'expand dictionary', 'placeholder', 'coming soon', 'todo', 'test page'],
  localeLeakageTerms: {
    es: ['Drop an image', 'Choose image', 'Download PNG', 'Your PNG is ready', 'Supported:', 'Start test'],
    fr: ['Drop an image', 'Choose image', 'Download PNG', 'Start test', 'Check spelling']
  }
};

function readRules(ctx: SiteContext): SeoRules {
  const rulesFile = join(ctx.workspaceRoot, 'seo.rules.yaml');
  if (!existsSync(rulesFile)) return defaultSeoRules;
  const parsed = YAML.parse(readFileSync(rulesFile, 'utf8')) ?? {};
  return { forbiddenPublicTerms: parsed.forbiddenPublicTerms ?? defaultSeoRules.forbiddenPublicTerms, localeLeakageTerms: parsed.localeLeakageTerms ?? defaultSeoRules.localeLeakageTerms, allowedTerms: parsed.allowedTerms ?? [] };
}

function walkFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(fullPath));
    else if (/\.(md|mdx|ya?ml|json|astro|tsx?)$/i.test(entry.name)) files.push(fullPath);
  }
  return files;
}

const lower = (value: string) => value.toLowerCase();

function readPublicText(file: string): string {
  const text = readFileSync(file, 'utf8');
  if (/\.mdx?$/i.test(file)) return matter(text).content;
  return text;
}

export function lintSitePublicContent(ctx: SiteContext): SeoIssue[] {
  const rules = readRules(ctx);
  const allowed = new Set((rules.allowedTerms ?? []).map(lower));
  const files = [
    ...walkFiles(join(ctx.siteDir, 'content')),
    ...walkFiles(join(ctx.siteDir, 'messages')),
    ...walkFiles(join(ctx.siteDir, 'snippets')),
    ...['layout.config.yaml', 'theme.config.yaml'].map((name) => join(ctx.siteDir, name)).filter(existsSync)
  ];
  const issues: SeoIssue[] = [];
  for (const file of files) {
    const text = readPublicText(file);
    const textLower = lower(text);
    for (const term of rules.forbiddenPublicTerms) {
      if (allowed.has(lower(term))) continue;
      if (textLower.includes(lower(term))) issues.push({ level: 'P1', code: 'FORBIDDEN_PUBLIC_TERM', message: `Public content contains internal term "${term}".`, file: relative(ctx.workspaceRoot, file) });
    }
  }
  for (const [locale, leakageTerms] of Object.entries(rules.localeLeakageTerms)) {
    const localeDir = join(ctx.siteDir, 'content', locale);
    const messageFileYaml = join(ctx.siteDir, 'messages', `${locale}.yaml`);
    const messageFileJson = join(ctx.siteDir, 'messages', `${locale}.json`);
    const localeFiles = [...walkFiles(localeDir), ...[messageFileYaml, messageFileJson].filter(existsSync)];
    for (const file of localeFiles) {
      const text = readPublicText(file);
      for (const term of leakageTerms) if (text.includes(term)) issues.push({ level: 'P1', code: 'LOCALE_COPY_LEAKAGE', message: `${locale} content appears to contain untranslated English UI/copy: "${term}".`, file: relative(ctx.workspaceRoot, file) });
    }
  }
  return issues;
}

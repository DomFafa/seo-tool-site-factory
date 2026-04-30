#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const [siteId, ...args] = process.argv.slice(2);

function usage(): void {
  console.log(`Usage:
  pnpm site:plan <site-id> --keyword "<primary keyword>" --category <category> --locale en --market US [--force]

Examples:
  pnpm site:plan backwards-text-generator --keyword "backwards text generator" --category generator
  pnpm site:plan anagram-solver --keyword "anagram solver" --category solver --market US
`);
}

if (!siteId || siteId.startsWith('--')) {
  usage();
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(siteId)) {
  throw new Error(`Invalid site id "${siteId}". Use lowercase kebab-case, for example "backwards-text-generator".`);
}

const workspaceRoot = findWorkspaceRoot();
const force = args.includes('--force');
const keyword = argValue('--keyword', humanize(siteId));
const category = argValue('--category', inferCategory(siteId));
const locale = argValue('--locale', 'en');
const market = argValue('--market', 'US');

if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(locale)) {
  throw new Error(`Invalid locale "${locale}". Use "en" or a simple language-region value such as "en-US".`);
}

if (!/^[A-Z]{2}$/.test(market)) {
  throw new Error(`Invalid market "${market}". Use a two-letter uppercase market code such as "US".`);
}
const date = new Date().toISOString().slice(0, 10);
const toolName = title(keyword);
const userJob = `Use an online ${keyword} to complete the task quickly.`;
const expectedAction = `Enter the required input, generate the result, and copy or use it.`;
const canonicalHost = `${siteId}.com`;
const brandName = title(siteId);
const skillTemplateDir = join(workspaceRoot, '.codex', 'skills', 'seo-tool-site-factory', 'templates');
const researchDir = join(workspaceRoot, 'sites', siteId, 'research');

const context: Record<string, string> = {
  site_id: siteId,
  primary_keyword: keyword,
  primary_keyword_title_case: title(keyword),
  category,
  locale,
  market,
  date,
  tool_name: toolName,
  user_job: userJob,
  expected_action: expectedAction,
  canonical_host: canonicalHost,
  brand_name: brandName,
  main_benefit: 'Fast, free online tool',
  clear_140_to_160_character_description_focused_on_the_user_task: `Use this ${keyword} to complete the task online. Fast, free, mobile-friendly, and designed for quick copy-ready results.`,
  one_sentence_explaining_what_the_tool_does_and_why_it_is_useful: `Use this ${keyword} to get quick, copy-ready results in your browser.`
};

const templateToOutput: Record<string, string> = {
  'keyword-intent.md': 'keyword-intent.md',
  'competitor-research.md': 'competitor-research.md',
  'product-requirements.md': 'product-requirements.md',
  'seo-spec.md': 'seo-spec.md',
  'ux-spec.md': 'ux-spec.md',
  'design-direction.md': 'design-direction.md',
  'design-review.md': 'design-review.md',
  'acceptance-tests.md': 'acceptance-tests.md',
  'implementation-trace.md': 'implementation-trace.md',
  'status.md': 'status.md',
  'launch-review.md': 'launch-review.md',
  'codex-build-prompt.md': 'codex-build-prompt.md',
  'brief.v2.example.yaml': 'brief.v2.draft.yaml'
};

mkdirSync(researchDir, { recursive: true });

for (const [templateName, outputName] of Object.entries(templateToOutput)) {
  const templatePath = join(skillTemplateDir, templateName);
  if (!existsSync(templatePath)) throw new Error(`Missing template: ${relative(templatePath)}`);

  const outputPath = join(researchDir, outputName);
  if (existsSync(outputPath) && !force) {
    console.log(`Skipped existing file: ${relative(outputPath)}`);
    continue;
  }

  writeFileSync(outputPath, render(readFileSync(templatePath, 'utf8'), context));
  console.log(`Wrote ${relative(outputPath)}`);
}

console.log(`
Next steps:
  1. Complete every file in sites/${siteId}/research/, or add a Deferred note with the reason and next action
  2. Capture the Bing Webmaster top 5 in sites/${siteId}/research/competitor-research.md
  3. Do not implement when Bing status is not-attempted; blocked-with-evidence requires explicit fallback approval
  4. After research is complete, tell Codex: 继续实现 ${siteId}
  5. After implementation, update sites/${siteId}/research/implementation-trace.md before calling the work complete
  6. Run pnpm site research-audit ${siteId} before implementation
  7. Run pnpm site trace-audit ${siteId} and pnpm site launch-review ${siteId} after implementation
  8. Keep the site draft and non-indexable until validation passes
`);

function findWorkspaceRoot(): string {
  let dir = resolve(process.env.FACTORY_ROOT || process.cwd());

  while (true) {
    const pkg = join(dir, 'package.json');
    if (existsSync(pkg)) {
      try {
        const parsed = JSON.parse(readFileSync(pkg, 'utf8')) as { name?: string };
        if (parsed.name === 'seo-tool-site-factory') return dir;
      } catch {
        // Continue walking upward.
      }
    }

    const parent = dirname(dir);
    if (parent === dir) return resolve(process.env.FACTORY_ROOT || process.cwd());
    dir = parent;
  }
}

function argValue(name: string, fallback: string): string {
  const index = args.indexOf(name);
  if (index < 0) return fallback;

  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${name}`);
  }

  return value;
}

function inferCategory(value: string): string {
  for (const category of ['generator', 'solver', 'maker', 'converter', 'tester', 'checker', 'calculator', 'formatter']) {
    if (value.endsWith(`-${category}`) || value.includes(`-${category}-`)) return category;
  }
  return 'generator';
}

function humanize(value: string): string {
  return value.replaceAll('-', ' ');
}

function title(value: string): string {
  return value
    .replaceAll('-', ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(' ');
}

function render(template: string, values: Record<string, string>): string {
  return template.replaceAll(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}

function relative(path: string): string {
  return path.startsWith(workspaceRoot) ? path.slice(workspaceRoot.length + 1) : path;
}

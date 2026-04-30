#!/usr/bin/env tsx
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { findWorkspaceRoot } from '@factory/site-core';

type Level = 'P0' | 'P1' | 'P2';

type Issue = {
  level: Level;
  code: string;
  message: string;
};

const workspaceRoot = findWorkspaceRoot();
const [command, siteId, ...args] = process.argv.slice(2);

const researchFiles = [
  'keyword-intent.md',
  'competitor-research.md',
  'product-requirements.md',
  'seo-spec.md',
  'ux-spec.md',
  'design-direction.md',
  'design-review.md',
  'acceptance-tests.md',
  'status.md',
  'brief.v2.draft.yaml',
  'codex-build-prompt.md'
];

const traceSources = [
  'keyword-intent.md',
  'competitor-research.md',
  'product-requirements.md',
  'seo-spec.md',
  'ux-spec.md',
  'design-direction.md',
  'design-review.md',
  'acceptance-tests.md',
  'brief.v2.draft.yaml'
];

function usage(): void {
  console.log(`Usage:
  pnpm site research-audit <site-id>
  pnpm site trace-audit <site-id>
  pnpm site launch-review <site-id>

Optional:
  --check-scope   Include git scope drift warnings in launch-review
`);
}

if (!command || !siteId || siteId.startsWith('--')) {
  usage();
  process.exit(command ? 1 : 0);
}

const researchDir = join(workspaceRoot, 'sites', siteId, 'research');
const issues: Issue[] = [];

switch (command) {
  case 'research-audit':
    auditResearch();
    break;
  case 'trace-audit':
    auditTrace();
    break;
  case 'launch-review':
    auditResearch();
    auditTrace();
    auditLaunch();
    if (args.includes('--check-scope')) auditScope();
    break;
  default:
    usage();
    process.exit(1);
}

printReport(command, issues);
if (issues.some((issue) => issue.level === 'P0')) process.exit(1);

function auditResearch(): void {
  if (!existsSync(researchDir)) {
    add('P0', 'RESEARCH_DIR_MISSING', `Missing research directory: sites/${siteId}/research`);
    return;
  }

  for (const file of researchFiles) {
    const content = readResearch(file);
    if (!content) {
      add('P0', 'RESEARCH_FILE_MISSING', `Missing required research file: ${file}`);
      continue;
    }

    if (file !== 'codex-build-prompt.md' && looksPlaceholder(content)) {
      add('P1', 'RESEARCH_PLACEHOLDER', `${file} still looks placeholder-like.`);
    }

    if (file !== 'codex-build-prompt.md' && content.includes('Deferred:') && !hasValidDeferred(content)) {
      add('P1', 'WEAK_DEFERRED_NOTE', `${file} has Deferred notes without blocker, missing evidence, impact, and next action.`);
    }
  }

  const competitor = readResearch('competitor-research.md');
  if (!competitor) return;

  if (!/Bing Webmaster Capture Attempt/i.test(competitor)) {
    add('P0', 'BING_CAPTURE_RECORD_MISSING', 'competitor-research.md must include a Bing Webmaster Capture Attempt record.');
    return;
  }

  const status = captureValue(competitor, /Status:\s*`?([a-z-]+)`?/i);
  const validStatuses = new Set(['captured', 'blocked-with-evidence', 'not-attempted', 'user-approved-skip']);
  if (!status || !validStatuses.has(status)) {
    add('P0', 'BING_CAPTURE_STATUS_INVALID', 'Bing status must be captured, blocked-with-evidence, not-attempted, or user-approved-skip.');
  }

  if (status === 'captured') {
    const urlCount = countUrls(competitor);
    if (urlCount < 5) {
      add('P0', 'BING_TOP5_WEAK', `Captured Bing evidence should include at least 5 ranked URLs; found ${urlCount}.`);
    }
  }

  if (status === 'blocked-with-evidence') {
    for (const label of ['Attempted at', 'Attempted URL', 'Blocker text', 'Screenshot or artifact path']) {
      if (!new RegExp(`${escapeRegExp(label)}:\\s*\\S`, 'i').test(competitor)) {
        add('P0', 'BING_BLOCKER_EVIDENCE_MISSING', `blocked-with-evidence requires ${label}.`);
      }
    }
    checkScoreCap('codex-build-prompt.md', 'Research readiness', 7, 'BING_BLOCKED_RESEARCH_CAP');
  }

  if (status === 'not-attempted') {
    checkScoreCap('codex-build-prompt.md', 'Research readiness', 3, 'BING_NOT_ATTEMPTED_RESEARCH_CAP');
  }
}

function auditTrace(): void {
  const trace = readResearch('implementation-trace.md');
  if (!trace) {
    add('P0', 'TRACE_MISSING', 'implementation-trace.md is required after implementation.');
    return;
  }

  const status = captureValue(trace, /Trace status:\s*([a-z-]+)/i);
  if (status !== 'complete') {
    add('P0', 'TRACE_NOT_COMPLETE', `implementation-trace.md must have Trace status: complete; found ${status ?? 'missing'}.`);
  }

  for (const source of traceSources) {
    if (!trace.includes(`\`${source}\``)) {
      add('P1', 'TRACE_SOURCE_MISSING', `Trace does not mention ${source}.`);
    }
  }

  if (!/Implemented in\s*\|\s*Evidence\s*\|\s*Validation/i.test(trace)) {
    add('P0', 'TRACE_MATRIX_MISSING', 'Trace must include the research-to-implementation matrix.');
  }

  if (!/\|\s*[^|\n]+\s*\|\s*[^|\n]+\s*\|\s*[^|\n]+\s*\|\s*[^|\n]+\s*\|\s*[^|\n]+\s*\|\s*(done|deferred)/i.test(trace)) {
    add('P0', 'TRACE_NO_COMPLETED_ROWS', 'Trace needs concrete rows with implemented file/behavior, evidence, validation, and done/deferred status.');
  }
}

function auditLaunch(): void {
  const launch = readResearch('launch-review.md');
  if (!launch) {
    add('P1', 'LAUNCH_REVIEW_MISSING', 'launch-review.md is missing; create it before launch review.');
  } else {
    for (const label of ['Research evidence', 'Research trace', 'Browser QA', 'Launch status']) {
      const row = findTableRow(launch, label);
      if (!row) {
        add('P1', 'LAUNCH_DASHBOARD_INCOMPLETE', `launch-review.md dashboard is missing ${label}.`);
      } else if (/\|\s*pending\s*\/|pending/i.test(row)) {
        add('P1', 'LAUNCH_DASHBOARD_PENDING', `launch-review.md still has pending status for ${label}.`);
      }
    }
  }

  const siteConfig = readSiteFile('site.config.yaml');
  if (siteConfig && /allowIndex:\s*true/i.test(siteConfig)) {
    const launchStatus = launch ? tableStatus(launch, 'Launch status') : undefined;
    const launchDecision = launch ? fieldValue(launch, 'Decision') : undefined;
    const hasIndexApproval = Boolean(
      launch &&
        launchStatus === 'READY_TO_INDEX' &&
        launchDecision === 'READY_TO_INDEX' &&
        /Explicit indexing approval recorded:\s*yes/i.test(launch)
    );
    if (!hasIndexApproval) {
      add('P0', 'INDEXING_ENABLED_WITHOUT_APPROVAL', 'Indexing is enabled without launch-review.md evidence for READY_TO_INDEX and explicit approval.');
    }
  }

  const designReview = readResearch('design-review.md');
  const acceptance = readResearch('acceptance-tests.md');
  const combined = `${designReview ?? ''}\n${acceptance ?? ''}`;

  if (/Post-UI design review completed:\s*no/i.test(combined)) {
    checkScoreCap('codex-build-prompt.md', 'Launch readiness', 4, 'POST_UI_DESIGN_REVIEW_CAP');
  }

  if (/qa(?:-only)?\s+was\s+run.*no|interactions changed.*deferred/i.test(combined)) {
    checkScoreCap('codex-build-prompt.md', 'Launch readiness', 5, 'INTERACTION_QA_CAP');
  }
}

function auditScope(): void {
  const toolConfig = readSiteFile('tool.config.yaml');
  const toolId = captureValue(toolConfig ?? '', /toolId:\s*([a-z0-9-]+)/i) ?? siteId;
  const allowedPrefixes = [
    `sites/${siteId}/`,
    `apps/site/src/features/${toolId}/`,
    `packages/tools/${toolId}/`,
    'apps/site/src/.generated/'
  ];

  const result = spawnSync('git', ['status', '--short'], {
    cwd: workspaceRoot,
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    add('P2', 'SCOPE_DRIFT_UNKNOWN', 'Could not read git status for scope drift detection.');
    return;
  }

  const outOfScope = result.stdout
    .split('\n')
    .map((line) => line.length > 3 ? line.slice(3).trim() : line.trim())
    .filter(Boolean)
    .filter((file) => !allowedPrefixes.some((prefix) => file.startsWith(prefix)));

  if (outOfScope.length) {
    add('P2', 'SCOPE_DRIFT_DIRTY_FILES', `Dirty files outside ${siteId} scope: ${outOfScope.slice(0, 8).join(', ')}${outOfScope.length > 8 ? '...' : ''}`);
  }
}

function checkScoreCap(file: string, label: string, cap: number, code: string): void {
  const content = readResearch(file);
  if (!content) return;
  const value = captureValue(content, new RegExp(`${escapeRegExp(label)}:\\s*(\\d+)`, 'i'));
  if (value && Number(value) > cap) {
    add('P0', code, `${label} must be <= ${cap}, found ${value}.`);
  }
}

function add(level: Level, code: string, message: string): void {
  issues.push({ level, code, message });
}

function printReport(label: string, reportIssues: Issue[]): void {
  const p0 = reportIssues.filter((issue) => issue.level === 'P0').length;
  const p1 = reportIssues.filter((issue) => issue.level === 'P1').length;
  const p2 = reportIssues.filter((issue) => issue.level === 'P2').length;
  console.log(`\n${siteId} ${label}: P0=${p0}, P1=${p1}, P2=${p2}`);
  for (const issue of reportIssues) {
    console.log(`  [${issue.level}] ${issue.code}: ${issue.message}`);
  }
  if (!reportIssues.length) console.log('  no issues');
}

function readResearch(file: string): string | undefined {
  const path = join(researchDir, file);
  return existsSync(path) ? readFileSync(path, 'utf8') : undefined;
}

function readSiteFile(file: string): string | undefined {
  const path = join(workspaceRoot, 'sites', siteId, file);
  return existsSync(path) ? readFileSync(path, 'utf8') : undefined;
}

function looksPlaceholder(content: string): boolean {
  const stripped = content.replace(/```[\s\S]*?```/g, '');
  return /\{[a-zA-Z0-9_]+\}|Describe |yes\/no|pending\/done\/deferred|\|\s*\|\s*\|\s*\|/.test(stripped);
}

function hasValidDeferred(content: string): boolean {
  const lower = content.toLowerCase();
  return lower.includes('deferred:') && lower.includes('blocker') && lower.includes('missing evidence') && lower.includes('impact') && lower.includes('next action');
}

function captureValue(content: string, pattern: RegExp): string | undefined {
  return pattern.exec(content)?.[1]?.trim();
}

function countUrls(content: string): number {
  return new Set(content.match(/https?:\/\/[^\s|)]+/g) ?? []).size;
}

function findTableRow(content: string, label: string): string | undefined {
  return content
    .split('\n')
    .find((line) => line.toLowerCase().includes(`| ${label.toLowerCase()}`));
}

function tableStatus(content: string, label: string): string | undefined {
  const row = findTableRow(content, label);
  const cells = row?.split('|').map((cell) => cell.trim()) ?? [];
  return cells[2] && !cells[2].includes('/') ? cells[2] : undefined;
}

function fieldValue(content: string, label: string): string | undefined {
  return captureValue(content, new RegExp(`${escapeRegExp(label)}:\\s*([^\\n]+)`, 'i'))?.trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

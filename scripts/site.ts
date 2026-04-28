import { validateAllSites, validateSitePack, loadSite, loadSites, type ValidationIssue } from '../packages/site-core/src/index.js';

type Command = 'list' | 'check';

function printIssue(issue: ValidationIssue): void {
  const site = issue.siteId ? `[${issue.siteId}] ` : '';
  const file = issue.file ? ` (${issue.file})` : '';
  console.log(`${issue.level.toUpperCase()} ${issue.code}: ${site}${issue.message}${file}`);
}

async function listSites(): Promise<void> {
  const sites = await loadSites();
  console.log('site id\tstatus\tprimary tool\tcanonical host');
  for (const site of sites) {
    console.log(`${site.id}\t${site.config.lifecycle.status}\t${site.config.primaryTool}\t${site.config.canonicalHost}`);
  }
}

async function checkSites(args: string[]): Promise<void> {
  if (args[0] === '--all') {
    const { sites, result } = await validateAllSites();
    for (const issue of [...result.errors, ...result.warnings]) {
      printIssue(issue);
    }
    console.log(`Checked ${sites.length} site(s): ${result.errors.length} error(s), ${result.warnings.length} warning(s)`);
    process.exitCode = result.errors.length > 0 ? 1 : 0;
    return;
  }

  const siteId = args[0];
  if (!siteId) {
    console.error('Usage: pnpm site check <site-id> | pnpm site check --all');
    process.exitCode = 1;
    return;
  }

  const site = await loadSite(siteId);
  if (!site) {
    console.error(`Unknown site "${siteId}"`);
    process.exitCode = 1;
    return;
  }

  const result = await validateSitePack(site);
  for (const issue of [...result.errors, ...result.warnings]) {
    printIssue(issue);
  }
  console.log(`Checked ${site.id}: ${result.errors.length} error(s), ${result.warnings.length} warning(s)`);
  process.exitCode = result.errors.length > 0 ? 1 : 0;
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2) as [Command | undefined, ...string[]];

  if (command === 'list') {
    await listSites();
    return;
  }

  if (command === 'check') {
    await checkSites(args);
    return;
  }

  console.error('Usage: pnpm site list | pnpm site check <site-id> | pnpm site check --all');
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

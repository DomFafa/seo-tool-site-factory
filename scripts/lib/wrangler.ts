import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { tmpdir } from 'node:os';

const proxyEnvKeys = [
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'ALL_PROXY',
  'NO_PROXY',
  'http_proxy',
  'https_proxy',
  'all_proxy',
  'no_proxy'
];

function hasProxyEnv(env: NodeJS.ProcessEnv): boolean {
  return proxyEnvKeys.some((key) => Boolean(env[key]));
}

function stripProxyEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const next = { ...env };
  for (const key of proxyEnvKeys) delete next[key];
  return next;
}

function runRelay(cmd: string, cmdArgs: string[], cwd: string, env: NodeJS.ProcessEnv): { status: number; output: string } {
  const result = spawnSync(cmd, cmdArgs, {
    cwd,
    shell: process.platform === 'win32',
    env,
    encoding: 'utf8'
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return {
    status: result.status ?? 1,
    output: `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  };
}

export function runWranglerPagesDeploy(
  workspaceRoot: string,
  deployArgs: string[],
  env: Record<string, string>
): void {
  const wranglerCwd = join(tmpdir(), 'seo-tool-site-factory-wrangler-cwd');
  mkdirSync(wranglerCwd, { recursive: true });
  const [outputDir, ...restDeployArgs] = deployArgs;
  const resolvedOutputDir = outputDir && !isAbsolute(outputDir) ? join(workspaceRoot, outputDir) : outputDir;
  const args = ['exec', 'wrangler', '--cwd', wranglerCwd, 'pages', 'deploy', resolvedOutputDir, ...restDeployArgs];
  const deployEnv = { ...process.env, FACTORY_ROOT: workspaceRoot, ...env };
  const first = runRelay('pnpm', args, workspaceRoot, deployEnv);
  if (first.status === 0) return;

  if (!hasProxyEnv(deployEnv) || !first.output.includes('fetch failed')) {
    process.exit(first.status);
  }

  console.warn('Wrangler fetch failed with proxy environment detected; retrying without proxy environment variables.');
  const second = runRelay('pnpm', args, workspaceRoot, stripProxyEnv(deployEnv));
  if (second.status !== 0) process.exit(second.status);
}

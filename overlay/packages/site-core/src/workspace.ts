import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export function findWorkspaceRoot(start = process.env.FACTORY_ROOT ?? process.cwd()): string {
  let dir = resolve(start);
  while (true) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml')) && existsSync(join(dir, 'sites'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Unable to find workspace root from ${start}. Set FACTORY_ROOT to the repository root.`);
}

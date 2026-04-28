#!/usr/bin/env tsx
import { generatePortfolioReport } from '@factory/ops';
import { findWorkspaceRoot } from '@factory/site-core';

const command = process.argv[2] ?? 'report';
const workspaceRoot = findWorkspaceRoot();

if (command !== 'report' && command !== 'dashboard') {
  console.log('Usage: pnpm ops report');
  process.exit(1);
}

const cards = generatePortfolioReport(workspaceRoot);
console.log(`Generated .generated/portfolio.json and .generated/portfolio.html for ${cards.length} site(s).`);

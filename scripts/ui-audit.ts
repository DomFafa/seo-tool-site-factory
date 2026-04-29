#!/usr/bin/env tsx
import { compareUiFingerprints, findWorkspaceRoot, getUiFingerprint, listSiteIds, loadSiteContext } from '@factory/site-core';

const workspaceRoot = findWorkspaceRoot();
const target = process.argv[2] ?? '--all';
const warnAt = Number(process.env.UI_SIMILARITY_WARN_AT ?? 72);

function printFingerprint(siteId: string): ReturnType<typeof getUiFingerprint> {
  const ctx = loadSiteContext(siteId, workspaceRoot);
  const fp = getUiFingerprint(ctx);
  console.log(`\n${fp.siteId}`);
  console.log(`  recipe: ${fp.recipe}`);
  console.log(`  nav: ${fp.navVariant}`);
  console.log(`  theme: ${fp.themeName}`);
  console.log(`  personality: ${fp.personality}`);
  console.log(`  density/surface: ${fp.density}/${fp.surface}`);
  console.log(`  blocks: ${fp.blocks.join(' > ')}`);
  return fp;
}

const siteIds = target === '--all' ? listSiteIds(workspaceRoot) : [target];
const fingerprints = siteIds.map(printFingerprint);

if (fingerprints.length > 1) {
  console.log('\nSimilarity warnings');
  let warnings = 0;
  for (let i = 0; i < fingerprints.length; i++) {
    for (let j = i + 1; j < fingerprints.length; j++) {
      const sim = compareUiFingerprints(fingerprints[i], fingerprints[j]);
      if (sim.score >= warnAt) {
        warnings++;
        console.log(`  [P2] ${sim.siteA} vs ${sim.siteB}: ${sim.score}% shared (${sim.shared.slice(0, 8).join(', ')})`);
      }
    }
  }
  if (!warnings) console.log('  none');
}

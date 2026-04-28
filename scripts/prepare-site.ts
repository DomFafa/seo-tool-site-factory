import { prepareSelectedSite } from '../packages/site-core/src/index.js';

async function main(): Promise<void> {
  const prepared = await prepareSelectedSite();
  console.log(`Prepared ${prepared.site.id}`);
  console.log(`Generated ${prepared.generatedFiles.site}`);
  console.log(`Generated ${prepared.generatedFiles.theme}`);
  console.log(`Generated ${prepared.generatedFiles.contentManifest}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

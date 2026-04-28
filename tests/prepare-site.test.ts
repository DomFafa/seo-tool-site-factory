import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { prepareSelectedSite, resolveSelectedSiteId } from '../packages/site-core/src/index.js';

let generatedDir: string;

beforeEach(async () => {
  generatedDir = await fs.mkdtemp(path.join(os.tmpdir(), 'seo-tool-site-generated-'));
});

afterEach(async () => {
  await fs.rm(generatedDir, { recursive: true, force: true });
});

describe('selected-site preparation', () => {
  it('rejects a missing SITE_ID', () => {
    expect(() => resolveSelectedSiteId()).toThrow('SITE_ID is required');
  });

  it('rejects an unknown SITE_ID', async () => {
    await expect(prepareSelectedSite({ siteId: 'missing-site', generatedDir })).rejects.toThrow('Unknown site "missing-site"');
  });

  it('generates a manifest for only the selected typing site', async () => {
    const result = await prepareSelectedSite({ siteId: 'typing-speed-test', generatedDir });
    const siteModule = await fs.readFile(path.join(generatedDir, 'site.ts'), 'utf8');
    const manifest = await fs.readFile(path.join(generatedDir, 'content-manifest.json'), 'utf8');

    expect(result.site.id).toBe('typing-speed-test');
    expect(siteModule).toContain('typing-speed-test');
    expect(siteModule).not.toContain('convert-image-to-png');
    expect(manifest).toContain('typing-speed-test');
    expect(manifest).not.toContain('convert-image-to-png');
  });

  it('generates a manifest for only the selected image converter site', async () => {
    const result = await prepareSelectedSite({ siteId: 'convert-image-to-png', generatedDir });
    const siteModule = await fs.readFile(path.join(generatedDir, 'site.ts'), 'utf8');
    const manifest = await fs.readFile(path.join(generatedDir, 'content-manifest.json'), 'utf8');

    expect(result.site.id).toBe('convert-image-to-png');
    expect(siteModule).toContain('convert-image-to-png');
    expect(siteModule).not.toContain('typing-speed-test');
    expect(manifest).toContain('convert-image-to-png');
    expect(manifest).not.toContain('typing-speed-test');
  });
});

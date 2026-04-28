import { describe, expect, it } from 'vitest';
import {
  contentFrontmatterSchema,
  siteConfigSchema,
  validateAllSites,
  validateSiteCollection,
  validateSiteConfig,
  type LoadedSite,
  type SiteConfig
} from '../packages/site-core/src/index.js';

const baseConfig: SiteConfig = {
  id: 'typing-speed-test',
  brandName: 'SpeedType',
  domains: ['typingspeedtest.example.com'],
  canonicalHost: 'typingspeedtest.example.com',
  defaultLocale: 'en',
  locales: ['en'],
  primaryTool: 'typing-speed-test',
  lifecycle: {
    status: 'draft',
    indexable: false,
    monetizable: false
  },
  seo: {
    defaultTitle: 'Typing Speed Test',
    defaultDescription: 'Test typing speed.',
    xDefaultLocale: 'en',
    structuredData: {
      website: true,
      webpage: true,
      softwareApplication: true,
      breadcrumb: true,
      faqPage: 'manual-review-only'
    }
  },
  ads: {
    enabled: false,
    provider: 'adsense',
    slots: {
      afterTool: true
    }
  },
  analytics: {
    enabled: true,
    provider: 'cloudflare',
    events: ['page_view']
  },
  deployment: {
    provider: 'cloudflare-workers',
    projectName: 'typing-speed-test'
  },
  privacy: {
    storesUserInput: false,
    storesUploadedFiles: false,
    rawInputInAnalytics: false
  },
  limits: {
    rateLimitPerMinute: 60
  },
  features: {
    guides: true
  }
};

function loadedSite(config: SiteConfig): LoadedSite {
  return {
    id: config.id,
    dir: `/repo/sites/${config.id}`,
    config
  };
}

describe('site config validation', () => {
  it('accepts the two initial draft site packs', async () => {
    const { sites, result } = await validateAllSites();

    expect(sites.map((site) => site.id).sort()).toEqual(['convert-image-to-png', 'typing-speed-test']);
    expect(result.errors).toEqual([]);
  });

  it('rejects duplicate domains across site packs', () => {
    const first = loadedSite(baseConfig);
    const second = loadedSite({
      ...baseConfig,
      id: 'convert-image-to-png',
      primaryTool: 'convert-image-to-png'
    });

    const result = validateSiteCollection([first, second]);

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'duplicate_domain'
        })
      ])
    );
  });

  it('rejects unknown primary tools', () => {
    const result = validateSiteConfig({ ...baseConfig, primaryTool: 'unknown-tool' }, 'typing-speed-test');

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unknown_primary_tool'
        })
      ])
    );
  });

  it('rejects a default locale that is not declared in locales', () => {
    const result = siteConfigSchema.safeParse({
      ...baseConfig,
      defaultLocale: 'fr'
    });

    expect(result.success).toBe(false);
  });

  it('rejects indexable content that is not approved', () => {
    const result = contentFrontmatterSchema.safeParse({
      title: 'Draft',
      description: 'Draft page.',
      slug: 'draft',
      lastModified: '2026-04-28',
      index: true,
      contentStatus: 'draft',
      reviewedBy: null,
      reviewedAt: null,
      aiAssisted: false
    });

    expect(result.success).toBe(false);
  });
});

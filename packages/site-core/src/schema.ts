import { z } from 'zod';

export const indexingModes = ['disallow', 'allow-noindex', 'index'] as const;
export const launchStages = ['pages-dev', 'real-domain-noindex', 'real-domain-indexed', 'ads-enabled'] as const;

const LocaleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  indexable: z.boolean().default(false),
  reviewed: z.boolean().default(false)
});

const SeoSitemapSchema = z.object({
  split: z.boolean().default(false),
  includeHome: z.boolean().default(true),
  includeGuides: z.boolean().default(true)
}).default({ split: false, includeHome: true, includeGuides: true });

const SeoOgImageSchema = z.object({
  mode: z.enum(['generated', 'static', 'none']).default('generated'),
  path: z.string().default('/og-image.svg'),
  template: z.string().optional()
}).default({ mode: 'generated', path: '/og-image.svg' });

const SeoPagesDevRedirectSchema = z.object({
  status: z.enum(['unknown', 'not-needed', 'pending', 'configured']).default('unknown'),
  notes: z.string().optional()
}).default({ status: 'unknown' });

export const SiteConfigSchema = z.object({
  schemaVersion: z.number().int().default(1),
  id: z.string().min(1).regex(/^[a-z0-9][a-z0-9-]*$/),
  brandName: z.string().min(1),
  category: z.string().min(1),
  primaryKeyword: z.string().min(1),
  lifecycle: z.object({
    status: z.enum(['draft', 'preview', 'live', 'paused', 'archived']).default('draft')
  }).default({ status: 'draft' }),
  launch: z.object({
    stage: z.enum(launchStages).default('pages-dev')
  }).default({ stage: 'pages-dev' }),
  domains: z.object({
    production: z.string().min(1),
    canonicalHost: z.string().min(1),
    aliases: z.array(z.string()).default([])
  }),
  defaultLocale: z.string().min(2),
  locales: z.record(LocaleConfigSchema),
  indexing: z.object({
    allowIndex: z.boolean().default(false),
    mode: z.enum(indexingModes).optional()
  }).default({ allowIndex: false }),
  primaryTool: z.string().min(1),
  seo: z.object({
    defaultTitle: z.string().min(1),
    defaultDescription: z.string().min(1),
    xDefaultLocale: z.string().min(2).optional(),
    structuredData: z.array(z.enum(['WebSite', 'WebPage', 'SoftwareApplication', 'Article', 'BreadcrumbList'])).default(['WebSite', 'WebPage']),
    sitemap: SeoSitemapSchema,
    ogImage: SeoOgImageSchema,
    pagesDevRedirect: SeoPagesDevRedirectSchema
  }),
  deployment: z.object({
    provider: z.enum(['cloudflare-pages']).default('cloudflare-pages'),
    projectName: z.string().min(1),
    outputDir: z.string().min(1).optional()
  })
});

export const ToolConfigSchema = z.object({
  schemaVersion: z.number().int().default(1),
  toolId: z.string().min(1),
  executionModel: z.enum(['client-only', 'static-data', 'browser-file-processing', 'external-provider', 'hybrid']),
  privacy: z.record(z.any()).default({}),
  analytics: z.object({
    safeFields: z.array(z.string()).default([])
  }).default({ safeFields: [] }),
  options: z.record(z.any()).default({})
});

export const ThemeConfigSchema = z.object({
  schemaVersion: z.number().int().default(1),
  name: z.string().min(1).default('default'),
  personality: z.string().optional(),
  density: z.enum(['compact', 'comfortable', 'spacious']).default('comfortable'),
  surface: z.enum(['flat', 'cards', 'panels', 'editorial']).default('cards'),
  colors: z.object({
    primary: z.string().default('#2563eb'),
    background: z.string().optional(),
    surface: z.string().optional(),
    accent: z.string().optional()
  }).default({ primary: '#2563eb' }),
  radius: z.string().default('18px'),
  layout: z.string().default('tool-first'),
  adLayout: z.object({
    avoidPrimaryActions: z.boolean().default(true),
    disableOnToolResultPanel: z.boolean().default(true)
  }).default({ avoidPrimaryActions: true, disableOnToolResultPanel: true })
});

export const LayoutBlockSchema = z.object({
  type: z.enum(['hero', 'tool', 'content', 'howItWorks', 'examples', 'guideLinks', 'faq', 'privacyNote', 'adSlot']),
  variant: z.string().default('default'),
  props: z.record(z.any()).default({})
});

export const LayoutConfigSchema = z.object({
  schemaVersion: z.number().int().default(1),
  recipe: z.string().default('tool-first'),
  chrome: z.object({
    navVariant: z.string().default('compact'),
    footerVariant: z.string().default('simple')
  }).default({ navVariant: 'compact', footerVariant: 'simple' }),
  home: z.object({
    blocks: z.array(LayoutBlockSchema).min(1).default([
      { type: 'hero', variant: 'simple', props: {} },
      { type: 'tool', variant: 'card', props: {} },
      { type: 'content', variant: 'card', props: {} },
      { type: 'faq', variant: 'accordion', props: {} }
    ])
  }).default({
    blocks: [
      { type: 'hero', variant: 'simple', props: {} },
      { type: 'tool', variant: 'card', props: {} },
      { type: 'content', variant: 'card', props: {} },
      { type: 'faq', variant: 'accordion', props: {} }
    ]
  })
});

const VerificationSchema = z.object({
  method: z.enum(['none', 'meta', 'html-file', 'xml-file', 'dns', 'import-from-gsc']).default('none'),
  metaName: z.string().optional(),
  content: z.string().optional(),
  fileName: z.string().optional(),
  fileContent: z.string().optional()
}).default({ method: 'none' });

export const IntegrationsConfigSchema = z.object({
  schemaVersion: z.number().int().default(1),
  consent: z.object({
    enabled: z.boolean().default(false),
    googleConsentMode: z.boolean().default(false),
    clarityConsentMode: z.boolean().default(false)
  }).default({ enabled: false, googleConsentMode: false, clarityConsentMode: false }),
  ads: z.object({
    enabled: z.boolean().default(false),
    activeProvider: z.enum(['adsense', 'adsterra']).default('adsense'),
    policy: z.object({
      allowPopunder: z.boolean().default(false),
      allowInterstitial: z.boolean().default(false),
      allowSocialBar: z.boolean().default(false),
      avoidPrimaryActions: z.boolean().default(true),
      disableOnToolResultPanel: z.boolean().default(true)
    }).default({ allowPopunder: false, allowInterstitial: false, allowSocialBar: false, avoidPrimaryActions: true, disableOnToolResultPanel: true }),
    adsTxt: z.object({
      enabled: z.boolean().default(false),
      entries: z.array(z.string()).default([])
    }).default({ enabled: false, entries: [] }),
    providers: z.object({
      adsense: z.object({
        enabled: z.boolean().default(false),
        publisherId: z.string().optional(),
        siteStatus: z.enum(['not_submitted', 'pending_review', 'approved', 'rejected', 'disabled']).default('not_submitted'),
        autoAds: z.boolean().default(false),
        verification: VerificationSchema.optional(),
        slots: z.record(z.object({
          enabled: z.boolean().default(false),
          adSlot: z.string().optional(),
          format: z.string().default('auto')
        })).default({})
      }).default({ enabled: false, siteStatus: 'not_submitted', autoAds: false, slots: {} }),
      adsterra: z.object({
        enabled: z.boolean().default(false),
        siteStatus: z.enum(['not_submitted', 'pending_verification', 'verified', 'rejected', 'disabled']).default('not_submitted'),
        allowedFormats: z.array(z.string()).default(['banner', 'native']),
        blockedFormats: z.array(z.string()).default(['popunder', 'interstitial', 'social-bar']),
        placements: z.record(z.object({
          enabled: z.boolean().default(false),
          format: z.string(),
          snippet: z.string().optional()
        })).default({})
      }).default({ enabled: false, siteStatus: 'not_submitted', placements: {} })
    }).default({ adsense: {}, adsterra: {} })
  }).default({ enabled: false, activeProvider: 'adsense' }),
  analytics: z.object({
    googleAnalytics: z.object({
      enabled: z.boolean().default(false),
      measurementId: z.string().optional(),
      trackToolEvents: z.boolean().default(true)
    }).default({ enabled: false, trackToolEvents: true }),
    microsoftClarity: z.object({
      enabled: z.boolean().default(false),
      projectId: z.string().optional(),
      consentMode: z.boolean().default(false)
    }).default({ enabled: false, consentMode: false })
  }).default({ googleAnalytics: {}, microsoftClarity: {} }),
  webmaster: z.object({
    googleSearchConsole: z.object({
      enabled: z.boolean().default(false),
      propertyType: z.enum(['url-prefix', 'domain']).default('url-prefix'),
      verification: VerificationSchema.optional()
    }).default({ enabled: false, propertyType: 'url-prefix' }),
    bingWebmaster: z.object({
      enabled: z.boolean().default(false),
      verification: VerificationSchema.optional()
    }).default({ enabled: false })
  }).default({ googleSearchConsole: {}, bingWebmaster: {} }),
  indexing: z.object({
    indexNow: z.object({
      enabled: z.boolean().default(false),
      key: z.string().optional(),
      keyFile: z.string().optional(),
      submitOnProductionDeploy: z.boolean().default(false),
      endpoint: z.string().default('https://api.indexnow.org/indexnow')
    }).default({ enabled: false, submitOnProductionDeploy: false, endpoint: 'https://api.indexnow.org/indexnow' })
  }).default({ indexNow: {} })
});

export const ContentFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9][a-z0-9-]*$/),
    lastModified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    index: z.boolean().default(false),
    contentStatus: z.enum(['draft', 'edited', 'reviewed', 'localized', 'approved', 'archived']).default('draft'),
    reviewedBy: z.string().nullable().optional(),
    reviewedAt: z.string().nullable().optional(),
    aiAssisted: z.boolean().default(false)
  })
  .superRefine((frontmatter, ctx) => {
    if (frontmatter.index && frontmatter.contentStatus !== 'approved') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['index'],
        message: 'index=true requires contentStatus=approved'
      });
    }

    if (frontmatter.index && frontmatter.aiAssisted && (!frontmatter.reviewedBy || !frontmatter.reviewedAt)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['reviewedBy'],
        message: 'indexable AI-assisted content requires reviewedBy and reviewedAt'
      });
    }
  });

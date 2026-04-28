import { z } from 'zod';

export const siteLifecycleStatuses = [
  'draft',
  'validated',
  'preview',
  'indexable',
  'monetizable',
  'launched',
  'paused',
  'archived'
] as const;

export const contentStatuses = ['draft', 'reviewed', 'localized', 'approved'] as const;

export const siteConfigSchema = z
  .object({
    id: z.string().min(1),
    brandName: z.string().min(1),
    domains: z.array(z.string().min(1)).min(1),
    canonicalHost: z.string().min(1),
    defaultLocale: z.string().min(2),
    locales: z.array(z.string().min(2)).min(1),
    primaryTool: z.string().min(1),
    lifecycle: z.object({
      status: z.enum(siteLifecycleStatuses),
      indexable: z.boolean(),
      monetizable: z.boolean(),
      launchedAt: z.string().optional(),
      pausedReason: z.string().optional()
    }),
    seo: z.object({
      defaultTitle: z.string().min(1),
      defaultDescription: z.string().min(1),
      xDefaultLocale: z.string().min(2),
      ogImage: z.string().optional(),
      structuredData: z.object({
        website: z.boolean(),
        webpage: z.boolean(),
        softwareApplication: z.boolean(),
        breadcrumb: z.boolean(),
        faqPage: z.enum(['disabled', 'manual-review-only'])
      })
    }),
    ads: z.object({
      enabled: z.boolean(),
      provider: z.enum(['adsense', 'none']),
      slots: z.record(z.boolean()),
      publisherId: z.string().optional()
    }),
    analytics: z.object({
      enabled: z.boolean(),
      provider: z.enum(['cloudflare', 'ga4', 'plausible', 'none']),
      events: z.array(z.string().min(1))
    }),
    deployment: z.object({
      provider: z.literal('cloudflare-workers'),
      projectName: z.string().min(1),
      zoneId: z.string().optional(),
      previewUrl: z.string().url().optional()
    }),
    privacy: z.object({
      storesUserInput: z.boolean(),
      storesUploadedFiles: z.boolean(),
      rawInputInAnalytics: z.literal(false),
      retentionDays: z.number().int().nonnegative().optional()
    }),
    limits: z.object({
      maxFileMb: z.number().positive().optional(),
      maxTextChars: z.number().int().positive().optional(),
      rateLimitPerMinute: z.number().int().positive().optional()
    }),
    features: z.record(z.boolean())
  })
  .superRefine((config, ctx) => {
    if (!config.domains.includes(config.canonicalHost)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['canonicalHost'],
        message: 'canonicalHost must be one of domains'
      });
    }

    if (!config.locales.includes(config.defaultLocale)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['defaultLocale'],
        message: 'defaultLocale must be included in locales'
      });
    }

    if (!config.locales.includes(config.seo.xDefaultLocale)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['seo', 'xDefaultLocale'],
        message: 'seo.xDefaultLocale must be included in locales'
      });
    }

    if (config.lifecycle.status === 'draft' && config.lifecycle.indexable) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lifecycle', 'indexable'],
        message: 'draft sites cannot be indexable'
      });
    }

    if (config.lifecycle.status !== 'monetizable' && config.lifecycle.status !== 'launched') {
      if (config.ads.enabled || config.lifecycle.monetizable) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['ads', 'enabled'],
          message: 'ads can only be enabled for monetizable or launched sites'
        });
      }
    }
  });

export const contentFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().min(1),
    lastModified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    index: z.boolean(),
    contentStatus: z.enum(contentStatuses),
    reviewedBy: z.string().nullable().optional(),
    reviewedAt: z.string().nullable().optional(),
    aiAssisted: z.boolean()
  })
  .superRefine((frontmatter, ctx) => {
    if (frontmatter.index && frontmatter.contentStatus !== 'approved') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['index'],
        message: 'index=true requires contentStatus=approved'
      });
    }

    if (frontmatter.index && frontmatter.aiAssisted) {
      if (!frontmatter.reviewedBy || !frontmatter.reviewedAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['reviewedBy'],
          message: 'indexable AI-assisted content requires reviewedBy and reviewedAt'
        });
      }
    }
  });

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type ContentFrontmatter = z.infer<typeof contentFrontmatterSchema>;

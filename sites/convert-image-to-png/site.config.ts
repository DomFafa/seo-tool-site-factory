export default {
  id: 'convert-image-to-png',
  brandName: 'PNG Convert',
  domains: ['convertimagetopng.example.com', 'www.convertimagetopng.example.com'],
  canonicalHost: 'convertimagetopng.example.com',
  defaultLocale: 'en',
  locales: ['en'],
  primaryTool: 'convert-image-to-png',
  lifecycle: {
    status: 'draft',
    indexable: false,
    monetizable: false
  },
  seo: {
    defaultTitle: 'Convert Image to PNG',
    defaultDescription: 'Convert JPG, WebP, and other browser-supported image files to PNG locally.',
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
      afterTool: true,
      inArticle: true,
      sidebar: false
    }
  },
  analytics: {
    enabled: true,
    provider: 'cloudflare',
    events: ['page_view', 'file_selected', 'tool_start', 'tool_complete', 'file_downloaded']
  },
  deployment: {
    provider: 'cloudflare-workers',
    projectName: 'convert-image-to-png'
  },
  privacy: {
    storesUserInput: false,
    storesUploadedFiles: false,
    rawInputInAnalytics: false
  },
  limits: {
    maxFileMb: 10,
    rateLimitPerMinute: 30
  },
  features: {
    guides: true,
    faq: true,
    ads: false,
    analytics: true
  }
} as const;

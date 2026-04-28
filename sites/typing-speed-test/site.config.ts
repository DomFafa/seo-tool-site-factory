export default {
  id: 'typing-speed-test',
  brandName: 'SpeedType',
  domains: ['typingspeedtest.example.com', 'www.typingspeedtest.example.com'],
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
    defaultDescription: 'Test your typing speed online and measure WPM, CPM, and accuracy.',
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
    events: ['page_view', 'tool_start', 'typing_test_completed', 'copy_action']
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
    maxTextChars: 5000,
    rateLimitPerMinute: 60
  },
  features: {
    guides: true,
    faq: true,
    ads: false,
    analytics: true
  }
} as const;

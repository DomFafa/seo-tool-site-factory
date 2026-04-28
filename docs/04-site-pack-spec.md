# 04 — Site Pack Specification

A site pack is the product identity layer for one independent website.

## Required files

```txt
sites/<site-id>/
  site.config.ts
  theme.ts
  content/
  messages/
```

## `site.config.ts` schema overview

```ts
type SiteLifecycleStatus =
  | 'draft'
  | 'validated'
  | 'preview'
  | 'indexable'
  | 'monetizable'
  | 'launched'
  | 'paused'
  | 'archived';

type SiteConfig = {
  id: string;
  brandName: string;
  domains: string[];
  canonicalHost: string;
  defaultLocale: string;
  locales: string[];
  primaryTool: string;
  lifecycle: {
    status: SiteLifecycleStatus;
    indexable: boolean;
    monetizable: boolean;
    launchedAt?: string;
    pausedReason?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    xDefaultLocale: string;
    ogImage?: string;
    structuredData: {
      website: boolean;
      webpage: boolean;
      softwareApplication: boolean;
      breadcrumb: boolean;
      faqPage: 'disabled' | 'manual-review-only';
    };
  };
  ads: {
    enabled: boolean;
    provider: 'adsense' | 'none';
    slots: Record<string, boolean>;
    publisherId?: string;
  };
  analytics: {
    enabled: boolean;
    provider: 'cloudflare' | 'ga4' | 'plausible' | 'none';
    events: string[];
  };
  deployment: {
    provider: 'cloudflare-workers';
    projectName: string;
    zoneId?: string;
    previewUrl?: string;
  };
  privacy: {
    storesUserInput: boolean;
    storesUploadedFiles: boolean;
    rawInputInAnalytics: false;
    retentionDays?: number;
  };
  limits: {
    maxFileMb?: number;
    maxTextChars?: number;
    rateLimitPerMinute?: number;
  };
  features: Record<string, boolean>;
};
```

## Config rules

- `id` must match directory name.
- `domains` must be globally unique across all site packs.
- `canonicalHost` must be one of `domains`.
- `defaultLocale` must be included in `locales`.
- `primaryTool` must exist in the tool registry.
- `lifecycle.indexable` cannot be true if status is `draft`.
- `ads.enabled` cannot be true if lifecycle is not monetizable.
- `privacy.rawInputInAnalytics` must always be false.

## `theme.ts` schema overview

Theme describes visual direction, not just colors.

```ts
type SiteTheme = {
  id: string;
  layout: 'tool-first' | 'education-first' | 'dashboard' | 'minimal';
  density: 'compact' | 'comfortable' | 'spacious';
  radius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  typography: {
    heading: 'compact' | 'editorial' | 'playful';
    body: 'readable' | 'compact';
  };
  hero: {
    variant: 'minimal' | 'split' | 'centered' | 'utility';
  };
  toolSurface: {
    variant: 'card' | 'panel' | 'borderless';
  };
  resultPanel: {
    variant: 'dashboard' | 'simple' | 'download-focused';
  };
  ads: {
    afterToolSpacing: 'normal' | 'large';
    sidebar: boolean;
  };
};
```

## Content frontmatter

```md
---
title: "Typing Speed Test"
description: "Test your typing speed online."
slug: "typing-speed-test"
lastModified: "2026-04-28"
index: false
contentStatus: "draft"
reviewedBy: null
reviewedAt: null
aiAssisted: false
---
```

Allowed `contentStatus` values:

```txt
draft
reviewed
localized
approved
```

Rules:

- `index=true` requires `contentStatus=approved`.
- `aiAssisted=true` requires `reviewedBy` and `reviewedAt` before indexable.
- `lastModified` changes only when content meaningfully changes.
- `slug` must be unique within locale.

## Messages

Messages are UI strings, not long-form content.

```txt
messages/
  en.json
  es.json
```

Missing messages should fail in strict production builds.

import type { z } from 'zod';
import type { SiteConfigSchema, ToolConfigSchema, ThemeConfigSchema, IntegrationsConfigSchema, LayoutConfigSchema } from './schema';

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type ToolConfig = z.infer<typeof ToolConfigSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type IntegrationsConfig = z.infer<typeof IntegrationsConfigSchema>;
export type LayoutConfig = z.infer<typeof LayoutConfigSchema>;
export type LayoutBlock = LayoutConfig['home']['blocks'][number];

export type SiteContext = {
  workspaceRoot: string;
  siteId: string;
  siteDir: string;
  siteConfig: SiteConfig;
  toolConfig: ToolConfig;
  themeConfig: ThemeConfig;
  integrationsConfig: IntegrationsConfig;
  layoutConfig: LayoutConfig;
};

export type ContentFrontmatter = {
  title: string;
  description: string;
  slug: string;
  lastModified: string;
  index: boolean;
  contentStatus?: 'draft' | 'edited' | 'reviewed' | 'localized' | 'approved' | 'archived';
  [key: string]: unknown;
};

export type ContentDocument = {
  filePath: string;
  locale: string;
  kind: 'home' | 'faq' | 'guide' | 'page';
  frontmatter: ContentFrontmatter;
  body: string;
  html: string;
};

export type ValidationIssue = {
  level: 'P0' | 'P1' | 'P2';
  code: string;
  message: string;
  file?: string;
};

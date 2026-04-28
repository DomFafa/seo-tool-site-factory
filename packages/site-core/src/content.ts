import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { contentFrontmatterSchema, type ContentFrontmatter, type SiteConfig } from './schema.js';
import type { ValidationIssue, ValidationResult } from './issues.js';

export type ContentItem = {
  locale: string;
  filePath: string;
  frontmatter: ContentFrontmatter;
};

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findMdxFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return findMdxFiles(entryPath);
      }
      return entry.isFile() && entry.name.endsWith('.mdx') ? [entryPath] : [];
    })
  );

  return files.flat();
}

export async function validateContent(siteDir: string, config: SiteConfig): Promise<ValidationResult> {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const defaultHomePath = path.join(siteDir, 'content', config.defaultLocale, 'home.mdx');

  if (!(await pathExists(defaultHomePath))) {
    errors.push({
      level: 'error',
      code: 'missing_default_home',
      message: `Missing default locale home content at ${path.relative(process.cwd(), defaultHomePath)}`,
      siteId: config.id,
      file: defaultHomePath
    });
  }

  for (const locale of config.locales) {
    const localeContentDir = path.join(siteDir, 'content', locale);
    if (!(await pathExists(localeContentDir))) {
      errors.push({
        level: 'error',
        code: 'missing_locale_content',
        message: `Missing content directory for locale ${locale}`,
        siteId: config.id,
        file: localeContentDir
      });
      continue;
    }

    const seenSlugs = new Map<string, string>();
    const mdxFiles = await findMdxFiles(localeContentDir);

    for (const filePath of mdxFiles) {
      const source = await fs.readFile(filePath, 'utf8');
      const parsed = matter(source);
      const frontmatterResult = contentFrontmatterSchema.safeParse(parsed.data);

      if (!frontmatterResult.success) {
        for (const issue of frontmatterResult.error.issues) {
          errors.push({
            level: 'error',
            code: 'invalid_frontmatter',
            message: `${path.relative(process.cwd(), filePath)}: ${issue.path.join('.') || 'frontmatter'} ${issue.message}`,
            siteId: config.id,
            file: filePath
          });
        }
        continue;
      }

      const previousFile = seenSlugs.get(frontmatterResult.data.slug);
      if (previousFile) {
        errors.push({
          level: 'error',
          code: 'duplicate_slug',
          message: `Duplicate slug "${frontmatterResult.data.slug}" in locale ${locale}`,
          siteId: config.id,
          file: filePath
        });
        errors.push({
          level: 'error',
          code: 'duplicate_slug',
          message: `Duplicate slug "${frontmatterResult.data.slug}" in locale ${locale}`,
          siteId: config.id,
          file: previousFile
        });
      }

      seenSlugs.set(frontmatterResult.data.slug, filePath);
    }
  }

  return { errors, warnings };
}

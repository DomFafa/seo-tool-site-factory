import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { ContentDocument, ContentFrontmatter, SiteContext } from './types';

function normalizeFrontmatter(data: Record<string, unknown>, fallbackSlug: string): ContentFrontmatter {
  const title = String(data.title ?? '').trim();
  const description = String(data.description ?? '').trim();
  if (!title) throw new Error(`Content document is missing title for slug ${fallbackSlug}`);
  if (!description) throw new Error(`Content document is missing description for slug ${fallbackSlug}`);
  return {
    ...data,
    title,
    description,
    slug: String(data.slug ?? fallbackSlug),
    lastModified: String(data.lastModified ?? new Date().toISOString().slice(0, 10)),
    index: data.index === undefined ? false : Boolean(data.index),
    contentStatus: (data.contentStatus as ContentFrontmatter['contentStatus']) ?? 'draft'
  };
}

async function readContentFile(ctx: SiteContext, locale: string, relPath: string, kind: ContentDocument['kind']): Promise<ContentDocument> {
  const filePath = join(ctx.siteDir, 'content', locale, relPath);
  if (!existsSync(filePath)) throw new Error(`Missing content file: ${filePath}`);
  const parsed = matter(readFileSync(filePath, 'utf8'));
  const fallbackSlug = relPath.replace(/\.mdx?$/, '').split('/').pop() ?? 'page';
  const frontmatter = normalizeFrontmatter(parsed.data, fallbackSlug);
  const html = await marked.parse(parsed.content);
  return { filePath, locale, kind, frontmatter, body: parsed.content, html };
}

export function contentExists(ctx: SiteContext, locale: string, relPath: string): boolean {
  return existsSync(join(ctx.siteDir, 'content', locale, relPath));
}

export function localeContentDirExists(ctx: SiteContext, locale: string): boolean {
  return existsSync(join(ctx.siteDir, 'content', locale));
}

export async function loadHomeContent(ctx: SiteContext, locale: string): Promise<ContentDocument> {
  return readContentFile(ctx, locale, 'home.mdx', 'home');
}

export async function loadFaqContent(ctx: SiteContext, locale: string): Promise<ContentDocument | null> {
  const filePath = join(ctx.siteDir, 'content', locale, 'faq.mdx');
  if (!existsSync(filePath)) return null;
  return readContentFile(ctx, locale, 'faq.mdx', 'faq');
}

export async function listGuideContent(ctx: SiteContext, locale: string): Promise<ContentDocument[]> {
  const dir = join(ctx.siteDir, 'content', locale, 'guides');
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((file) => file.endsWith('.md') || file.endsWith('.mdx')).sort();
  const docs = [];
  for (const file of files) docs.push(await readContentFile(ctx, locale, `guides/${file}`, 'guide'));
  return docs;
}

export async function loadGuideContent(ctx: SiteContext, locale: string, slug: string): Promise<ContentDocument> {
  const guides = await listGuideContent(ctx, locale);
  const guide = guides.find((doc) => doc.frontmatter.slug === slug);
  if (!guide) throw new Error(`Guide not found for locale=${locale}, slug=${slug}`);
  return guide;
}

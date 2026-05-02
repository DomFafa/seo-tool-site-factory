import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import type { ContentDocument, SiteContext } from '@factory/site-core';
import { getIndexableLocales, getIndexingMode, isPagesDevHost, isRealDomain, listGuideContent, listPageContent, loadFaqContent, loadHomeContent, shouldAllowRobotsCrawl } from '@factory/site-core';
import { buildPageSeo } from './metadata';
import { generateRobotsTxt } from './robots';
import { getSitemapEntries } from './sitemap';
import { lintSitePublicContent, type SeoIssue } from './content-lint';

const issue = (level: SeoIssue['level'], code: string, message: string, file?: string): SeoIssue => ({ level, code, message, file });
const isTrailingSlashUrl = (url: string) => /\/$/.test(new URL(url).pathname);
const countMarkdownH1 = (body: string) => body.split('\n').filter((line) => /^#\s+/.test(line.trim())).length;

function validateDoc(ctx: SiteContext, doc: ContentDocument, pageType: 'home' | 'guide' | 'page', slug?: string): SeoIssue[] {
  const issues: SeoIssue[] = [];
  const seo = buildPageSeo(ctx, { locale: doc.locale, page: doc, pageType, slug });
  if (seo.title.length < 20) issues.push(issue('P2', 'TITLE_SHORT', `Title is short (${seo.title.length} chars).`, relative(ctx.workspaceRoot, doc.filePath)));
  if (seo.title.length > 70) issues.push(issue('P2', 'TITLE_LONG', `Title is long (${seo.title.length} chars).`, relative(ctx.workspaceRoot, doc.filePath)));
  if (seo.description.length < 70) issues.push(issue('P2', 'DESCRIPTION_SHORT', `Description is short (${seo.description.length} chars).`, relative(ctx.workspaceRoot, doc.filePath)));
  if (seo.description.length > 170) issues.push(issue('P2', 'DESCRIPTION_LONG', `Description is long (${seo.description.length} chars).`, relative(ctx.workspaceRoot, doc.filePath)));
  if (countMarkdownH1(doc.body) > 0) issues.push(issue('P1', 'CONTENT_H1_FOUND', 'Content body contains markdown H1. The layout already emits the page H1.', relative(ctx.workspaceRoot, doc.filePath)));
  const canonical = new URL(seo.canonical);
  if (canonical.hostname !== ctx.siteConfig.domains.canonicalHost) issues.push(issue('P0', 'CANONICAL_HOST_MISMATCH', `Canonical host ${canonical.hostname} does not match ${ctx.siteConfig.domains.canonicalHost}.`, relative(ctx.workspaceRoot, doc.filePath)));
  if (!isTrailingSlashUrl(seo.canonical)) issues.push(issue('P1', 'CANONICAL_MISSING_TRAILING_SLASH', `Canonical URL should preserve trailing slash: ${seo.canonical}.`, relative(ctx.workspaceRoot, doc.filePath)));
  if (seo.noindex && getIndexingMode(ctx) === 'index' && doc.frontmatter.index && doc.frontmatter.contentStatus === 'approved') issues.push(issue('P1', 'UNEXPECTED_NOINDEX', 'Document appears approved/indexable but metadata still emits noindex.', relative(ctx.workspaceRoot, doc.filePath)));
  return issues;
}

async function allDocs(ctx: SiteContext): Promise<ContentDocument[]> {
  const docs: ContentDocument[] = [];
  for (const locale of Object.keys(ctx.siteConfig.locales)) {
    if (!ctx.siteConfig.locales[locale]?.enabled) continue;
    try { docs.push(await loadHomeContent(ctx, locale)); } catch {}
    const faq = await loadFaqContent(ctx, locale).catch(() => null);
    if (faq) docs.push(faq);
    docs.push(...await listGuideContent(ctx, locale).catch(() => []));
    docs.push(...await listPageContent(ctx, locale).catch(() => []));
  }
  return docs;
}

function auditAds(ctx: SiteContext): SeoIssue[] {
  const issues: SeoIssue[] = [];
  const ads = ctx.integrationsConfig.ads;
  if (!ads.enabled) return issues;
  if (!ads.adsTxt.enabled || ads.adsTxt.entries.length === 0) issues.push(issue('P1', 'ADS_TXT_MISSING', 'Ads are enabled but ads.txt entries are missing.'));
  if (ads.activeProvider === 'adsense') {
    const adsense = ads.providers.adsense;
    if (adsense.autoAds) issues.push(issue('P2', 'ADSENSE_AUTO_ADS_ENABLED', 'AdSense auto ads are enabled. Prefer manual slots for tool pages.'));
    if (!adsense.publisherId) issues.push(issue('P0', 'ADSENSE_PUBLISHER_ID_MISSING', 'AdSense is active but publisherId is missing.'));
  }
  if (ads.activeProvider === 'adsterra') {
    const risky = ['popunder', 'interstitial', 'social-bar'];
    for (const format of ctx.integrationsConfig.ads.providers.adsterra.allowedFormats ?? []) if (risky.includes(format)) issues.push(issue('P1', 'INTRUSIVE_AD_FORMAT_ALLOWED', `Adsterra intrusive format allowed: ${format}.`));
  }
  return issues;
}

function auditAnalyticsSafeFields(ctx: SiteContext): SeoIssue[] {
  const bannedTokens = ['rawtext', 'rawinput', 'uploadedfilecontent', 'typedtext', 'fulluserinput', 'spellchecktext', 'email', 'ipaddress'];
  const issues: SeoIssue[] = [];
  for (const field of ctx.toolConfig.analytics.safeFields ?? []) {
    const normalized = field.replace(/[^a-z0-9]/gi, '').toLowerCase();
    if (bannedTokens.some((token) => normalized.includes(token))) {
      issues.push(issue('P0', 'UNSAFE_ANALYTICS_FIELD', `tool.config.yaml analytics.safeFields contains unsafe field: ${field}.`));
    }
  }
  return issues;
}

function walkDistFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkDistFiles(full)); else out.push(full);
  }
  return out;
}

function extractAstroScriptRefs(html: string): string[] {
  const refs = new Set<string>();
  const scriptRefPattern = /["'](\/_astro\/[^"']+\.js)["']/g;
  for (const match of html.matchAll(scriptRefPattern)) refs.add(match[1]);
  return [...refs];
}

function extractRelativeStaticImports(js: string): string[] {
  const refs = new Set<string>();
  const patterns = [
    /\bimport\s+["'](\.{1,2}\/[^"']+\.js)["']/g,
    /\bfrom\s+["'](\.{1,2}\/[^"']+\.js)["']/g
  ];
  for (const pattern of patterns) {
    for (const match of js.matchAll(pattern)) refs.add(match[1]);
  }
  return [...refs];
}

function extractRelativeDynamicImports(js: string): string[] {
  const refs = new Set<string>();
  const pattern = /\bimport\(\s*["'](\.{1,2}\/[^"']+\.js)["']\s*\)/g;
  for (const match of js.matchAll(pattern)) refs.add(match[1]);
  return [...refs];
}

function toDistJsFile(outDir: string, ref: string): string {
  return ref.startsWith('/_astro/') ? join(outDir, ref.slice(1)) : ref;
}

function collectReachableClientJs(outDir: string): {
  initialStaticJsFiles: Set<string>;
  lazyDynamicJsFiles: Set<string>;
  missingRefs: string[];
} {
  const initialStaticJsFiles = new Set<string>();
  const lazyDynamicJsFiles = new Set<string>();
  const missingRefs: string[] = [];
  const htmlFiles = walkDistFiles(outDir).filter((file) => file.endsWith('.html'));
  const queue = htmlFiles.flatMap((file) => extractAstroScriptRefs(readFileSync(file, 'utf8')).map((ref) => toDistJsFile(outDir, ref)));

  while (queue.length > 0) {
    const file = resolve(queue.shift() ?? '');
    if (initialStaticJsFiles.has(file)) continue;
    if (!existsSync(file)) {
      missingRefs.push(relative(outDir, file));
      continue;
    }
    initialStaticJsFiles.add(file);
    const js = readFileSync(file, 'utf8');
    for (const ref of extractRelativeStaticImports(js)) queue.push(resolve(dirname(file), ref));
    for (const ref of extractRelativeDynamicImports(js)) {
      const dynamicFile = resolve(dirname(file), ref);
      if (!existsSync(dynamicFile)) missingRefs.push(relative(outDir, dynamicFile));
      else lazyDynamicJsFiles.add(dynamicFile);
    }
  }

  return { initialStaticJsFiles, lazyDynamicJsFiles, missingRefs: [...new Set(missingRefs)].sort() };
}

function sumRawBytes(files: Iterable<string>): number {
  let total = 0;
  for (const file of files) total += statSync(file).size;
  return total;
}

function sumGzipBytes(files: Iterable<string>): number {
  let total = 0;
  for (const file of files) total += gzipSync(readFileSync(file)).length;
  return total;
}

function auditCloudflareStaticFiles(ctx: SiteContext): SeoIssue[] {
  const issues: SeoIssue[] = [];
  const outDir = join(ctx.workspaceRoot, 'dist', 'sites', ctx.siteId);
  if (!existsSync(outDir)) return [issue('P2', 'DIST_NOT_BUILT', `dist/sites/${ctx.siteId} does not exist. Build the site before final SEO QA.`)];
  if (!existsSync(join(outDir, '_headers'))) issues.push(issue('P2', 'HEADERS_FILE_MISSING', '_headers is missing. Static asset cache headers are recommended.'));
  if (ctx.siteConfig.seo.ogImage?.mode !== 'none' && !existsSync(join(outDir, 'og-image.svg'))) issues.push(issue('P2', 'OG_IMAGE_MISSING', 'Generated OG image is missing from the build output.'));
  const reachableJs = collectReachableClientJs(outDir);
  for (const ref of reachableJs.missingRefs) issues.push(issue('P2', 'CLIENT_JS_REFERENCE_MISSING', `Referenced client JS is missing from build output: ${ref}.`));
  const reachableInitialJsGzipKiB = sumGzipBytes(reachableJs.initialStaticJsFiles) / 1024;
  const reachableInitialJsRawKiB = sumRawBytes(reachableJs.initialStaticJsFiles) / 1024;
  if (reachableInitialJsGzipKiB > 80) {
    issues.push(issue('P2', 'CLIENT_JS_BUDGET_WARNING', `Reachable client JS is ${reachableInitialJsGzipKiB.toFixed(1)} KiB gzip / ${reachableInitialJsRawKiB.toFixed(1)} KiB raw.`));
  }
  return issues;
}

export async function auditSiteSeo(ctx: SiteContext): Promise<SeoIssue[]> {
  const issues: SeoIssue[] = [];
  const mode = getIndexingMode(ctx);
  const host = ctx.siteConfig.domains.canonicalHost;
  if (ctx.siteConfig.lifecycle.status === 'live' && mode !== 'index') issues.push(issue('P1', 'LIVE_NOT_INDEX_MODE', `lifecycle.status=live but indexing.mode=${mode}.`));
  if (mode === 'index' && ctx.siteConfig.lifecycle.status !== 'live') issues.push(issue('P0', 'INDEX_MODE_NOT_LIVE', 'indexing.mode=index requires lifecycle.status=live.'));
  if (mode === 'index' && !ctx.siteConfig.indexing.allowIndex) issues.push(issue('P0', 'INDEX_MODE_ALLOWINDEX_FALSE', 'indexing.mode=index requires indexing.allowIndex=true.'));
  if (mode === 'index' && isPagesDevHost(host)) issues.push(issue('P0', 'PAGES_DEV_INDEX_MODE', 'pages.dev hosts must not use indexing.mode=index.'));
  if (mode === 'allow-noindex' && !shouldAllowRobotsCrawl(ctx)) issues.push(issue('P0', 'ALLOW_NOINDEX_ROBOTS_BLOCKED', 'allow-noindex mode should allow crawling in robots.txt.'));
  const robots = generateRobotsTxt(ctx);
  if (mode === 'disallow' && !robots.includes('Disallow: /')) issues.push(issue('P0', 'ROBOTS_EXPECTED_DISALLOW', 'indexing.mode=disallow should emit Disallow: /.'));
  if ((mode === 'allow-noindex' || mode === 'index') && !robots.includes('Allow: /')) issues.push(issue('P0', 'ROBOTS_EXPECTED_ALLOW', `${mode} should emit Allow: /.`));
  const entries = await getSitemapEntries(ctx);
  if (mode !== 'index' && entries.length > 0) issues.push(issue('P0', 'SITEMAP_NON_INDEX_MODE_HAS_URLS', `Sitemap has ${entries.length} URL(s) while indexing.mode=${mode}.`));
  if (mode === 'index' && entries.length === 0) issues.push(issue('P1', 'SITEMAP_INDEX_MODE_EMPTY', 'indexing.mode=index but sitemap has no URLs.'));
  for (const entry of entries) {
    const loc = new URL(entry.loc);
    if (loc.hostname !== host) issues.push(issue('P0', 'SITEMAP_HOST_MISMATCH', `Sitemap URL host ${loc.hostname} does not match ${host}.`));
    if (!isTrailingSlashUrl(entry.loc)) issues.push(issue('P1', 'SITEMAP_TRAILING_SLASH', `Sitemap URL should have trailing slash: ${entry.loc}.`));
  }
  if (isRealDomain(ctx) && ctx.siteConfig.seo.pagesDevRedirect.status !== 'configured') issues.push(issue('P2', 'PAGES_DEV_REDIRECT_RECOMMENDED', 'Real-domain launch should configure pages.dev -> canonical domain redirect in Cloudflare and then set seo.pagesDevRedirect.status=configured.'));
  for (const locale of getIndexableLocales(ctx)) if (!ctx.siteConfig.locales[locale]?.reviewed) issues.push(issue('P0', 'INDEXABLE_LOCALE_NOT_REVIEWED', `${locale} is indexable but reviewed=false.`));
  const docs = await allDocs(ctx);
  const slugs = new Map<string, string>();
  for (const doc of docs) {
    const key = `${doc.locale}:${doc.frontmatter.slug}`;
    const previous = slugs.get(key);
    if (previous) issues.push(issue('P0', 'DUPLICATE_CONTENT_SLUG', `Duplicate slug ${key}.`, `${previous} and ${relative(ctx.workspaceRoot, doc.filePath)}`));
    slugs.set(key, relative(ctx.workspaceRoot, doc.filePath));
    if (doc.kind === 'home') issues.push(...validateDoc(ctx, doc, 'home'));
    if (doc.kind === 'guide') issues.push(...validateDoc(ctx, doc, 'guide', doc.frontmatter.slug));
    if (doc.kind === 'page') issues.push(...validateDoc(ctx, doc, 'page', doc.frontmatter.slug));
  }
  issues.push(...auditAds(ctx), ...auditAnalyticsSafeFields(ctx), ...lintSitePublicContent(ctx), ...auditCloudflareStaticFiles(ctx));
  return issues;
}

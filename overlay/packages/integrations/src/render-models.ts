import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SiteContext } from '@factory/site-core';

export function getVerificationMetaTags(ctx: SiteContext): Array<{ name: string; content: string }> {
  const tags: Array<{ name: string; content: string }> = [];
  const webmaster = ctx.integrationsConfig.webmaster;
  const gsc = webmaster.googleSearchConsole;
  if (gsc.enabled && gsc.verification?.method === 'meta' && gsc.verification.content) {
    tags.push({ name: gsc.verification.metaName ?? 'google-site-verification', content: gsc.verification.content });
  }
  const bing = webmaster.bingWebmaster;
  if (bing.enabled && bing.verification?.method === 'meta' && bing.verification.content) {
    tags.push({ name: bing.verification.metaName ?? 'msvalidate.01', content: bing.verification.content });
  }
  const adsense = ctx.integrationsConfig.ads.providers.adsense;
  if (adsense.enabled && adsense.publisherId && adsense.verification?.method === 'meta') {
    tags.push({ name: adsense.verification.metaName ?? 'google-adsense-account', content: adsense.verification.content ?? adsense.publisherId });
  }
  return tags;
}

export function getAnalyticsRenderModel(ctx: SiteContext) {
  const analytics = ctx.integrationsConfig.analytics;
  return {
    ga4: analytics.googleAnalytics.enabled && analytics.googleAnalytics.measurementId
      ? { enabled: true, measurementId: analytics.googleAnalytics.measurementId }
      : undefined,
    clarity: analytics.microsoftClarity.enabled && analytics.microsoftClarity.projectId
      ? { enabled: true, projectId: analytics.microsoftClarity.projectId }
      : undefined
  };
}

export function getAdProviderScriptModel(ctx: SiteContext) {
  const ads = ctx.integrationsConfig.ads;
  const adsense = ads.providers.adsense;
  return {
    adsense: ads.enabled && ads.activeProvider === 'adsense' && adsense.enabled && adsense.publisherId
      ? { enabled: true, publisherId: adsense.publisherId }
      : undefined
  };
}

export type AdSlotRenderModel =
  | { kind: 'disabled' }
  | { kind: 'placeholder' }
  | { kind: 'adsense'; client: string; slot: string; format: string }
  | { kind: 'raw-html'; html: string };

export function getAdSlotRenderModel(ctx: SiteContext, placement: string): AdSlotRenderModel {
  const ads = ctx.integrationsConfig.ads;
  if (!ads.enabled || ctx.siteConfig.lifecycle.status !== 'live') return { kind: 'disabled' };
  if (ads.activeProvider === 'adsense') {
    const adsense = ads.providers.adsense;
    const slot = adsense.slots?.[placement];
    if (!adsense.enabled || !slot?.enabled || !adsense.publisherId || !slot.adSlot) return { kind: 'disabled' };
    return { kind: 'adsense', client: `ca-${adsense.publisherId.replace(/^ca-/, '')}`, slot: slot.adSlot, format: slot.format ?? 'auto' };
  }
  if (ads.activeProvider === 'adsterra') {
    const placementConfig = ads.providers.adsterra.placements?.[placement];
    if (!ads.providers.adsterra.enabled || !placementConfig?.enabled) return { kind: 'disabled' };
    if (placementConfig.snippet) {
      const snippetPath = join(ctx.siteDir, placementConfig.snippet);
      if (existsSync(snippetPath)) return { kind: 'raw-html', html: readFileSync(snippetPath, 'utf8') };
    }
    return { kind: 'placeholder' };
  }
  return { kind: 'disabled' };
}

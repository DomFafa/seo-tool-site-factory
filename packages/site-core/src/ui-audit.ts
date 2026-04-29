import type { LayoutBlock, SiteContext } from './types';

export type UiFingerprint = {
  siteId: string;
  recipe: string;
  navVariant: string;
  themeName: string;
  personality: string;
  density: string;
  surface: string;
  blocks: string[];
  key: string;
};

export type UiSimilarity = {
  siteA: string;
  siteB: string;
  score: number;
  shared: string[];
};

function blockKey(block: LayoutBlock): string {
  return `${block.type}:${block.variant}`;
}

export function getUiFingerprint(ctx: SiteContext): UiFingerprint {
  const blocks = ctx.layoutConfig.home.blocks.map(blockKey);
  const navVariant = ctx.layoutConfig.chrome.navVariant;
  const themeName = ctx.themeConfig.name;
  const personality = ctx.themeConfig.personality ?? ctx.layoutConfig.recipe;
  const density = ctx.themeConfig.density;
  const surface = ctx.themeConfig.surface;
  const keyParts = [ctx.layoutConfig.recipe, navVariant, themeName, personality, density, surface, ...blocks];
  return {
    siteId: ctx.siteId,
    recipe: ctx.layoutConfig.recipe,
    navVariant,
    themeName,
    personality,
    density,
    surface,
    blocks,
    key: keyParts.join('|')
  };
}

export function compareUiFingerprints(a: UiFingerprint, b: UiFingerprint): UiSimilarity {
  const aSet = new Set([a.recipe, a.navVariant, a.themeName, a.personality, a.density, a.surface, ...a.blocks]);
  const bSet = new Set([b.recipe, b.navVariant, b.themeName, b.personality, b.density, b.surface, ...b.blocks]);
  const shared = [...aSet].filter((value) => bSet.has(value));
  const union = new Set([...aSet, ...bSet]);
  const score = union.size === 0 ? 0 : Math.round((shared.length / union.size) * 100);
  return { siteA: a.siteId, siteB: b.siteId, score, shared };
}

import { imageConverterToolSpec } from '../../tools/image-converter/src/spec.js';
import { typingSpeedTestToolSpec } from '../../tools/typing-engine/src/spec.js';

export const toolSpecsById = {
  [typingSpeedTestToolSpec.id]: typingSpeedTestToolSpec,
  [imageConverterToolSpec.id]: imageConverterToolSpec
} as const;

export type KnownToolId = keyof typeof toolSpecsById;

export const knownToolIds = Object.keys(toolSpecsById) as KnownToolId[];

export function isKnownToolId(toolId: string): toolId is KnownToolId {
  return toolId in toolSpecsById;
}

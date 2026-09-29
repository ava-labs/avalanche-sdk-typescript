import type { ChainIdentifier } from '../types';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Generates an HSL color string for the chain icon fallback.
 */
export function getChainColor(id: ChainIdentifier): string {
  const seed = hashString(id.toString());
  const hue = seed % 360;
  const saturation = 60 + (seed % 20); // 60-79%
  const lightness = 45 + (seed % 10); // 45-54%
  return `hsl(${hue}, ${clamp(saturation, 40, 80)}%, ${clamp(lightness, 40, 65)}%)`;
}

export function getChainGradient(id: ChainIdentifier): string {
  const seed = hashString(`${id}-gradient`);
  const hue = seed % 360;
  const nextHue = (hue + 20) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 70%, 52%), hsl(${nextHue}, 70%, 58%))`;
}

import { FUEL_TYPE_COLORS } from "./types";

export { FUEL_TYPE_COLORS };

export function generateColors(countries: string[]): Record<string, string> {
  const colors: Record<string, string> = {};
  for (let i = 0; i < countries.length; i++) {
    const hue = (i / countries.length) % 1.0;
    const lightness = 0.5;
    const saturation = 0.5;
    const [r, g, b] = hlsToRgb(hue, lightness, saturation);
    colors[countries[i]] = `rgb(${r}, ${g}, ${b})`;
  }
  return colors;
}

function hlsToRgb(
  h: number,
  l: number,
  s: number
): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

// This simple round function is here to reduce floating
// point garbage in SVG attributes
export function round (n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

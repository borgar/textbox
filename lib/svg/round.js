// This simple round function is here to reduce floating
// point garbage in SVG attributes
export default function round (n) {
  return Math.round(n * 1e6) / 1e6;
}

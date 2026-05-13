import { WHITESPACE } from '../constants.ts';
import { fontStringParser } from '../fontStringParser.ts';
import type { MinimalCanvas, MinimalCanvasContext } from '../types.ts';

// This is just guesswork but works surprisingly well.
// Intended to be used to renderer for tests, or as a last resort in a server env.

// Character width multipliers for Excel formula-based calculation
const CHAR_WIDTH_MULTIPLIERS: Record<string, number> = {
  ...WHITESPACE,
  // Wide characters
  'W': 1.5,
  'M': 1.4,
  '@': 1.4,
  'm': 1.2,
  'w': 1.2,
  // Narrow characters
  'i': 0.4,
  'l': 0.5,
  'I': 0.4,
  'j': 0.4,
  // Punctuation
  ' ': 0.5,
  '.': 0.5,
  ',': 0.5,
  ':': 0.5,
  ';': 0.5
  // Default for unmapped characters: 1.0
};

function isUppercase (str: string) {
  return /^\p{Lu}+$/u.test(str);
}

export function measureText (text: string, font: string): number {
  if (!text) {
    return 0;
  }

  const f = fontStringParser(font);
  const isMonospace = /\bmonospace\b/.test(f.family ?? font);
  const isNarrow = /\b(narrow|condensed|compressed)\b/i.test(f.family ?? font);

  // approximate the font size
  let size = f.size ?? 12;
  if (isMonospace) {
    size *= 0.6;
  }
  else {
    size *= 0.45;
    if (f.weight && f.weight > 400) {
      size *= 1.18;
    }
  }

  let totalWidth = 0;
  for (const char of text) {
    const multiplier = CHAR_WIDTH_MULTIPLIERS[char] || (isUppercase(char) ? 1.2 : 1);
    totalWidth += multiplier;
  }

  // Generally, we overestimate condensed fonts like "Aptos Narrow" by ~25-30%. Scaling down by 0.88 for
  // known narrow/condensed fonts brings the estimate back in line with actual rendered widths.
  const condensedFactor = isNarrow ? 0.88 : 1;

  return totalWidth * size * condensedFactor;
}

const ctx: MinimalCanvasContext = {
  font: '',
  measureText: (text: string) => {
    const width = measureText(text, ctx.font);
    return { width };
  }
};

export function getDummyCanvas (): MinimalCanvas {
  return { getContext: () => ctx };
}

import { fontStringParser } from '../fontStringParser.ts';
import { fontToString } from '../fontToString.ts';
import type { Token } from '../parser/tokens.ts';
import type { MinimalCanvas, FontProps, MeasureOptions } from '../types.ts';
import { getBrowserCanvas } from './getBrowserCanvas.ts';
import { getDummyCanvas } from './getDummyCanvas.ts';

const DEFAULT_FONT: FontProps = fontStringParser('12px/14px sans-serif');
const DEFAULT_OPTIONS: MeasureOptions = { trim: true, collapse: true };

const whitespaceCache = new Map<string, number>();

let measureCanvas: MinimalCanvas = getBrowserCanvas() || getDummyCanvas();

// This misses MONGOLIAN-VOWEL-SEPARATOR and ZERO-WIDTH-SPACE but they
// are both zero width, very uncommon, and can be measured normally
function isPureWhitespace (s: string) {
  return !/\S/.test(s);
}

/**
 * Set the canvas to use when measuring text. This will be needed when using {@link measureText}
 * in a non-browser environment.
 * @param canvas The canvas interface to use.
 */
export function setMeasureCanvas (canvas: MinimalCanvas | null) {
  if (canvas == null) {
    measureCanvas = getBrowserCanvas() || getDummyCanvas();
  }
  else if (canvas && typeof canvas.getContext === 'function') {
    measureCanvas = canvas;
  }
  else {
    throw new Error('setMeasureCanvas argument must be a minimal canvas or a null');
  }
}

function measureTextCanvas (text: string, font: FontProps, tracking: number = 0): number {
  const context = measureCanvas.getContext('2d');
  if (!context || typeof context.measureText !== 'function') {
    throw new Error('Canvas did not return a valid context');
  }
  context.font = fontToString(font);
  const width = context.measureText(text).width;
  const trackingExtra = (font.size ?? 12) * tracking;

  return width + trackingExtra;
}

/**
 * Measure a string of text as printed with a specified font and return its width.
 *
 * Be careful that in non-browser environments you may want to supply an alternative
 * canvas using {@link setMeasureCanvas} or this method will default to a crude
 * "best guess" method.
 *
 * @param token A string or token of text to measure.
 * @param font A CSS font shorthand string or a collection of font properties.
 * @param options Text handling options.
 */
export function measureText (
  token: string | Token,
  font: string | FontProps,
  options?: MeasureOptions
): number {
  if (typeof font === 'string') {
    font = fontStringParser(font);
  }
  else {
    font = { ...DEFAULT_FONT, ...font };
  }

  const tracking = typeof token === 'string' ? 0 : token.font.tracking || 0;

  const trim = options?.trim ?? DEFAULT_OPTIONS.trim;
  const collapse = options?.collapse ?? DEFAULT_OPTIONS.collapse;

  let s = String(token);
  // empty string
  if (!s) {
    return 0;
  }

  // pure-whitespace handling
  if (isPureWhitespace(s)) {
    const cacheId = fontToString(font, true) + '/' + tracking + '/' + s;
    if (whitespaceCache.has(cacheId)) {
      return whitespaceCache.get(cacheId)!;
    }
    const w = measureTextCanvas(`_${s}_`, font, tracking) - measureTextCanvas('__', font, tracking);
    whitespaceCache.set(cacheId, w);
    return w;
  }

  // When there are line breaks in the string but we're either not trimming
  // whitespace or not collapsing whitespace, do what the input element does
  // and convert all "\n" to " ".
  if (!trim || !collapse) {
    s = s.replace(/\n/g, ' ');
  }
  else if (trim) {
    s = s.replace(/\n/g, ' ').trim();
  }
  else if (collapse) {
    s = s.replace(/\s+/g, ' ');
  }

  return measureTextCanvas(s, font, tracking);
}

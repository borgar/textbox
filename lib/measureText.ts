/* globals document OffscreenCanvas HTMLCanvasElement */
import { WHITESPACE } from './constants.ts';
import { fontStringParser } from './fontStringParser.ts';
import { fontToString } from './fontToString.ts';
import type { Token } from './parser/tokens.ts';
import type { CanvasPartial, FontProps, MeasureOptions } from './types.ts';

const defaultFont = fontStringParser('12px/14px sans-serif');

const defaultOptions = {
  trim: true,
  collapse: true
};

const wCache = {};

type MeasureFn = (text: string, font: string | FontProps) => number;

// This is just guesswork but works surprisingly well.
// Intended to be used to renderer for tests, or as a last
// resort in a server env.
export function getDumbHandler (): MeasureFn {
  return (text: string, font: string | FontProps) => {
    const f = typeof font === 'string' ? fontStringParser(font) : font;
    let size = f.size ?? 12;
    if (f.family && /\bmonospace\b/.test(f.family)) {
      size *= 0.6;
    }
    else {
      size *= 0.45;
      if (f.weight && f.weight > 400) {
        size *= 1.18;
      }
    }
    return text.length * size;
  };
}

function getMeasureFromCanvas (canvas?: CanvasPartial | null): MeasureFn | void {
  if (canvas && canvas.getContext) {
    const context = canvas.getContext('2d');
    if (context && typeof context.measureText === 'function') {
      return (text, font) => {
        context.font = String(font);
        return context.measureText(text).width;
      };
    }
  }
}

export function getBrowserCanvas () {
  const doc = typeof document !== 'undefined' ? document : null;
  return (
    (typeof OffscreenCanvas !== 'undefined' && new OffscreenCanvas(100, 100)) ||
    (doc && doc.createElement && doc.createElement('canvas')) ||
    null
  );
}

let measure: MeasureFn = getMeasureFromCanvas(getBrowserCanvas()) || getDumbHandler();
export function setMeasureCanvas (canvas: CanvasPartial | null) {
  if (canvas == null) {
    measure = getMeasureFromCanvas(getBrowserCanvas()) || getDumbHandler();
  }
  else if (canvas) {
    measure = getMeasureFromCanvas(canvas) || getDumbHandler();
  }
  else {
    throw new Error('setMeasureCanvas argument is not a canvas or null');
  }
}

/**
 * Measure a string of text as printed with a specified font and return
 * its width.
 */
export function measureText (
  token: string | Token,
  font: string | FontProps,
  options: MeasureOptions = defaultOptions
): number {
  if (typeof font === 'string') {
    font = fontStringParser(font);
  }
  else {
    font = { ...defaultFont, ...font };
  }

  const opts = Object.assign({}, defaultOptions, options);
  let s = String(token);
  // empty
  if (!s) {
    return 0;
  }
  // whitespace
  if (s in WHITESPACE) {
    const cacheId = fontToString(font, true) + '/' + s;
    if (!(cacheId in wCache)) {
      wCache[cacheId] = measure(`_${s}_`, fontToString(font)) - measure('__', fontToString(font));
    }
    return wCache[cacheId];
  }
  // When there are line breaks in the string but we're either not trimming
  // whitespace or not collapsing whitespace, do what the input element does
  // and convert all "\n" to " ".
  if (!opts.trim || !opts.collapse) {
    s = s.replace(/\n/g, ' ');
  }
  else if (opts.trim) {
    s = s.replace(/\n/g, ' ').trim();
  }
  else if (opts.collapse) {
    s = s.replace(/\s+/g, ' ');
  }
  const tracking = typeof token === 'string' ? 0 : token.font.tracking || 0;
  return measure(s, fontToString(font)) + (font.size ?? 12) * tracking;
}

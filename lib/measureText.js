/* globals document OffscreenCanvas HTMLCanvasElement */
import { whitespace } from './whitespace.js';
import { Font } from './Font.js';

const defaultFont = new Font();
const defaultOptions = {
  trim: true,
  collapse: true
};
const wCache = {};

/**
 * @typedef {(text: string, font: string | Font) => number} MeasureFn
 *
 * @typedef CanvasContext
 * @prop {string} font
 * @prop {(text: string) => { width: number }} measureText
 *
 * @typedef CanvasPartial
 * @prop {(contextId: '2d') => CanvasContext | null} getContext
 */

// This is just guesswork but works surprisingly well.
// Intended to be used to renderer for tests, or as a last
// resort in a server env.
export function getDumbHandler () {
  return (text, font) => {
    const f = new Font(font);
    let size = f.size;
    if (/\bmonospace\b/.test(f.family)) {
      size *= 0.6;
    }
    else {
      size *= 0.45;
      if (f.weight > 400) {
        size *= 1.18;
      }
    }
    return text.length * size;
  };
}

function getMeasureFromCanvas (canvas) {
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
  const canvas =
    (typeof OffscreenCanvas !== 'undefined' && new OffscreenCanvas(100, 100)) ||
    (doc && doc.createElement && doc.createElement('canvas'));
  if (canvas) {
    const context = canvas.getContext('2d');
    return getMeasureFromCanvas(canvas);
  }
}

/** @type {MeasureFn} */
let measure = getMeasureFromCanvas(getBrowserCanvas()) || getDumbHandler();

/**
 * @param {CanvasPartial | null} canvas
 */
export function setMeasureCanvas (canvas) {
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
 *
 * @param {string | import('./parser/tokens.js').Token} token
 * @param {(Font | string)} font
 * @param {import('./types.js').MeasureOptions} [options]
 * @return {number}
 */
export function measureText (token, font, options = defaultOptions) {
  if (typeof font === 'string') {
    font = new Font(font);
  }
  else if (!(font instanceof Font)) {
    font = new Font().assign(font);
  }
  else {
    font = defaultFont.assign(font);
  }
  const opts = Object.assign({}, defaultOptions, options);
  let s = String(token);
  // empty
  if (!s) {
    return 0;
  }
  // whitespace
  if (s in whitespace) {
    const cacheId = font.valueOf() + '/' + s;
    if (!(cacheId in wCache)) {
      wCache[cacheId] = measure(`_${s}_`, font) - measure('__', font);
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
  const tracking = typeof token === 'string' ? 0 : token.tracking || 0;
  return measure(s, font) + font.size * tracking;
}


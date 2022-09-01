/* globals document */
import whitespace from '../whitespace.js';
import parseFont from '../font/index.js';

// Canvas is the prefered way of doing this because
// it is a clean env, and does not touch the DOM tree
export const getCanvasHandler = doc => {
  const canvas =
    (typeof OffscreenCanvas !== 'undefined' && new OffscreenCanvas(100, 100)) ||
    (doc && doc.createElement('canvas'));
  if (canvas && canvas.getContext) {
    const context = canvas.getContext('2d');
    if (context && typeof context.measureText === 'function') {
      return (text, font) => {
        context.font = String(font);
        return context.measureText(text).width;
      };
    }
  }
};

// This is just guesswork but works surprisingly well.
// Intended to be used to renderer for tests, or as a last
// resort in a server env.
export const getDumbHandler = warn => {
  if (warn) {
    // eslint-disable-next-line
    console.warn('No reliable way to measure text, Textbox will guesstimate.');
  }
  const fCache = {};
  return (text, font) => {
    if (!fCache[font]) {
      const f = parseFont(font);
      fCache[font] = f;
      if (/\bmonospace\b/.test(f.family)) {
        f.size *= 0.60;
      }
      else {
        f.size *= 0.45;
        if (f.weight) {
          f.size *= 1.18;
        }
      }
    }
    return text.length * fCache[font].size;
  };
};

const _doc = typeof document !== 'undefined' ? document : null;
const measure = getCanvasHandler(_doc) || getDumbHandler();

const wCache = {};
const defaultOptions = {
  trim: true,
  collapse: true
};
export default function measureText (token, font, options) {
  const opts = Object.assign({}, defaultOptions, options);
  let s = String(token);
  // empty
  if (!s) {
    return 0;
  }
  // whitespace
  if (s in whitespace) {
    const cacheId = font.id + '/' + s;
    if (!(cacheId in wCache)) {
      wCache[cacheId] = measure(`_${s}_`, font) - measure('__', font);
    }
    return wCache[cacheId];
  }
  // When there are line breaks in the string but we're either not trimming whitespace or not
  // collapsing whitespace, do what the input element does and convert all "\n" to " ".
  if (!opts.trim || !opts.collapse) {
    s = s.replace(/\n/g, ' ');
  }
  // text
  else if (opts.trim) {
    s = s.trim();
  }
  else if (opts.collapse) {
    s = s.replace(/\s+/g, ' ');
  }
  return measure(s, font) + font.size * (token.tracking || 0);
}


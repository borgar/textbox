/* globals document */
import whitespace from '../whitespace.js';
import parseFont from '../font/index.js';

const _doc = typeof document !== 'undefined' ? document : null;

// Canvas is the prefered way of doing this because
// it is a clean env, and does not touch the DOM tree
export const getCanvasHandler = doc => {
  const canvas = doc && doc.createElement('canvas');
  if (canvas && canvas.getContext) {
    const context = canvas.getContext('2d');
    if (context && typeof context.measureText === 'function') {
      return (text, font) => {
        context.font = String(font);
        return context.measureText(text.trim().replace(/\s+/g, ' ')).width;
      };
    }
  }
};

// Secondary method is to use SVG, this is worse because it requires
// an extra element to live inside the DOM. This can be potentially
// affected by outside styles.
export const getSvgHandler = doc => {
  const makeSVGElm = (name, props) => {
    const elm = doc.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(props || {}).forEach(key => { elm.setAttribute(key, props[key]); });
    return elm;
  };
  if (doc && doc.createElementNS && doc.documentElement && makeSVGElm('svg').createSVGRect) {
    // In order for this to function correctly, we need an SVG, and that SVG needs
    // to reside in the DOM when the text is measured.
    const svg = makeSVGElm('svg', {
      'id': 'rtext_helper',
      'style': 'position:absolute;left:-9999em;top:-99em;padding:0;margin:0;line-height:1;white-space:nowrap;',
      'font-size': '16px',
      'font-family': 'sans-serif'
    });
    const context = makeSVGElm('text', { x: 0, y: 0 });
    context.appendChild(doc.createTextNode(''));
    svg.appendChild(context);
    doc.documentElement.appendChild(svg);
    //
    return (text, font) => {
      context.setAttribute('style', 'font:' + font);
      context.firstChild.nodeValue = text;
      return context.getComputedTextLength();
    };
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

const measure = getCanvasHandler(_doc) || getSvgHandler(_doc) || getDumbHandler(_doc);

const wCache = {};
export default function measureText (token, font, with_shy) {
  const s = String(token);
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
  // text
  return measure((with_shy ? s + '-' : s), font) + font.size * (token.tracking || 0);
}


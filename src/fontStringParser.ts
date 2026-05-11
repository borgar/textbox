import type { FontProps } from './types.js';

const re_fontstring = /^((?:[a-z\d-]+\s+)*)([\d.]+(%|em|px)|(?:x+-)?large|(?:x+-)?small|medium)(?:\s*\/\s*(normal|[\d.]+(%|px|em)?))?(\s.+)?$/;
const re_small_caps = /\bsmall-caps\b/;
const re_italics = /\b(?:italic|oblique)\b/;
const re_bold = /\bbold(?:er)?\b/;

const emSize = 16;
const ptSize = 13.3333333;
const percentSize = 0.01 * emSize;

const absSide = {
  'xx-small': 9,
  'x-small': 10,
  'smaller': 13.3333,
  'small': 13,
  'medium': 16,
  'large': 18,
  'larger': 19.2,
  'x-large': 24,
  'xx-large': 32
};

const fontCache = new Map<string, FontProps>();

export function fontStringParser (str: string): FontProps {
  if (fontCache.has(str)) {
    return fontCache.get(str)!;
  }

  const m = re_fontstring.exec(str);
  if (!m) {
    // FIXME: throw?
    return {};
  }

  const family = (m[6] || '').trim();

  // font size
  let size = absSide[m[2]] || parseFloat(m[2]);
  if (m[3] === '%') {
    size *= percentSize;
  }
  else if (m[3] === 'em') {
    size *= emSize;
  }
  else if (m[3] === 'pt') {
    size *= ptSize;
  }

  // line height
  let height: number | undefined;
  if (m[4] === 'normal' || m[4] === 'inherit' || !m[4]) {
    // no height defined
    height = Math.round(size * (7 / 6));
  }
  else if (!m[5] || m[5] === 'em') {
    // height is unitless or in ems
    height = parseFloat(m[4] || '') * size;
  }
  else if (m[5] === 'pt') {
    height = parseFloat(m[4] || '') * ptSize;
  }
  else if (m[5] === '%') {
    height = size * 0.01;
  }
  else {
    height = parseFloat(m[4] || '');
  }

  const variant = re_small_caps.test(m[1]) ? 'small-caps' : 'normal';
  const style = re_italics.test(m[1]) ? 'italic' : 'normal';

  // bold
  let weight: number;
  if (re_bold.test(m[1])) {
    weight = 700;
  }
  // (numberic tokens 550+ = bold)
  else {
    const mx = /\b(\d+)\b/.exec(m[1]);
    const w = mx ? parseInt(mx[1], 10) : 400;
    weight = (w >= 100 && w !== 400) ? w : 400;
  }

  const out: FontProps = {
    family,
    size,
    height: height ?? size * (7 / 6),
    weight,
    variant,
    style
  };

  fontCache.set(str, out);
  return out;
}

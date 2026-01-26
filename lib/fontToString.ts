import type { FontProps } from './types.ts';

export function fontToString (font: FontProps, _full?: boolean) {
  let s = '';
  if (font.style && font.style !== 'normal') {
    s += font.style;
  }
  if (font.variant && font.variant !== 'normal') {
    s += (s ? ' ' : '') + font.variant;
  }
  if (font.weight && font.weight !== 400) {
    s += (s ? ' ' : '');
    if (font.weight === 700) {
      s += 'bold';
    }
    else {
      s += font.weight;
    }
  }
  if (font.size) {
    let fs = font.size;
    if (!_full && font.sizeAdjust && font.sizeAdjust !== 1) {
      fs *= font.sizeAdjust;
    }
    s += (s ? ' ' : '') + fs + 'px';
    if (font.height !== font.size) {
      s += '/' + font.height + 'px';
    }
  }
  if (font.family) {
    s += (s ? ' ' : '') + font.family;
  }
  if (_full) {
    s += '::' + font.baseline;
  }
  if (_full) {
    s += '::' + font.color;
  }
  if (_full) {
    s += '::' + font.tracking;
  }
  if (_full) {
    s += '::' + (font.sizeAdjust ?? '');
  }
  return s;
}

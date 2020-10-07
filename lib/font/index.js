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

function font_repr (_full) {
  let s = '';
  const f = this;
  if (f.style && f.style !== 'normal') {
    s += f.style;
  }
  if (f.variant && f.variant !== 'normal') {
    s += (s ? ' ' : '') + f.variant;
  }
  if (f.weight && f.weight !== 'normal') {
    s += (s ? ' ' : '') + f.weight;
  }
  if (f.size) {
    s += (s ? ' ' : '') + f.size + 'px';
    if (f.height !== f.size) {
      s += '/' + f.height + 'px';
    }
  }
  if (f.family) {
    s += (s ? ' ' : '') + f.family;
  }
  if (_full) {
    s += '::' + f.baseline;
  }
  if (_full) {
    s += '::' + f.color;
  }
  return s;
}

const font_proto = {
  id: '',
  family: 'sans-serif',
  height: 14,
  size: 12,
  variant: '',
  style: '',
  weight: '',
  baseline: '',
  color: null,
  toString: font_repr,
  valueOf: font_repr
};


function parseFontString (str, p = {}) {
  const m = re_fontstring.exec(str);

  p.family = (m[6] || '').trim();

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
  p.size = size;

  // line height
  const h = parseFloat(m[4]);
  if (h === 'normal' || h === 'inherit' || !h) {
    // no height defined
    p.height = Math.round(size * (7 / 6));
  }
  else if (!m[5] || m[5] === 'em') {
    // height is unitless or in ems
    p.height = h * size;
  }
  else if (m[5] === 'pt') {
    p.height = h * ptSize;
  }
  else if (m[5] === '%') {
    p.height = size * 0.01;
  }
  else {
    p.height = h;
  }

  // variants
  if (re_small_caps.test(m[1])) { p.variant = 'small-caps'; }
  // italics
  if (re_italics.test(m[1])) { p.style = 'italic'; }
  // bold (numberic tokens 550+ = bold)
  if (re_bold.test(m[1]) || parseInt(/\b(\d+)\b/.exec(m[1]), 10) >= 550) {
    p.weight = 'bold';
  }

  return p;
}

export default function font (node = '12px/14px sans-serif', override = {}) {
  let family;
  let height = 14;
  let size = 12;
  let weight = null;
  let style = null;
  let variant = '';
  let baseline;
  let color;

  if (node && node.nodeType) {
    // read basic styles from DOM
    const view = node && (
      node.ownerDocument && node.ownerDocument.defaultView ||
      node.document && node ||
      node.defaultView
    );
    const viewStyle = view.getComputedStyle(node, null);
    family = viewStyle.getPropertyValue('font-family') || '';
    size = parseFloat(viewStyle.getPropertyValue('font-size'));
    height = viewStyle.getPropertyValue('line-height');
    weight = viewStyle.getPropertyValue('font-weight');
    style = viewStyle.getPropertyValue('font-style');
    variant = viewStyle.getPropertyValue('font-variant') || '';
  }
  else if (typeof node === 'string') {
    const s = parseFontString(node);
    family = s.family;
    size = s.size;
    height = s.height;
    variant = s.variant;
    style = s.style;
    weight = s.weight;
  }
  else if (typeof node === 'object') { // clone
    // rescale subscript
    family = node.family;
    size = node.size;
    height = node.height;
    variant = node.variant;
    weight = node.weight;
    style = node.style;
    baseline = node.baseline;
    color = node.color;
  }

  if (override.size && override.size < 3) {
    size *= override.size;
  }

  height = (height === 'normal' || !height)
    ? size * (7 / 6)
    : parseFloat(height);
  if (override.height && override.height < 3) {
    height *= override.height;
  }

  const p = Object.create(font_proto);
  p.family = override.family || family || 'sans-serif';
  p.height = (height == null) ? 14 : height;
  p.size = (size == null) ? 12 : size;
  p.variant = override.variant || variant || '';
  p.style = override.style || style || '';
  p.weight = override.weight || weight || '';
  p.baseline = baseline || 0;
  if (override.baseline != null) { p.baseline = override.baseline; }

  p.color = override.color || color || '';

  p.id = font_repr.call(p, true);
  return p;
}

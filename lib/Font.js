import { fontStringParser } from './fontStringParser.js';

const defaultFontString = '12px/14px sans-serif';

export class Font {
  /**
   * @param {string | Font} [input]
   */
  constructor (input = defaultFontString) {
    let family;
    let height = 14;
    let size = 12;
    let weight = 400;
    /** @type {import('./types.js').FontStyle} */
    let style = 'normal';
    /** @type {import('./types.js').FontVariant} */
    let variant = 'normal';
    /** @type {number} */
    let baseline = 0;
    let color;

    if (typeof input === 'string') {
      const s = fontStringParser(input);
      if (s) {
        family = s.family;
        size = s.size;
        height = s.height || 14;
        variant = s.variant;
        style = s.style;
        weight = s.weight;
      }
    }
    else if (input instanceof Font) { // clone
      // rescale subscript
      family = input.family;
      size = input.size;
      height = input.height;
      variant = input.variant;
      weight = input.weight;
      style = input.style;
      baseline = input.baseline;
      color = input.color;
    }

    /** @type {string} */
    this.family = family || 'sans-serif';
    /** @type {number} */
    this.size = (size || size === 0) ? size : 12;
    /** @type {number} */
    this.height = (height || height === 0)
      ? height
      : this.size * (7 / 6);
    /** @type {import('./types.js').FontVariant} */
    this.variant = variant || '';
    /** @type {import('./types.js').FontStyle} */
    this.style = style || '';
    /** @type {number} */
    this.weight = weight || 400;
    /** @type {number} */
    this.baseline = baseline || 0;
    /** @type {string} */
    this.color = color || '';
  }

  /**
   * Get a new instance with some or all of the properties changed.
   *
   * @param {object} [props]
   * @param {boolean} [props.bold]
   * @param {boolean} [props.italic]
   * @param {number} [props.weight]
   * @param {number} [props.size]
   * @param {number} [props.baseline]
   * @param {string} [props.family]
   * @param {string} [props.color]
   * @param {import('./types.js').FontStyle} [props.style]
   * @return {Font}
   */
  assign (props = {}) {
    const f = new Font(this);
    if (props.bold) { f.weight = 700; }
    if (props.weight) { f.weight = props.weight; }
    if (props.italic) { f.style = 'italic'; }
    if (props.family) { f.family = props.family; }
    if (props.style) { f.style = props.style; }
    if (props.color) { f.color = props.color; }
    if (typeof props.baseline === 'number') { f.baseline = props.baseline; }
    if (typeof props.size === 'number') { f.size = props.size; }
    return f;
  }

  toString (_full) {
    let s = '';
    if (this.style && this.style !== 'normal') {
      s += this.style;
    }
    if (this.variant && this.variant !== 'normal') {
      s += (s ? ' ' : '') + this.variant;
    }
    if (this.weight && this.weight !== 400) {
      s += (s ? ' ' : '') + this.weight;
    }
    if (this.size) {
      s += (s ? ' ' : '') + this.size + 'px';
      if (this.height !== this.size) {
        s += '/' + this.height + 'px';
      }
    }
    if (this.family) {
      s += (s ? ' ' : '') + this.family;
    }
    if (_full) {
      s += '::' + this.baseline;
    }
    if (_full) {
      s += '::' + this.color;
    }
    return s;
  }

  valueOf () {
    return this.toString(true);
  }
}

import type { FontProps } from '../types.ts';

/**
 * Represents a unit of text, typically a single word.
 */
export class Token {
  value: string;
  width: number;
  whitespace: boolean | undefined; // FIXME? Is this ever used?
  font: FontProps;
  line?: number;

  constructor (value = '', font = {}) {
    this.value = value;
    this.font = font;
    this.width = 0;
  }

  /** @internal */
  valueOf () {
    return this.value;
  }

  /** @internal */
  toString () {
    return this.value;
  }

  toJSON () {
    const t = this;
    const r: any = { type: 'TK', val: t.value ?? '' };
    if (t.font.style === 'italic') {
      r.style = t.font.style;
    }
    if (t.font.family && t.font.family !== 'sans-serif') {
      r.font = t.font.family;
    }
    if (t.font.weight && t.font.weight !== 400) {
      r.weight = t.font.weight;
    }
    if (t.font.baseline) {
      r[t.font.baseline < 0 ? 'sub' : 'sup'] = true;
    }
    [ 'href', 'color', 'class', 'target', 'rel' ].forEach(key => {
      if (t.font[key]) {
        r[key] = t.font[key];
      }
    });
    return r;
  }
}

export class Break extends Token {
  toJSON () {
    const r = super.toJSON();
    r.type = 'BR';
    delete r.val;
    return r;
  }
}
export class LineBreak extends Token {
  toJSON () {
    const r = super.toJSON();
    r.type = 'NL';
    delete r.val;
    return r;
  }
}
export class SoftHyphen extends Token {
  toJSON () {
    const r = super.toJSON();
    r.type = 'SH';
    delete r.val;
    return r;
  }
}

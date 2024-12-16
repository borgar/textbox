export class Token {
  constructor (value = '') {
    this.value = value;
    /** @type {import('../Font.js').Font | null} */
    this.font = null;
    /** @type {string} */
    this.href = '';
    this.sub = false;
    this.sup = false;
    /** @type {number} */
    this.width;
    /** @type {number} */
    this.line;
    /** @type {number} */
    this.tracking;
    /** @type {boolean} */
    this.whitespace;
  }

  clone () {
    const t = new Token(this.value);
    return Object.assign(t, this);
  }

  valueOf () {
    return this.value;
  }

  toString () {
    return this.value;
  }
}

export class Break extends Token {}
export class LineBreak extends Token {}
export class SoftHyphen extends Token {}

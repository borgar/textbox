export class Token {
  constructor (value = '') {
    this.value = value;
    this.weight = null;
    this.style = null;
    this.font = null;
    this.href = null;
    this.sub = false;
    this.sup = false;
  }

  clone () {
    const t = new Token(this.value);
    t.value = this.value;
    t.weight = this.weight;
    t.style = this.style;
    t.font = this.font;
    t.href = this.href;
    t.sub = this.sub;
    t.sup = this.sup;
    return t;
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

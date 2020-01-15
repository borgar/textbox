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

  valueOf () {
    return this.value;
  }

  toString () {
    return this.value;
  }
};

export class Break extends Token {}
export class LineBreak extends Token {}
export class SoftHyphen extends Token {}

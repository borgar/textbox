import type { FontProps } from '../types.ts';
import { FONT_DEFAULTS } from './constants.ts';
import { Break, LineBreak, type Token } from './tokens.ts';

const re_whitespace = /^[\n\r\x20\u2000-\u200B\u205F\u3000]/;

export class ParserContext {
  tokens: Token[];
  stack: FontProps[];
  props: FontProps;

  constructor () {
    this.tokens = [];
    this.stack = [];
    this.props = { ...FONT_DEFAULTS };
  }

  add_token (d: Token): Token {
    d.font = this.props;
    this.tokens.push(d);
    return d;
  }

  open_context () {
    // create new context
    this.stack.push(this.props);
    this.props = Object.create(this.props);
  }

  close_context () {
    // restore context
    if (!this.stack.length) {
      throw new Error('Unexpected }');
    }
    this.props = this.stack.pop()!;
  }

  trimEnd () {
    let last = this.tokens[this.tokens.length - 1];
    while (last instanceof LineBreak) {
      this.tokens.pop();
      last = this.tokens[this.tokens.length - 1];
    }
  }

  setProps (props: Partial<FontProps>) {
    for (const [ key, value ] of Object.entries(props)) {
      if (value != null) {
        this.props[key] = value;
      }
    }
  }

  maybeLineBreak (numBreaks: number | undefined) {
    const len = this.tokens.length;
    if (len > 0 && numBreaks && numBreaks > 0) {
      // ignore all breaks and whitespace...
      let n = len - 1;
      while (this.tokens[n] &&
        (this.tokens[n] instanceof Break || re_whitespace.test(this.tokens[n].value))) {
        n--;
      }
      // discount tailing linebreaks from how many are needed
      while (numBreaks && this.tokens[n] && this.tokens[n] instanceof LineBreak) {
        n--;
        numBreaks--;
      }
      // add linebreaks as needed
      while (numBreaks-- > 0) {
        this.tokens.push(new LineBreak());
      }
    }
  }
}

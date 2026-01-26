import { Token, LineBreak } from './tokens.ts';
import { textparser } from './textparser.ts';
import { htmlEntitites } from './htmlentities.ts';
import { ParserContext } from './ParserContext.ts';
import type { FontProps } from '../types.ts';
import { BASELINE_SUB, BASELINE_SUPER, SUBSCRIPT_SIZE } from './constants.ts';

const re_html_tag_close = /^<\/([a-zA-Z0-9]+)([^>]*)>/;
const re_html_tag_open = /^<([a-zA-Z0-9]+)((?:\s[^=\s/]+(?:\s*=\s*(?:"[^"]+"|'[^']+'|[^>\\s]+))?)+)?\s*(\/?)>(\n*)/;
const re_html_comment = /^<!--(.+?)-->/;
const re_entity = /&(?:#(\d\d{2,})|#x([\da-fA-F]{2,})|([a-zA-Z][a-zA-Z1-4]{1,8}));/g;

const tag_to_prop: Record<string, (this: ParserContext, p: FontProps) => void> = {
  b: p => (p.weight = 700),
  strong: p => (p.weight = 700),
  i: p => (p.style = 'italic'),
  em: p => (p.style = 'italic'),
  dfn: p => (p.style = 'italic'),
  cite: p => (p.style = 'italic'),
  code: p => (p.family = 'monospace'),
  kbd: p => (p.family = 'monospace'),
  samp: p => (p.family = 'monospace'),
  var: p => (p.family = 'monospace'),
  tt: p => (p.family = 'monospace'),
  sub: p => {
    p.baseline = BASELINE_SUB;
    p.sizeAdjust = SUBSCRIPT_SIZE;
  },
  sup: p => {
    p.baseline = BASELINE_SUPER;
    p.sizeAdjust = SUBSCRIPT_SIZE;
  }
};

const tag_to_breaks = {
  div: 1,
  li: 1,
  blockquote: 2,
  h1: 2,
  h2: 2,
  h3: 2,
  h4: 2,
  h5: 2,
  h6: 2,
  ul: 2,
  ol: 2,
  hr: 2,
  p: 2
};

function decode_entities (str: string): string {
  return str.replace(re_entity, function (a, u, x, n) {
    if (u || x) {
      // unicode or hex escape
      const radix = u ? 10 : 16;
      return String.fromCharCode(parseInt(u || x, radix));
    }
    else if (n in htmlEntitites) {
      // named entity
      return htmlEntitites[n];
    }
    return a;
  });
}

function unquote (s: string): string {
  if (s && s.length > 1) {
    if (s.startsWith('"') && s.endsWith('"')) {
      return s.slice(1, -1);
    }
    if (s.startsWith("'") && s.endsWith("'")) {
      return s.slice(1, -1);
    }
  }
  return s;
}

const reAttr = /^\s*([^=\s&]+)(?:\s*=\s*("[^"]+"|'[^']+'|[^>\s]+))?/;
function parseAttr (s: string): Record<string, string> {
  let m: RegExpExecArray | null;
  const r: Record<string, string> = {};
  if (s) {
    do {
      m = reAttr.exec(s);
      if (m) {
        const val = decode_entities(unquote(m[2] || ''))
          .replace(/[ \r\n\t]+/g, ' ')
          .trim();
        r[m[1]] = val;
        s = s.slice(m[0].length);
        if (s.length && /^\S/.test(s[0])) {
          throw new Error('Attribute error');
        }
      }
    }
    while (m && s.length);
    if (/\S/.test(s)) {
      throw new Error('Attribute error');
    }
  }
  return r;
}

/**
* Parse a very small subset of HTML.
*
* This parser can handle linebreaks, as well as inline text
* instruction tags such as `<b>`, `<tt>`, `<em>`, `<sup>`.
*/
export function htmlparser (text?: string | null): Token[] {
  text = String(text || '').trim();

  let m: RegExpExecArray | null;
  let s: RegExpExecArray | null;
  const self = new ParserContext();

  while (text.length) {
    if ((m = /^[^<]+/.exec(text))) {
      const part = decode_entities(m[0]);
      // delegate text handling to the simple parser
      textparser(part).forEach(d => self.add_token(d));
    }
    else if ((m = re_html_comment.exec(text))) {
      // noop
    }
    else if ((m = re_html_tag_close.exec(text))) {
      // rich text close
      self.close_context();
      self.maybeLineBreak(tag_to_breaks[m[1]]);
    }
    else if ((m = re_html_tag_open.exec(text))) {
      const tagName = m[1];
      // common block level tags: linebreak
      self.maybeLineBreak(tag_to_breaks[tagName]);
      // rich text open
      self.open_context();
      if (tag_to_prop[tagName]) {
        tag_to_prop[tagName].call(self, self.props);
      }
      const attr = parseAttr(m[2]);
      if (tagName === 'a') {
        self.setProps({
          href: attr.href,
          rel: attr.rel,
          target: attr.target
        });
      }
      if (attr.class) {
        self.props.class = self.props.class ? self.props.class + ' ' + attr.class : attr.class;
      }
      if (attr.style) {
        // TODO: allow more css props
        s = /(?:^|\s|;)color\s*:\s*([^;\s"']+)/.exec(attr.style);
        if (s && s[1]) {
          self.props.color = s[1];
        }
      }
      // allow linebreaks
      if (tagName === 'br') {
        self.tokens.push(new LineBreak());
      }
    }
    else {
      m = [ text.slice(0, 1) ] as RegExpExecArray;
      self.add_token(new Token(m[0]));
    }
    text = text.slice(m[0].length);
  }

  // discard any trailing whitespace
  // because it will mess with linecount
  self.trimEnd();

  return self.tokens;
}

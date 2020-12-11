import { Token, Break, LineBreak } from './tokens';
import textparser from './textparser';
import entities from './htmlentities';
const re_whitespace = /^[\n\r\x20\u2000-\u200B\u205F\u3000]/;

const re_html_tag_close = /^<\/([a-zA-Z0-9]+)([^>]*)>/;
const re_html_tag_open = /^<([a-zA-Z0-9]+)((?:\s[^=\s/]+(?:\s*=\s*(?:"[^"]+"|'[^']+'|[^>\\s]+))?)+)?\s*(\/?)>(\n*)/;
const re_html_comment = /^<!--(.+?)-->/;
const re_entity = /&(?:#(\d\d{2,})|#x([\da-fA-F]{2,})|([a-zA-Z][a-zA-Z1-4]{1,8}));/g;

const tag_to_prop = {
  b: p => { p.weight = 'bold'; },
  strong: p => { p.weight = 'bold'; },
  i: p => { p.style = 'italic'; },
  em: p => { p.style = 'italic'; },
  dfn: p => { p.style = 'italic'; },
  cite: p => { p.style = 'italic'; },
  code: p => { p.family = 'monospace'; },
  kbd: p => { p.family = 'monospace'; },
  samp: p => { p.family = 'monospace'; },
  var: p => { p.family = 'monospace'; },
  tt: p => { p.family = 'monospace'; },
  sub: p => { p.sub = true; },
  sup: p => { p.sup = true; }
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

function decode_entities (str) {
  return str.replace(re_entity, function (a, u, x, n) {
    if (u || x) {
      // unicode or hex escape
      const radix = u ? 10 : 16;
      return String.fromCharCode(parseInt(u || x, radix));
    }
    else if (n in entities) {
      // named entity
      return entities[n];
    }
    return a;
  });
}

export default function htmlparser (text) {
  text = String(text || '').trim();

  let prop = {
    weight: null,
    style: null,
    sub: false,
    sup: false,
    href: null,
    color: null
  };

  const tokens = [];
  const stack = [];
  let m;
  let s;
  const add_token = function (d) {
    for (const p in prop) {
      if (prop[p]) {
        d[p] = prop[p];
      }
    }
    tokens.push(d);
  };
  const open_context = () => {
    // create new context
    stack.push(prop);
    prop = Object.create(prop);
  };
  const close_context = m => {
    // restore context
    if (stack.length) {
      prop = stack.pop();
    }
  };
  const maybeLineBreak = (tagName, amClose) => {
    const len = tokens.length;
    let numBreaks = tag_to_breaks[tagName];
    if (len && numBreaks) {
      // ignore all breaks and whitespace...
      let n = len - 1;
      while (tokens[n] &&
        (tokens[n] instanceof Break || re_whitespace.test(tokens[n].value))) {
        n--;
      }
      // discount tailing linebreaks from how many are needed
      while (numBreaks && tokens[n] && tokens[n] instanceof LineBreak) {
        n--;
        numBreaks--;
      }
      // add linebreaks as needed
      while (numBreaks-- > 0) {
        tokens.push(new LineBreak());
      }
    }
  };

  while (text.length) {
    if ((m = /^[^<]+/.exec(text))) {
      const part = decode_entities(m[0]);
      // delegate text handling to the simple parser
      textparser(part, false).forEach(add_token);
    }
    else if ((m = re_html_comment.exec(text))) {
      // noop
    }
    else if ((m = re_html_tag_close.exec(text))) {
      // rich text close
      close_context();
      maybeLineBreak(m[1], true);
    }
    else if ((m = re_html_tag_open.exec(text))) {
      const tagName = m[1];
      // common block level tags: linebreak
      maybeLineBreak(tagName);
      // rich text open
      open_context();
      if (tag_to_prop[tagName]) {
        tag_to_prop[tagName](prop, '');
      }
      if (tagName === 'a') {
        const h = /\shref=("|'|)(.*?)\1(?=\s|$)/.exec(m[2]);
        prop.href = h ? decode_entities(h[2]) : null;
      }
      if (/\sstyle\s*=/.test(m[2])) {
        s = /[\s;"']color\s*:\s*([^;\s"']+)/.exec(m[2]);
        if (s && s[1]) {
          prop.color = s[1];
        }
      }
      // allow linebreaks
      if (tagName === 'br') {
        tokens.push(new LineBreak());
      }
    }
    else {
      m = [ text.slice(0, 1) ];
      add_token(new Token(m[0]));
    }
    text = text.slice(m[0].length);
  }

  // discard any trailing whitespace
  // because it will mess with linecount
  let last = tokens[tokens.length - 1];
  while (last instanceof LineBreak) {
    tokens.pop();
    last = tokens[tokens.length - 1];
  }

  // console.log(tokens);
  return tokens;
}

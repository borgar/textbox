import { Token, LineBreak } from './tokens';
import textparser from './textparser';
import entities from './latexentities';

const re_command = /^(\^|_|\\[^#$%&~_^\\{}()\s]+)(\{)?/;
const re_comment = /^%[^\n]+(?:\n|$)/;
const re_plaintext = /^[^#$%&~_^\\{}]+/;
const re_esc = /^\\([&{}$%#_])/;

// assume partial \usepackage{hyperref}
//   \url{http://www.wikibooks.org}
//   \href{http://www.wikibooks.org}{Wikibooks home}

// assume partial \usepackage{color}
//   \color{red}
//   {\color{red}some colored text}
//   \textcolor{red}{easily}
//   {\textcolor{red}some colored text}

const re_preprocess = /(?:\\[\\@,!:;-]|-{2,3}|[!?]`|``?|,,|''?|~|<<|>>)/g;
const preprocess = {
  '---': '\u2014', // \textemdash
  '--': '\u2013', // \textendash
  '!`': '¡', // \textexclamdown
  '?`': '¿', // \textquestiondown

  '``': '“', // \textquotedblleft
  ',,': '„', //
  "''": '”', // \textquotedblright
  '`': '‘', // \textquoteleft
  "'": '’', // \textquoteright
  // , '"': '”' //
  '<<': '«', // guillemotleft
  '>>': '»', // guillemotright

  '~': '\u00A0', // non-breaking space
  '\\-': '\u00AD', // soft hyphen
  '\\,': '\u2009', // thin space
  '\\;': '\u2003', // thick space
  '\\:': '\u2005', // medium space
  '\\!': '\u2006', // negative thin space
  '\\@': '\uFEFF', // (0 width NBSp) end sentence
  '\\\\': '\\newline{}' // newline command shorthand
};
// FIXME: \emph https://www.sharelatex.com/learn/Bold,_italics_and_underlining#Emphasising_text
const commands = {
  'bf': p => { p.weight = 'bold'; },
  'it': p => { p.style = 'italic'; },
  'sl': p => { p.style = 'italic'; },
  'color': (p, c) => { p.color = c; },
  'href': (p, c) => { p.href = c; },
  '^': p => { p.sup = true; },
  '_': p => { p.sub = true; },
  'par': function () {
    this.tokens.push(new LineBreak(), new LineBreak());
  },
  'newline': function () {
    this.tokens.push(new LineBreak());
  },
  'url': function (p, url) {
    p = this.open_context();
    p.href = url;
    this.add_token(new Token(url));
    this.close_context();
  }
};
commands.textsuperscript = commands['^'];
commands.textsubscript = commands._;
commands.textsl = commands.sl;
commands.mathbf = commands.bf;
commands.mathit = commands.it;
commands.textbf = commands.bf;
commands.textit = commands.it;
commands.textcolor = commands.color;

export default function latexparser (text) {
  text = String(text || '').trim();

  // quickly preprocess some "non-consistent" character escapes
  const verb = [ 0 ];
  text = text
    // verbatim texts pulled out
    .replace(/\\verb,(.*?),/, (m, t) => {
      verb.push(t);
      return '\\verb,' + (verb.length - 1) + ',';
    })
    .replace(/\\\\\n/g, () => '\\\\')
    .replace(re_preprocess, (a, idx, str) => {
      return (str.charAt(idx - 1) === '\\') ? a : preprocess[a];
    })
    .replace(/\n\s+/g, a => {
      if (/\n/.test(a.slice(1))) { return '\\par '; }
      return a;
    })
    .replace(/\\symbol\{(\d+)\}/, (a, b, idx, str) => {
      return (str.charAt(idx - 1) === '\\') ? a : String.fromCharCode(1 * b);
    })
    // Note: x^10 is not the same as x^{10}.
    // The former produces $x^{1}0$ instead of $x^{10}$.
    .replace(/(^|[^\\])(\^|_)(\d|[^{]\S*)/g, (a, b, c, d) => {
      return b + c + '{' + d + '}';
    })
    // verbatim texts inserted back
    .replace(/\\verb,(.*?),/, (m, n) => {
      return `\\verb,${verb[+n]},`;
    });

  let prop = {
    weight: null,
    italic: null,
    variant: null,
    sub: false,
    sup: false,
    href: null
  };

  const tokens = [];
  const stack = [];
  let m;
  const add_token = function (d) {
    for (const p in prop) {
      if (prop[p]) {
        d[p] = prop[p];
      }
    }
    tokens.push(d);
    return d;
  };
  const open_context = function () {
    // create new context
    stack.push(prop);
    prop = Object.create(prop);
  };
  const close_context = function () {
    // restore context
    if (!stack.length) {
      throw new Error('Unexpected }');
    }
    prop = stack.pop();
  };
  const self = {
    tokens: tokens,
    open_context: open_context,
    close_context: close_context,
    add_token: add_token
  };

  while (text.length) {
    if ((m = re_plaintext.exec(text))) {
      // delegate text handling to the simple parser
      textparser(m[0], false).forEach(add_token);
    }
    else if ((m = re_esc.exec(text))) {
      add_token(new Token(m[1]));
    }
    else if ((m = re_comment.exec(text))) {
      // noop
    }
    else if ((m = /^\{/.exec(text))) {
      // create new context
      open_context();
    }
    else if ((m = /^\}/.exec(text))) {
      close_context();
    }
    else if ((m = /^\$/.exec(text))) {
      // toggle math mode -- not supported
    }
    else if ((m = /^\\verb,([^,]+),/.exec(text))) {
      add_token(new Token(m[1]));
    }
    else if ((m = re_command.exec(text))) {
      const cmd = m[1].slice(1) || m[1];
      let ctx = !!m[2];
      if (/^(La)?TeX$/i.test(cmd)) {
        open_context();
        prop.family = 'serif';
        let lt;
        if (cmd === 'LaTeX') {
          lt = add_token(new Token('L'));
          lt.tracking = -0.25;
          lt = add_token(new Token('A'));
          lt.size = 0.7;
          lt.baseline = 0.3;
          lt.tracking = -0.1;
        }
        lt = add_token(new Token('T'));
        lt.tracking = -0.17;
        lt = add_token(new Token('E'));
        lt.baseline = -0.22;
        lt.tracking = -0.13;
        lt = add_token(new Token('X'));
        close_context();
      }
      else if (cmd in entities) {
        add_token(new Token(entities[cmd]));
        if (ctx) {
          open_context();
        }
      }
      else if (cmd in commands) {
        const args = [];
        let narg = commands[cmd].length - 1;
        let arg;
        if (narg) {
          // ignore matched context
          ctx = false;
          text = text.slice(m[0].length - 1);
          while (narg--) { // expect a parameter
            if ((arg = /^\{([^}]+)\}/.exec(text))) {
              args.push(arg[1]);
              text = text.slice(arg[0].length);
            }
            else {
              throw new Error(cmd + ' is missing an argument');
            }
          }
          m[0] = /^\{/.exec(text) ? '{' : '';
          ctx = !!m[0];
        }
        if (ctx) { open_context(); }
        commands[cmd].apply(self, [ prop ].concat(args));
      }
      else {
        // eslint-disable-next-line
        console.warn('unknown latex command', cmd);
        add_token(new Token(m[1]));
        if (ctx) { open_context(); }
      }
    }
    else {
      m = [ text.slice(0, 1) ];
      add_token(new Token(m[0]));
    }
    text = text.slice(m[0].length);
  }

  return tokens;
}

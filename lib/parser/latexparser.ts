import { Token, LineBreak } from './tokens.ts';
import { textparser } from './textparser.ts';
import { LATEX_ENTITIES } from './latexentities.ts';
import type { FontProps } from '../types.ts';
import { ParserContext } from './ParserContext.ts';
import { BASELINE_SUB, BASELINE_SUPER, SUBSCRIPT_SIZE } from './constants.ts';

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

type CommandHandler = (this: ParserContext, p: FontProps, ...args: string[]) => any;

const commands: Record<string, CommandHandler> = {
  'bf': p => (p.weight = 700),
  'emph': p => {
    if (p.style === 'italic') {
      p.style = 'normal';
    }
    else {
      p.style = 'italic';
    }
  },
  'it': p => (p.style = 'italic'),
  'sl': p => (p.style = 'italic'),
  'color': (p, c) => (p.color = c),
  'href': (p, c) => (p.href = c),
  '^': p => {
    p.baseline = BASELINE_SUPER;
    p.sizeAdjust = SUBSCRIPT_SIZE;
  },
  '_': p => {
    p.baseline = BASELINE_SUB;
    p.sizeAdjust = SUBSCRIPT_SIZE;
  },
  'par': function () {
    this.tokens.push(new LineBreak(), new LineBreak());
  },
  'newline': function () {
    this.tokens.push(new LineBreak());
  },
  'url': function (p, url) {
    this.open_context();
    this.props.href = url;
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

/**
 * Parse a very small subset of LaTeX
 */
export function latexparser (text: string): Token[] {
  text = String(text || '').trim();

  // quickly preprocess some "non-consistent" character escapes
  const verb = [ '' ];
  text = text
    // verbatim texts pulled out
    .replace(/\\verb,(.*?),/, (_, t: string) => {
      verb.push(t);
      return '\\verb,' + (verb.length - 1) + ',';
    })
    .replace(/\\\\\n/g, () => '\\\\')
    .replace(re_preprocess, (a, idx, str) => ((str.charAt(idx - 1) === '\\') ? a : preprocess[a]))
    .replace(/\n\s+/g, a => (a.slice(1).includes('\n') ? '\\par ' : a))
    .replace(/\\symbol\{(\d+)\}/, (a, b, idx, str) => ((str.charAt(idx - 1) === '\\') ? a : String.fromCharCode(1 * b)))
    // Note: x^10 is not the same as x^{10}: The former produces $x^{1}0$ instead of $x^{10}$.
    .replace(/(^|[^\\])(\^|_)(\d|[^{]\S*)/g, (a, b, c, d) => b + c + '{' + d + '}')
    // verbatim texts inserted back
    .replace(/\\verb,(.*?),/, (m, n) => `\\verb,${verb[+n]},`);

  const self = new ParserContext();

  let m: RegExpExecArray | null;
  while (text.length) {
    if ((m = re_plaintext.exec(text))) {
      // delegate text handling to the simple parser
      textparser(m[0]).forEach(d => self.add_token(d));
    }
    else if ((m = re_esc.exec(text))) {
      self.add_token(new Token(m[1]));
    }
    else if ((m = re_comment.exec(text))) {
      // noop
    }
    else if ((m = /^\{/.exec(text))) {
      // create new context
      self.open_context();
    }
    else if ((m = /^\}/.exec(text))) {
      self.close_context();
    }
    else if ((m = /^\$/.exec(text))) {
      // toggle math mode -- not supported
    }
    else if ((m = /^\\verb,([^,]+),/.exec(text))) {
      self.add_token(new Token(m[1]));
    }
    else if ((m = re_command.exec(text))) {
      const cmd = m[1].slice(1) || m[1];
      let ctx = !!m[2];
      if (/^(La)?TeX$/i.test(cmd)) {
        self.open_context();
        self.props.family = 'serif';
        let lt: Token;
        if (cmd === 'LaTeX') {
          lt = self.add_token(new Token('L'));
          lt.font = Object.create(lt.font);
          lt.font.tracking = -0.25;

          lt = self.add_token(new Token('A'));
          lt.font = Object.create(lt.font);
          lt.font.sizeAdjust = 0.7;
          lt.font.baseline = 0.3;
          lt.font.tracking = -0.1;
        }

        lt = self.add_token(new Token('T'));
        lt.font = Object.create(lt.font);
        lt.font.tracking = -0.17;

        lt = self.add_token(new Token('E'));
        lt.font = Object.create(lt.font);
        lt.font.baseline = -0.22;
        lt.font.tracking = -0.13;

        lt = self.add_token(new Token('X'));
        self.close_context();
      }
      else if (cmd in LATEX_ENTITIES) {
        self.add_token(new Token(LATEX_ENTITIES[cmd]));
        if (ctx) {
          self.open_context();
        }
      }
      else if (cmd in commands) {
        const args: string[] = [];
        let narg = Math.max(0, commands[cmd].length - 1);
        let arg: RegExpExecArray | null;
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
        if (ctx) {
          self.open_context();
        }
        commands[cmd].apply(self, [ self.props, ...args ]);
      }
      else {
        self.add_token(new Token(m[1]));
        if (ctx) {
          self.open_context();
        }
      }
    }
    else {
      m = [ text.slice(0, 1) ] as RegExpExecArray;
      self.add_token(new Token(m[0]));
    }
    text = text.slice(m[0].length);
  }

  return self.tokens;
}

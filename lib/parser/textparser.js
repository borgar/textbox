import { Token, Break, SoftHyphen } from './tokens.js';

const re_whitespace = /^[\n\r\t\x20\xA0\u2000-\u200B\u205F\u3000]/;
const re_chars2n = /^[^\n\r\t\u0020\u2000-\u200B\u205F\u3000]{2,}/;
const re_nobreak = /^[\xA0\u2011\u202F\u2060\uFEFF]/;
const re_break_after = /^(?:[;\xAD%?…]|,(?!\d))/;
const re_break_before = /^[´±°¢£¤$¥\u2212]/;

export default function parser (text, _trim) {
  if (_trim !== false) {
    text = text.trim();
  }
  const tokens = [];
  let last_ch = text.charAt(0);
  let curr_ch;
  let next_ch;
  let p = 0;
  for (let i = 1, l = text.length; i < l; i++) {
    curr_ch = text.charAt(i);
    next_ch = text.charAt(i + 1);

    const last_is_ws = re_whitespace.test(last_ch);
    const curr_is_ws = re_whitespace.test(curr_ch);
    let allow_break = curr_is_ws || last_is_ws;
    let pre_last_is_ws;

    if ((re_break_before.test(curr_ch) && !re_nobreak.test(last_ch)) ||
         (re_break_after.test(last_ch + next_ch) && !re_nobreak.test(curr_ch))) {
      allow_break = true;
    }

    // slighly more complicated case: hyphens
    if (last_ch === '\u002D' || // - ASCII dash
        last_ch === '\u2010' || // ‐ Unicode hyphen
        last_ch === '\u2013' || // – En dash
        last_ch === '\u2014' // — Em dash
    ) {
      pre_last_is_ws = re_whitespace.test(text.charAt(i - 2));
      if (pre_last_is_ws && !curr_is_ws) {
        allow_break = false;
      }
      if (!pre_last_is_ws && re_chars2n.test(curr_ch + next_ch)) {
        allow_break = true;
      }
    }

    if (allow_break) {
      const s = text.slice(p, i);
      if (/\u00AD$/.test(s)) { // ends in a S-HY ?
        tokens.push(new Token(s.slice(0, -1)));
        tokens.push(new SoftHyphen());
      }
      else {
        tokens.push(new Token(s));
        tokens.push(new Break());
      }
      p = i;
    }
    last_ch = curr_ch;
  }

  tokens.push(new Token(text.slice(p)));

  return tokens;
}

import font from './font/index.js';
import whitespace from './whitespace.js';
import measureText from './measure/index.js';
import { Token, Break, LineBreak, SoftHyphen } from './parser/index.js';

const re_whitespace = /[\r\n\xA0]+/g;
const subscript_size = 0.7;

// return a font style decl. based on the current token
function get_font (token, basefont) {
  // translate sub/super into scaled text
  if (token.sup) {
    token.baseline = 0.45;
    token.size = subscript_size;
  }
  if (token.sub) {
    token.baseline = -0.3;
    token.size = subscript_size;
  }
  // FIXME: token.italic => token.style = 'italic'
  // FIXME: token.bold => token.weight = 'bold'
  let r = basefont;
  // can shortcut to default obj?
  if (token.style || token.weight ||
      token.baseline || token.color ||
      token.size || token.family) {
    r = font(basefont, token);
  }
  return r;
}

function overflow_line (target_line, target_width, token) {
  let line_width = target_line.width;
  let last;
  let temp;
  while (line_width + token.width > target_width &&
          target_line.length) {
    last = target_line[target_line.length - 1];
    temp = last.width;
    if (last.width > token.width) {
      // reduce the token while possible
      last.value = last.value.slice(0, -1);
      last.width = measureText(last, last.font);
      line_width += last.width;
    }
    else {
      // otherwise remove the token
      target_line.pop();
    }
    line_width -= temp;
  }
  if (target_line[target_line.length - 1] instanceof SoftHyphen) {
    // don't add ellipsis directly after hyphen, it is gross
    target_line.pop();
  }

  // it is possible that the last line is empty, because of LineBreaks
  last = target_line[target_line.length - 1] || last || {};
  token.font = font(token.font, last.bold, last.italic, '');
  token.href = target_line.length ? last.href : null;
  token.rel = target_line.length ? last.rel : null;
  token.target = target_line.length ? last.target : null;
  target_line.push(token);
}

// this method is destructive to the tokens
export default function linebreak (tokens, opt, f_base) {
  if (!tokens.length) {
    return [];
  }

  const height = opt.height();
  const width = opt.width();
  const lineclamp = opt.overflowLine();
  const wrapMode = opt.overflowWrap();

  // fonts
  const f_bold = font(f_base, true, false);

  const max_lines = isFinite(height())
    ? Math.floor(height() / f_base.height)
    : Infinity;
  // skip the work for things what will never show anyway
  if ((!height() && !width(0)) || !max_lines) { return []; }

  let index = 0;
  let line_index = 0;
  let line_width = 0;
  const final_breaks = [];
  let possible_breaks = [];
  let last_was_whitespace = false;

  while (index < tokens.length && line_index < max_lines) {
    const token = tokens[index];
    const font_inst = get_font(token, f_base); // don't need this for Break or LineBreak

    token.width = measureText(token, font_inst);
    token.font = font_inst;
    token.line = line_index;
    token.whitespace = token.value in whitespace;

    if (token.value) {
      // normalize whitespace (SVG doesn't "space" \n like HTML does)
      token.value = token.value.replace(re_whitespace, ' ');
    }

    if (!line_width && token.whitespace ||
         last_was_whitespace && token.whitespace) {
      // ignore whitespace at the start of a line
      // ignore repeat whitespace
    }
    else if (token instanceof LineBreak) {
      line_width = 0;
      possible_breaks = [];
      final_breaks.push(index + 1);
      line_index++;
    }
    else if (token instanceof Break || token instanceof SoftHyphen) {
      possible_breaks.push({
        index: index,
        width: line_width
      });
    }
    // have space to add things or this is whitespace
    else if (token.whitespace || line_width + token.width < width(line_index)) {
      line_width += token.width;
    }
    // out of space in the line, need to perform a break
    else if (!possible_breaks.length) {
      // if there are no possible breaks we diverge:
      // - break-word: inject a break and continue
      // - else: add the token which overflows
      if (wrapMode === 'break-word') {
        const lw = width(line_index);
        if ((line_width + token.width) > lw) {
          // split the token into two halves
          const post = token.clone();
          // reduce the token to fit the line
          do {
            token.value = token.value.slice(0, -1);
            token.width = measureText(token, token.font);
            line_width += token.width;
          }
          while (token.value && token.width > lw);
          // add the remainder and a breakpoint to the stream
          post.value = post.value.slice(token.value.length);
          tokens.splice(index + 1, 0, new Break(), post);
        }
        final_breaks.push(index + 1);
        line_width = 0;
        line_index++;
      }
      else {
        line_width += token.width;
      }
    }
    else {
      let break_rep;
      let break_accepted;
      // seek backwards through the breakpoints in the line
      // and determine if any of them are suitable
      do {
        break_accepted = true;
        break_rep = possible_breaks.pop();
        const break_token = tokens[break_rep.index];
        let hyp_width;
        if (break_token instanceof SoftHyphen) {
          hyp_width = measureText('-', break_token.font);
          if (break_rep.width + hyp_width > width(line_index)) {
            // won't fit so we'll try again if we have more breaks
            break_accepted = !possible_breaks.length;
          }
        }
      }
      while (!break_accepted);

      // remember this break's index in the tokenstream
      final_breaks.push(break_rep.index + 1);
      line_width = 0;
      line_index++;

      index = break_rep.index;
      possible_breaks = [];
    }

    index++;
    last_was_whitespace = token.whitespace;
  }
  // cut remainder of last line if needed
  if (index !== final_breaks[final_breaks.length - 1]) {
    final_breaks.push(index);
  }

  // convert breakpoints to lines
  let last_break = 0;
  let widest = 0;
  const lines = final_breaks.map(p => {
    // find first token that is not "junk"
    let s = last_break;
    let t;
    while ((t = tokens[s]) && (t.whitespace || !t.value)) {
      // this trims breaks and whitespace from the start of the line
      s++;
    }
    // find last token that is not "junk"
    let e = p;
    let hardbreak = null;
    while ((e > s) && (t = tokens[e - 1]) &&
      (t.whitespace || !(t.value || t instanceof SoftHyphen))) {
      // this trims breaks and whitespace from the end of the line
      if (t instanceof LineBreak) {
        // preserve hard breaks so we can justify text later
        hardbreak = t;
      }
      e--;
    }
    // last token in line is a soft-hyphen, which expands to a dash
    if (t instanceof SoftHyphen) {
      t.value = '-';
      t.width = measureText('-', t.font);
    }
    // next start pos
    last_break = p;
    // cut and clean the line
    const line = tokens.slice(s, e).filter(d => d.value);
    if (hardbreak) {
      line.push(hardbreak);
    }
    // keep track of line widths
    line.width = line.reduce((a, d) => a + d.width, 0);
    if (line.width > widest) {
      widest = line.width;
    }
    return line;
  });

  // per-line overflow
  if (lineclamp) {
    const overflow = (lineclamp === 'ellipsis') ? '…' : lineclamp;
    lines.forEach((line, line_index) => {
      const w = width(line_index);
      if (line.width > w) {
        const o_token = new Token(overflow);
        o_token.font = f_base;
        o_token.width = measureText(overflow, f_bold);
        overflow_line(line, w, o_token);
      }
    });
  }

  // overflow needed?
  const overflow = (opt.overflow() === 'ellipsis') ? '…' : opt.overflow();
  if (overflow && index !== tokens.length) {
    const line_width = width(lines.length - 1);
    const last_line = lines[lines.length - 1];
    const o_token = new Token(overflow);
    o_token.font = f_base;
    o_token.width = measureText(overflow, f_bold);
    overflow_line(last_line, line_width, o_token);
    lines.hasOverflow = true;
  }
  else {
    lines.hasOverflow = false;
  }

  lines.font = f_base;
  lines.width = widest;

  return lines;
}

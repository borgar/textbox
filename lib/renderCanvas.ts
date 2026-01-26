import { fontStringParser } from './fontStringParser.ts';
import { fontToString } from './fontToString.ts';
import { LineBreak } from './parser/tokens.ts';
import type { FontProps, LayoutOptions, Lines, VAlignment } from './types.ts';

const valignMult = {
  middle: 0.5,
  center: 0.5,
  bottom: 1,
  end: 1
};

function getColor (font: FontProps) {
  return font.color || (font.href ? '#00C' : '#000');
}

export function renderCanvas (lines: Lines, opt: LayoutOptions, ctx: CanvasRenderingContext2D) {
  if (!lines.length) {
    return;
  }

  ctx.textBaseline = 'middle';

  const _font = fontStringParser(opt.font);
  const fs: number = _font.size ?? 12;
  const lh: number = _font.height ?? fs * (7 / 6);

  const gravity: VAlignment = opt.valign;

  const height: number = typeof opt.height === 'function' ? opt.height() : opt.height;
  const width: number = typeof opt.width === 'function' ? opt.width(0) : opt.width;
  const xFn = typeof opt.x === 'function' ? opt.x : () => opt.x as number;

  const align = opt.align;
  const justify = align === 'justify';

  // baseline adjustment for first line
  let adj = lh * 0.5;
  const m = valignMult[gravity];
  if (m && isFinite(height)) {
    const th = lines.length * lh;
    adj += (height * m) - (th * m);
  }

  let underlineLast: null | [ number, number ];

  lines.forEach((line, line_nr) => {
    underlineLast = null;
    let x = xFn(line_nr);
    const y = line_nr * lh + adj;

    // compute the line's width and count number of whitespace gaps
    let wsCount = 0;
    let lineWidthAll = 0;
    line.forEach(token => {
      if (token.whitespace) {
        wsCount++;
      }
      lineWidthAll += token.width;
    });

    // does line need wordspacing (last line or ends in a linebreak)
    let ws = 0;
    const last_line = line_nr === lines.length - 1 || line[line.length - 1] instanceof LineBreak;
    if (justify && line.length > 1 && !last_line) {
      // don't do this if line was \n terminated
      const missing = width - lineWidthAll;
      ws = missing / wsCount;
    }

    for (const token of line) {
      // font and baseline
      ctx.font = fontToString(token.font);
      const font = token.font;
      const dy = font.baseline ? (fs * -(font.baseline)) + (fs * 0.15) : 0;
      ctx.fillStyle = getColor(font);

      let ax = 0;
      if (align === 'right') {
        ax += width - lineWidthAll;
      }
      else if (align === 'center') {
        ax += width / 2 - lineWidthAll / 2;
      }
      else if (align === 'justify') {
        if (token.whitespace || token instanceof LineBreak) {
          x += ws;
        }
      }

      // render token
      ctx.fillText(token.value, x + ax, y + dy);

      // render underline
      if (token.font.href) {
        ctx.beginPath();
        ctx.strokeStyle = ctx.fillStyle;
        const uy = Math.floor(y + fs * 0.45) + 0.5;
        if (!underlineLast) {
          // we track the last underline end pos so that we draw an unbroken
          // line even if extra word spacing is used (as with justified text)
          underlineLast = [ x + ax, uy ];
        }
        ctx.moveTo(...underlineLast);
        ctx.lineTo(x + ax + token.width, uy);
        ctx.stroke();
      }
      else {
        underlineLast = null;
      }

      // advance x position
      x += token.width;
    }
  });
}

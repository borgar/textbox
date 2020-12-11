import { LineBreak } from '../parser';

const valignMult = {
  middle: 0.5,
  center: 0.5,
  bottom: 1,
  end: 1
};

function getColor (font, token) {
  if (font.color) { return font.color; }
  return (token.href ? '#00C' : '#000');
}

export default function canvasRender (lines, opt, ctx) {
  if (!lines.length) { return; }

  ctx.textBaseline = 'middle';

  const _font = opt.font();
  const lh = _font.height;
  const fs = _font.size;

  const gravity = opt.valign();
  const height = opt.height()();
  const width = opt.width()(0);

  const align = opt.align();
  const justify = align === 'justify';

  // baseline adjustment for first line
  let adj = lh * 0.5;
  const m = valignMult[gravity];
  if (m && isFinite(height)) {
    const th = lines.length * lh;
    adj += (height * m) - (th * m);
  }

  lines.forEach((line, line_nr) => {
    let x = opt.x()(line_nr);
    const y = line_nr * lh + adj;

    // compute the line's width and count number of whitespace gaps
    let wsCount = 0;
    let lineWidthAll = 0;
    line.forEach(token => {
      if (token.whitespace) { wsCount++; }
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

    line.forEach(token => {
      // font and baseline
      ctx.font = token.font;
      const font = token.font;
      const dy = font.baseline ? (fs * -font.baseline) + (fs * 0.15) : 0;
      ctx.fillStyle = getColor(font, token);

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
      if (token.href) {
        ctx.beginPath();
        ctx.strokeStyle = ctx.fillStyle;
        const uy = Math.floor(y + fs * 0.45) + 0.5;
        ctx.moveTo(x + ax, uy);
        ctx.lineTo(x + ax + token.width, uy);
        ctx.stroke();
      }

      // advance x position
      x += token.width;
    });
  });
}

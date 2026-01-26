import { fontStringParser } from './fontStringParser.ts';
import { fontToString } from './fontToString.ts';
import { LineBreak } from './parser/tokens.ts';
import { round } from './round.ts';
import type { FontStyle, FontVariant, LayoutOptions, Lines } from './types.ts';

const alignMap = {
  center: 'middle',
  right: 'end'
};

const valignMult = {
  middle: 0.5,
  center: 0.5,
  bottom: 1,
  end: 1
};

type SegmentProps = Partial<{
  fontFamily: string | null,
  fontSize: number | null,
  fontWeight: number | null,
  fontStyle: FontStyle | null,
  fontVariant: FontVariant | null,
  fill: string | null,
  baselineShift: string | null,
  className: string | null,
  dx: number,
  href: string | null,
  rel: string | null,
  target: string | null
}>;

const eqVal = (a: unknown, b: unknown): boolean => (!a && !b) || a === b;

export function renderSVG (lines: Lines, opt: LayoutOptions) {
  const root: SVGElement[] = [];
  const _font = fontStringParser(opt.font);
  const fs = _font.size ?? 12;
  const ff = _font.family ?? 'sans-serif';
  const align = opt.align ?? 'left';
  const createElement = opt.createElement;

  if (lines.length) {
    const lh: number = _font.height ?? fs * (7 / 6);

    // layout dimensions
    const valign = opt.valign;
    const height: number = typeof opt.height === 'function' ? opt.height() : opt.height;
    const width: number = typeof opt.width === 'function' ? opt.width(0) : opt.width;
    const xFn = typeof opt.x === 'function' ? opt.x : () => opt.x as number;

    // if width is infinite and this is a single line (no linebreaks used)
    // it should get treated like any other svg text
    const is_common_label = !isFinite(width) && lines.length === 1;

    // leading step size in EMs
    const dy = round(lh / fs) ?? 0;

    // baseline adjustment for first line
    let adj = is_common_label ? 0 : round(lh / ((fs * 1.15) + (lh - fs) / 2));
    const m = valignMult[valign];
    if (m && isFinite(height)) {
      const m = valign === 'bottom' ? 1 : 0.5;
      adj = (adj || 0) + (height * m - lh * lines.length * m) / fs;
    }

    const justify = align === 'justify';
    let xAlignAdjust = 0;
    if (align === 'right') {
      xAlignAdjust = width;
    }
    else if (align === 'center') {
      xAlignAdjust = width / 2;
    }

    let children: SVGElement[] = [];
    let segmentType = 'tspan';
    let segmentProps: SegmentProps | null = null;
    let segmentText = '';

    const flushSegment = () => {
      if (segmentText) {
        const segmentElement = createElement(segmentType, segmentProps, segmentText);
        children.push(segmentElement);
      }
      segmentType = 'tspan';
      segmentProps = null;
      segmentText = '';
    };

    for (let li = 0, ll = lines.length; li < ll; li++) {
      let last_font_id = '';
      let last_class = '';
      let dx = 0;
      const line = lines[li];
      if (!line.length) {
        // empty lines don't trigger dy shifting so they need to
        // be filled with something that gives them substance
        // --- lineElement.textContent = '\u00A0';
        root.push(
          createElement('tspan', {
            x: xFn(li),
            dy: round(li ? dy : adj) + 'em'
          }, '\u00A0')
        );
        continue;
      }

      children = [];

      let wsCount = 0;
      let lineWidth = 0;

      let href = '';
      for (let wi = 0, wl = line.length; wi < wl; wi++) {
        const token = line[wi];
        const sfont = token.font;
        const sfontId = fontToString(sfont, true);

        if (token.whitespace) { // token.value.split(/\s+/g).length ?
          wsCount++;
        }
        lineWidth += token.width;

        // re-use segment because it is the same and we can reduce element count
        // we also need this for underlines to be sequential across multiple
        // words although this does break when justifying the text
        if (wi && !token.font.tracking && !dx &&
            eqVal(sfontId, last_font_id) &&
            eqVal(token.font.class, last_class) &&
            eqVal(href, token.font.href)) {
          segmentText += token.value;
        }
        // new segment
        else {
          flushSegment();

          const fontSize = (sfont.size ?? fs) * (sfont.sizeAdjust ?? 1);
          segmentText = token.value;
          segmentProps = {
            fontFamily: (sfont.family !== ff && sfont.family) || null,
            fontSize: fontSize !== fs ? fontSize : null,
            fontWeight: sfont.weight !== 400 ? sfont.weight || null : null,
            fontStyle: sfont.style !== 'normal' ? sfont.style || null : null,
            fontVariant: sfont.variant !== 'normal' ? sfont.variant || null : null,
            fill: sfont.color || null,
            baselineShift: sfont.baseline ? (sfont.baseline * 100) + '%' : null,
            className: token.font.class || null,
            dx: 0,
            href: null,
            rel: null,
            target: null
          };

          // tracking
          if (dx) {
            segmentProps.dx = round(dx);
            dx = 0;
          }
          if (token.font.tracking) {
            // next token will be tracked by this segments value
            dx = fontSize * token.font.tracking;
          }

          // create the segment
          if (token.font.href && !href) {
            href = token.font.href;
            segmentType = 'a';
            segmentProps.href = href;
            segmentProps.rel = token.font.rel;
            segmentProps.target = token.font.target;
          }
          else {
            href = '';
          }

          last_font_id = sfontId;
          last_class = token.font.class ?? '';
        }
      }
      flushSegment();

      if (is_common_label) {
        root.push(...children);
      }
      else {
        let ws: number | null = null;
        const last_line = li === ll - 1 || line[line.length - 1] instanceof LineBreak;
        if (justify && line.length > 1 && !last_line) {
          // don't do this if line was \n terminated
          const missing = width - lineWidth;
          ws = round(missing / wsCount);
        }
        root.push(
          createElement('tspan', {
            wordSpacing: ws,
            x: xFn(li) + xAlignAdjust,
            dy: round(li ? dy : adj) + 'em'
          }, ...children)
        );
      }
    }
  }

  return createElement('text', {
    fontFamily: ff,
    fontSize: fs,
    textAnchor: alignMap[align] || 'start'
  }, ...root);
}

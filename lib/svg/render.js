import round from './round';
import { LineBreak } from '../parser';

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

export default function svgRender (lines, opt) {
  const root = [];
  const _font = opt.font();
  const fs = _font.size;
  const ff = _font.family;
  const align = opt.align();
  const createElement = opt.createElement();

  if (lines.length) {
    const lh = _font.height;

    // layout dimensions
    const valign = opt.valign();
    const height = opt.height()();
    const width = opt.width()(0);

    // if width is infinite and this is a single line (no linebreaks used)
    // it should get treated like any other svg text
    const is_common_label = !isFinite(width) && lines.length === 1;
    const x = is_common_label ? null : opt.x();

    // leading step size in EMs
    const dy = round(lh / fs);

    // baseline adjustment for first line
    let adj = is_common_label ? null : round(lh / ((fs * 1.15) + (lh - fs) / 2));
    const m = valignMult[valign];
    if (m && isFinite(height)) {
      const m = valign === 'bottom' ? 1 : 0.5;
      adj += (height * m - lh * lines.length * m) / fs;
    }

    const justify = align === 'justify';
    let xAlignAdjust = 0;
    if (align === 'right') {
      xAlignAdjust = width;
    }
    else if (align === 'center') {
      xAlignAdjust = width / 2;
    }

    let children = [];
    let segmentType = 'tspan';
    let segmentProps = null;
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
      let dx = 0;
      const line = lines[li];
      if (!line.length) {
        // empty lines don't trigger dy shifting so they need to
        // be filled with something that gives them substance
        // --- lineElement.textContent = '\u00A0';
        root.push(
          createElement('tspan', {
            x: x(li),
            dy: round(li ? dy : adj) + 'em'
          }, '\u00A0')
        );
        continue;
      }

      children = [];

      let wsCount = 0;
      let lineWidth = 0;

      let href;
      for (let wi = 0, wl = line.length; wi < wl; wi++) {
        const token = line[wi];
        const sfont = token.font;

        if (token.whitespace) { // token.value.split(/\s+/g).length ?
          wsCount++;
        }
        lineWidth += token.width;

        // re-use segment because it is the same and we can reduce element count
        // we also need this for underlines to be sequential across multiple words
        // although this breaks when justifying the text
        if (wi && sfont.id === last_font_id && !token.tracking && !dx &&
            ((!href && !token.href) || href === token.href)) {
          segmentText += token.value;
        }
        // new segment
        else {
          flushSegment();

          segmentText = token.value;
          segmentProps = {
            fontFamily: sfont.family !== ff ? sfont.family : null,
            fontSize: sfont.size !== fs ? sfont.size : null,
            fontWeight: sfont.weight || null,
            fontStyle: sfont.style || null,
            fontVariant: sfont.variant !== 'normal' ? sfont.variant || null : null,
            fill: sfont.color || null,
            baselineShift: sfont.baseline ? (sfont.baseline * 100) + '%' : null
          };

          // tracking
          if (dx) {
            segmentProps.dx = round(dx);
            dx = 0;
          }
          if (token.tracking) {
            // next token will be tracked by this segments value
            dx = sfont.size * token.tracking;
          }

          // create the segment
          if (token.href && !href) {
            href = token.href;
            segmentType = 'a';
            segmentProps.href = href;
          }
          else {
            href = null;
          }

          last_font_id = sfont.id;
        }
      }
      flushSegment();

      if (is_common_label) {
        root.push(...children);
      }
      else {
        let ws = null;
        const last_line = li === ll - 1 || line[line.length - 1] instanceof LineBreak;
        if (justify && line.length > 1 && !last_line) {
          // don't do this if line was \n terminated
          const missing = width - lineWidth;
          ws = round(missing / wsCount);
        }
        root.push(
          createElement('tspan', {
            wordSpacing: ws,
            x: x(li) + xAlignAdjust,
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


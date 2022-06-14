import font from './font/index.js';
import linebreak from './linebreak.js';
import svgRender from './svg/render.js';
import canvasRender from './canvas/render.js';
import argMap from './argmap.js';

const defaultFont = font();
const toFunction = ƒ => ((typeof ƒ === 'function') ? ƒ : () => ƒ);

export default class Textbox {
  constructor (opts) {
    this.props = {
      overflow: 'ellipsis',
      lineclamp: null,
      align: 'left',
      wordBreak: null,
      valign: 'top',
      width: () => Infinity,
      height: () => Infinity,
      x: () => 0,
      font: null,
      tAnchor: 0,
      parser: Textbox.defaultparser
    };
    if (opts) {
      for (const key in opts) {
        if (typeof this[key] === 'function') {
          this[key](opts[key]);
        }
      }
    }
  }

  linebreak (text) {
    const tokens = this.props.parser(String(text));
    const font = this.font();
    const lines = linebreak(tokens, this, font);
    lines.height = lines.length * font.height;
    lines.render = c => this.render(lines, c);
    lines.svg = lines.render;
    lines.draw = lines.render;
    return lines;
  }

  font (v) {
    if (!arguments.length) {
      return this.props.font || font(defaultFont);
    }
    this.props.font = font(v);
    return this;
  }

  overflow (v) {
    if (!arguments.length) {
      return this.props.overflow;
    }
    this.props.overflow = String(v);
    return this;
  }

  overflowLine (v) {
    if (!arguments.length) {
      return this.props.lineclamp;
    }
    this.props.lineclamp = String(v);
    return this;
  }

  valign (v) {
    if (!arguments.length) {
      return this.props.valign;
    }
    this.props.valign = v;
    return this;
  }

  align (v) {
    if (!arguments.length) {
      return this.props.align;
    }
    const align = String(v).toLowerCase();
    if (align === 'left' || align === 'start') {
      this.props.align = 'left';
      this.props.tAnchor = 0;
    }
    else if (align === 'center' || align === 'middle') {
      this.props.align = 'center';
      this.props.tAnchor = -0.5;
    }
    else if (align === 'end' || align === 'right') {
      this.props.align = 'right';
      this.props.tAnchor = -1;
    }
    else if (align === 'justify') {
      this.props.align = v;
      this.props.tAnchor = 0;
    }
    return this;
  }

  overflowWrap (v) {
    if (!arguments.length) {
      return this.props.overflowWrap || 'normal';
    }
    const mode = String(v).toLowerCase();
    if (mode === 'break-word') {
      this.props.overflowWrap = 'break-word';
    }
    else if (mode === 'normal' || v == null) {
      this.props.overflowWrap = null;
    }
    return this;
  }

  width (v) {
    if (!arguments.length) {
      return this.props.width;
    }
    this.props.width = toFunction(v);
    return this;
  }

  height (v) {
    if (!arguments.length) {
      return this.props.height;
    }
    this.props.height = toFunction(v);
    return this;
  }

  x (v) {
    if (!arguments.length) {
      return this.props.x;
    }
    this.props.x = toFunction(v);
    return this;
  }

  parser (v) {
    if (!arguments.length) {
      return this.props.parser;
    }
    if (typeof v === 'string') {
      // allow calling parser by "name"
      const tmp = Textbox[v] || Textbox[v + 'parser'];
      if (typeof tmp === 'function') {
        v = tmp;
      }
    }
    if (typeof v !== 'function') {
      throw new Error('Unknown parser: ' + v);
    }
    this.props.parser = v;
    return this;
  }

  createElement (_) {
    if (!arguments.length) {
      return this.props.createElement || Textbox.createElement;
    }
    this.props.createElement = _;
    return this;
  }

  render () {
    // eslint-disable-next-line
    const s = argMap(arguments);
    if (typeof s.text === 'string') {
      s.text = this.linebreak(s.text);
    }
    if (s.ctx) {
      return canvasRender(s.text, this, s.ctx);
    }
    return svgRender(s.text, this);
  }
}

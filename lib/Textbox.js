/* globals SVGElement OffscreenCanvas HTMLCanvasElement
 * CanvasRenderingContext2D */
import { linebreak } from './linebreak.js';
import { renderSVG } from './renderSVG.js';
import { renderCanvas } from './renderCanvas.js';
import { argmap } from './argmap.js';
import { measureText, setMeasureCanvas } from './measureText.js';
import { Font } from './Font.js';
import { createElement } from './createElement.js';
import { Rotator } from './Rotator.js';
import { textparser } from './parser/textparser.js';
import { htmlparser } from './parser/htmlparser.js';
import { latexparser } from './parser/latexparser.js';
import { Break, LineBreak, SoftHyphen, Token } from './parser/tokens.js';

const defaultFont = new Font();
const toFunction = ƒ => ((typeof ƒ === 'function') ? ƒ : () => ƒ);

const alignments = {
  left: 'left',
  start: 'left',
  center: 'center',
  middle: 'center',
  right: 'right',
  end: 'right',
  justify: 'justify',
};

/**
 * A Textbox formatter that allows flowing text into a preset area.
 */
export class Textbox {
  static createElement = createElement;
  static textparser = textparser;
  static defaultparser = textparser;
  static htmlparser = htmlparser;
  static latexparser = latexparser;
  static Token = Token;
  static Break = Break;
  static LineBreak = LineBreak;
  static SoftHyphen = SoftHyphen;
  static Rotator = Rotator;
  static Font = Font;
  static setMeasureCanvas = setMeasureCanvas;

  /**
   * Measure a string of text as printed with a specified font and return
   * its width.
   *
   * @param {string | import('./parser/tokens.js').Token} text
   * @param {(Font | string)} font
   * @param {import('./types.js').MeasureOptions} [options]
   * @return {number}
   */
  static measureText = function (text, font, options) {
    return measureText(text, new Font(font), options);
  };

  /**
   * @param {object} [opts]
   * @param {string | Font} [opts.font = '12px/14px sans-serif']
   * @param {import('./types.js').Overflow} [opts.overflow = 'ellipsis']
   * @param {import('./types.js').Overflow} [opts.overflowLine = '']
   * @param {import('./types.js').OverflowWrap} [opts.overflowWrap = 'break-word']
   * @param {import('./types.js').VAlignment} [opts.valign = 'top']
   * @param {import('./types.js').Alignment} [opts.align = 'left']
   * @param {number | ((line?: number) => number)} [opts.width = Infinity]
   * @param {number | (() => number)} [opts.height = Infinity]
   * @param {number | ((line?: number) => number)} [opts.x = 0]
   * @param {(text: string) => Token[]} [opts.parser]
   * @param {typeof createElement} [opts.createElement]
   */
  constructor (opts) {
    this.props = {
      overflow: 'ellipsis',
      /** @type {null | 'break-word'} */
      overflowWrap: null,
      overflowLine: '',
      /** @type {import('./types.js').Alignment} */
      align: 'left',
      wordBreak: null,
      valign: 'top',
      /** @type {(n: number) => number} */
      width: () => Infinity,
      height: () => Infinity,
      x: () => 0,
      /** @type {Font} */
      font: defaultFont,
      parser: Textbox.defaultparser
    };
    if (opts) {
      if (opts.font) {
        this.font(opts.font);
      }
      if (opts.overflow) {
        this.overflow(opts.overflow);
      }
      if (opts.overflowLine) {
        this.overflowLine(opts.overflowLine);
      }
      if (opts.overflowWrap) {
        this.overflowWrap(opts.overflowWrap);
      }
      if (opts.valign) {
        this.valign(opts.valign);
      }
      if (opts.align) {
        this.align(opts.align);
      }
      if (opts.width) {
        this.width(opts.width);
      }
      if (opts.height) {
        this.height(opts.height);
      }
      if (opts.x) {
        this.x(opts.x);
      }
      if (opts.parser) {
        this.parser(opts.parser);
      }
      if (opts.createElement) {
        this.createElement(opts.createElement);
      }
    }
  }

  /**
   * @param {string} text
   * @return {import('./types.js').Lines & import('./types.js').LinesPropsRender}
   */
  linebreak (text) {
    const tokens = this.props.parser(String(text));
    const lines = linebreak(tokens, this, this.font());
    const render = c => this.render(lines, c);
    return Object.assign(lines, {
      render: render,
      svg: render,
      draw: render
    });
  }

  /**
   * @overload
   * @return {Font}
   *//**
   * @overload
   * @param {string | Font} v
   * @return {this}
   */
  font (v) {
    if (!arguments.length) {
      return this.props.font || new Font();
    }
    this.props.font = new Font(v);
    return this;
  }

  /**
   * @overload
   * @return {string}
   *//**
   * @overload
   * @param {string} v
   * @return {this}
   */
  overflow (v) {
    if (!arguments.length) {
      return this.props.overflow;
    }
    this.props.overflow = String(v);
    return this;
  }

  /**
   * @overload
   * @return {string}
   *//**
   * @overload
   * @param {string} v
   * @return {this}
   */
  overflowLine (v) {
    if (!arguments.length) {
      return this.props.overflowLine;
    }
    this.props.overflowLine = String(v);
    return this;
  }

  /**
   * @overload
   * @return {string}
   *//**
   * @overload
   * @param {string} v
   * @return {this}
   */
  valign (v) {
    if (!arguments.length) {
      return this.props.valign;
    }
    this.props.valign = v;
    return this;
  }

  /**
   * @overload
   * @return {'left' | 'right' | 'center' | 'justify'}
   *//**
   * @overload
   * @param {'left' | 'right' | 'center' | 'justify'} v
   * @return {this}
   */
  align (v) {
    if (!arguments.length) {
      return this.props.align;
    }
    const align = String(v).toLowerCase();
    if (align in alignments) {
      this.props.align = alignments[align];
    }
    return this;
  }

  /**
   * @overload
   * @return {'break-word' | 'normal'}
   *//**
   * @overload
   * @param {'break-word' | 'normal'} v
   * @return {this}
   */
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

  /**
   * @overload
   * @return {(line?: number) => number}
   *//**
   * @overload
   * @param {number | ((line?: number) => number)} v
   * @return {this}
   */
  width (v) {
    if (!arguments.length) {
      return this.props.width;
    }
    this.props.width = /** @type {(line?: number) => number} */(toFunction(v));
    return this;
  }

  /**
   * @overload
   * @return {() => number}
   *//**
   * @overload
   * @param {number | (() => number)} v
   * @return {this}
   */
  height (v) {
    if (!arguments.length) {
      return this.props.height;
    }
    this.props.height = /** @type {() => number} */(toFunction(v));
    return this;
  }

  /**
   * @overload
   * @return {(line?: number) => number}
   *//**
   * @overload
   * @param {number | ((line?: number) => number)} v
   * @return {this}
   */
  x (v) {
    if (!arguments.length) {
      return this.props.x;
    }
    this.props.x = /** @type {(line?: number) => number} */(toFunction(v));
    return this;
  }

  /**
   * @overload
   * @return {(text: string) => Token[]}
   *//**
   * @overload
   * @param {((text: string) => Token[]) | 'html' | 'text' | 'latex'} v
   * @return {this}
   */
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

  /**
   * @overload
   * @return {typeof createElement}
   *//**
   * @overload
   * @param {typeof createElement} factory
   * @return {this}
   */
  createElement (factory) {
    if (!arguments.length) {
      return this.props.createElement || Textbox.createElement;
    }
    this.props.createElement = factory;
    return this;
  }

  /**
   * @overload
   * @param {string | import('./types.js').Lines} text
   * @return {SVGElement}
   *//**
   * @overload
   * @param {string | import('./types.js').Lines} text
   * @param {OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D} target
   * @return {undefined}
   */
  render (text, target) {
    const s = argmap([ text, target ]);
    if (typeof s.text === 'string') {
      s.text = this.linebreak(s.text);
    }
    if (s.ctx) {
      renderCanvas(s.text, this, s.ctx);
    }
    else {
      return renderSVG(s.text, this);
    }
  }
}

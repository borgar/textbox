/* globals SVGElement OffscreenCanvas HTMLCanvasElement CanvasRenderingContext2D */
import { linebreak } from './linebreak.js';
import { renderSVG } from './renderSVG.js';
import { renderCanvas } from './renderCanvas.ts';
import { measureText, setMeasureCanvas } from './measureText.js';
import { createElement } from './createElement.ts';
import { textparser } from './parser/textparser.ts';
import { htmlparser } from './parser/htmlparser.ts';
import { latexparser } from './parser/latexparser.ts';
import { Break, LineBreak, SoftHyphen, Token } from './parser/tokens.ts';
import type { Alignment, LayoutOptions, Lines, MeasureOptions, Overflow, OverflowWrap, VAlignment } from './types.ts';

const defaults: Omit<LayoutOptions, 'parser' | 'createElement'> = {
  overflow: 'ellipsis',
  overflowWrap: 'normal',
  overflowLine: '',
  align: 'left',
  valign: 'top',
  width: Infinity,
  height: Infinity,
  x: 0,
  font: '12px/14px sans-serif'
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
  static setMeasureCanvas = setMeasureCanvas;

  /**
   * Measure a string of text as printed with a specified font and return
   * its width.
   */
  static measureText = function (
    text: string | Token,
    font: string,
    options?: MeasureOptions
  ): number {
    return measureText(text, font, options);
  };

  props: LayoutOptions;

  constructor (opts?: Partial<LayoutOptions>) {
    this.props = {
      overflow: opts?.overflow ?? defaults.overflow,
      overflowWrap: opts?.overflowWrap ?? defaults.overflowWrap,
      overflowLine: opts?.overflowLine ?? defaults.overflowLine,
      align: opts?.align ?? defaults.align,
      valign: opts?.valign ?? defaults.valign,
      width: opts?.width ?? defaults.width,
      height: opts?.height ?? defaults.height,
      x: opts?.x ?? defaults.x,
      font: opts?.font ?? defaults.font,
      parser: opts?.parser ?? Textbox.defaultparser,
      createElement: opts?.createElement ?? Textbox.createElement
    };
    if (opts?.parser) {
      this.parser(opts.parser);
    }
  }

  linebreak (text: string): Lines {
    const tokens = this.props.parser(String(text).trim());
    return linebreak(tokens, this.props);
  }

  font (): string;
  font (v: string): this;
  font (v?: string): this | string {
    if (!arguments.length) {
      return this.props.font || defaults.font;
    }
    this.props.font = v ?? defaults.font;
    return this;
  }

  overflow (): Overflow;
  overflow (v: Overflow): this;
  overflow (v?: Overflow): this | Overflow {
    if (!arguments.length) {
      return this.props.overflow;
    }
    this.props.overflow = v ?? defaults.overflow;
    return this;
  }

  overflowLine (): Overflow;
  overflowLine (v: Overflow): this;
  overflowLine (v?: Overflow): this | Overflow {
    if (!arguments.length) {
      return this.props.overflowLine;
    }
    this.props.overflowLine = v ?? defaults.overflowLine;
    return this;
  }

  overflowWrap (): OverflowWrap;
  overflowWrap (v: OverflowWrap): this;
  overflowWrap (v?: OverflowWrap): this | OverflowWrap {
    if (!arguments.length) {
      return this.props.overflowWrap;
    }
    const mode = String(v).toLowerCase();
    this.props.overflowWrap = (mode === 'break-word') ? mode : defaults.overflowWrap;
    return this;
  }

  valign (): VAlignment;
  valign (v: VAlignment): this;
  valign (v?: VAlignment): this | VAlignment {
    if (!arguments.length) {
      return this.props.valign;
    }
    this.props.valign = v ?? defaults.valign;
    return this;
  }

  align (): Alignment;
  align (v: Alignment): this;
  align (v?: Alignment): this | Alignment {
    if (!arguments.length) {
      return this.props.align;
    }
    this.props.align = v ?? defaults.align;
    return this;
  }

  width (): LayoutOptions['width'];
  width (v: LayoutOptions['width']): this;
  width (v?: LayoutOptions['width']): this | LayoutOptions['width'] {
    if (!arguments.length) {
      return this.props.width;
    }
    this.props.width = v ?? defaults.width;
    return this;
  }

  height (): LayoutOptions['height'];
  height (v: LayoutOptions['height']): this;
  height (v?: LayoutOptions['height']): this | LayoutOptions['height'] {
    if (!arguments.length) {
      return this.props.height;
    }
    this.props.height = v ?? defaults.height;
    return this;
  }

  x (): LayoutOptions['x'];
  x (v: LayoutOptions['x']): this;
  x (v?: LayoutOptions['x']): this | LayoutOptions['x'] {
    if (!arguments.length) {
      return this.props.height;
    }
    this.props.x = v ?? defaults.x;
    return this;
  }

  parser (): LayoutOptions['parser'];
  parser (parser: LayoutOptions['parser'] | 'html' | 'text' | 'latex'): this;
  parser (parser?: LayoutOptions['parser'] | 'html' | 'text' | 'latex'): this | LayoutOptions['parser'] {
    if (!arguments.length) {
      return this.props.parser;
    }
    if (parser === 'html') {
      this.props.parser = Textbox.htmlparser;
    }
    else if (parser === 'text') {
      this.props.parser = Textbox.textparser;
    }
    else if (parser === 'latex') {
      this.props.parser = Textbox.latexparser;
    }
    else {
      this.props.parser = parser ?? Textbox.defaultparser;
    }
    return this;
  }

  createElement (): LayoutOptions['createElement'];
  createElement (factory: LayoutOptions['createElement']): this;
  createElement (factory?: LayoutOptions['createElement']): this | LayoutOptions['createElement'] {
    if (!arguments.length) {
      return this.props.createElement;
    }
    this.props.createElement = factory ?? Textbox.createElement;
    return this;
  }

  renderSVG (text: string | Lines): SVGElement {
    const lines = typeof text === 'string' ? this.linebreak(text) : text;
    return renderSVG(lines, this.props);
  }

  renderCanvas (text: string | Lines, target: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D): void {
    const lines = typeof text === 'string' ? this.linebreak(text) : text;
    if (target instanceof CanvasRenderingContext2D) {
      renderCanvas(lines, this.props, target);
    }
    else {
      const ctx = target.getContext('2d');
      if (ctx instanceof CanvasRenderingContext2D) {
        renderCanvas(lines, this.props, ctx);
      }
    }
  }

  render (text: string | Lines): SVGElement;
  render (text: string | Lines, target: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D): void;
  render (text: string | Lines, target?: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D): SVGElement | void {
    const lines = typeof text === 'string' ? this.linebreak(text) : text;
    if (target) {
      return this.renderCanvas(lines, target);
    }
    return this.renderSVG(lines);
  }
}

/* globals SVGElement OffscreenCanvas HTMLCanvasElement CanvasRenderingContext2D */
import { linebreak } from './linebreak.js';
import { renderSVG } from './renderSVG.js';
import { renderCanvas } from './renderCanvas.ts';
import { measureText, setMeasureCanvas } from './measureText/measureText.ts';
import { createElement } from './createElement.ts';
import { textparser } from './parser/textparser.ts';
import { htmlparser } from './parser/htmlparser.ts';
import { latexparser } from './parser/latexparser.ts';
import type { Alignment, LayoutOptions, Lines, Overflow, OverflowWrap, VAlignment } from './types.ts';

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
 * A Textbox formatter that allows flowing rich text into a preset area.
 */
export class Textbox {
  /**
   * Default factory function to use when constructing SVG elements.
   */
  static createElement = createElement;
  /**
   * Default parser to use when consuming text.
  */
  static defaultparser = textparser;
  /**
   * Measure a string of text as printed with a specified font and return its width.
  */
  static measureText = measureText;
  /**
   * Set the canvas to use when measuring text (in a non-browser environment).
  */
  static setMeasureCanvas = setMeasureCanvas;

  /** @internal */
  props: LayoutOptions;

  constructor (options?: Partial<LayoutOptions>) {
    this.props = {
      overflow: options?.overflow ?? defaults.overflow,
      overflowWrap: options?.overflowWrap ?? defaults.overflowWrap,
      overflowLine: options?.overflowLine ?? defaults.overflowLine,
      align: options?.align ?? defaults.align,
      valign: options?.valign ?? defaults.valign,
      width: options?.width ?? defaults.width,
      height: options?.height ?? defaults.height,
      x: options?.x ?? defaults.x,
      font: options?.font ?? defaults.font,
      parser: options?.parser ?? Textbox.defaultparser,
      createElement: options?.createElement ?? Textbox.createElement
    };
    if (options?.parser) {
      this.parser(options.parser);
    }
  }

  /**
   * Parses text, flows it into the set dimensions and returns a list of the lines.
   * The returned object can then be passed on to the renderer.
   *
   * As well as a list of lines of tokens, the lines object has a height property
   * which is useful if you want to set the render destination to the fit the text.
   *
   * The lines object also includes a .hasOverflow property which indicates if the
   * text was able to fit a designated height. It will be `true` if the text did not
   * fit the defined space.
   */
  linebreak (text: string): Lines {
    const tokens = this.props.parser(String(text).trim());
    return linebreak(tokens, this.props);
  }

  /**
   * Set or get a default font for the text. Parts of the text
   * may override the default font, but this defines the font used
   * when nothing else is specified.
   *
   * The method assumes a [CSS-style font declaration])(eb/CSS/Reference/Properties/font)
   * string.
   *
   * By default this will be set to `"12px/14px sans-serif"`.
   */
  font (): string;
  font (font: string): this;
  font (font?: string): this | string {
    if (!arguments.length) {
      return this.props.font || defaults.font;
    }
    this.props.font = font ?? defaults.font;
    return this;
  }

  /**
   * The symbol to use when indicating text overflow (text that
   * is cut off because it doesn't fit within the set boundaries).
   *
   * May be set to any string or the keyword `"ellipsis"`.
   *
   * By default this will be set to `"ellipsis"` which prints `…`.
   */
  overflow (): Overflow;
  overflow (overflow: Overflow): this;
  overflow (overflow?: Overflow): this | Overflow {
    if (!arguments.length) {
      return this.props.overflow;
    }
    this.props.overflow = overflow ?? defaults.overflow;
    return this;
  }

  /**
   * The symbol to use when indicating a single line text overflow.
   *
   * May be set to any string or `""` to turn off line overflow cutoff.
   *
   * By default this will be set to `""` which will allow words longer
   * than the width of the textbox to print in full.
   */
  overflowLine (): Overflow;
  overflowLine (overflow: Overflow): this;
  overflowLine (overflow?: Overflow): this | Overflow {
    if (!arguments.length) {
      return this.props.overflowLine;
    }
    this.props.overflowLine = overflow ?? defaults.overflowLine;
    return this;
  }

  /**
   * Controls whether line breaks should be inserted within an otherwise unbreakable
   * string to prevent text from overflowing the textbox.
   *
   * - Set this to `"break-word"` to allow extra breaks mid-word.
   * - Set this to `"normal"` to only allow natural breaks at whitespace, punctuation, or hyphens.
   *
   * By default this will be set to `"normal"`.
   */
  overflowWrap (): OverflowWrap;
  overflowWrap (wrap: OverflowWrap): this;
  overflowWrap (wrap?: OverflowWrap): this | OverflowWrap {
    if (!arguments.length) {
      return this.props.overflowWrap;
    }
    const mode = String(wrap).toLowerCase();
    this.props.overflowWrap = (mode === 'break-word') ? mode : defaults.overflowWrap;
    return this;
  }

  /**
   * Controls the vertical alignment of the text.
   *
   * By default this will be set to `"top"`.
   */
  valign (): VAlignment;
  valign (align: VAlignment): this;
  valign (align?: VAlignment): this | VAlignment {
    if (!arguments.length) {
      return this.props.valign;
    }
    this.props.valign = align ?? defaults.valign;
    return this;
  }

  /**
   * Controls the horizontal alignment of the text.
   *
   * By default this will be set to `"left"`.
   */
  align (): Alignment;
  align (align: Alignment): this;
  align (align?: Alignment): this | Alignment {
    if (!arguments.length) {
      return this.props.align;
    }
    this.props.align = align ?? defaults.align;
    return this;
  }

  /**
   * Controls the width of the textbox in which to fit the text.
   *
   * This can be a callback function if you want runaround text layout,
   * or to flow the text into irregular space.
   *
   * By default this will be set to `Infinity` which prints a text
   * without linebreaks into a single line.
   */
  width (): LayoutOptions['width'];
  width (width: LayoutOptions['width']): this;
  width (width?: LayoutOptions['width']): this | LayoutOptions['width'] {
    if (!arguments.length) {
      return this.props.width;
    }
    this.props.width = width ?? defaults.width;
    return this;
  }

  /**
   * Controls the height of the textbox in which to fit the text.
   *
   * By default this will be set to `Infinity` which mean text will
   * not be subject to overflow.
   */
  height (): LayoutOptions['height'];
  height (height: LayoutOptions['height']): this;
  height (height?: LayoutOptions['height']): this | LayoutOptions['height'] {
    if (!arguments.length) {
      return this.props.height;
    }
    this.props.height = height ?? defaults.height;
    return this;
  }

  /**
   * Controls the indentation of text lines.
   *
   * This is useful for fitting text into non-rectanglular shapes. A callback
   * provided as an argument this will be called every line with the line number
   * as a parameter.
   *
   * By default this will be set to `0`.
   */
  x (): LayoutOptions['x'];
  x (x: LayoutOptions['x']): this;
  x (x?: LayoutOptions['x']): this | LayoutOptions['x'] {
    if (!arguments.length) {
      return this.props.height;
    }
    this.props.x = x ?? defaults.x;
    return this;
  }

  /**
   * The parser to use when parsing text input.
   *
   * - Set it to `"text"` for plaintext parsing.
   * - Set it to `"html"` for basic HTML parsing (it understands such things as `<b>`, `<sup>`, `<tt>`, ...).
   * - Set it to `"latex"` for a very basic LaTeX parser (it understands basic text commands and punctuation - no math mode).
   *
   * An alternative parser may be provided as a callback, as long as it conforms to the parser interface.
   *
   * By default the parser is set to `"text"`.
   */
  parser (): LayoutOptions['parser'];
  parser (parser: LayoutOptions['parser'] | 'html' | 'text' | 'latex'): this;
  parser (parser?: LayoutOptions['parser'] | 'html' | 'text' | 'latex'): this | LayoutOptions['parser'] {
    if (!arguments.length) {
      return this.props.parser;
    }
    if (parser === 'html') {
      this.props.parser = htmlparser;
    }
    else if (parser === 'text') {
      this.props.parser = textparser;
    }
    else if (parser === 'latex') {
      this.props.parser = latexparser;
    }
    else {
      this.props.parser = parser ?? Textbox.defaultparser;
    }
    return this;
  }

  /**
   * The element factory function to use when constructing SVG elements within the SVG renderer.
   *
   * The interface conforms to React's `React.createElement` so you may simply set that function as
   * the factory if you want to use the rendered text in a React render tree.
   */
  createElement (): LayoutOptions['createElement'];
  createElement (factory: LayoutOptions['createElement']): this;
  createElement (factory?: LayoutOptions['createElement']): this | LayoutOptions['createElement'] {
    if (!arguments.length) {
      return this.props.createElement;
    }
    this.props.createElement = factory ?? Textbox.createElement;
    return this;
  }

  /**
   * Render text or linebreak-output as an SVG element.
   *
   * The output will be a single root text element with the lines and sections contained within.
   */
  renderSVG (text: string | Lines): SVGElement {
    const lines = typeof text === 'string' ? this.linebreak(text) : text;
    return renderSVG(lines, this.props);
  }

  /**
   * Render text or linebreak-output onto a Canvas.
   */
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

  /**
   * Render text or linebreak-output onto a Canvas or as an SVG element.
   *
   * This method determines which render output is desired based on whether a canvas based
   * target was supplied or not.
   *
   * @deprecated
   */
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

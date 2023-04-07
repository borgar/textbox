type CSS_TEXT_ALIGN = "left" | "right" | "center" | "justify";
type SVG_TEXT_ALIGN = "start" | "middle" | "end";
type VERTICAL_ALIGN = "top" | "middle" | "bottom" | "start" | "end";
type OVERFLOW = "ellipsis" | "clip" | string;

type FontStyle = "normal" | "italic" | "oblique";
type FontWeight =
  | "normal"
  | "bold"
  | "bolder"
  | "lighter"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

type FontVariant = "normal" | "small-caps";

export interface TextboxOptions {
  /**
   * Define what font to use. This will allow setting both font-size and line-height as well as font-family. Defaults to `12px/14px sans-serif`.
   * @default "12px/14px sans-serif"
   */
  font?: string;
  width?: number;
  height?: number;
  x?: number;
  align?: CSS_TEXT_ALIGN | SVG_TEXT_ALIGN;
  valign?: VERTICAL_ALIGN;
  overflow?: OVERFLOW;
  parser?: Parser;
  createElement?: ElementFactory;
}

export class Token {
  value: string;
  weight: FontWeight;
  style: string | FontStyle;
  font: string | Font;
  href: string | null;
  sub: boolean;
  sup: boolean;

  clone(): Token;

  valueOf(): string;

  toString(): string;
}

export class Break extends Token {}
export class LineBreak extends Token {}
export class SoftHyphen extends Token {}

export type Parser = (text: string) => Token[];

export type ElementFactory = (
  tag: string,
  attrs?: { [key: string]: string },
  children?: string[] | string | Element[] | Element
) => Element;

export default class Textbox {
  constructor(options: TextboxOptions);

  /**
   * Define what font to use. This will allow setting both font-size and line-height as well as font-family. Defaults to `12px/14px sans-serif`.
   */
  font(): string;
  font(font: string): this;

  /**
   * Controls the horizontal dimension of the text. This can be a callback function if you want runaround text layout, or to flow the text into irregular space. Defaults to Infinity (a single line).
   * A callback provided to this will be called every line with the line number as a parameter.
   */
  width(): number;
  width(w: number): this;

  /**
   * Controls the vertical dimension of the text. Defaults to Infinity. If the text ends up with more lines than fit into the height, the text is cut and postfixed with an overflow indicator
   */
  height(): number;
  height(h: number): this;

  /**
   * Sets per-line text horizontal indent. This is most useful for flowing text into irregular shapes. A callback provided to this will be called every line with the line number as a parameter.
   */
  x(): number;
  x(x: number): this;

  /**
   * Sets text horizontal alignment. Accepts all values you would expect CSS text-align to understand, as well as SVG text-anchor equivalents: left, start, center, middle, right, end, and justify.
   */
  align(): CSS_TEXT_ALIGN | SVG_TEXT_ALIGN;
  align(align: CSS_TEXT_ALIGN | SVG_TEXT_ALIGN): this;

  /**
   * Sets text vertical alignment. Accepts all values you would expect CSS `vertical-align` to understand: `top`, `start`, `center`, `middle`, `bottom`, and `end`.
   */
  valign(): VERTICAL_ALIGN;
  valign(align: VERTICAL_ALIGN): this;

  /**
   * Sets text overflow mark, similar to CSS `text-overflow`. The keyword `ellipsis` will set the overflow mark to `…`, otherwise the provided string is used as-is.
   */
  overflow(): OVERFLOW;
  overflow(indicator: OVERFLOW): this;

  /**
   * Sets text per-line overflow mark, similar to `.overflow`. This setting is off by default. The keyword `ellipsis` will set the overflow mark to `…`, otherwise the provided string is used as-is..
   */
  overflowline(indicator: OVERFLOW): number;

  /**
   * Sets whether textbox should line-break within a word to prevent text from overflowing. This setting is `normal` by default which allows words to exceed the current line-width (unless line-overflow is set). Alternatively it may be set to `break-word` which will force a break mid-words.
   */
  overflowWrap(): "normal" | "break-word";
  overflowWrap(indicator: "normal" | "break-word"): this;

  /**
   * Selects which text parser to use. The available parsers are:
   *
   *  - `Textbox.textparser` (the default, may be selected with `"text"`)
   *  - `Textbox.htmlparser` (may be selected with `"html"`)
   *  - `Textbox.latexparser` (may be selected with `"latext"`)
   *
   * Textbox will look for a parser on the instance first, then default to `Textbox.defaultparser`. So you if you know that you will exclusively be using the HTML parser, you can change the default once:
   *   `Textbox.defaultparser = Textbox.htmlparser;`
   */
  parser(): Parser;
  parser(parser: Parser): this;

  createElement(fn: ElementFactory): this;

  /**
   * Parses text, flows it into the set dimensions and returns a list of the lines. The returned object can then be passed on to `.render()`.
   * As well as a list of lines of tokens, the lines object has a height property which is useful if you want to set the render destination to the fit the text.
   * The lines object additionally has a render method so you can pass it on without having the originating Textbox instance.
   */
  linebreak(text: string): Lines;

  static createElement: ElementFactory;
  static textparser: Parser;
  static htmlparser: Parser;
  static latexparser: Parser;
  static defaultparser: Parser;
  static measureText: (text: string, font: string) => number;
}

export interface Font {
  family: string;
  size: number;
  weight: FontWeight;
  variant: FontVariant;
  id: string;
  height: number;
  color: string;
}

export interface Line extends Token {
  width: number;
  font: Font;
}

export interface Lines extends Array<Line> {
  height: number;
  width: number;
}

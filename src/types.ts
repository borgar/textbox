import type { Token } from './parser/tokens.js';

/** Text alignment. */
export type Alignment = 'left' | 'center' | 'right' | 'justify';
/** Horizontal alignment. */
export type HAlignment = 'left' | 'center' | 'right';
/** Vertical alignment. */
export type VAlignment = 'top' | 'middle' | 'bottom';
/** Overflow wrap behavior. */
export type OverflowWrap = 'break-word' | 'normal';
/** Overflow indication symbol. */
/* eslint-disable-next-line */
export type Overflow = 'ellipsis' | string;
/** Font style. */
export type FontStyle = 'normal' | 'italic';
/** Font variant. */
export type FontVariant = 'normal' | 'small-caps';

/** Additional properties for linebroken text. */
export type LinesProps = {
  /** Does any line have line-overflow? */
  hasLineOverflow: boolean;
  /** Did the text overflow? */
  hasOverflow: boolean;
  /** Height of the layed-out text. */
  height: number;
  /** Width of the layed-out text. */
  width: number;
  /** Default font properties used. */
  font: FontProps;
};

/** A (linebroken) line of Tokens */
export type Line = Token[] & { width: number };
/** A collection of flowed text lines & their properties.  */
export type Lines = Line[] & LinesProps;

/** A collection of font properties or styles. */
export type FontProps = {
  /**
   * Name of the font's type family.
   */
  family?: string;
  /**
   * Style of the font (italics or not).
   */
  style?: FontStyle;
  /**
   * Variant of the font (Small-Caps or not).
   */
  variant?: FontVariant;
  /**
   * Weight of the font as a number (400 is regular).
   */
  weight?: number;
  /**
   * Height of the leading (line-height).
   */
  height?: number;
  /**
   * Size of the font in pixels.
   */
  size?: number;
  /**
   * Size adjustment multiplier (such as for sub-/superscript).
   */
  sizeAdjust?: number;
  /**
   * Baseline adjustment factor (such as for sub-/superscript).
   */
  baseline?: number;
  /**
   * Tracking (multiplier) for the text.
   */
  tracking?: number;
  /**
   * Color of the text.
   */
  color?: string;
  /**
   * HREF URL property for the text.
   */
  href?: string;
  /**
   * Rel identifier to be applied to emitted link elements (use with href).
   */
  rel?: string;
  /**
   * Link target identifier to be applied to emitted link elements (use with href).
   */
  target?: string;
  /**
   * Class identifier to be applied to emitted elements.
   */
  class?: string;
};

/**
 * A function accepting a line number that emits a width or height in pixels.
 */
export type NumberLineFunc = (line?: number) => number;

/**
 * A function that emits a width or height in pixels.
 */
export type NumberFunc = () => number;

/**
 * Factory function for constructing SVG elements.
 */
export type CreateElementFunc = (
  name: string,
  props?: | Record<string, string | number | boolean | null> | null,
  ...children: (string | SVGElement | undefined | null)[]
) => SVGElement;

/** Options for text measuring. */
export type MeasureOptions = {
  /**
   * Should the text be trimmed before measuring?
   * @defaultValue true
   */
  trim?: boolean;
  /**
   * Should whitespace in the text get collapsed (like in HTML)?
   * @defaultValue true
   */
  collapse?: boolean;
};

/**
 * Options for a textbox and how text flows inside it.
 */
export type LayoutOptions = {
  /**
   * Default font to use (as CSS shorthand).
   * @defaultValue Infinity
   */
  font: string,
  /**
   * The symbol to use when indicating text overflow ("…").
   * @defaultValue "ellipsis"
   */
  overflow: Overflow,
  /**
   * Symbol to use when indicating line overflow, or "" when line overflow is off.
   * @defaultValue ""
   */
  overflowLine: Overflow,
  /**
   * Whether breaks should be inserted within an otherwise unbreakable word to prevent overflowing the textbox.
   * @defaultValue "normal"
   */
  overflowWrap: OverflowWrap,
  /**
   * Vertical alignment of the text.
   * @defaultValue "left"
   */
  valign: VAlignment,
  /**
   * Horizontal alignment of the text.
   * @defaultValue "top"
   */
  align: Alignment,
  /**
   * Width of the textbox in pixels.
   * @defaultValue Infinity
   */
  width: number | NumberLineFunc,
  /**
   * Height of the textbox in pixels.
   * @defaultValue Infinity
   */
  height: number | NumberFunc,
  /**
   * Line horizontal offset factor or per-line callback to control horizontal offset.
   * @defaultValue 0
   */
  x: number | NumberLineFunc,
  /**
   * Which parser to use when parsing text input.
   * @defaultValue Textbox.defaultparser
   */
  parser: (text: string) => Token[],
  /**
   * Factory function to use when constructing SVG elements.
   * @defaultValue Infinity
   */
  createElement: CreateElementFunc,
};

/**
 * Options for the Rotator class
 */
export type RotatorOptions = {
  /**
   * An anchor point for the rotation orientation (such as `top center`)
   * @defaultValue "top left"
   */
  anchor: string,
  /**
   * Width of the rotated box (in pixels)
   * @defaultValue Infinity
   */
  width: number,
  /**
   * Height of the rotated box (in pixels)
   * @defaultValue Infinity
   */
  height: number,
  /**
   * Rotation of the content (in degrees)
   * @defaultValue 0
   */
  rotate: number,
  /**
   * SVG Element factory
   * @defaultValue Rotator.createElement
   */
  createElement: CreateElementFunc
};

/**
 * Minimal CanvasRenderingContext2D interface needed.
 */
export type MinimalCanvasContext = {
  font: string;
  measureText: (text: string) => { width: number };
};

/**
 * Minimal Canvas interface needed.
 */
export type MinimalCanvas = {
  getContext: (contextId: '2d') => MinimalCanvasContext | null;
};

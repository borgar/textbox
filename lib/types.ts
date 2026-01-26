import type { createElement } from './createElement.ts';
import type { Token } from './parser/tokens.js';

export type Alignment = 'left' | 'center' | 'right' | 'justify';
export type VAlignment = 'top' | 'middle' | 'bottom';
export type OverflowWrap = 'break-word' | 'normal';
/* eslint-disable-next-line */
export type Overflow = 'ellipsis' | string;
export type FontStyle = 'normal' | 'italic';
export type FontVariant = 'normal' | 'small-caps';

export type LinesProps = {
  hasLineOverflow: boolean;
  hasOverflow: boolean;
  height: number;
  width: number;
  font: FontProps;
};

export type LinesPropsRender = {
  draw: () => void;
  render: () => void;
  svg: () => void;
};

export type TokenWithWidth = Token & { width: number };
export type Line = TokenWithWidth[] & { width: number };
export type Lines = Line[] & LinesProps;

export type MeasureOptions = {
  trim?: boolean;
  collapse?: boolean;
};

export type FontProps = {
  family?: string;
  style?: FontStyle;
  variant?: FontVariant;
  weight?: number;
  height?: number;
  size?: number;
  sizeAdjust?: number;
  baseline?: number;
  tracking?: number;
  href?: string;
  color?: string;
  rel?: string;
  target?: string;
  class?: string;
};

export type NumberLineFunc = (line?: number) => number;
export type NumberFunc = () => number;

export type LayoutOptions = {
  font: string,
  overflow: Overflow,
  overflowLine: Overflow,
  overflowWrap: OverflowWrap,
  valign: VAlignment,
  align: Alignment,
  width: number | NumberLineFunc,
  height: number | NumberFunc,
  x: number | NumberLineFunc,
  parser: (text: string) => Token[],
  createElement: typeof createElement,
};

export type RotatorOptions = {
  anchor: string,
  width: number,
  height: number,
  rotate: number,
  createElement: typeof createElement
};

export type CanvasContext = {
  font: string;
  measureText: (text: string) => { width: number };
};

export type CanvasPartial = {
  getContext: (contextId: '2d') => CanvasContext | null;
};

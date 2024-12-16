import { Token } from './parser/tokens.js';

/**
 * @typedef {'left' | 'center' | 'right' | 'justify'} Alignment
 *
 * @typedef {'top' | 'middle' | 'bottom'} VAlignment
 *
 * @typedef {'break-word' | 'normal'} OverflowWrap
 *
 * @typedef {'ellipsis' | string} Overflow
 *
 * @typedef {'normal' | 'italic'} FontStyle
 *
 * @typedef {'normal' | 'small-caps'} FontVariant
 *
 * @typedef LinesProps
 * @prop {boolean} hasLineOverflow
 * @prop {boolean} hasOverflow
 * @prop {number} height
 * @prop {number} width
 * @prop {import("./Font.js").Font} font
 *
 * @typedef LinesPropsRender
 * @prop {() => void} draw
 * @prop {() => void} render
 * @prop {() => void} svg
 *
 * @typedef {Token[][] & LinesProps} Lines
 *
 * @typedef MeasureOptions
 * @prop {boolean} [trim=true] Trim the string before measuring.
 * @prop {boolean} [collapse=true] Collapse whitespace (HTML style)
 */

export default null;

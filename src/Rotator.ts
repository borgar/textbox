import { createElement } from './createElement.ts';
import type { CreateElementFunc, HAlignment, LayoutOptions, RotatorOptions, VAlignment } from './types.ts';

const alignMap = {
  top:    -0.0,
  middle: -0.5,
  bottom: -1.0,
  left:   -0.0,
  center: -0.5,
  right:  -1.0
};

/**
 * A convenience utility class to assist rotating text.
 */
export class Rotator {
  static createElement = createElement;

  /** @internal */
  props: {
    width: number;
    height: number;
    rotation: number;
    align: HAlignment;
    valign: VAlignment;
    createElement: CreateElementFunc,
  };

  constructor (opts: RotatorOptions) {
    this.props = {
      width: Infinity,
      height: Infinity,
      rotation: 0,
      align: 'left',
      valign: 'top',
      createElement: Rotator.createElement
    };
    if (opts) {
      for (const key in opts) {
        if (typeof this[key] === 'function') {
          this[key](opts[key]);
        }
      }
    }
    this.render = this.render.bind(this);
  }

  /**
   * Origin point of the rotation
   */
  get origin (): [ number, number ] {
    const { align, valign, width, height } = this.props;
    return [ alignMap[align] * width, alignMap[valign] * height ];
  }

  /**
   * A convenience method to set or get a rotation anchor.
   *
   * A rotation anchor controls the origin point of the rotation relative to textbox.
   * It is a string of one or more of alignment keywords separated by spaces.
   *
   * Keywords: [ `top`, `middle`, `bottom`, `left`, `center`, `right` ].
   *
   * By default it is set to `"top left"`
   */
  anchor (): string;
  anchor (anchor: string): this;
  anchor (anchor?: string): string | this {
    if (!arguments.length) {
      return `${this.props.align} ${this.props.valign}`;
    }
    if (typeof anchor === 'string') {
      const dir = anchor.toLowerCase().trim().split(/[\s,;]+/);
      for (const d of dir) {
        if (d === 'top' || d === 'middle' || d === 'bottom') {
          this.valign(d);
        }
        if (d === 'left' || d === 'center' || d === 'right') {
          this.align(d);
        }
      }
    }
    return this;
  }

  /**
   * Controls the vertical anchor point of the rotation.
   *
   * By default this will be set to `"top"`.
   */
  valign (): VAlignment;
  valign (align: VAlignment): this;
  valign (align?: VAlignment): this | VAlignment {
    if (!arguments.length) {
      return this.props.valign;
    }
    this.props.valign = align ?? 'top';
    return this;
  }

  /**
   * Controls the horizontal alignment of the text.
   *
   * By default this will be set to `"left"`.
   */
  align (): HAlignment;
  align (align: HAlignment): this;
  align (align?: HAlignment): this | HAlignment {
    if (!arguments.length) {
      return this.props.align;
    }
    this.props.align = align ?? 'left';
    return this;
  }

  /**
   * Controls the width of the rotation box in pixels.
   *
   * By default this will be set to `Infinity`.
   */
  width (): number;
  width (width: number): this;
  width (width?: number): this | number {
    if (!arguments.length) {
      return this.props.width;
    }
    this.props.width = width ?? Infinity;
    return this;
  }

  /**
   * Controls the height of the rotation box in pixels.
   *
   * By default this will be set to `Infinity`.
   */
  height (): number;
  height (height: number): this;
  height (height?: number): this | number {
    if (!arguments.length) {
      return this.props.height;
    }
    this.props.height = height ?? Infinity;
    return this;
  }

  /**
   * Controls the angle of rotation in degrees.
   *
   * By default this will be set to `0`.
   */
  rotate (): number;
  rotate (degrees: number): this;
  rotate (degrees?: number): this | number {
    if (!arguments.length) {
      return this.props.rotation;
    }
    this.props.rotation = degrees ?? 0;
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
    this.props.createElement = factory ?? Rotator.createElement;
    return this;
  }

  /**
   * Set up a rotated context for additional rendering.
   *
   * The method will set up a rotated context, call the supplied callback argument
   * with a CanvasRenderingContext2D as its argument, and then clean up.
   */
  renderCanvas (
    callback: (ctx: CanvasRenderingContext2D) => void,
    target: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D
  ) {
    const ctx = 'getContext' in target ? target.getContext('2d') : target;
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.save();
      ctx.rotate(this.rotate() * Math.PI / 180);
      ctx.translate(...this.origin);
      callback(ctx);
      ctx.restore();
    }
  }

  /**
   * Render an SVG <g> element that is rotated around its origin point and
   * place the given content inside it.
   */
  renderSVG (content: SVGElement) {
    return this.props.createElement('g', {
      transform: `rotate(${this.rotate()}) translate(${this.origin.join(',')})`
    }, content);
  }

  /**
   * Render onto a Canvas or as an SVG element based on whether a canvas based
   * target was supplied or not.
   *
   * @deprecated
   */
  render (contentOrCallback: SVGElement): SVGElement;
  render (contentOrCallback: () => void, ctx: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D): void;
  render (
    contentOrCallback: SVGElement | (() => void),
    ctx?: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D
  ): SVGElement | void {
    if (typeof contentOrCallback === 'function') {
      if (ctx) {
        return this.renderCanvas(contentOrCallback, ctx);
      }
    }
    else if (contentOrCallback instanceof SVGElement) {
      return this.renderSVG(contentOrCallback);
    }
  }
}

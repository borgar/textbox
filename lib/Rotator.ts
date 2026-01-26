import { createElement } from './createElement.ts';
import type { LayoutOptions, RotatorOptions } from './types.ts';

const alignMap = {
  top:    { vAnchor: -0.0 },
  middle: { vAnchor: -0.5 },
  bottom: { vAnchor: -1.0 },
  left:   { hAnchor: -0.0 },
  center: { hAnchor: -0.5 },
  right:  { hAnchor: -1.0 }
};

export class Rotator {
  static createElement = createElement;

  props: {
    width: number;
    height: number;
    rotation: number;
    vAnchor: number;
    hAnchor: number;
    createElement: typeof createElement,
  };

  constructor (opts: RotatorOptions) {
    this.props = {
      width: Infinity,
      height: Infinity,
      rotation: 0,
      vAnchor: 0,
      hAnchor: 0,
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

  anchor (): [number, number];
  anchor (v: string): this;
  anchor (v?: string): [ number, number ] | this {
    const { hAnchor, vAnchor, width, height } = this.props;
    if (!arguments.length) {
      return [ hAnchor * width, vAnchor * height ];
    }
    if (typeof v === 'string') {
      v.toLowerCase()
        .trim()
        .split(/\s+/)
        .forEach(d => Object.assign(this.props, alignMap[d]));
    }
    return this;
  }

  width (): number;
  width (v: number): this;
  width (v?: number): this | number {
    if (!arguments.length) {
      return this.props.width;
    }
    this.props.width = v ?? Infinity;
    return this;
  }

  height (): number;
  height (v: number): this;
  height (v?: number): this | number {
    if (!arguments.length) {
      return this.props.height;
    }
    this.props.height = v ?? Infinity;
    return this;
  }

  rotate (): number;
  rotate (v: number): this;
  rotate (v?: number): this | number {
    if (!arguments.length) {
      return this.props.rotation;
    }
    this.props.rotation = v ?? 0;
    return this;
  }

  createElement (): LayoutOptions['createElement'];
  createElement (factory: LayoutOptions['createElement']): this;
  createElement (factory?: LayoutOptions['createElement']): this | LayoutOptions['createElement'] {
    if (!arguments.length) {
      return this.props.createElement;
    }
    this.props.createElement = factory ?? Rotator.createElement;
    return this;
  }

  renderCanvas (
    callback: (ctx: CanvasRenderingContext2D) => void,
    target: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D
  ) {
    const ctx = 'getContext' in target ? target.getContext('2d') : target;
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.save();
      ctx.rotate(this.rotate() * Math.PI / 180);
      ctx.translate(...this.anchor());
      callback(ctx);
      ctx.restore();
    }
  }

  renderSVG (content: SVGElement) {
    return this.props.createElement('g', {
      transform: `rotate(${this.rotate()}) translate(${this.anchor().join(',')})`
    }, content);
  }

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

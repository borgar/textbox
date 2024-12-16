import { argmap } from './argmap.js';
import { createElement } from './createElement.js';

const toFunction = ƒ => ((typeof ƒ === 'function') ? ƒ : () => ƒ);

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

  constructor (opts) {
    this.props = {
      width: () => Infinity,
      height: () => Infinity,
      rotation: 0,
      vAnchor: 0,
      hAnchor: 0
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
   * @overload
   * @return {[ number, number ]}
   *//**
   * @overload
   * @param {string} v
   * @return {this}
   */
  anchor (v) {
    const { hAnchor, vAnchor, width, height } = this.props;
    if (!arguments.length) {
      return [
        hAnchor * width(),
        vAnchor * height()
      ];
    }
    if (typeof v === 'string') {
      const props = this.props;
      v.toLowerCase()
        .trim()
        .split(/\s+/)
        .forEach(d => Object.assign(props, alignMap[d]));
    }
    return this;
  }

  /**
   * @overload
   * @return {() => number}
   *//**
   * @overload
   * @param {number} v
   * @return {this}
   */
  width (v) {
    if (!arguments.length) {
      return this.props.width;
    }
    this.props.width = toFunction(v);
    return this;
  }

  /**
   * @overload
   * @return {() => number}
   *//**
   * @overload
   * @param {number} v
   * @return {this}
   */
  height (v) {
    if (!arguments.length) {
      return this.props.height;
    }
    this.props.height = toFunction(v);
    return this;
  }

  /**
   * @overload
   * @return {number}
   *//**
   * @overload
   * @param {number} v
   * @return {this}
   */
  rotate (v) {
    if (!arguments.length) {
      return this.props.rotation;
    }
    this.props.rotation = v;
    return this;
  }

  createElement (_) {
    if (!arguments.length) {
      return this.props.createElement || Rotator.createElement;
    }
    this.props.createElement = _;
    return this;
  }

  canvas (c, callback) {
    const ctx = c.getContext ? c.getContext('2d') : c;
    ctx.save();
    ctx.rotate(this.rotate() * Math.PI / 180);
    ctx.translate(...this.anchor());
    callback(ctx);
    ctx.restore();
    return ctx;
  }

  render (...args) {
    const s = argmap(args);
    if (s.d3) {
      return s.d3.attr('transform', `rotate(${this.rotate()}) translate(${this.anchor()})`);
    }
    else if (s.ctx) {
      return this.canvas(s.ctx, s.fn);
    }
    else if (s.text) {
      const ch = (typeof s.text.render === 'function') ? s.text.render() : s.text;
      return this.createElement()('g', {
        transform: `rotate(${this.rotate()}) translate(${this.anchor()})`
      }, ch);
    }
  }
}

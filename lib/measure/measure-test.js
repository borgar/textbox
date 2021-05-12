/* eslint-disable prefer-const, no-multi-str, quotes, no-multiple-empty-lines */
import test from 'tape';
import measure, { getCanvasHandler, getSvgHandler, getDumbHandler } from '.';

test('measure.getCanvasHandler()', t => {
  // faking the canvas interface
  const d = {
    createElement: () => {
      return {
        getContext: () => {
          return { measureText: () => ({ width: 36 }) };
        }
      };
    }
  };
  const c = getCanvasHandler(d);
  t.equal(typeof c, 'function', 'returns function');
  t.equal(c('TEST', '20px sans-serif'), 36, 'measures text');
  t.end();
});

test('measure.getSVGHandler()', t => {
  // faking the DOM interface
  const d = {
    documentElement: { appendChild: () => {} },
    createTextNode: () => { },
    createElementNS: () => {
      return {
        createSVGRect: () => {},
        setAttribute: () => {},
        appendChild: () => {},
        getComputedTextLength: () => 36,
        firstChild: {}
      };
    }
  };
  const c = getSvgHandler(d);
  t.equal(typeof c, 'function', 'returns function');
  t.equal(c('TEST', '20px sans-serif'), 36, 'measures text');
  t.end();
});

test('measure.getDumbHandler()', t => {
  const c = getDumbHandler();
  t.equal(typeof c, 'function', 'returns function');
  t.equal(c('TEST', '20px sans-serif'), 36, 'measures text');
  t.end();
});

test('measure()', t => {
  // eslint-disable-next-line
  const token = new String('TEST');
  t.equal(
    measure(token, { size: 20, family: 'sans-serif' }, false),
    36, 'measures given token');
  t.equal(
    measure(token, { size: 20, family: 'sans-serif' }, true),
    45, 'measures given token (with shy)');
  t.end();
});

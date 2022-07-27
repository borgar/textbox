/* eslint-disable prefer-const, no-multi-str, quotes, no-multiple-empty-lines */
import test from 'tape';
import measure, { getCanvasHandler, getDumbHandler } from './index.js';

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
    measure(token, { size: 20, family: 'sans-serif' }),
    36, 'measures given token');
  t.equal(
    measure('test', { size: 20, family: 'sans-serif' }),
    36, 'measures given token');
  t.end();
});

test('measure() with whitespace trimming', t => {
  const token = 'TEST';
  const tokenWithWhitespace = '   TEST ';
  const font = { size: 20, family: 'sans-serif' };
  t.equal(
    measure(token, font),
    measure(tokenWithWhitespace, font),
    'measures given token');
  t.end();
});

test('measure() without whitespace trimming', t => {
  const token = 'TEST';
  const tokenWithWhitespace = '   TEST ';
  const font = { size: 20, family: 'sans-serif' };
  t.ok(
    measure(token, font, false) <
      measure(tokenWithWhitespace, font, { trim: false }),
    'measure can include trailing whitespace'
  );
  t.end();
});

test('measure() without collapsing whitespace', t => {
  const token = 'A TEST';
  const tokenWithWhitespace = 'A  TEST';
  const font = { size: 20, family: 'sans-serif' };
  t.ok(
    measure(token, font, false) <
      measure(tokenWithWhitespace, font, { collapse: false }),
    'measure can leave repeated whitespace alone'
  );
  t.end();
});

test('measure() handles newlines when not trimming or collapsing whitespace', t => {
  const tokenWithWhitespace = 'A   TEST ';
  const tokenWithNewLines = 'A \n TEST\n';
  const font = { size: 20, family: 'sans-serif' };
  t.equal(
    measure(tokenWithWhitespace, font, { test: false, collapse: true }),
    measure(tokenWithNewLines, font, { test: false, collapse: true }),
    'Newlines count as spaces when not trimming whitespace'
  );
  t.equal(
    measure(tokenWithWhitespace, font, { test: true, collapse: false }),
    measure(tokenWithNewLines, font, { test: true, collapse: false }),
    'Newlines count as spaces when not collapsing whitespace'
  );
  t.equal(
    measure(tokenWithWhitespace, font, { test: false, collapse: false }),
    measure(tokenWithNewLines, font, { test: false, collapse: false }),
    'Newlines count as spaces when neither trimming nor collapsing whitespace'
  );
  t.end();
});

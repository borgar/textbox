import test from 'tape';
import { measureText, setMeasureCanvas, getDumbHandler } from './measureText.js';
import { Token } from './parser/tokens.js';

test('setMeasureCanvas()', t => {
  // faking the canvas interface
  const mockCanvas = {
    getContext: () => {
      return { font: '', measureText: () => ({ width: 36 }) };
    }
  };
  setMeasureCanvas(mockCanvas);
  t.equal(measureText('TEST', '20px sans-serif'), 36, 'measures text');
  setMeasureCanvas(null);
  t.end();
});

test('measureText.getDumbHandler()', t => {
  const c = getDumbHandler();
  t.equal(typeof c, 'function', 'returns function');
  t.equal(c('TEST', '20px sans-serif'), 36, 'measures text');
  t.end();
});

test('measureText()', t => {
  const token = new Token('TEST');
  const font = '20px sans-serif';
  t.equal(
    measureText(token, font),
    36, 'measures given token'
  );
  t.equal(
    measureText('test', font),
    36, 'measures given token'
  );
  t.end();
});

test('measureText() with whitespace trimming', t => {
  const token = 'TEST';
  const tokenWithWhitespace = '   TEST ';
  const font = '20px sans-serif';
  t.equal(
    measureText(token, font),
    measureText(tokenWithWhitespace, font),
    'measures given token'
  );
  t.end();
});

test('measureText() without whitespace trimming', t => {
  const token = 'TEST';
  const tokenWithWhitespace = '   TEST ';
  const font = '20px sans-serif';
  t.ok(
    measureText(token, font) < measureText(tokenWithWhitespace, font, { trim: false }),
    'measure can include trailing whitespace'
  );
  t.end();
});

test('measureText() without collapsing whitespace', t => {
  const token = 'A TEST';
  const tokenWithWhitespace = 'A  TEST';
  const font = '20px sans-serif';
  t.ok(
    measureText(token, font) < measureText(tokenWithWhitespace, font, { collapse: false }),
    'measure can leave repeated whitespace alone'
  );
  t.end();
});

test('measureText() handles newlines when not trimming or collapsing whitespace', t => {
  const tokenWithWhitespace = 'A   TEST ';
  const tokenWithNewLines = 'A \n TEST\n';
  const font = '20px sans-serif';
  t.equal(
    measureText(tokenWithWhitespace, font, { trim: false, collapse: true }),
    measureText(tokenWithNewLines, font, { trim: false, collapse: true }),
    'Newlines count as spaces when not trimming whitespace'
  );
  t.equal(
    measureText(tokenWithWhitespace, font, { trim: true, collapse: false }),
    measureText(tokenWithNewLines, font, { trim: true, collapse: false }),
    'Newlines count as spaces when not collapsing whitespace'
  );
  t.equal(
    measureText(tokenWithWhitespace, font, { trim: false, collapse: false }),
    measureText(tokenWithNewLines, font, { trim: false, collapse: false }),
    'Newlines count as spaces when neither trimming nor collapsing whitespace'
  );
  t.end();
});

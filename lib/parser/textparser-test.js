/* eslint-disable prefer-const, no-multi-str, quotes, no-multiple-empty-lines */
import test from 'tape';
import parse from './textparser.js';
import { Token, Break, LineBreak, SoftHyphen } from './tokens.js';

function toJSON (t) {
  if (!t) { return t; }
  const r = {};
  if (t instanceof Break) {
    r.type = 'BR';
  }
  else if (t instanceof LineBreak) {
    r.type = 'NL';
  }
  else if (t instanceof SoftHyphen) {
    r.type = 'SH';
  }
  else if (t instanceof Token) {
    r.type = 'TK';
    r.val = t.value;
  }
  if (t.sub) { r.sub = true; }
  if (t.sup) { r.sup = true; }
  if (t.style) { r.style = String(t.style); }
  if (t.weight) { r.weight = String(t.weight); }
  if (t.href) { r.href = String(t.href); }
  if (t.family) { r.family = String(t.family); }
  if (t.color) { r.color = String(t.color); }
  return r;
}


test('text parse', t => {
  t.deepEqual(
    parse('simple text').map(toJSON),
    [
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: ' ' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ],
    'simple text'
  );

  t.deepEqual(
    parse('simple  text').map(toJSON),
    [
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: ' ' },
      { type: 'BR' },
      { type: 'TK', val: ' ' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ],
    'simple  text'
  );

  t.deepEqual(
    parse('simple\ntext').map(toJSON),
    [
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: '\n' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ],
    'simple\\ntext'
  );

  t.deepEqual(
    parse('simple\n\ntext').map(toJSON),
    [
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: '\n' },
      { type: 'BR' },
      { type: 'TK', val: '\n' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ],
    'simple\\n\\ntext'
  );

  t.deepEqual(
    parse('simple-text').map(toJSON),
    [
      { type: 'TK', val: 'simple-' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ],
    'simple-text'
  );

  t.deepEqual(
    parse('simple?text').map(toJSON),
    [
      { type: 'TK', val: 'simple?' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ],
    'simple?text'
  );

  t.deepEqual(
    parse('simple$text').map(toJSON),
    [
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: '$text' }
    ],
    'simple$text'
  );

  t.deepEqual(
    parse('simple%text').map(toJSON),
    [
      { type: 'TK', val: 'simple%' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ],
    'simple%text'
  );

  t.deepEqual(
    parse('simple–text').map(toJSON),
    [
      { type: 'TK', val: 'simple–' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ],
    'simple–text'
  );

  t.deepEqual(
    parse('simple\u00ADtext').map(toJSON),
    [
      { type: 'TK', val: 'simple' },
      { type: 'SH' },
      { type: 'TK', val: 'text' }
    ],
    'simple\u00ADtext'
  );

  t.deepEqual(
    parse('这是“只是一些”混乱。').map(toJSON),
    [
      { type: 'TK', val: '这' },
      { type: 'BR' },
      { type: 'TK', val: '是' },
      { type: 'BR' },
      { type: 'TK', val: '“只' },
      { type: 'BR' },
      { type: 'TK', val: '是' },
      { type: 'BR' },
      { type: 'TK', val: '一' },
      { type: 'BR' },
      { type: 'TK', val: '些”' },
      { type: 'BR' },
      { type: 'TK', val: '混' },
      { type: 'BR' },
      { type: 'TK', val: '乱。' }
    ],
    '这是“只是一些”混乱。'
  );

  t.end();
});

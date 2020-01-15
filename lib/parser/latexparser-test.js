/* eslint-disable prefer-const, no-multi-str, quotes, no-multiple-empty-lines */
import test from 'tape';
import parse from './latexparser';
import { Token, Break, LineBreak, SoftHyphen } from './tokens';

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


test('latex parse', t => {
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

  // unknowns are passed through
  t.deepEqual(
    parse('\\usepackage{hyperref}').map(toJSON),
    [
      { type: 'TK', val: '\\usepackage' },
      { type: 'TK', val: 'hyperref' }
    ],
    '\\usepackage{hyperref}'
  );

  t.deepEqual(
    parse('<<foo>>').map(toJSON),
    [
      { type: 'TK', val: '«foo»' }
    ],
    '<<foo>>'
  );

  t.deepEqual(
    parse(',,foo``').map(toJSON),
    [
      { type: 'TK', val: '„foo“' }
    ],
    ',,foo``'
  );

  t.deepEqual(
    parse('foo~bar').map(toJSON),
    [
      { type: 'TK', val: 'foo' },
      { type: 'BR' },
      { type: 'TK', val: '\u00A0' },
      { type: 'BR' },
      { type: 'TK', val: 'bar' }
    ],
    'foo~bar'
  );

  t.deepEqual(
    parse('foo-bar').map(toJSON),
    [
      { type: 'TK', val: 'foo-' },
      { type: 'BR' },
      { type: 'TK', val: 'bar' }
    ],
    'foo-bar'
  );

  t.deepEqual(
    parse('foo\\-bar').map(toJSON),
    [
      { type: 'TK', val: 'foo' },
      { type: 'SH' },
      { type: 'TK', val: 'bar' }
    ],
    'foo\\-bar'
  );

  t.deepEqual(
    parse('foo\\,bar').map(toJSON),
    [
      { type: 'TK', val: 'foo' },
      { type: 'BR' },
      { type: 'TK', val: '\u2009' },
      { type: 'BR' },
      { type: 'TK', val: 'bar' }
    ],
    'foo\\,bar'
  );

  t.deepEqual(
    parse('foo\\\\bar').map(toJSON),
    [
      { type: 'TK', val: 'foo' },
      { type: 'NL' },
      { type: 'TK', val: 'bar' }
    ],
    'foo\\\\bar'
  );

  t.deepEqual(
    parse('foo\\\\bar').map(toJSON),
    [
      { type: 'TK', val: 'foo' },
      { type: 'NL' },
      { type: 'TK', val: 'bar' }
    ],
    'foo\\\\bar'
  );

  t.deepEqual(
    parse('\\bf{foo}').map(toJSON),
    [
      { type: 'TK', val: 'foo', weight: 'bold' }
    ],
    '\\bf{bold}'
  );

  t.deepEqual(
    parse('\\it{foo}').map(toJSON),
    [
      { type: 'TK', val: 'foo', style: 'italic' }
    ],
    '\\it{bold}'
  );

  t.deepEqual(
    parse('\\sl{foo}').map(toJSON),
    [
      { type: 'TK', val: 'foo', style: 'italic' }
    ],
    '\\sl{bold}'
  );

  t.deepEqual(
    parse('\\color{red}{foo}').map(toJSON),
    [
      { type: 'TK', val: 'foo', color: 'red' }
    ],
    '\\color{red}{foo}'
  );

  t.deepEqual(
    parse('\\color{red}{\\color{blue}{foo}}').map(toJSON),
    [
      { type: 'TK', val: 'foo', color: 'blue' }
    ],
    '\\color{red}{\\color{blue}{foo}}'
  );

  t.deepEqual(
    parse('\\href{http://example.com/}{foo}').map(toJSON),
    [
      { type: 'TK', val: 'foo', href: 'http://example.com/' }
    ],
    '\\href{http://example.com/}{foo}'
  );

  t.deepEqual(
    parse('_{foo}').map(toJSON),
    [
      { type: 'TK', val: 'foo', sub: true }
    ],
    '_{foo}'
  );

  t.deepEqual(
    parse('^{foo}').map(toJSON),
    [
      { type: 'TK', val: 'foo', sup: true }
    ],
    '^{foo}'
  );

  t.deepEqual(
    parse('^foo').map(toJSON),
    [
      { type: 'TK', val: 'foo', sup: true }
    ],
    '^foo'
  );

  t.deepEqual(
    parse('^{fo}o').map(toJSON),
    [
      { type: 'TK', val: 'fo', sup: true },
      { type: 'TK', val: 'o' }
    ],
    '^{fo}o'
  );

  t.deepEqual(
    parse('^{fo}o').map(toJSON),
    [
      { type: 'TK', val: 'fo', sup: true },
      { type: 'TK', val: 'o' }
    ],
    '^{fo}o'
  );

  t.deepEqual(
    parse('foo\\par{}foo').map(toJSON),
    [
      { type: 'TK', val: 'foo' },
      { type: 'NL' },
      { type: 'NL' },
      { type: 'TK', val: 'foo' }
    ],
    'foo\\par{}foo'
  );

  t.deepEqual(
    parse('\\verb,\\bf{foo},').map(toJSON),
    [
      { type: 'TK', val: '\\bf{foo}' }
    ],
    '\\verb,\\bf{foo},'
  );

  t.end();
});

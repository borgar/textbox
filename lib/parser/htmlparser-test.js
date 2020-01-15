/* eslint-disable prefer-const, no-multi-str, quotes, no-multiple-empty-lines */
import test from 'tape';
import parse from './htmlparser';
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

test('html parse bad markup', t => {
  // parser only responds to opening tags and nesting level
  t.deepEqual(
    parse('xx<a>xx<b>xx</a>xx</b>xx').map(toJSON),
    [
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx', weight: 'bold' },
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx' }
    ],
    'incorrect nesting'
  );

  t.deepEqual(
    parse('xx<a  >xx<b  >xx</b  >xx</a  >xx').map(toJSON),
    [
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx', weight: 'bold' },
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx' }
    ],
    'whitespace in tags'
  );

  t.deepEqual(
    parse('<foo />').map(toJSON),
    [],
    'self closing'
  );

  t.deepEqual(
    parse('<foo attr />').map(toJSON),
    [],
    'self closing with bool attr'
  );

  t.deepEqual(
    parse('<foo attr=val />').map(toJSON),
    [],
    'self closing with attr'
  );

  t.deepEqual(
    parse('<foo></foo>').map(toJSON),
    [],
    'empty tag'
  );

  t.deepEqual(
    parse('<foo attr></foo>').map(toJSON),
    [],
    'empty tag'
  );

  t.deepEqual(
    parse('<foo attr=val></foo>').map(toJSON),
    [],
    'empty tag'
  );

  t.end();
});


test('html parse markup', t => {
  t.deepEqual(
    parse('just some text').map(toJSON),
    [
      { type: 'TK', val: 'just' },
      { type: 'BR' },
      { type: 'TK', val: ' ' },
      { type: 'BR' },
      { type: 'TK', val: 'some' },
      { type: 'BR' },
      { type: 'TK', val: ' ' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ],
    'simple text parsing'
  );

  t.deepEqual(
    parse('hy&shy;phen&shy;ation').map(toJSON),
    [
      { type: 'TK', val: 'hy' },
      { type: 'SH' },
      { type: 'TK', val: 'phen' },
      { type: 'SH' },
      { type: 'TK', val: 'ation' }
    ],
    'line break is whitespace'
  );

  t.deepEqual(
    parse('line\nbreaks').map(toJSON),
    [
      { type: 'TK', val: 'line' },
      { type: 'BR' },
      { type: 'TK', val: '\n' },
      { type: 'BR' },
      { type: 'TK', val: 'breaks' }
    ],
    'line break is whitespace'
  );

  t.deepEqual(
    parse('line<br>breaks').map(toJSON),
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<br> is line break'
  );

  t.deepEqual(
    parse('<p>line</p><p>breaks</p>').map(toJSON),
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<p> causes line breaks'
  );

  t.deepEqual(
    parse('<div>line</div><div>breaks</div>').map(toJSON),
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<div> causes line breaks'
  );

  t.deepEqual(
    parse('<blockquote>line</blockquote><blockquote>breaks</blockquote>').map(toJSON),
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<blockquote> causes line breaks'
  );

  t.deepEqual(
    parse('<li>line</li><li>breaks</li>').map(toJSON),
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<li> causes line breaks'
  );

  t.deepEqual(
    parse('<h1>line</h1><h1>breaks</h1>').map(toJSON),
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<h1> causes line breaks'
  );

  t.deepEqual(
    parse('<h2>line</h2><h2>breaks</h2>').map(toJSON),
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<h2> causes line breaks'
  );

  t.deepEqual(
    parse('entity&copy;&quot;&mdash;&trade;&Phi;parsing').map(toJSON),
    [
      { type: 'TK', val: 'entity©"—' },
      { type: 'BR' },
      { type: 'TK', val: '™Φparsing' }
    ],
    '<h2> causes line breaks'
  );

  t.end();
});


test('html parse style markup', t => {
  t.deepEqual(
    parse('<b>bold</b>').map(toJSON),
    [ { type: 'TK', val: 'bold', weight: 'bold' } ],
    '<b> bold'
  );

  t.deepEqual(
    parse('<strong>bold</strong>').map(toJSON),
    [ { type: 'TK', val: 'bold', weight: 'bold' } ],
    '<strong> bold'
  );

  t.deepEqual(
    parse('<i>italic</i>').map(toJSON),
    [ { type: 'TK', val: 'italic', style: 'italic' } ],
    '<i> italic'
  );

  t.deepEqual(
    parse('<em>italic</em>').map(toJSON),
    [ { type: 'TK', val: 'italic', style: 'italic' } ],
    '<em> italic'
  );

  t.deepEqual(
    parse('<dfn>italic</dfn>').map(toJSON),
    [ { type: 'TK', val: 'italic', style: 'italic' } ],
    '<dfn> italic'
  );

  t.deepEqual(
    parse('<cite>italic</cite>').map(toJSON),
    [ { type: 'TK', val: 'italic', style: 'italic' } ],
    '<cite> italic'
  );

  t.deepEqual(
    parse('<code>mono</code>').map(toJSON),
    [ { type: 'TK', val: 'mono', family: 'monospace' } ],
    '<code> monospace'
  );

  t.deepEqual(
    parse('<kbd>mono</kbd>').map(toJSON),
    [ { type: 'TK', val: 'mono', family: 'monospace' } ],
    '<kbd> monospace'
  );

  t.deepEqual(
    parse('<samp>mono</samp>').map(toJSON),
    [ { type: 'TK', val: 'mono', family: 'monospace' } ],
    '<samp> monospace'
  );

  t.deepEqual(
    parse('<var>mono</var>').map(toJSON),
    [ { type: 'TK', val: 'mono', family: 'monospace' } ],
    '<var> monospace'
  );

  t.deepEqual(
    parse('<tt>mono</tt>').map(toJSON),
    [ { type: 'TK', val: 'mono', family: 'monospace' } ],
    '<tt> monospace'
  );

  t.deepEqual(
    parse('<sub>superscript</sub>').map(toJSON),
    [ { type: 'TK', val: 'superscript', sub: true } ],
    '<sub> monospace'
  );

  t.deepEqual(
    parse('<sup>subscript</sup>').map(toJSON),
    [ { type: 'TK', val: 'subscript', sup: true } ],
    '<sup> monospace'
  );

  t.deepEqual(
    parse('<a href="http://example.com/">hyperlink</a>').map(toJSON),
    [ { type: 'TK', val: 'hyperlink', href: 'http://example.com/' } ],
    '<a> monospace'
  );

  t.end();
});


test('html parse attributes', t => {
  t.deepEqual(
    parse('<a href="http://example.com/">hyperlink</a>').map(toJSON),
    [ { type: 'TK', val: 'hyperlink', href: 'http://example.com/' } ],
    '<a href="http://example.com/">hyperlink</a>'
  );

  t.deepEqual(
    parse('<foo style="color: blue;">colored</foo>').map(toJSON),
    [ { type: 'TK', val: 'colored', color: 'blue' } ],
    '<foo style="color: blue;">colored</foo>'
  );

  t.deepEqual(
    parse('<foo style="color:teal">colored</foo>').map(toJSON),
    [ { type: 'TK', val: 'colored', color: 'teal' } ],
    '<foo style="color:teal">colored</foo>'
  );

  t.deepEqual(
    parse('<foo style="background: pink; color: red;">colored</foo>').map(toJSON),
    [ { type: 'TK', val: 'colored', color: 'red' } ],
    '<foo style="background: pink; color: red;">colored</foo>'
  );

  t.deepEqual(
    parse('<foo style="color: #c05;">colored</foo>').map(toJSON),
    [ { type: 'TK', val: 'colored', color: '#c05' } ],
    '<foo style="color: #c05;">colored</foo>'
  );

  t.deepEqual(
    parse('<a href="http://example.com/" style="color: #c05;">colored</a>').map(toJSON),
    [ { type: 'TK', val: 'colored', color: '#c05', href: 'http://example.com/' } ],
    '<a href="http://example.com/" style="color: #c05;">colored</a>'
  );

  t.end();
});

/* eslint-disable prefer-const, no-multi-str, quotes, no-multiple-empty-lines */
import test, { Test } from 'tape';
import parse from './htmlparser.js';
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
  if (t.class) { r.class = String(t.class); }
  if (t.rel) { r.rel = String(t.rel); }
  if (t.target) { r.target = String(t.target); }
  return r;
}

Test.prototype.htmlEq = function (markup, tokens, message = null) {
  const result = parse(markup).map(toJSON);
  this.deepEqual(result, tokens, message || markup);
};


test('html parse bad markup', t => {
  // parser only responds to opening tags and nesting level
  t.htmlEq(
    'xx<a>xx<b>xx</a>xx</b>xx',
    [
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx', weight: 'bold' },
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx' }
    ],
    'incorrect nesting'
  );

  t.htmlEq(
    'xx<a  >xx<b  >xx</b  >xx</a  >xx',
    [
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx', weight: 'bold' },
      { type: 'TK', val: 'xx' },
      { type: 'TK', val: 'xx' }
    ],
    'whitespace in tags'
  );

  t.htmlEq(
    '<foo />',
    [],
    'self closing'
  );

  t.htmlEq(
    '<foo attr />',
    [],
    'self closing with bool attr'
  );

  t.htmlEq(
    '<foo attr=val />',
    [],
    'self closing with attr'
  );

  t.htmlEq(
    '<foo></foo>',
    [],
    'empty tag'
  );

  t.htmlEq(
    '<foo attr></foo>',
    [],
    'empty tag'
  );

  t.htmlEq(
    '<foo attr=val></foo>',
    [],
    'empty tag'
  );

  t.end();
});


test('html parse markup', t => {
  t.htmlEq(
    'just some text',
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

  t.htmlEq(
    'hy&shy;phen&shy;ation',
    [
      { type: 'TK', val: 'hy' },
      { type: 'SH' },
      { type: 'TK', val: 'phen' },
      { type: 'SH' },
      { type: 'TK', val: 'ation' }
    ],
    'line break is whitespace'
  );

  t.htmlEq(
    'line\nbreaks',
    [
      { type: 'TK', val: 'line' },
      { type: 'BR' },
      { type: 'TK', val: '\n' },
      { type: 'BR' },
      { type: 'TK', val: 'breaks' }
    ],
    'line break is whitespace'
  );

  t.htmlEq(
    'line<br>breaks',
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<br> is line break'
  );

  t.htmlEq(
    '<p>line</p><p>breaks</p>',
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<p> causes line breaks'
  );

  t.htmlEq(
    '<div>line</div><div>breaks</div>',
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<div> causes line breaks'
  );

  t.htmlEq(
    '<blockquote>line</blockquote><blockquote>breaks</blockquote>',
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<blockquote> causes line breaks'
  );

  t.htmlEq(
    '<li>line</li><li>breaks</li>',
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<li> causes line breaks'
  );

  t.htmlEq(
    '<h1>line</h1><h1>breaks</h1>',
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<h1> causes line breaks'
  );

  t.htmlEq(
    '<h2>line</h2><h2>breaks</h2>',
    [
      { type: 'TK', val: 'line' },
      { type: 'NL' },
      { type: 'NL' },
      { type: 'TK', val: 'breaks' }
    ],
    '<h2> causes line breaks'
  );

  t.htmlEq(
    'entity&copy;&quot;&mdash;&trade;&Phi;parsing',
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
  t.htmlEq(
    '<b>bold</b>',
    [ { type: 'TK', val: 'bold', weight: 'bold' } ]
  );

  t.htmlEq(
    '<strong>bold</strong>',
    [ { type: 'TK', val: 'bold', weight: 'bold' } ]
  );

  t.htmlEq(
    '<i>italic</i>',
    [ { type: 'TK', val: 'italic', style: 'italic' } ]
  );

  t.htmlEq(
    '<em>italic</em>',
    [ { type: 'TK', val: 'italic', style: 'italic' } ]
  );

  t.htmlEq(
    '<dfn>italic</dfn>',
    [ { type: 'TK', val: 'italic', style: 'italic' } ]
  );

  t.htmlEq(
    '<cite>italic</cite>',
    [ { type: 'TK', val: 'italic', style: 'italic' } ]
  );

  t.htmlEq(
    '<code>mono</code>',
    [ { type: 'TK', val: 'mono', family: 'monospace' } ]
  );

  t.htmlEq(
    '<kbd>mono</kbd>',
    [ { type: 'TK', val: 'mono', family: 'monospace' } ]
  );

  t.htmlEq(
    '<samp>mono</samp>',
    [ { type: 'TK', val: 'mono', family: 'monospace' } ]
  );

  t.htmlEq(
    '<var>mono</var>',
    [ { type: 'TK', val: 'mono', family: 'monospace' } ]
  );

  t.htmlEq(
    '<tt>mono</tt>',
    [ { type: 'TK', val: 'mono', family: 'monospace' } ]
  );

  t.htmlEq(
    '<sub>superscript</sub>',
    [ { type: 'TK', val: 'superscript', sub: true } ]
  );

  t.htmlEq(
    '<sup>subscript</sup>',
    [ { type: 'TK', val: 'subscript', sup: true } ]
  );

  t.htmlEq(
    '<a href="http://example.com/">hyperlink</a>',
    [ { type: 'TK', val: 'hyperlink', href: 'http://example.com/' } ]
  );

  t.end();
});


test('html parse attributes', t => {
  t.htmlEq(
    '<a href="http://example.com/">hyperlink</a>',
    [ { type: 'TK', val: 'hyperlink', href: 'http://example.com/' } ]
  );

  t.htmlEq(
    '<foo style="color: blue;">colored</foo>',
    [ { type: 'TK', val: 'colored', color: 'blue' } ]
  );

  t.htmlEq(
    '<foo style="color:teal">colored</foo>',
    [ { type: 'TK', val: 'colored', color: 'teal' } ]
  );

  t.htmlEq(
    '<foo style="background: pink; color: red;">colored</foo>',
    [ { type: 'TK', val: 'colored', color: 'red' } ]
  );

  t.htmlEq(
    '<foo style="color: #c05;">colored</foo>',
    [ { type: 'TK', val: 'colored', color: '#c05' } ]
  );

  t.htmlEq(
    '<a href="http://example.com/" style="color: #c05;">colored</a>',
    [ { type: 'TK', val: 'colored', color: '#c05', href: 'http://example.com/' } ]
  );

  t.htmlEq(
    '<a href="http://example.com/" style="color: #c05;">colored</a>',
    [ { type: 'TK', val: 'colored', color: '#c05', href: 'http://example.com/' } ]
  );

  t.htmlEq(
    '<a href="http://example.com/" rel="noopener noreferrer nofollow" target="_blank">foo</a>',
    [ { type: 'TK', val: 'foo', href: 'http://example.com/', rel: 'noopener noreferrer nofollow', target: '_blank' } ]
  );


  t.htmlEq(
    '<span rel="noopener noreferrer nofollow" target="_blank">foo</span>',
    [ { type: 'TK', val: 'foo' } ]
  );

  t.htmlEq(
    '<span class="foo">classed</span>',
    [ { type: 'TK', val: 'classed', class: 'foo' } ]
  );

  t.htmlEq(
    '<span class=\'foo\'>classed</span>',
    [ { type: 'TK', val: 'classed', class: 'foo' } ]
  );

  t.htmlEq(
    '<span class=foo>classed</span>',
    [ { type: 'TK', val: 'classed', class: 'foo' } ]
  );

  t.htmlEq(
    '<span class=foo>cla<a href="//example.com">ss</a>ed</span>',
    [ { type: 'TK', val: 'cla', class: 'foo' },
      { type: 'TK', val: 'ss', href: '//example.com', class: 'foo' },
      { type: 'TK', val: 'ed', class: 'foo' } ]
  );

  t.htmlEq(
    '<span class=foo>cla<a href="//example.com" class=bar>ss</a>ed</span>',
    [ { type: 'TK', val: 'cla', class: 'foo' },
      { type: 'TK', val: 'ss', href: '//example.com', class: 'foo bar' },
      { type: 'TK', val: 'ed', class: 'foo' } ]
  );

  t.htmlEq(
    '<span class="foo bar" style="color: red;">colored</span>',
    [ { type: 'TK', val: 'colored', class: 'foo bar', color: 'red' } ]
  );

  t.end();
});

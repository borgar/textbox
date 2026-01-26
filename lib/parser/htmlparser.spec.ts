// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { htmlparser as parse } from './htmlparser.ts';

function htmlEq (markup: string, tokens: any[]) {
  const result = parse(markup).map(d => d.toJSON());
  expect(result).toEqual(tokens);
}

describe('html parse bad markup', () => {
  it('incorrect nesting', () => {
    // parser only responds to opening tags and nesting level
    htmlEq(
      'xx<a>xx<b>xx</a>xx</b>xx',
      [
        { type: 'TK', val: 'xx' },
        { type: 'TK', val: 'xx' },
        { type: 'TK', val: 'xx', weight: 700 },
        { type: 'TK', val: 'xx' },
        { type: 'TK', val: 'xx' }
      ]
    );
  });

  it('whitespace in tags', () => {
    htmlEq(
      'xx<a  >xx<b  >xx</b  >xx</a  >xx',
      [
        { type: 'TK', val: 'xx' },
        { type: 'TK', val: 'xx' },
        { type: 'TK', val: 'xx', weight: 700 },
        { type: 'TK', val: 'xx' },
        { type: 'TK', val: 'xx' }
      ]
    );
  });

  it('self closing', () => {
    htmlEq('<foo />', []);
  });

  it('self closing with bool attr', () => {
    htmlEq('<foo attr />', []);
  });

  it('self closing with attr', () => {
    htmlEq('<foo attr=val />', []);
  });

  it('empty tag', () => {
    htmlEq('<foo></foo>', []);
  });

  it('empty tag with attr', () => {
    htmlEq('<foo attr></foo>', []);
  });

  it('empty tag with attr value', () => {
    htmlEq('<foo attr=val></foo>', []);
  });
});

describe('html parse markup', () => {
  it('simple text parsing', () => {
    htmlEq(
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
      ]
    );
  });

  it('shy entity for hyphenation', () => {
    htmlEq(
      'hy&shy;phen&shy;ation',
      [
        { type: 'TK', val: 'hy' },
        { type: 'SH' },
        { type: 'TK', val: 'phen' },
        { type: 'SH' },
        { type: 'TK', val: 'ation' }
      ]
    );
  });

  it('line break is whitespace', () => {
    htmlEq(
      'line\nbreaks',
      [
        { type: 'TK', val: 'line' },
        { type: 'BR' },
        { type: 'TK', val: '\n' },
        { type: 'BR' },
        { type: 'TK', val: 'breaks' }
      ]
    );
  });

  it('<br> is line break', () => {
    htmlEq(
      'line<br>breaks',
      [
        { type: 'TK', val: 'line' },
        { type: 'NL' },
        { type: 'TK', val: 'breaks' }
      ]
    );
  });

  it('<p> causes line breaks', () => {
    htmlEq(
      '<p>line</p><p>breaks</p>',
      [
        { type: 'TK', val: 'line' },
        { type: 'NL' },
        { type: 'NL' },
        { type: 'TK', val: 'breaks' }
      ]
    );
  });

  it('<div> causes line breaks', () => {
    htmlEq(
      '<div>line</div><div>breaks</div>',
      [
        { type: 'TK', val: 'line' },
        { type: 'NL' },
        { type: 'TK', val: 'breaks' }
      ]
    );
  });

  it('<blockquote> causes line breaks', () => {
    htmlEq(
      '<blockquote>line</blockquote><blockquote>breaks</blockquote>',
      [
        { type: 'TK', val: 'line' },
        { type: 'NL' },
        { type: 'NL' },
        { type: 'TK', val: 'breaks' }
      ]
    );
  });

  it('<li> causes line breaks', () => {
    htmlEq(
      '<li>line</li><li>breaks</li>',
      [
        { type: 'TK', val: 'line' },
        { type: 'NL' },
        { type: 'TK', val: 'breaks' }
      ]
    );
  });

  it('<h1> causes line breaks', () => {
    htmlEq(
      '<h1>line</h1><h1>breaks</h1>',
      [
        { type: 'TK', val: 'line' },
        { type: 'NL' },
        { type: 'NL' },
        { type: 'TK', val: 'breaks' }
      ]
    );
  });

  it('<h2> causes line breaks', () => {
    htmlEq(
      '<h2>line</h2><h2>breaks</h2>',
      [
        { type: 'TK', val: 'line' },
        { type: 'NL' },
        { type: 'NL' },
        { type: 'TK', val: 'breaks' }
      ]
    );
  });

  it('entity parsing', () => {
    htmlEq(
      'entity&copy;&quot;&mdash;&trade;&Phi;parsing',
      [
        { type: 'TK', val: 'entity©"—' },
        { type: 'BR' },
        { type: 'TK', val: '™Φparsing' }
      ]
    );
  });
});

describe('html parse style markup', () => {
  it('<b>bold</b>', () => {
    htmlEq(
      '<b>bold</b>',
      [ { type: 'TK', val: 'bold', weight: 700 } ]
    );
  });

  it('<strong>bold</strong>', () => {
    htmlEq(
      '<strong>bold</strong>',
      [ { type: 'TK', val: 'bold', weight: 700 } ]
    );
  });

  it('<i>italic</i>', () => {
    htmlEq(
      '<i>italic</i>',
      [ { type: 'TK', val: 'italic', style: 'italic' } ]
    );
  });

  it('<em>italic</em>', () => {
    htmlEq(
      '<em>italic</em>',
      [ { type: 'TK', val: 'italic', style: 'italic' } ]
    );
  });

  it('<dfn>italic</dfn>', () => {
    htmlEq(
      '<dfn>italic</dfn>',
      [ { type: 'TK', val: 'italic', style: 'italic' } ]
    );
  });

  it('<cite>italic</cite>', () => {
    htmlEq(
      '<cite>italic</cite>',
      [ { type: 'TK', val: 'italic', style: 'italic' } ]
    );
  });

  it('<code>mono</code>', () => {
    htmlEq(
      '<code>mono</code>',
      [ { type: 'TK', val: 'mono', font: 'monospace' } ]
    );
  });

  it('<kbd>mono</kbd>', () => {
    htmlEq(
      '<kbd>mono</kbd>',
      [ { type: 'TK', val: 'mono', font: 'monospace' } ]
    );
  });

  it('<samp>mono</samp>', () => {
    htmlEq(
      '<samp>mono</samp>',
      [ { type: 'TK', val: 'mono', font: 'monospace' } ]
    );
  });

  it('<var>mono</var>', () => {
    htmlEq(
      '<var>mono</var>',
      [ { type: 'TK', val: 'mono', font: 'monospace' } ]
    );
  });

  it('<tt>mono</tt>', () => {
    htmlEq(
      '<tt>mono</tt>',
      [ { type: 'TK', val: 'mono', font: 'monospace' } ]
    );
  });

  it('<sub>superscript</sub>', () => {
    htmlEq(
      '<sub>superscript</sub>',
      [ { type: 'TK', val: 'superscript', sub: true } ]
    );
  });

  it('<sup>subscript</sup>', () => {
    htmlEq(
      '<sup>subscript</sup>',
      [ { type: 'TK', val: 'subscript', sup: true } ]
    );
  });

  it('<a href="...">hyperlink</a>', () => {
    htmlEq(
      '<a href="http://example.com/">hyperlink</a>',
      [ { type: 'TK', val: 'hyperlink', href: 'http://example.com/' } ]
    );
  });
});

describe('html parse attributes', () => {
  it('href attribute', () => {
    htmlEq(
      '<a href="http://example.com/">hyperlink</a>',
      [ { type: 'TK', val: 'hyperlink', href: 'http://example.com/' } ]
    );
  });

  it('style color with spaces', () => {
    htmlEq(
      '<foo style="color: blue;">colored</foo>',
      [ { type: 'TK', val: 'colored', color: 'blue' } ]
    );
  });

  it('style color without spaces', () => {
    htmlEq(
      '<foo style="color:teal">colored</foo>',
      [ { type: 'TK', val: 'colored', color: 'teal' } ]
    );
  });

  it('style multiple properties', () => {
    htmlEq(
      '<foo style="background: pink; color: red;">colored</foo>',
      [ { type: 'TK', val: 'colored', color: 'red' } ]
    );
  });

  it('style hex color', () => {
    htmlEq(
      '<foo style="color: #c05;">colored</foo>',
      [ { type: 'TK', val: 'colored', color: '#c05' } ]
    );
  });

  it('href and style color', () => {
    htmlEq(
      '<a href="http://example.com/" style="color: #c05;">colored</a>',
      [ { type: 'TK', val: 'colored', color: '#c05', href: 'http://example.com/' } ]
    );
  });

  it('multiple anchor attributes', () => {
    htmlEq(
      '<a href="http://example.com/" rel="noopener noreferrer nofollow" target="_blank">foo</a>',
      [ { type: 'TK', val: 'foo', href: 'http://example.com/', rel: 'noopener noreferrer nofollow', target: '_blank' } ]
    );
  });

  it('non-anchor attributes ignored', () => {
    htmlEq(
      '<span rel="noopener noreferrer nofollow" target="_blank">foo</span>',
      [ { type: 'TK', val: 'foo' } ]
    );
  });

  it('class attribute double quotes', () => {
    htmlEq(
      '<span class="foo">classed</span>',
      [ { type: 'TK', val: 'classed', class: 'foo' } ]
    );
  });

  it('class attribute single quotes', () => {
    htmlEq(
      "<span class='foo'>classed</span>",
      [ { type: 'TK', val: 'classed', class: 'foo' } ]
    );
  });

  it('class attribute no quotes', () => {
    htmlEq(
      '<span class=foo>classed</span>',
      [ { type: 'TK', val: 'classed', class: 'foo' } ]
    );
  });

  it('nested tags inherit class', () => {
    htmlEq(
      '<span class=foo>cla<a href="//example.com">ss</a>ed</span>',
      [ { type: 'TK', val: 'cla', class: 'foo' },
        { type: 'TK', val: 'ss', href: '//example.com', class: 'foo' },
        { type: 'TK', val: 'ed', class: 'foo' } ]
    );
  });

  it('nested tags merge classes', () => {
    htmlEq(
      '<span class=foo>cla<a href="//example.com" class=bar>ss</a>ed</span>',
      [ { type: 'TK', val: 'cla', class: 'foo' },
        { type: 'TK', val: 'ss', href: '//example.com', class: 'foo bar' },
        { type: 'TK', val: 'ed', class: 'foo' } ]
    );
  });

  it('multiple classes and style', () => {
    htmlEq(
      '<span class="foo bar" style="color: red;">colored</span>',
      [ { type: 'TK', val: 'colored', class: 'foo bar', color: 'red' } ]
    );
  });
});

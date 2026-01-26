import { describe, it, expect } from 'vitest';
import { latexparser as parse } from './latexparser.ts';
import { Token } from './tokens.ts';

const toJSON = (t: Token) => t.toJSON();

describe('latex parse', () => {
  it('simple text', () => {
    expect(parse('simple text').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: ' ' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ]);
  });

  it('\\usepackage{hyperref}', () => {
    // unknowns are passed through
    expect(parse('\\usepackage{hyperref}').map(toJSON)).toEqual([
      { type: 'TK', val: '\\usepackage' },
      { type: 'TK', val: 'hyperref' }
    ]);
  });

  it('<<foo>>', () => {
    expect(parse('<<foo>>').map(toJSON)).toEqual([
      { type: 'TK', val: '«foo»' }
    ]);
  });

  it(',,foo``', () => {
    expect(parse(',,foo``').map(toJSON)).toEqual([
      { type: 'TK', val: '„foo“' }
    ]);
  });

  it('foo~bar', () => {
    expect(parse('foo~bar').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo' },
      { type: 'BR' },
      { type: 'TK', val: '\u00A0' },
      { type: 'BR' },
      { type: 'TK', val: 'bar' }
    ]);
  });

  it('foo-bar', () => {
    expect(parse('foo-bar').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo-' },
      { type: 'BR' },
      { type: 'TK', val: 'bar' }
    ]);
  });

  it('foo\\-bar', () => {
    expect(parse('foo\\-bar').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo' },
      { type: 'SH' },
      { type: 'TK', val: 'bar' }
    ]);
  });

  it('foo\\,bar', () => {
    expect(parse('foo\\,bar').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo' },
      { type: 'BR' },
      { type: 'TK', val: '\u2009' },
      { type: 'BR' },
      { type: 'TK', val: 'bar' }
    ]);
  });

  it('foo\\\\bar', () => {
    expect(parse('foo\\\\bar').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo' },
      { type: 'NL' },
      { type: 'TK', val: 'bar' }
    ]);
  });

  it('\\bf{bold}', () => {
    expect(parse('\\bf{foo}').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo', weight: 700 }
    ]);
  });

  it('\\it{italic}', () => {
    expect(parse('\\it{foo}').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo', style: 'italic' }
    ]);
  });

  it('\\sl{slanted}', () => {
    expect(parse('\\sl{foo}').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo', style: 'italic' }
    ]);
  });

  it('\\color{red}{foo}', () => {
    expect(parse('\\color{red}{foo}').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo', color: 'red' }
    ]);
  });

  it('\\color{red}{\\color{blue}{foo}}', () => {
    expect(parse('\\color{red}{\\color{blue}{foo}}').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo', color: 'blue' }
    ]);
  });

  it('\\href{http://example.com/}{foo}', () => {
    expect(parse('\\href{http://example.com/}{foo}').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo', href: 'http://example.com/' }
    ]);
  });

  it('_{foo}', () => {
    expect(parse('_{foo}').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo', sub: true }
    ]);
  });

  it('^{foo}', () => {
    expect(parse('^{foo}').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo', sup: true }
    ]);
  });

  it('^foo', () => {
    expect(parse('^foo').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo', sup: true }
    ]);
  });

  it('^{fo}o', () => {
    expect(parse('^{fo}o').map(toJSON)).toEqual([
      { type: 'TK', val: 'fo', sup: true },
      { type: 'TK', val: 'o' }
    ]);
  });

  it('foo\\par{}foo', () => {
    expect(parse('foo\\par{}foo').map(toJSON)).toEqual([
      { type: 'TK', val: 'foo' },
      { type: 'NL' },
      { type: 'NL' },
      { type: 'TK', val: 'foo' }
    ]);
  });

  it('\\verb,\\bf{foo},', () => {
    expect(parse('\\verb,\\bf{foo},').map(toJSON)).toEqual([
      { type: 'TK', val: '\\bf{foo}' }
    ]);
  });
});

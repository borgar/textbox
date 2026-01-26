import { describe, it, expect } from 'vitest';
import { textparser as parse } from './textparser.ts';
import type { Token } from './tokens.ts';

const toJSON = (t: Token) => t.toJSON();

describe('text parse', () => {
  it('simple text', () => {
    expect(parse('simple text').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: ' ' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ]);
  });

  it('simple  text', () => {
    expect(parse('simple  text').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: ' ' },
      { type: 'BR' },
      { type: 'TK', val: ' ' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ]);
  });

  it('simple\\ntext', () => {
    expect(parse('simple\ntext').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: '\n' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ]);
  });

  it('simple\\n\\ntext', () => {
    expect(parse('simple\n\ntext').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: '\n' },
      { type: 'BR' },
      { type: 'TK', val: '\n' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ]);
  });

  it('simple-text', () => {
    expect(parse('simple-text').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple-' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ]);
  });

  it('simple?text', () => {
    expect(parse('simple?text').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple?' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ]);
  });

  it('simple$text', () => {
    expect(parse('simple$text').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple' },
      { type: 'BR' },
      { type: 'TK', val: '$text' }
    ]);
  });

  it('simple%text', () => {
    expect(parse('simple%text').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple%' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ]);
  });

  it('simple–text', () => {
    expect(parse('simple–text').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple–' },
      { type: 'BR' },
      { type: 'TK', val: 'text' }
    ]);
  });

  it('simple\u00ADtext', () => {
    expect(parse('simple\u00ADtext').map(toJSON)).toEqual([
      { type: 'TK', val: 'simple' },
      { type: 'SH' },
      { type: 'TK', val: 'text' }
    ]);
  });

  it('这是"只是一些"混乱。', () => {
    expect(parse('这是“只是一些”混乱。').map(toJSON)).toEqual([
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
    ]);
  });
});

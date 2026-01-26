import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createElement } from './createElement.ts';

const addProp = (o: object, p: string, v: unknown) => {
  Object.defineProperty(o, p, { value: v, writable: false, enumerable: false });
};

let orgDoc: typeof globalThis.document;
beforeAll(() => {
  orgDoc = globalThis.document;
  globalThis.document = {
    createElementNS: function (ns: string, tagName: string) {
      const node: any = {
        nodeName: tagName.toUpperCase()
      };
      addProp(node, 'setAttribute', (k, v) => {
        if (!node.attributes) {
          node.attributes = {};
        }
        node.attributes[k] = v;
      });
      addProp(node, 'appendChild', c => {
        if (!node.childNodes) {
          node.childNodes = [];
        }
        node.childNodes.push(c);
        return c;
      });
      return node;
    },
    // @ts-ignore
    createTextNode: function (text) {
      return String(text);
    }
  };
});
afterAll(() => {
  globalThis.document = orgDoc;
});

describe('createElement', () => {
  it('createElement tag only', () => {
    expect(createElement('div')).toEqual({ nodeName: 'DIV' });
  });

  it('createElement with attributes', () => {
    expect(createElement('div', { attr: 'val' })).toEqual({
      nodeName: 'DIV',
      attributes: { attr: 'val' }
    });
  });

  it('createElement attributes and child', () => {
    expect(createElement('div', { attr: 'val' }, createElement('span', { a: '1' }))).toEqual({
      nodeName: 'DIV',
      attributes: { attr: 'val' },
      childNodes: [ { nodeName: 'SPAN', attributes: { a: '1' } } ]
    });
  });

  it('createElement with child', () => {
    expect(createElement('div', null, createElement('span', { a: '1' }))).toEqual({
      nodeName: 'DIV',
      childNodes: [ { nodeName: 'SPAN', attributes: { a: '1' } } ]
    });
  });

  it('createElement with children', () => {
    expect(createElement('div', null, createElement('span', { a: '1' }), createElement('span', { b: '2' }))).toEqual({
      nodeName: 'DIV',
      childNodes: [
        { nodeName: 'SPAN', attributes: { a: '1' } },
        { nodeName: 'SPAN', attributes: { b: '2' } }
      ]
    });
  });

  it('createElement with text children', () => {
    expect(createElement('div', null, 'just', 'some', 'text')).toEqual({
      nodeName: 'DIV',
      childNodes: [ 'just', 'some', 'text' ]
    });
  });
});

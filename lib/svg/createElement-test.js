/* eslint-disable prefer-const, no-multi-str, quotes, no-multiple-empty-lines */
import test from 'tape';
import createElement from './createElement';

const addProp = (o, p, v) => {
  Object.defineProperty(o, p, { value: v, writable: false, enumerable: false });
};
// eslint-disable-next-line
global.document = {
  createElementNS: function (ns, tagName) {
    const node = { nodeName: tagName.toUpperCase() };
    addProp(node, 'setAttribute', (k, v) => {
      if (!node.attributes) {
        node.attributes = {};
      }
      node.attributes[k] = v;
    });
    addProp(node, 'appendChild', (c) => {
      if (!node.childNodes) {
        node.childNodes = [];
      }
      node.childNodes.push(c);
      return c;
    });
    return node;
  },
  createTextNode: function (text) {
    return String(text);
  }
};

test('createElement', t => {
  t.deepEqual(
    createElement('div'),
    { nodeName: 'DIV' },
    "createElement tag only"
  );

  t.deepEqual(
    createElement('div', { attr: 'val' }),
    { nodeName: 'DIV', attributes: { attr: 'val' } },
    "createElement with attributes"
  );

  t.deepEqual(
    createElement('div', { attr: 'val' }, createElement('span', { a: 1 })),
    { nodeName: 'DIV', attributes: { attr: 'val' }, childNodes: [
      { nodeName: 'SPAN', attributes: { a: 1 } } ] },
    "createElement attributes and child"
  );

  t.deepEqual(
    createElement('div', null, createElement('span', { a: 1 })),
    { nodeName: 'DIV', childNodes: [
      { nodeName: 'SPAN', attributes: { a: 1 } } ] },
    "createElement with child"
  );

  t.deepEqual(
    createElement('div', null, createElement('span', { a: 1 }), createElement('span', { b: 2 })),
    { nodeName: 'DIV', childNodes: [
      { nodeName: 'SPAN', attributes: { a: 1 } },
      { nodeName: 'SPAN', attributes: { b: 2 } } ] },
    "createElement with children"
  );

  t.deepEqual(
    createElement('div', null, "just", "some", "text"),
    { nodeName: 'DIV', childNodes: [ 'just', 'some', 'text' ] },
    "createElement with text children"
  );

  t.end();
});

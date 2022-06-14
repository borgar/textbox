/* eslint-disable prefer-const, no-multi-str, quotes, no-multiple-empty-lines, no-undefined */
import test from 'tape';
import argmap from './argmap.js';

test('argmap', t => {
  const FN = function () {};
  const CX = { fillText: FN, beginPath: FN };
  const CV = { nodeType: 1, getContext: () => CX };
  const D3 = { _groups: [], _parents: [] };
  const ST = "";

  t.deepEqual(argmap([ CV ]), { ctx: CX });
  t.deepEqual(argmap([ CX ]), { ctx: CX });
  t.deepEqual(argmap([ D3 ]), { d3: D3 });
  t.deepEqual(argmap([ FN ]), { fn: FN });
  t.deepEqual(argmap([ ST ]), { text: ST });

  t.deepEqual(argmap([ FN, D3 ]), { fn: FN, d3: D3 });
  t.deepEqual(argmap([ D3, FN ]), { fn: FN, d3: D3 });
  t.deepEqual(argmap([ CX, FN ]), { fn: FN, ctx: CX });
  t.deepEqual(argmap([ CV, FN ]), { fn: FN, ctx: CX });

  t.deepEqual(argmap([ CV, D3, FN, ST ]), { fn: FN, ctx: CX, text: ST, d3: D3 });

  t.deepEqual(argmap([ CV, null, D3, false, FN, undefined, ST, 0, 123 ]), { fn: FN, ctx: CX, text: ST, d3: D3 });
  t.end();
});

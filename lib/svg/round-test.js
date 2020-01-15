/* eslint-disable prefer-const, no-multi-str, quotes, no-multiple-empty-lines */
import test from 'tape';
import round from './round';

test('round', t => {
  t.equal(round(124.1234567890123), 124.123457, 'round');
  t.equal(round(1.2 + 1.2), 2.4, 'round');
  t.equal(round(1.0000015), 1.000002, 'round');
  t.equal(round(1 / 10), 0.1, 'round');
  t.end();
});

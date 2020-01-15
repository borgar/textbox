/* eslint-disable prefer-const, no-multi-str, quotes, no-multiple-empty-lines */
import test from 'tape';
import font from '.';

function activeProps (s) {
  const o = font(s);
  const r = {};
  for (const k in o) {
    if (o[k] && k !== 'id' && typeof o[k] !== 'function') {
      r[k] = o[k];
    }
  }
  return r;
}

test('font() parses CSS font shorthand correctly', t => {

  t.deepEqual(activeProps('12px/14px sans-serif'),
    { family: 'sans-serif',
      height: 14,
      size: 12
    }
  );

  t.deepEqual(activeProps('80% sans-serif'),
    { family: 'sans-serif',
      size: 12.8,
      height: 15
    }
  );

  t.deepEqual(activeProps('1.2em "Awesome Sans", sans-serif'),
    { family: '"Awesome Sans", sans-serif',
      size: 19.2,
      height: 22
    }
  );

  t.deepEqual(activeProps('italic 1.2em "Fira Sans", serif'),
    { family: '"Fira Sans", serif',
      size: 19.2,
      height: 22,
      style: 'italic'
    }
  );

  t.deepEqual(activeProps('italic small-caps bold 16px/2 cursive'),
    { family: 'cursive',
      size: 16,
      height: 32,
      variant: 'small-caps',
      style: 'italic',
      weight: 'bold'
    }
  );

  t.deepEqual(activeProps('normal normal 400 normal 12px / normal sans-serif'),
    { family: 'sans-serif',
      size: 12,
      height: 14
    }
  );

  t.deepEqual(activeProps('normal normal 600 normal 12px / normal sans-serif'),
    { family: 'sans-serif',
      size: 12,
      height: 14,
      weight: 'bold'
    }
  );

  t.deepEqual(activeProps('normal normal 400 normal 14px / 17px sans-serif'),
    { family: 'sans-serif',
      size: 14,
      height: 17
    }
  );

  t.deepEqual(activeProps('small-caps bold 24px/1 sans-serif'),
    { family: 'sans-serif',
      size: 24,
      height: 24,
      variant: 'small-caps',
      weight: 'bold'
    }
  );

  t.deepEqual(activeProps('bold oblique xx-small serif'),
    { family: 'serif',
      size: 9,
      height: 11,
      style: 'italic',
      weight: 'bold'
    }
  );

  t.deepEqual(activeProps('bold italic large serif'),
    { family: 'serif',
      size: 18,
      height: 21,
      style: 'italic',
      weight: 'bold'
    }
  );

  t.end();
});

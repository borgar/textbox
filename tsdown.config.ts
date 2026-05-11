import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [ 'src/index.ts' ],
  platform: 'neutral',
  format: [
    'cjs',
    'esm'
  ],
  sourcemap: true,
  checks: {
    mixedExports: false
  }
});

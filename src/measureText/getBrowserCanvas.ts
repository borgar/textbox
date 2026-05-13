/* globals document OffscreenCanvas */
import type { MinimalCanvas } from '../types.ts';

export function getBrowserCanvas (): MinimalCanvas | undefined {
  const doc = typeof document !== 'undefined' ? document : null;
  return (
    (typeof OffscreenCanvas !== 'undefined' && new OffscreenCanvas(100, 100)) ||
    (doc && doc.createElement && doc.createElement('canvas')) ||
    undefined
  );
}

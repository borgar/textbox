import { describe, it, expect } from 'vitest';
import { round } from './round.ts';

describe('round', () => {
  it('rounds long decimal', () => {
    expect(round(124.1234567890123)).toBe(124.123457);
  });

  it('rounds floating point arithmetic result', () => {
    expect(round(1.2 + 1.2)).toBe(2.4);
  });

  it('rounds small decimal', () => {
    expect(round(1.0000015)).toBe(1.000002);
  });

  it('rounds division result', () => {
    expect(round(1 / 10)).toBe(0.1);
  });
});

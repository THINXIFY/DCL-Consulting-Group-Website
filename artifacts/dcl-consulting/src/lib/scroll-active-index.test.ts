import { describe, expect, it } from 'vitest';
import { getActiveIndex } from './scroll-active-index';

describe('getActiveIndex', () => {
  it('returns 0 at progress 0', () => {
    expect(getActiveIndex(0, 5)).toBe(0);
  });

  it('returns the last index at progress 1', () => {
    expect(getActiveIndex(1, 5)).toBe(4);
  });

  it('returns the middle index at progress 0.5 for 5 items', () => {
    expect(getActiveIndex(0.5, 5)).toBe(2);
  });

  it('clamps out-of-range progress', () => {
    expect(getActiveIndex(-1, 5)).toBe(0);
    expect(getActiveIndex(2, 5)).toBe(4);
  });

  it('never returns an index outside the array bounds', () => {
    for (let p = 0; p <= 1; p += 0.05) {
      const idx = getActiveIndex(p, 5);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(5);
    }
  });
});

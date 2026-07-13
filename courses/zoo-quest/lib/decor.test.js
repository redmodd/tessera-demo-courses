import { describe, test, expect } from 'vitest';
import { hasTuft } from './decor.js';

describe('hasTuft', () => {
  test('is deterministic — same coords give the same answer', () => {
    expect(hasTuft(3, 7)).toBe(hasTuft(3, 7));
    expect(hasTuft(10, 2)).toBe(hasTuft(10, 2));
    expect(hasTuft(0, 0)).toBe(hasTuft(0, 0));
  });

  test('is sparse but non-empty across a full map sweep', () => {
    let count = 0;
    for (let r = 0; r < 20; r++) {
      for (let c = 0; c < 32; c++) {
        if (hasTuft(r, c)) count++;
      }
    }
    const ratio = count / (20 * 32);
    expect(ratio).toBeGreaterThan(0); // some tufts appear
    expect(ratio).toBeLessThan(0.3); // but the ground stays calm
  });
});

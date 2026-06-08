import { describe, test, expect } from 'vitest';
import { readRivals, recordRival } from './rivals.js';

// A minimal stand-in for usePersistence(): synchronous get/set over an in-memory value.
function fakeStore(initial = null) {
  let value = initial;
  return {
    get: () => value,
    set: (v) => {
      value = v;
    },
  };
}

describe('readRivals', () => {
  test('defaults to {} on an empty store', () => {
    expect(readRivals(fakeStore())).toEqual({});
  });

  test('returns the stored map', () => {
    expect(readRivals(fakeStore({ quibble: 'won' }))).toEqual({ quibble: 'won' });
  });
});

describe('recordRival', () => {
  test('writes the outcome and round-trips through readRivals', () => {
    const store = fakeStore();
    recordRival(store, 'quibble', 'lost');
    expect(readRivals(store)).toEqual({ quibble: 'lost' });
  });

  test('preserves other rivals already recorded', () => {
    const store = fakeStore({ other: 'won' });
    recordRival(store, 'quibble', 'lost');
    expect(readRivals(store)).toEqual({ other: 'won', quibble: 'lost' });
  });

  test('overwrites the same id cleanly (idempotent shape)', () => {
    const store = fakeStore();
    recordRival(store, 'quibble', 'lost');
    recordRival(store, 'quibble', 'won');
    expect(readRivals(store)).toEqual({ quibble: 'won' });
  });
});

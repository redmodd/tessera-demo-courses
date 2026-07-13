import { describe, test, expect } from 'vitest';
import { penTiles, wanderStep, roamTiles } from './npc.js';

// A 2×2 pen ringed by fence.
const grid = [
  ['F', 'F', 'F', 'F'],
  ['F', 'p', 'p', 'F'],
  ['F', 'p', 'p', 'F'],
  ['F', 'F', 'F', 'F'],
];
const bounds = { r0: 1, r1: 2, c0: 1, c1: 2 };

describe('penTiles', () => {
  test('lists the pen interior tiles within bounds', () => {
    expect(penTiles(grid, bounds)).toEqual([
      { r: 1, c: 1 },
      { r: 1, c: 2 },
      { r: 2, c: 1 },
      { r: 2, c: 2 },
    ]);
  });

  test('ignores non-pen tiles inside the bounds', () => {
    const g = [
      ['p', 'p'],
      ['p', '#'],
    ];
    expect(penTiles(g, { r0: 0, r1: 1, c0: 0, c1: 1 })).toEqual([
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 1, c: 0 },
    ]);
  });
});

describe('wanderStep', () => {
  const set = new Set(penTiles(grid, bounds).map((t) => `${t.r},${t.c}`));

  test('never leaves the pen across many steps, for any rng', () => {
    let pos = { r: 1, c: 1 };
    const seq = [0, 0.2, 0.5, 0.8, 0.99];
    for (let i = 0; i < 200; i++) {
      pos = wanderStep(set, pos, () => seq[i % seq.length]);
      expect(set.has(`${pos.r},${pos.c}`)).toBe(true);
    }
  });

  test('only moves to an orthogonally-adjacent tile, or stays put', () => {
    const pos = { r: 1, c: 1 };
    for (const v of [0, 0.3, 0.6, 0.99]) {
      const next = wanderStep(set, pos, () => v);
      expect(Math.abs(next.r - pos.r) + Math.abs(next.c - pos.c)).toBeLessThanOrEqual(1);
    }
  });

  test('a one-tile pen always stays put', () => {
    const lone = new Set(['5,5']);
    expect(wanderStep(lone, { r: 5, c: 5 }, () => 0)).toEqual({ r: 5, c: 5 });
  });
});

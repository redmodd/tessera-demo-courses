import { describe, test, expect } from 'vitest';
import { bfs, camOffset } from './engine.js';

describe('camOffset', () => {
  test('always returns a whole number so tiles stay on the pixel grid', () => {
    // odd window → winPx/2 is fractional; the result must still be an integer
    expect(Number.isInteger(camOffset(500, 1000, 801))).toBe(true);
    expect(Number.isInteger(camOffset(0, 100, 301))).toBe(true);
  });

  test('centres content smaller than the window', () => {
    expect(camOffset(0, 100, 300)).toBe(100); // (300 - 100) / 2
  });

  test('keeps the avatar centred and clamps to the map edges', () => {
    expect(camOffset(500, 1000, 800)).toBe(-100); // 400 - 500, in range
    expect(camOffset(0, 1000, 800)).toBe(0); // clamp at the near edge
    expect(camOffset(2000, 1000, 800)).toBe(-200); // clamp at the far edge
  });
});

const open = [
  ['.', '.', '.'],
  ['.', '.', '.'],
  ['.', '.', '.'],
];

describe('bfs', () => {
  test('returns the steps to the goal, excluding start, including goal', () => {
    const path = bfs(open, { r: 0, c: 0 }, { r: 0, c: 2 });
    expect(path).toEqual([
      { r: 0, c: 1 },
      { r: 0, c: 2 },
    ]);
  });

  test('returns an empty path when already at the goal', () => {
    expect(bfs(open, { r: 1, c: 1 }, { r: 1, c: 1 })).toEqual([]);
  });

  test('finds the shortest path (4-connected, no diagonals)', () => {
    const path = bfs(open, { r: 0, c: 0 }, { r: 2, c: 2 });
    expect(path).not.toBeNull();
    expect(path.length).toBe(4); // Manhattan distance
    expect(path[path.length - 1]).toEqual({ r: 2, c: 2 });
  });

  test('routes around a wall', () => {
    const grid = [
      ['.', '#', '.'],
      ['.', '#', '.'],
      ['.', '.', '.'],
    ];
    const path = bfs(grid, { r: 0, c: 0 }, { r: 0, c: 2 });
    expect(path).not.toBeNull();
    // must detour down and around the wall column
    expect(path).toContainEqual({ r: 2, c: 1 });
    expect(path[path.length - 1]).toEqual({ r: 0, c: 2 });
  });

  test('returns null when the goal is unreachable', () => {
    const grid = [
      ['.', '#', '.'],
      ['#', '#', '.'],
      ['.', '#', '.'],
    ];
    expect(bfs(grid, { r: 0, c: 0 }, { r: 0, c: 2 })).toBeNull();
  });

  test('returns null when the goal itself is not walkable', () => {
    const grid = [
      ['.', '.', '~'],
      ['.', '.', '.'],
    ];
    expect(bfs(grid, { r: 0, c: 0 }, { r: 0, c: 2 })).toBeNull();
  });
});

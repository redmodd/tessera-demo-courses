
import { walkable } from './worldmap.js';

const STEPS = [
  { r: -1, c: 0 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
  { r: 0, c: 1 },
];

export function penTiles(grid, bounds) {
  const out = [];
  for (let r = bounds.r0; r <= bounds.r1; r++) {
    for (let c = bounds.c0; c <= bounds.c1; c++) {
      if (grid[r]?.[c] === 'p') out.push({ r, c });
    }
  }
  return out;
}

/**
 * Walkable tiles within `radius` of `home` — a patron's roaming area.
 */
export function roamTiles(grid, home, radius) {
  const out = [];
  for (let r = home.r - radius; r <= home.r + radius; r++) {
    for (let c = home.c - radius; c <= home.c + radius; c++) {
      if (walkable(grid, r, c)) out.push({ r, c });
    }
  }
  return out;
}

/**
 * The next position: a random adjacent tile in `penSet`, or stay put (one of N+1 equally
 * likely outcomes, so animals linger as well as roam). The result is always inside the set.
 */
export function wanderStep(penSet, pos, rng = Math.random) {
  const opts = [];
  for (const d of STEPS) {
    const nr = pos.r + d.r;
    const nc = pos.c + d.c;
    if (penSet.has(`${nr},${nc}`)) opts.push({ r: nr, c: nc });
  }
  if (opts.length === 0) return pos;
  const pick = Math.floor(rng() * (opts.length + 1));
  return pick >= opts.length ? pos : opts[pick];
}

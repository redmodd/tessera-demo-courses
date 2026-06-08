// Pure wandering for the overworld's NPCs — penned animals and roaming patrons alike.
// Keeping it pure makes it trivially testable and keeps the "stays in its area"
// guarantee out of the rendering code.

import { walkable } from './worldmap.js';

const STEPS = [
  { r: -1, c: 0 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
  { r: 0, c: 1 },
];

/** The pen-interior tiles (`'p'`) within an enclosure's bounds, as `{r,c}` records. */
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
 * Walkable tiles within `radius` of `home` — a patron's roaming area. Combined with
 * `wanderStep`, a patron strolls around its home patch without straying across the map
 * (and, since wanderStep only moves to adjacent tiles, never hops a wall it can't cross).
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
 * Pick an animal's next position: a random orthogonally-adjacent pen tile, or stay
 * put (one of N+1 equally-likely outcomes, so animals linger as well as roam). `penSet`
 * is a Set of `"r,c"` keys for the enclosure's pen tiles; `rng` is injectable for tests.
 * The result is always in the pen, so an animal can never wander through the fence.
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

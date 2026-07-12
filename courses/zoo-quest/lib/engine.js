import { walkable } from './worldmap.js';

/**
 * Board offset that frames the map in the viewport: centre a map smaller than the window,
 * otherwise follow the avatar and clamp at the edges. Rounded to whole px — a fractional
 * translate lands the tile grid off the pixel grid and renders hairline seams.
 */
export function camOffset(centerPx, contentPx, winPx) {
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const raw =
    contentPx <= winPx
      ? (winPx - contentPx) / 2
      : clamp(winPx / 2 - centerPx, winPx - contentPx, 0);
  return Math.round(raw);
}

const DIRS = [
  { r: -1, c: 0 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
  { r: 0, c: 1 },
];

/**
 * Shortest path over walkable tiles, 4-connected. Steps exclude `start` and include `goal`;
 * empty when already there, null when the goal is unreachable or not walkable.
 */
export function bfs(grid, start, goal) {
  if (!walkable(grid, goal.r, goal.c)) return null;
  if (start.r === goal.r && start.c === goal.c) return [];

  const key = (r, c) => `${r},${c}`;
  const queue = [start];
  const cameFrom = new Map([[key(start.r, start.c), null]]);

  while (queue.length > 0) {
    const cur = queue.shift();
    if (cur.r === goal.r && cur.c === goal.c) {
      const path = [];
      let step = cur;
      while (!(step.r === start.r && step.c === start.c)) {
        path.push({ r: step.r, c: step.c });
        step = cameFrom.get(key(step.r, step.c));
      }
      return path.reverse();
    }
    for (const d of DIRS) {
      const nr = cur.r + d.r;
      const nc = cur.c + d.c;
      if (!walkable(grid, nr, nc)) continue;
      const k = key(nr, nc);
      if (cameFrom.has(k)) continue;
      cameFrom.set(k, cur);
      queue.push({ r: nr, c: nc });
    }
  }
  return null;
}

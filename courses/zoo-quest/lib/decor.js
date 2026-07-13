// Coordinate-based, not random, so a tuft is fixed to its tile and never re-rolls.

export function hasTuft(r, c) {
  const h = (Math.imul(r, 73856093) ^ Math.imul(c, 19349663)) >>> 0;
  return h % 8 === 0;
}

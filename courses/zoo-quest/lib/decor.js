// Decorative ground details. Pure and coordinate-based so a tuft is fixed to its tile
// and never re-rolls or flickers on re-render or when you re-enter a map.

/** True for ~1 in 8 tiles — a sparse, stable scatter of decorative grass tufts. */
export function hasTuft(r, c) {
  const h = (Math.imul(r, 73856093) ^ Math.imul(c, 19349663)) >>> 0;
  return h % 8 === 0;
}

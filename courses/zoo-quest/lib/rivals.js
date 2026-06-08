// Persistent record of which adversaries the player has already faced to a finish, and
// how they did. Kept in its own `usePersistence('rivals')` key — deliberately separate
// from the `zoodex` store so adversaries never bleed into the Zoodex collection domain.
// Shape: { [rivalId]: 'won' | 'lost' }.

/** Read the faced-rivals map, defaulting to {} on an empty store. */
export function readRivals(store) {
  return store.get() ?? {};
}

/**
 * Record one rival's outcome (idempotent overwrite). `outcome` is 'won' when the player
 * answered every question correctly, otherwise 'lost'. Returns the next map.
 */
export function recordRival(store, id, outcome) {
  const next = { ...readRivals(store), [id]: outcome };
  store.set(next);
  return next;
}

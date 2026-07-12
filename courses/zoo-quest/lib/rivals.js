// Rivals the player has faced to a finish: { [rivalId]: 'won' | 'lost' }. Its own
// persistence key, kept out of the `zoodex` store so rivals never touch the collection.

export function readRivals(store) {
  return store.get() ?? {};
}

/**
 * Record one rival's outcome. 'won' means every question was answered correctly.
 */
export function recordRival(store, id, outcome) {
  const next = { ...readRivals(store), [id]: outcome };
  store.set(next);
  return next;
}

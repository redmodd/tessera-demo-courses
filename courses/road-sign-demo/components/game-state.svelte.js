// Shared reactive state between play.svelte (the quiz page) and quiz.svelte
// (the custom paced shell). The shell renders above the page, so passing state
// up via context isn't viable; this module is the bridge.

import { generateRounds, MODES } from './road-signs.js';

let rounds = $state([]);
let attemptOffset = $state(0);

export const game = {
  get rounds() {
    return rounds;
  },
  /** Idempotent: generates rounds on first call; safe to call from every page mount. */
  init() {
    if (rounds.length === 0) {
      rounds = generateRounds({ attemptOffset });
    }
  },
  /** Bump the mode-rotation offset and resample the round pool. */
  reroll() {
    attemptOffset = (attemptOffset + 1) % MODES.length;
    rounds = generateRounds({ attemptOffset });
  },
};

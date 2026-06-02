// Lightweight SFX player. Preloads HTMLAudioElements; the first play needs
// a user gesture (browser autoplay policy); the splash's "Enter" click
// triggers sfx.unlock() to satisfy that. Persistence of the mute toggle
// is owned by layout.svelte; this module just receives muted state.

// ES `?url` imports through the `$assets/` alias; Vite gives us hashed,
// build-bundled URLs and fails the build if any clip is missing.
import dealUrl from '$assets/sfx/switch_006.wav?url';
import selectUrl from '$assets/sfx/select_003.wav?url';
import correctUrl from '$assets/sfx/confirmation_001.wav?url';
import wrongUrl from '$assets/sfx/error_004.wav?url';
import tickUrl from '$assets/sfx/tick_002.wav?url';
import winUrl from '$assets/sfx/confirmation_004.wav?url';

const CUES = {
  deal: dealUrl,
  select: selectUrl,
  correct: correctUrl,
  wrong: wrongUrl,
  tick: tickUrl,
  win: winUrl,
};

const elements = {};
let unlocked = false;
let muted = false;
let lastTickAt = 0;

function ensureLoaded(key) {
  if (typeof window === 'undefined') return null;
  if (!elements[key]) {
    const src = CUES[key];
    if (!src) return null;
    const el = new Audio(src);
    el.preload = 'auto';
    el.volume = 0.5;
    elements[key] = el;
  }
  return elements[key];
}

function play(key) {
  if (muted) return;
  const el = ensureLoaded(key);
  if (!el) return;
  try {
    el.currentTime = 0;
    el.volume = 0.5;
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch {
    /* ignore; first play may need a gesture */
  }
}

// Throttled: the rAF loop in the shell calls this every frame in the last
// 3 seconds; we want one tick per second.
function tick() {
  if (muted) return;
  const now = performance.now();
  if (now - lastTickAt < 900) return;
  lastTickAt = now;
  play('tick');
}

function unlock() {
  unlocked = true;
}

function setMuted(value) {
  muted = !!value;
}

export const sfx = { play, tick, unlock, setMuted };

<script module>
  export const pageConfig = { title: 'Zoo Map' };
</script>

<script>
  import { onMount, onDestroy, tick, untrack } from 'svelte';
  import { useNavigation, usePersistence } from 'tessera-learn';
  import {
    WORLD,
    walkable,
    resolveLink,
    keeperAt,
    encounterFor,
    isStaffDoor,
  } from '../../../lib/worldmap.js';
  import { bfs, camOffset } from '../../../lib/engine.js';
  import { penTiles, wanderStep, roamTiles } from '../../../lib/npc.js';
  import { PEOPLE } from '../../../lib/people.js';
  import { readRivals, recordRival } from '../../../lib/rivals.js';
  import { ANIMALS, ENCOUNTERS, KEEPERS, readStore, onStoreChange } from '../../../lib/zoodex.js';
  import Explorer from '../../../components/Explorer.svelte';
  import Animal from '../../../components/Animal.svelte';
  import Keeper from '../../../components/Keeper.svelte';
  import Patron from '../../../components/Patron.svelte';
  import EncounterOverlay from '../../../components/EncounterOverlay.svelte';
  import KeeperOverlay from '../../../components/KeeperOverlay.svelte';
  import PatronOverlay from '../../../components/PatronOverlay.svelte';
  import EmployeesOnlyOverlay from '../../../components/EmployeesOnlyOverlay.svelte';
  import RivalOverlay from '../../../components/RivalOverlay.svelte';
  import GrassTuft from '../../../components/GrassTuft.svelte';
  import Icon from '../../../components/Icon.svelte';
  import { hasTuft } from '../../../lib/decor.js';

  const TILE = 56; // px per tile (sprites stay crisp; the window shows more of the map)
  const STEP_MS = 220;
  const FADE_MS = 120;
  const CRITTER_TICK_MS = 250; // how often we check which animals are due to step
  const ENCOUNTER_RATE = 0.5; // chance a grass step rolls its un-met encounter
  const PATRON_TICK_MS = 250; // poll: how often we check which patrons are due to step
  const PATRON_WANDER_MS = 1300; // a strolling patron takes a step about this often
  const PATRON_GLIDE_MS = 550; // glide per step — kept < wander so each step settles
  const PATRON_ROAM_RADIUS = 3; // tiles a roaming patron strays from home

  const MAP_LABELS = {
    entrance: 'Zoo Entrance',
    plaza: 'Central Plaza',
    savanna: 'Savanna',
    centre: 'Visitor Centre',
  };

  // Arrow keys / WASD → [rowDelta, colDelta].
  const KEYDIR = {
    arrowup: [-1, 0], w: [-1, 0],
    arrowdown: [1, 0], s: [1, 0],
    arrowleft: [0, -1], a: [0, -1],
    arrowright: [0, 1], d: [0, 1],
  };

  const TILES = {
    '.': { cls: 'ground', glyph: '' },
    '+': { cls: 'path', glyph: '' },
    '#': { cls: 'hedge', icon: 'tree' },
    '~': { cls: 'water', glyph: '' },
    g: { cls: 'grass', icon: 'leaf' },
    '>': { cls: 'connector', glyph: '' },
    F: { cls: 'fence', glyph: '' },
    p: { cls: 'pen', glyph: '' },
    K: { cls: 'keeper', glyph: '' }, // the Keeper sprite is drawn as a layer, not a glyph
    W: { cls: 'building', glyph: '' },
    D: { cls: 'door', icon: 'door' },
    E: { cls: 'staff-door', icon: 'door' },
    c: { cls: 'desk', glyph: '' },
    s: { cls: 'shelf', glyph: '' },
  };

  const nav = useNavigation();
  const store = usePersistence('zoodex');
  // Adversaries the player has already faced to a finish: { [id]: 'won' | 'lost' }. Its
  // own key, kept out of the zoodex store so rivals never touch the collection domain.
  const rivalStore = usePersistence('rivals');

  const saved = readStore(store);
  // Restore the saved position, but only if it's still valid on the *current* map.
  // Map edits (or a save from an older layout) can leave the avatar on a tile that's
  // now a wall/fence/pen or out of bounds — restoring it verbatim would trap the
  // player. When that happens, fall back to the start so movement always works.
  const restored =
    saved.map &&
    WORLD.maps[saved.map] &&
    saved.avatar &&
    walkable(WORLD.maps[saved.map].grid, saved.avatar.y, saved.avatar.x)
      ? { map: saved.map, r: saved.avatar.y, c: saved.avatar.x }
      : { map: WORLD.start.map, r: WORLD.start.r, c: WORLD.start.c };

  let mapId = $state(restored.map);
  let pos = $state({ r: restored.r, c: restored.c });
  // Collection now happens on the overworld (keeper overlays), so collected/badges can
  // change while mounted — hold them as reactive copies, refreshed on 'zoodex-change'.
  let collected = $state(saved.collected);
  let badges = $state(saved.badges);
  const refreshDex = () => {
    const s = readStore(store);
    collected = s.collected;
    badges = s.badges;
  };

  let facing = $state('down');
  let heldActive = $state(false);
  let moving = $state(false);
  let crossing = $state(false);
  let fading = $state(false);
  let snap = $state(false);
  let encounter = $state(null); // ENCOUNTERS entry while a grass overlay is open
  let keeper = $state(null); // ANIMALS entry while a keeper overlay is open
  let critters = $state([]); // penned animals on the current map
  let penSets = {}; // animal id → Set("r,c") of its pen tiles
  let patrons = $state([]); // people on the current map, with live {r,c}
  let patronRoamSets = {}; // patron id → Set("r,c") roam area (roamers only)
  let talking = $state(null); // the patron whose overlay is open
  let employeesOnly = $state(false); // the staff-only modal is open
  let rivals = $state(readRivals(rivalStore)); // faced rivals → past outcome
  let patronLoop = null;
  let held = [];
  let walkLoop = null;
  // Bumped to cancel an in-flight click-to-walk (walkTo / approach loops). Each loop
  // captures the current value and bails the moment it no longer matches — so pressing an
  // arrow key interrupts the auto-walk and hands control back from the current tile.
  let walkSeq = 0;
  let critterLoop = null;
  let stageEl;

  // Viewport size in px — drives the camera. Defaults are SSR-safe; real values land
  // in onMount and on resize.
  let winW = $state(960);
  let winH = $state(640);

  const map = $derived(WORLD.maps[mapId]);
  const keepersOnMap = $derived(WORLD.enclosures[mapId] ?? []);
  const walking = $derived(heldActive || moving);
  const busy = $derived(moving || crossing || !!encounter || !!keeper || !!talking || employeesOnly);

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Visible tiles scale with the window: a larger screen reveals more of the map, a
  // smaller one less. TILE is fixed (crisp sprites), so a wider/taller window simply
  // frames more rows and columns. The camera-follow clamp keeps the avatar in view.
  const tx = $derived(camOffset((pos.c + 0.5) * TILE, map.cols * TILE, winW));
  const ty = $derived(camOffset((pos.r + 0.5) * TILE, map.rows * TILE, winH));

  const status = $derived(`${MAP_LABELS[mapId] ?? mapId} — row ${pos.r}, column ${pos.c}`);

  // Water tiles, for the single board-spanning texture overlay (see the .water-layer SVG
  // in the template). One overlay masked to these cells keeps the fractal-noise surface
  // continuous across tiles, instead of N per-tile layers.
  const waterTiles = $derived(
    map.grid.flatMap((row, r) =>
      [...row].flatMap((code, c) => (code === '~' ? [{ r, c }] : [])),
    ),
  );

  // The blob filter rounds + displaces the water outline; seeding the displacement from
  // the map name gives each map's pond its own shape. The cells under the blob are painted
  // the shore colour (the terrain the pond sits in) so the blob's concave dips blend into
  // the bank rather than revealing a blue square edge.
  const TERRAIN_FILL = { ground: 'var(--ground-field)', path: 'var(--path)', grass: 'var(--tall-grass)' };
  const blobSeed = $derived([...mapId].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 100);

  // The dominant land terrain orthogonally adjacent to (r, c), or null if it only borders
  // water (a fully-interior tile, whose shore never shows — it sits under the blob).
  function dominantShore(r, c) {
    const counts = {};
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const cls = TILES[map.grid[r + dr]?.[c + dc]]?.cls;
      if (cls && TERRAIN_FILL[cls]) counts[cls] = (counts[cls] ?? 0) + 1;
    }
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return best ? TERRAIN_FILL[best] : null;
  }

  // Pond-wide majority shore — the fallback for interior tiles (no land neighbour) and
  // the board-level default for the .cell.water CSS rule.
  const shoreFill = $derived.by(() => {
    const counts = {};
    for (const { r, c } of waterTiles) {
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const cls = TILES[map.grid[r + dr]?.[c + dc]]?.cls;
        if (cls && TERRAIN_FILL[cls]) counts[cls] = (counts[cls] ?? 0) + 1;
      }
    }
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return TERRAIN_FILL[best] ?? 'var(--zoo-water)';
  });

  // Per-tile shore: each water cell blends into the bank it actually touches, so a pond
  // framed by path on three sides but open to grass below reads tan up top and green at
  // the bottom — instead of one pond-wide colour leaking against the wrong neighbour.
  const shoreFillByTile = $derived.by(() => {
    const m = new Map();
    for (const { r, c } of waterTiles) m.set(`${r},${c}`, dominantShore(r, c) ?? shoreFill);
    return m;
  });

  // Enclosure footprints in px, for the post-and-rail fence overlay. `bounds` is the pen
  // interior ('p'); the 'F' ring is one tile larger on every side, so the outer footprint
  // is the interior grown by a tile. The fence is drawn centred on that ring.
  const enclosurePens = $derived(
    (WORLD.enclosures[mapId] ?? []).map(({ animal, bounds }) => ({
      animal,
      x: (bounds.c0 - 1) * TILE,
      y: (bounds.r0 - 1) * TILE,
      w: (bounds.c1 - bounds.c0 + 3) * TILE,
      h: (bounds.r1 - bounds.r0 + 3) * TILE,
    })),
  );

  // Buildings drawn on the overworld: an SVG facade (roof + windows + door + sign) over
  // the whole footprint, so the door reads as part of the wall. The door tile underneath
  // stays walkable/clickable (the facade is pointer-events:none) and the avatar (z-index 2)
  // renders above the facade when stepping into it. `doorX/doorY` are the door's px offset
  // within the facade.
  const buildingsOnMap = $derived(
    (WORLD.buildings?.[mapId] ?? []).map(({ label, bounds, door }) => ({
      label,
      x: bounds.c0 * TILE,
      y: bounds.r0 * TILE,
      w: (bounds.c1 - bounds.c0 + 1) * TILE,
      h: (bounds.r1 - bounds.r0 + 1) * TILE,
      doorX: (door.c - bounds.c0) * TILE,
      doorY: (door.r - bounds.r0) * TILE,
    })),
  );

  // Evenly spaced left edges for `n` windows of width `ww` across a facade `w` px wide.
  function windowXs(w, n = 3, ww = 56) {
    const gap = (w - n * ww) / (n + 1);
    return Array.from({ length: n }, (_, i) => Math.round(gap + i * (ww + gap)));
  }

  // Persist position. Spread the *latest* persisted state so a move never clobbers a
  // card/badge a keeper overlay just wrote. The store read/write is wrapped in
  // untrack() so this effect depends only on mapId/pos — reading the store it also
  // writes would otherwise be an infinite update loop. (Avatar writes don't dispatch
  // the HUD event.)
  $effect(() => {
    const map = mapId;
    const avatar = { x: pos.c, y: pos.r };
    untrack(() => store.set({ ...readStore(store), map, avatar }));
  });

  // (Re)spawn penned animals and patrons whenever the map changes.
  $effect(() => {
    mapId; // track
    spawnCritters();
    spawnPatrons();
  });

  function spawnCritters() {
    const encs = WORLD.enclosures[mapId] ?? [];
    penSets = {};
    const list = [];
    const now = performance.now();
    for (const e of encs) {
      const tiles = penTiles(map.grid, e.bounds);
      penSets[e.animal] = new Set(tiles.map((t) => `${t.r},${t.c}`));
      const def = ANIMALS[e.animal];
      for (let i = 0; i < e.count && tiles.length; i++) {
        const t = tiles[(i * 2) % tiles.length];
        list.push({
          animal: e.animal,
          r: t.r,
          c: t.c,
          facing: 'right',
          wanderMs: def.wanderMs,
          glideMs: def.glideMs,
          nextAt: now + Math.random() * def.wanderMs, // stagger first steps
        });
      }
    }
    critters = list;
  }

  function spawnPatrons() {
    const people = PEOPLE[mapId] ?? [];
    patronRoamSets = {};
    const now = performance.now();
    patrons = people.map((p) => {
      if (p.roam) {
        const tiles = roamTiles(map.grid, p.home, PATRON_ROAM_RADIUS);
        patronRoamSets[p.id] = new Set(tiles.map((t) => `${t.r},${t.c}`));
      }
      return {
        ...p,
        r: p.home.r,
        c: p.home.c,
        wanderMs: PATRON_WANDER_MS,
        glideMs: PATRON_GLIDE_MS,
        nextAt: now + Math.random() * PATRON_WANDER_MS, // stagger first steps
      };
    });
  }

  // Roaming patrons stroll their home patch on their own staggered cadence — a
  // poll-and-schedule loop like the critters, so each glide settles before the next
  // step (no transform thrash). Frozen whenever the map is busy (a modal is open or the
  // avatar is mid-walk) so the patron you're approaching stays put, and never stepping
  // onto the avatar's tile so the two sprites can't overlap.
  function stepPatrons() {
    if (busy || !patrons.length) return;
    const now = performance.now();
    let changed = false;
    const next = patrons.map((p) => {
      if (!p.roam || now < p.nextAt) return p;
      changed = true;
      const avail = new Set(patronRoamSets[p.id]);
      avail.delete(`${pos.r},${pos.c}`);
      const np = wanderStep(avail, { r: p.r, c: p.c });
      return { ...p, r: np.r, c: np.c, nextAt: now + p.wanderMs * (0.7 + Math.random() * 0.6) };
    });
    if (changed) patrons = next;
  }

  // Each animal steps on its own cadence (lions quicker, elephants slower), with jitter
  // so they don't move in lockstep. The tick just advances whoever is due.
  function stepCritters() {
    if (!critters.length) return;
    const now = performance.now();
    let changed = false;
    const next = critters.map((cr) => {
      if (now < cr.nextAt) return cr;
      changed = true;
      const np = wanderStep(penSets[cr.animal], { r: cr.r, c: cr.c });
      const facing = np.c < cr.c ? 'left' : np.c > cr.c ? 'right' : cr.facing;
      return { ...cr, r: np.r, c: np.c, facing, nextAt: now + cr.wanderMs * (0.7 + Math.random() * 0.6) };
    });
    if (changed) critters = next;
  }

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Apply a tile's effect on entry. Returns true if it ended movement on this map.
  // (Keepers aren't handled here — their tile is blocked, so you can't step onto it;
  // you reach them by clicking, which routes through interactWithKeeper.)
  function enterTile(r, c) {
    const link = resolveLink(WORLD, mapId, { r, c });
    if (link) {
      crossTo(link);
      return true;
    }
    if (map.grid[r][c] === 'g') {
      // Skip animals already collected; an un-finished (fled) encounter stays findable.
      const id = encounterFor(WORLD, mapId, readStore(store).collected);
      if (id && Math.random() < ENCOUNTER_RATE) {
        stopLoop();
        encounter = ENCOUNTERS[id];
        return true;
      }
    }
    return false;
  }

  function resolveEncounter() {
    encounter = null;
    refreshDex(); // a freshly collected hidden animal updates the HUD count
    tick().then(() => stageEl?.focus());
  }

  function openKeeper(animalId) {
    keeper = ANIMALS[animalId];
  }

  function resolveKeeper() {
    keeper = null;
    refreshDex(); // pick up a freshly collected card / earned badge
    tick().then(() => stageEl?.focus());
  }

  // Pokémon-style area change: fade to black, swap the map under the black (snapped),
  // then fade back in. Input stays locked throughout.
  async function crossTo(link) {
    crossing = true;
    fading = true;
    await delay(FADE_MS);
    snap = true;
    mapId = link.to;
    pos = { r: link.entry.r, c: link.entry.c };
    await tick();
    fading = false;
    await delay(FADE_MS);
    snap = false;
    crossing = false;
  }

  const faceFor = (dr, dc) =>
    dr < 0 ? 'up' : dr > 0 ? 'down' : dc < 0 ? 'left' : 'right';

  function stepHeld() {
    if (held.length === 0) {
      stopLoop();
      return;
    }
    if (busy) return;
    const [dr, dc] = KEYDIR[held[held.length - 1]];
    facing = faceFor(dr, dc);
    const nr = pos.r + dr;
    const nc = pos.c + dc;
    // Bumping into a keeper starts the conversation (you still can't enter their tile).
    const animalId = keeperAt(WORLD, mapId, { r: nr, c: nc });
    if (animalId) {
      stopLoop();
      openKeeper(animalId);
      return;
    }
    // Bumping into a patron starts the conversation too (their tile is treated as blocked).
    const bumped = patronAt(nr, nc);
    if (bumped) {
      stopLoop();
      talking = bumped;
      return;
    }
    // The staff-only door looks enterable but only pops the "staff only" modal.
    if (isStaffDoor(map.grid, nr, nc)) {
      stopLoop();
      employeesOnly = true;
      return;
    }
    if (!walkable(map.grid, nr, nc)) return;
    pos = { r: nr, c: nc };
    enterTile(nr, nc);
  }

  function startLoop() {
    heldActive = true;
    if (walkLoop) return;
    stepHeld();
    walkLoop = setInterval(stepHeld, STEP_MS);
  }

  function stopLoop() {
    heldActive = false;
    if (walkLoop) {
      clearInterval(walkLoop);
      walkLoop = null;
    }
  }

  async function walkTo(r, c) {
    if (busy) return;
    const path = bfs(map.grid, pos, { r, c });
    if (!path || path.length === 0) return;
    const seq = ++walkSeq;
    moving = true;
    for (const step of path) {
      if (seq !== walkSeq) return; // interrupted (e.g. by an arrow key); canceller owns `moving`
      const onTile = patronAt(step.r, step.c);
      if (onTile) {
        facing = faceFor(step.r - pos.r, step.c - pos.c);
        talking = onTile;
        break;
      }
      facing = faceFor(step.r - pos.r, step.c - pos.c);
      pos = { r: step.r, c: step.c };
      if (enterTile(step.r, step.c)) break;
      if (!reduceMotion) await delay(STEP_MS);
    }
    if (seq === walkSeq) moving = false;
  }

  // Click a keeper → walk to the nearest reachable tile beside them, then talk.
  async function interactWithKeeper(r, c) {
    if (busy) return;
    const animalId = keeperAt(WORLD, mapId, { r, c });
    if (!animalId) return;
    let best = null;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const t = { r: r + dr, c: c + dc };
      if (!walkable(map.grid, t.r, t.c)) continue;
      const path = bfs(map.grid, pos, t);
      if (path && (!best || path.length < best.path.length)) best = { path };
    }
    if (!best) return; // no reachable spot beside the keeper
    const seq = ++walkSeq;
    moving = true;
    for (const step of best.path) {
      if (seq !== walkSeq) return; // arrow key interrupted the approach
      facing = faceFor(step.r - pos.r, step.c - pos.c);
      pos = { r: step.r, c: step.c };
      if (!reduceMotion) await delay(STEP_MS);
    }
    if (seq !== walkSeq) return; // cancelled before arriving — don't open the keeper
    moving = false;
    facing = faceFor(r - pos.r, c - pos.c); // turn toward the keeper
    openKeeper(animalId);
  }

  function patronAt(r, c) {
    return patrons.find((p) => p.r === r && p.c === c) ?? null;
  }

  // Click a patron → walk to the nearest reachable tile beside them, then talk. If
  // already adjacent (or the bump path), open immediately. Setting moving=true freezes
  // roaming during the approach, so the target stays put.
  async function interactWithPatron(patron) {
    if (busy) return;
    if (Math.abs(patron.r - pos.r) + Math.abs(patron.c - pos.c) <= 1) {
      talking = patron;
      return;
    }
    let best = null;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const t = { r: patron.r + dr, c: patron.c + dc };
      if (!walkable(map.grid, t.r, t.c)) continue;
      const path = bfs(map.grid, pos, t);
      if (path && (!best || path.length < best.path.length)) best = { path };
    }
    if (!best) return; // no reachable spot beside the patron
    const seq = ++walkSeq;
    moving = true;
    for (const step of best.path) {
      if (seq !== walkSeq) return; // arrow key interrupted the approach
      facing = faceFor(step.r - pos.r, step.c - pos.c);
      pos = { r: step.r, c: step.c };
      if (!reduceMotion) await delay(STEP_MS);
    }
    if (seq !== walkSeq) return; // cancelled before arriving — don't open the dialog
    moving = false;
    facing = faceFor(patron.r - pos.r, patron.c - pos.c); // turn toward the patron
    talking = patron;
  }

  function resolvePatron() {
    talking = null;
    tick().then(() => stageEl?.focus());
  }

  // Click the staff-only door → walk to the nearest reachable tile beside it, then pop
  // the modal. Mirrors interactWithKeeper's approach loop.
  async function interactWithStaffDoor(r, c) {
    if (busy) return;
    let best = null;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const t = { r: r + dr, c: c + dc };
      if (!walkable(map.grid, t.r, t.c)) continue;
      const path = bfs(map.grid, pos, t);
      if (path && (!best || path.length < best.path.length)) best = { path };
    }
    if (!best) {
      employeesOnly = true; // nowhere to stand beside it; just show the message
      return;
    }
    const seq = ++walkSeq;
    moving = true;
    for (const step of best.path) {
      if (seq !== walkSeq) return; // arrow key interrupted the approach
      facing = faceFor(step.r - pos.r, step.c - pos.c);
      pos = { r: step.r, c: step.c };
      if (!reduceMotion) await delay(STEP_MS);
    }
    if (seq !== walkSeq) return; // cancelled before arriving — don't open the modal
    moving = false;
    facing = faceFor(r - pos.r, c - pos.c); // turn toward the door
    employeesOnly = true;
  }

  function resolveEmployeesOnly() {
    employeesOnly = false;
    tick().then(() => stageEl?.focus());
  }

  // Tile clicks: keepers route to the approach-and-talk flow; everything else walks.
  function onCellClick(r, c) {
    const patron = patronAt(r, c);
    if (patron) interactWithPatron(patron);
    else if (keeperAt(WORLD, mapId, { r, c })) interactWithKeeper(r, c);
    else if (isStaffDoor(map.grid, r, c)) interactWithStaffDoor(r, c);
    else walkTo(r, c);
  }

  function onKeyDown(e) {
    if (encounter || keeper || talking || employeesOnly) return; // the open overlay owns the keyboard
    const k = e.key.toLowerCase();
    if (!(k in KEYDIR)) return;
    e.preventDefault();
    if (e.repeat) return;
    // Interrupt a click-to-walk in progress so this arrow takes over from the current tile.
    // Bumping walkSeq makes the in-flight loop bail; clearing `moving` frees up stepHeld.
    if (moving) {
      walkSeq++;
      moving = false;
    }
    if (!held.includes(k)) held.push(k);
    startLoop();
  }

  function onKeyUp(e) {
    const k = e.key.toLowerCase();
    if (!(k in KEYDIR)) return;
    held = held.filter((x) => x !== k);
    if (held.length === 0) stopLoop();
  }

  function onResize() {
    winW = window.innerWidth;
    winH = window.innerHeight;
  }

  onMount(() => {
    onResize();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);
    const unsub = onStoreChange(refreshDex);
    if (!reduceMotion) {
      critterLoop = setInterval(stepCritters, CRITTER_TICK_MS);
      patronLoop = setInterval(stepPatrons, PATRON_TICK_MS);
    }
    stageEl?.focus();
    return unsub;
  });
  onDestroy(() => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);
    stopLoop();
    if (critterLoop) clearInterval(critterLoop);
    if (patronLoop) clearInterval(patronLoop);
  });
</script>

<div
  class="stage"
  class:interior={WORLD.interiors.includes(mapId)}
  bind:this={stageEl}
  tabindex="-1"
  role="application"
  aria-label="Zoo overworld. Walk with the arrow keys or WASD, or press Tab to move between characters and Enter to talk to them."
>
  <div class="board area-{mapId}" class:smooth={!reduceMotion && !snap}
    style="--step:{STEP_MS}ms; --water-shore:{shoreFill}; width:{map.cols * TILE}px; height:{map.rows * TILE}px;
      transform: translate({tx}px, {ty}px);">
    {#each map.grid as row, r}
      {#each row as code, c}
        {@const t = TILES[code] ?? TILES['.']}
        {@const shore = t.cls === 'water' ? shoreFillByTile.get(`${r},${c}`) : null}
        <button
          class="cell {t.cls}"
          style="left:{c * TILE}px; top:{r * TILE}px; width:{TILE}px; height:{TILE}px;
            background-position:{-c * TILE}px {-r * TILE}px;{shore ? ` --water-shore:${shore};` : ''}"
          onclick={() => onCellClick(r, c)}
          tabindex="-1"
          aria-hidden="true"
        >
          {#if t.icon}<span class="glyph"><Icon name={t.icon} /></span>{/if}
          {#if t.cls === 'ground' && !WORLD.interiors.includes(mapId) && hasTuft(r, c)}<GrassTuft dry={mapId === 'savanna'} />{/if}
        </button>
      {/each}
    {/each}

    <!-- Water: one board-spanning SVG. A "goo" filter (blur + alpha threshold) fuses the
         water tiles into a rounded blob and a turbulence displacement — seeded per map —
         gives each pond its own organic outline. The blob is dilated so it laps onto the
         shore and never exposes a square tile corner; concave dips fall on the cells, which
         are painted the shore colour (--water-shore) so they blend into the bank. Blue fill
         + subtle static noise render inside the blob. -->
    {#if waterTiles.length}
      <svg class="water-layer" width={map.cols * TILE} height={map.rows * TILE}
        viewBox="0 0 {map.cols * TILE} {map.rows * TILE}" aria-hidden="true">
        <defs>
          <filter id="water-noise-{mapId}" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.026 0.011"
              numOctaves="2" seed="11" result="n" />
            <feColorMatrix in="n" type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.5 0 0 0 -0.26" />
          </filter>
          <filter id="water-blob-{mapId}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b" />
            <feColorMatrix in="b" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -4.5" result="g" />
            <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2"
              seed={blobSeed} result="t" />
            <feDisplacementMap in="g" in2="t" scale="20"
              xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <mask id="water-mask-{mapId}">
            <g filter="url(#water-blob-{mapId})" fill="white">
              {#each waterTiles as w (w.r + ':' + w.c)}
                <rect x={w.c * TILE} y={w.r * TILE} width={TILE} height={TILE} />
              {/each}
            </g>
          </mask>
        </defs>
        <g mask="url(#water-mask-{mapId})">
          <rect width="100%" height="100%" style="fill: var(--zoo-water)" />
          <rect width="100%" height="100%" filter="url(#water-noise-{mapId})" />
        </g>
      </svg>
    {/if}

    <!-- Enclosures: a continuous wooden post-and-rail fence around each pen, drawn on the
         'F' ring centreline, over a textured grass floor (the pen/fence cells supply the
         flat grass; this adds speckle). Three strokes make the rail read as wood: dark
         dashed posts poking through, a light continuous rail, a thin top highlight. Sits
         below the animal sprites, like the water layer. -->
    {#if enclosurePens.length}
      <svg class="enclosure-layer" width={map.cols * TILE} height={map.rows * TILE}
        viewBox="0 0 {map.cols * TILE} {map.rows * TILE}" aria-hidden="true">
        <defs>
          <filter id="pen-grass-{mapId}" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.04" numOctaves="2" seed="4" result="n" />
            <feColorMatrix in="n" type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.4 0 0 0 -0.2" />
          </filter>
        </defs>
        {#each enclosurePens as p (p.animal)}
          <rect x={p.x} y={p.y} width={p.w} height={p.h} filter="url(#pen-grass-{mapId})" />
          {@const fx = p.x + TILE / 2}
          {@const fy = p.y + TILE / 2}
          {@const fw = p.w - TILE}
          {@const fh = p.h - TILE}
          <rect x={fx} y={fy} width={fw} height={fh} rx="12" fill="none"
            stroke="#5a4634" stroke-width="22" stroke-dasharray="9 47" />
          <rect x={fx} y={fy} width={fw} height={fh} rx="12" fill="none"
            stroke="#8a6a44" stroke-width="11" />
          <rect x={fx} y={fy} width={fw} height={fh} rx="12" fill="none"
            stroke="#a9844f" stroke-width="3" />
        {/each}
      </svg>
    {/if}

    <!-- Buildings: an SVG facade over the whole footprint — overhanging shingled roof with
         a ridge highlight, stucco wall, two rows of paned windows, a storefront sign, and a
         framed doorway drawn into the wall at the door tile (which stays walkable beneath). -->
    {#each buildingsOnMap as b (b.label)}
      <div class="building" style="left:{b.x}px; top:{b.y}px; width:{b.w}px; height:{b.h}px;" aria-hidden="true">
        <svg class="facade" viewBox="0 0 {b.w} {b.h}" width={b.w} height={b.h}>
          <!-- wall -->
          <rect x="6" y="44" width={b.w - 12} height={b.h - 44} fill="#dcc6a2" stroke="#8a6a44" stroke-width="3" />
          <!-- roof: overhang + ridge highlight -->
          <polygon points="0,50 {b.w},50 {b.w - 24},8 24,8" fill="#7a4d30" stroke="#543824" stroke-width="3" stroke-linejoin="round" />
          <rect x="26" y="11" width={b.w - 52} height="5" rx="2" fill="rgba(255,255,255,0.18)" />
          <!-- windows: a single row of two, flanking the door below -->
          {#each windowXs(b.w, 2) as wx}
            <rect x={wx} y="82" width="56" height="48" rx="4" fill="#bfe0ea" stroke="#6f4630" stroke-width="4" />
            <line x1={wx + 28} y1="82" x2={wx + 28} y2="130" stroke="#6f4630" stroke-width="3" />
            <line x1={wx} y1="106" x2={wx + 56} y2="106" stroke="#6f4630" stroke-width="3" />
          {/each}
          <!-- door: a framed doorway reaching the building's base -->
          <rect x={b.doorX + 5} y={b.doorY - 8} width={TILE - 10} height={TILE + 8} rx="5" fill="#5a3a22" />
          <rect x={b.doorX + 11} y={b.doorY - 2} width={TILE - 22} height={TILE + 2} rx="3" fill="#a06a3a" />
          <circle cx={b.doorX + TILE - 17} cy={b.doorY + TILE / 2} r="3.2" fill="#f5d65b" />
        </svg>
        <span class="building-sign">{b.label}</span>
      </div>
    {/each}

    {#each keepersOnMap as e (e.animal)}
      <button class="sprite keeper-sprite"
        style="width:{TILE}px; height:{TILE}px;
          transform: translate3d({e.keeper.c * TILE}px, {e.keeper.r * TILE}px, 0);"
        onclick={() => interactWithKeeper(e.keeper.r, e.keeper.c)}
        aria-label={`Talk to the ${ANIMALS[e.animal].name} keeper`}>
        <Keeper {...KEEPERS[e.animal]} />
      </button>
    {/each}

    {#each critters as cr, i (i)}
      <div class="sprite critter" class:smooth={!reduceMotion}
        style="width:{TILE}px; height:{TILE}px; --cw:{cr.glideMs}ms;
          transform: translate3d({cr.c * TILE}px, {cr.r * TILE}px, 0);"
        aria-hidden="true">
        <Animal kind={cr.animal} flip={cr.facing === 'left'} />
      </div>
    {/each}

    {#each patrons as p (p.id)}
      <button class="sprite patron-sprite" class:smooth={!reduceMotion}
        style="width:{TILE}px; height:{TILE}px; --pw:{p.glideMs}ms;
          transform: translate3d({p.c * TILE}px, {p.r * TILE}px, 0);"
        onclick={() => interactWithPatron(p)}
        aria-label={`Talk to ${p.name}`}>
        <Patron {...p.look} />
      </button>
    {/each}

    <div class="avatar" class:smooth={!reduceMotion && !snap}
      style="--step:{STEP_MS}ms; --cycle:{STEP_MS * 2}ms; width:{TILE}px; height:{TILE}px;
        transform: translate3d({pos.c * TILE}px, {pos.r * TILE}px, 0);"
      aria-hidden="true">
      <Explorer {facing} {walking} />
    </div>
  </div>

  <div class="toolbar">
    <p class="hint"><strong>{MAP_LABELS[mapId] ?? mapId}</strong></p>
  </div>

  <div class="fade" class:on={fading} style="--fade:{FADE_MS}ms;" aria-hidden="true"></div>

  <p class="sr-status" aria-live="polite">{status}</p>
</div>

{#if encounter}
  <EncounterOverlay {encounter} onResolve={resolveEncounter} />
{/if}

{#if keeper}
  <KeeperOverlay animal={keeper} collected={collected.includes(keeper.id)} onResolve={resolveKeeper} />
{/if}

{#if talking}
  {#if talking.kind === 'rival'}
    <RivalOverlay
      patron={talking}
      onResolve={resolvePatron}
      faced={rivals[talking.id] ?? null}
      onComplete={(outcome) => {
        recordRival(rivalStore, talking.id, outcome);
        rivals = readRivals(rivalStore);
      }}
    />
  {:else}
    <PatronOverlay patron={talking} onResolve={resolvePatron} />
  {/if}
{/if}

{#if employeesOnly}
  <EmployeesOnlyOverlay onResolve={resolveEmployeesOnly} />
{/if}

<style>
  /* Full-window viewport, but in normal flow (not fixed) so #tessera-app keeps height
     — the headless a11y audit treats a zero-height app root as hidden. */
  .stage {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: var(--zoo-grass);
    outline: none;
  }
  /* The stage holds keyboard focus during play; suppress the framework's box-shadow
     focus ring (outline alone doesn't cover it). */
  .stage:focus,
  .stage:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .board {
    position: absolute;
    top: 0;
    left: 0;
  }
  .board.smooth {
    transition: transform var(--step, 130ms) linear;
  }

  .cell {
    position: absolute;
    margin: 0;
    padding: 0;
    border: none;
    display: grid;
    place-items: center;
    font-size: 1.7rem;
    cursor: pointer;
    background: var(--ground-field);
  }
  /* Tiles are decorative click targets (aria-hidden, not keyboard-focusable); the real
     keyboard path is the arrow keys + Map menu. Suppress the focus ring a mouse click
     leaves behind — otherwise a later keypress flips it to :focus-visible and a stray
     outline appears on a tile the player has already walked away from. */
  .cell:focus,
  .cell:focus-visible {
    outline: none;
    box-shadow: none; /* the framework draws its focus ring as a box-shadow, not an outline */
  }
  /* Dominant ground: a flat field colour broken up by a soft mottle. The per-cell
     background-position (set inline) shares one board-wide origin, so the mottle is
     continuous across tiles instead of repeating on the 56px grid. */
  .cell.ground {
    background:
      radial-gradient(40px 28px at 22% 32%, var(--mottle-hi), transparent 72%),
      radial-gradient(46px 32px at 72% 64%, var(--mottle-lo), transparent 72%),
      radial-gradient(30px 30px at 88% 22%, var(--mottle-lo), transparent 70%),
      radial-gradient(34px 24px at 45% 85%, var(--mottle-hi), transparent 72%),
      var(--ground-field);
    background-size: 150px 120px;
  }
  .cell.grass { background: var(--tall-grass); }
  .cell.path { background: var(--path); } /* groomed dirt route */
  /* Under the blob, the water cell shows the shore colour so the blob's concave dips read
     as bank, not a blue square edge. The blue water itself is painted by the .water-layer
     overlay. Falls back to blue if no shore terrain was found. */
  .cell.water { background: var(--water-shore, var(--zoo-water)); cursor: not-allowed; }
  /* Shimmer overlay sits above the flat water fill but below every sprite (which carry
     z-index ≥ 1), and never intercepts clicks. */
  .water-layer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
  }
  .cell.hedge { background: var(--zoo-hedge); cursor: not-allowed; }
  /* Pen and fence cells are one continuous grass floor; the wooden fence itself is drawn
     by the .enclosure-layer overlay on the ring centreline. */
  .cell.pen,
  .cell.fence { background: var(--pen-floor); cursor: not-allowed; }
  /* Enclosure fence/floor overlay: above the cells, below the animal sprites. */
  .enclosure-layer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
  }
  /* Building facade (SVG), drawn over the upper rows of a footprint (the base row with
     the door stays exposed). Above the tiles, below the sprites (z-index 2). */
  .building {
    position: absolute;
    z-index: 1;
    pointer-events: none;
  }
  .facade {
    position: absolute;
    inset: 0;
    display: block;
  }
  /* Storefront sign, mounted on the wall just below the roof. */
  .building-sign {
    position: absolute;
    left: 50%;
    top: 56px;
    transform: translateX(-50%);
    padding: 2px 10px;
    background: var(--zoo-dialog);
    border: 2px solid var(--zoo-bark);
    border-radius: 7px;
    font-size: 0.8rem;
    font-weight: 700;
    white-space: nowrap;
    color: var(--zoo-ink);
  }
  .cell.keeper { background: var(--ground-earth); }
  .cell.building { background: var(--building-wall); cursor: not-allowed; }
  .cell.door { background: var(--ground-earth); }
  .cell.staff-door { background: var(--building-wall); cursor: pointer; } /* clickable: pops the staff-only modal */
  .cell.desk { background: var(--desk-fill); cursor: not-allowed; }
  .cell.shelf { background: var(--shelf-fill); cursor: not-allowed; }

  /* ===== interior polish (Warm Wood) ===== */
  /* Dim warm void outside the room walls, so the interior reads as "inside" rather
     than an outdoor patch floating on grass. */
  .stage.interior { background: #2e2620; }
  /* Wood-panelled walls that clearly bound the room. */
  .board.area-centre .cell.building,
  .board.area-centre .cell.staff-door {
    background: #6f4630;
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.18);
  }
  /* Floor: a faint tile grid over the warm floor tone. */
  .board.area-centre .cell.ground {
    background: var(--ground-field);
    box-shadow: inset 0 0 0 1px rgba(120, 90, 50, 0.1);
  }
  .board.area-centre .cell.door { background: #b08a55; }
  /* Service desk: a wood counter with a lit top edge. */
  .board.area-centre .cell.desk {
    background: linear-gradient(#b5824a, #8a5e30);
    box-shadow: inset 0 6px 0 rgba(255, 255, 255, 0.18), inset 0 0 0 1px rgba(0, 0, 0, 0.22);
  }
  /* Gift-shop shelves: shelving rows dotted with colourful merchandise. */
  .board.area-centre .cell.shelf {
    background:
      radial-gradient(7px 7px at 28% 26%, #d05b4a, transparent 62%),
      radial-gradient(7px 7px at 70% 40%, #4a78d0, transparent 62%),
      radial-gradient(7px 7px at 40% 74%, #e0a93f, transparent 62%),
      repeating-linear-gradient(0deg, #7a5a38 0 12px, #654b30 12px 14px);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.22);
  }
  /* ===== end interior polish ===== */
  .cell.connector {
    background: var(--ground-earth);
    box-shadow: inset 0 0 0 2px rgba(194, 118, 47, 0.6);
  }
  .glyph { pointer-events: none; display: grid; place-items: center; }
  .glyph :global(svg) { width: 36px; height: 36px; }

  .sprite {
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
  }
  .critter { z-index: 1; }
  .critter.smooth { transition: transform var(--cw, 600ms) linear; }
  .keeper-sprite {
    z-index: 2;
    align-items: end; /* stands on its tile */
    pointer-events: auto; /* clickable: walk over and talk */
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
  }
  .keeper-sprite:focus { outline: none; }
  .keeper-sprite:focus-visible {
    outline: none;
    border-radius: 8px;
    box-shadow: 0 0 0 3px #fff, 0 0 0 6px var(--zoo-accent-deep);
  }

  .patron-sprite {
    z-index: 2;
    align-items: end; /* stands on its tile */
    pointer-events: auto; /* clickable: walk over and talk */
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
  }
  .patron-sprite:focus { outline: none; }
  .patron-sprite:focus-visible {
    outline: none;
    border-radius: 8px;
    box-shadow: 0 0 0 3px #fff, 0 0 0 6px var(--zoo-accent-deep);
  }
  .patron-sprite.smooth { transition: transform var(--pw, 380ms) linear; }

  .toolbar {
    position: absolute;
    top: 0.85rem;
    left: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
    z-index: 4;
  }
  .hint {
    margin: 0;
    padding: 0.4rem 0.7rem;
    background: var(--zoo-dialog);
    border: 2px solid var(--zoo-bark);
    border-radius: 8px;
    font-size: 0.9rem;
    color: var(--zoo-ink);
  }

  .fade {
    position: absolute;
    inset: 0;
    z-index: 5;
    background: #000;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--fade, 200ms) ease;
  }
  .fade.on { opacity: 1; }

  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 2;
    pointer-events: none;
    will-change: transform;
  }
  .avatar.smooth { transition: transform var(--step, 130ms) linear; }

  .sr-status {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
</style>

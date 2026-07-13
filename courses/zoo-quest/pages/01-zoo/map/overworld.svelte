<script module>
  export const pageConfig = { title: 'Zoo Map' };
</script>

<script>
  import { onMount, onDestroy, tick, untrack } from 'svelte';
  import { useNavigation, usePersistence } from 'tessera-learn';
  import {
    WORLD,
    TILE as CH,
    walkable,
    resolveLink,
    keeperAt,
    pickEncounter,
    isStaffDoor,
    isSign,
    signAt,
    isDisplay,
    exhibitAt,
  } from '../../../lib/worldmap.js';
  import { bfs, camOffset } from '../../../lib/engine.js';
  import { penTiles, wanderStep, roamTiles } from '../../../lib/npc.js';
  import { PEOPLE } from '../../../lib/people.js';
  import { ANIMALS, ENCOUNTERS, KEEPERS, readStore, onStoreChange } from '../../../lib/zoodex.js';
  import Explorer from '../../../components/Explorer.svelte';
  import Animal from '../../../components/Animal.svelte';
  import Keeper from '../../../components/Keeper.svelte';
  import Patron from '../../../components/Patron.svelte';
  import EncounterOverlay from '../../../components/EncounterOverlay.svelte';
  import KeeperOverlay from '../../../components/KeeperOverlay.svelte';
  import PatronOverlay from '../../../components/PatronOverlay.svelte';
  import SignOverlay from '../../../components/SignOverlay.svelte';
  import ExhibitOverlay from '../../../components/ExhibitOverlay.svelte';
  import RivalOverlay from '../../../components/RivalOverlay.svelte';
  import GrassTuft from '../../../components/GrassTuft.svelte';
  import InteriorDecor from '../../../components/InteriorDecor.svelte';
  import Icon from '../../../components/Icon.svelte';
  import { hasTuft } from '../../../lib/decor.js';
  import SavannaDecor from '../../../components/SavannaDecor.svelte';
  import PlazaDecor from '../../../components/PlazaDecor.svelte';
  import PolarDecor from '../../../components/PolarDecor.svelte';

  const TILE = 56; // px; CH.* are the grid characters
  const STEP_MS = 220;
  const FADE_MS = 120;
  const CRITTER_TICK_MS = 250;
  const ENCOUNTER_RATE = 0.06;
  const PATRON_TICK_MS = 250;
  const PATRON_WANDER_MS = 1300;
  const PATRON_GLIDE_MS = 550; // < wander, so each glide settles before the next step
  const PATRON_ROAM_RADIUS = 3;

  // A staff door is just a sign whose text turns you away.
  const STAFF_ONLY = { title: 'Staff Only', body: 'Sorry, this area’s for zoo staff only!', icon: 'door' };

  const MAP_LABELS = {
    plaza: 'Central Plaza',
    savanna: 'Savanna',
    centre: 'Gift Shop',
    discovery: 'Discovery Center',
    polar: 'Polar',
    'polar-discovery': 'Polar Research Station',
  };

  const KEYDIR = {
    arrowup: [-1, 0], w: [-1, 0],
    arrowdown: [1, 0], s: [1, 0],
    arrowleft: [0, -1], a: [0, -1],
    arrowright: [0, 1], d: [0, 1],
  };

  const TILES = {
    [CH.PATH]: { cls: 'ground' },
    [CH.PATH_DIRT]: { cls: 'path' },
    [CH.WALL]: { cls: 'hedge', icon: 'tree' },
    [CH.WATER]: { cls: 'water' },
    [CH.GRASS]: { cls: 'grass', icon: 'leaf' },
    [CH.CONNECTOR]: { cls: 'connector' },
    [CH.FENCE]: { cls: 'fence' },
    [CH.PEN]: { cls: 'pen' },
    [CH.KEEPER]: { cls: 'keeper' },
    [CH.BUILDING]: { cls: 'building' },
    [CH.DOOR]: { cls: 'door', icon: 'door' },
    [CH.STAFF_DOOR]: { cls: 'staff-door', icon: 'door' },
    [CH.DESK]: { cls: 'desk' },
    [CH.SHELF]: { cls: 'shelf' },
    [CH.RACK]: { cls: 'rack' },
    [CH.TABLE]: { cls: 'table' },
    [CH.VOID]: { cls: 'void' },
    [CH.SIGN]: { cls: 'sign', icon: 'sign' },
    [CH.DISPLAY]: { cls: 'display' },
    [CH.PROP]: { cls: 'prop' },
  };

  const nav = useNavigation();
  const store = usePersistence('zoodex');
  const rivalStore = usePersistence('rivals');

  const saved = readStore(store);
  // A map edit can leave a saved position on a tile that's now blocked — fall back to the
  // start rather than restoring the player into a wall.
  const restored =
    saved.map &&
    WORLD.maps[saved.map] &&
    saved.avatar &&
    walkable(WORLD.maps[saved.map].grid, saved.avatar.y, saved.avatar.x)
      ? { map: saved.map, r: saved.avatar.y, c: saved.avatar.x }
      : { map: WORLD.start.map, r: WORLD.start.r, c: WORLD.start.c };

  let mapId = $state(restored.map);
  let pos = $state({ r: restored.r, c: restored.c });
  let collected = $state(saved.collected);
  const refreshDex = () => (collected = readStore(store).collected);

  let facing = $state('down');
  let heldActive = $state(false);
  let moving = $state(false);
  let crossing = $state(false);
  let fading = $state(false);
  let snap = $state(false);
  let encounter = $state(null);
  let keeper = $state(null);
  let critters = $state([]);
  let penSets = {}; // animal id → Set("r,c") of its pen tiles
  let patrons = $state([]);
  let patronRoamSets = {}; // patron id → Set("r,c") roam area (roamers only)
  let talking = $state(null);
  let signInfo = $state(null);
  let exhibit = $state(null);
  // Rivals the player has faced to a finish: { [rivalId]: 'won' | 'lost' }. Its own key, so
  // rivals never touch the Zoodex collection.
  let rivals = $state(rivalStore.get() ?? {});
  let patronLoop = null;
  let held = [];
  let walkLoop = null;
  // Bumped to cancel an in-flight click-to-walk: each loop captures the value and bails
  // once it no longer matches, so an arrow key can interrupt an auto-walk.
  let walkSeq = 0;
  let critterLoop = null;
  let stageEl;

  let winW = $state(960);
  let winH = $state(640);

  const map = $derived(WORLD.maps[mapId]);
  const interior = $derived(WORLD.interiors.includes(mapId));
  const keepersOnMap = $derived(WORLD.enclosures[mapId] ?? []);
  const walking = $derived(heldActive || moving);
  const busy = $derived(moving || crossing || !!encounter || !!keeper || !!talking || !!signInfo || !!exhibit);

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const tx = $derived(camOffset((pos.c + 0.5) * TILE, map.cols * TILE, winW));
  const ty = $derived(camOffset((pos.r + 0.5) * TILE, map.rows * TILE, winH));

  const status = $derived(`${MAP_LABELS[mapId] ?? mapId} — row ${pos.r}, column ${pos.c}`);

  const waterTiles = $derived(
    map.grid.flatMap((row, r) =>
      [...row].flatMap((code, c) => (code === CH.WATER ? [{ r, c }] : [])),
    ),
  );

  const TERRAIN_FILL = { ground: 'var(--ground-field)', path: 'var(--path)', grass: 'var(--tall-grass)' };
  // Seeding the water blob's displacement from the map name gives each pond its own shape.
  const blobSeed = $derived([...mapId].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 100);

  // The terrain a water tile mostly borders — that's the colour its shore is painted.
  function dominantShore(tiles) {
    const counts = {};
    for (const { r, c } of tiles) {
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const cls = TILES[map.grid[r + dr]?.[c + dc]]?.cls;
        if (cls && TERRAIN_FILL[cls]) counts[cls] = (counts[cls] ?? 0) + 1;
      }
    }
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return best ? TERRAIN_FILL[best] : null;
  }

  // The whole pond's shore, used for tiles that border no terrain at all (mid-pond).
  const shoreFill = $derived(dominantShore(waterTiles) ?? 'var(--zoo-water)');

  const shoreFillByTile = $derived.by(() => {
    const m = new Map();
    for (const t of waterTiles) m.set(`${t.r},${t.c}`, dominantShore([t]) ?? shoreFill);
    return m;
  });

  // The 'F' ring is one tile larger than `bounds` on every side; the fence is drawn on it.
  const enclosurePens = $derived(
    (WORLD.enclosures[mapId] ?? []).map(({ animal, bounds }) => ({
      animal,
      x: (bounds.c0 - 1) * TILE,
      y: (bounds.r0 - 1) * TILE,
      w: (bounds.c1 - bounds.c0 + 3) * TILE,
      h: (bounds.r1 - bounds.r0 + 3) * TILE,
    })),
  );

  const buildingsOnMap = $derived(
    (WORLD.buildings?.[mapId] ?? []).map(({ label, style = 'shop', bounds, door }) => {
      const w = (bounds.c1 - bounds.c0 + 1) * TILE;
      const h = (bounds.r1 - bounds.r0 + 1) * TILE;
      const doorX = (door.c - bounds.c0) * TILE;
      const doorY = (door.r - bounds.r0) * TILE;
      // Two windows, each centred between the door and its corner; the wall interior runs
      // ~8px in from each side and the door occupies one tile at doorX.
      const winW = 32;
      const winH = 46;
      const winY = 44 + (h - 44) / 2 - winH / 2;
      const winXs = [
        Math.round((8 + doorX) / 2 - winW / 2),
        Math.round((doorX + TILE + (w - 8)) / 2 - winW / 2),
      ];
      const plankYs = [];
      for (let py = 60; py < h - 8; py += 16) plankYs.push(py);
      return { label, style, x: bounds.c0 * TILE, y: bounds.r0 * TILE, w, h, doorX, doorY, winW, winH, winY, winXs, plankYs };
    }),
  );

  // Interior walls are a band drawn on the outer edge of the floor tiles that face the void,
  // not blocked tiles of their own — so the player can walk right up to the wall.
  function wallEdge(r, c) {
    if (map.grid[r]?.[c] !== CH.PATH) return '';
    const outside = (rr, cc) => {
      const ch = map.grid[rr]?.[cc];
      return ch === undefined || ch === CH.VOID;
    };
    const top = outside(r - 1, c), bot = outside(r + 1, c);
    const left = outside(r, c - 1), right = outside(r, c + 1);
    if (top && left) return 'we-tl';
    if (top && right) return 'we-tr';
    if (bot && left) return 'we-bl';
    if (bot && right) return 'we-br';
    if (top) return 'we-top';
    if (bot) return 'we-bottom';
    if (left) return 'we-left';
    if (right) return 'we-right';
    return '';
  }

  // Spread the latest store so a move never clobbers a card a keeper overlay just wrote;
  // untrack the read, or this effect would loop on its own write.
  $effect(() => {
    const map = mapId;
    const avatar = { x: pos.c, y: pos.r };
    untrack(() => store.set({ ...readStore(store), map, avatar }));
  });

  $effect(() => {
    mapId;
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
          // Keyed by identity, not index — an index key lets Svelte reuse a node across
          // maps and .critter.smooth then glides the animal from the old pen to the new.
          id: `${e.animal}-${i}`,
          animal: e.animal,
          r: t.r,
          c: t.c,
          facing: 'right',
          wanderMs: def.wanderMs,
          glideMs: def.glideMs,
          nextAt: now + Math.random() * def.wanderMs,
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
        nextAt: now + Math.random() * PATRON_WANDER_MS,
      };
    });
  }

  // Frozen while the map is busy, so the patron you're walking toward stays put.
  function stepPatrons() {
    if (busy || !patrons.length) return;
    const now = performance.now();
    let changed = false;
    const next = patrons.map((p) => {
      if (!p.roam || now < p.nextAt) return p;
      changed = true;
      const avail = new Set(patronRoamSets[p.id]);
      avail.delete(`${pos.r},${pos.c}`); // never step onto the avatar
      const np = wanderStep(avail, { r: p.r, c: p.c });
      return { ...p, r: np.r, c: np.c, nextAt: now + p.wanderMs * (0.7 + Math.random() * 0.6) };
    });
    if (changed) patrons = next;
  }

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

  // Returns true if the tile's effect ended movement on this map.
  function enterTile(r, c) {
    const link = resolveLink(WORLD, mapId, { r, c });
    if (link) {
      crossTo(link);
      return true;
    }
    if (map.grid[r][c] === CH.GRASS && Math.random() < ENCOUNTER_RATE) {
      const id = pickEncounter(WORLD, mapId);
      if (id) {
        stopLoop();
        encounter = ENCOUNTERS[id];
        return true;
      }
    }
    return false;
  }

  function resolveEncounter() {
    encounter = null;
    refreshDex();
    tick().then(() => stageEl?.focus());
  }

  function resolveKeeper() {
    keeper = null;
    refreshDex();
    tick().then(() => stageEl?.focus());
  }

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
    // Everything interactive sits on a blocked tile; bumping one opens its dialog.
    if (openTarget(nr, nc)) {
      stopLoop();
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
      if (seq !== walkSeq) return; // the canceller owns `moving`
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

  function patronAt(r, c) {
    return patrons.find((p) => p.r === r && p.c === c) ?? null;
  }

  /**
   * Walk to the nearest walkable tile beside (r, c) and end up facing it. Everything the
   * player can bump into — keeper, patron, staff door, sign, display — sits on a blocked
   * tile, so reaching it always means standing next to it.
   *
   * Returns 'arrived' when the avatar is now beside the target, 'unreachable' when no
   * adjacent tile can be walked to (the caller may still open its dialog — a sign read
   * across a fence is friendlier than a dead click), or 'cancelled' when a newer walk took
   * over, in which case that walk owns `moving` and the caller must do nothing.
   */
  async function approach(r, c) {
    if (Math.abs(r - pos.r) + Math.abs(c - pos.c) <= 1) {
      facing = faceFor(r - pos.r, c - pos.c);
      return 'arrived';
    }
    let best = null;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const t = { r: r + dr, c: c + dc };
      if (!walkable(map.grid, t.r, t.c)) continue;
      const path = bfs(map.grid, pos, t);
      if (path && (!best || path.length < best.length)) best = path;
    }
    if (!best) return 'unreachable';

    const seq = ++walkSeq;
    moving = true;
    for (const step of best) {
      if (seq !== walkSeq) return 'cancelled';
      facing = faceFor(step.r - pos.r, step.c - pos.c);
      pos = { r: step.r, c: step.c };
      if (!reduceMotion) await delay(STEP_MS);
    }
    if (seq !== walkSeq) return 'cancelled';
    moving = false;
    facing = faceFor(r - pos.r, c - pos.c);
    return 'arrived';
  }

  /**
   * What the player can interact with on (r, c), or null. `open` is captured now, before any
   * walk, so a patron stepping away mid-approach can't swap the dialog out from under it.
   * `adjacentOnly` marks the ones you must actually reach: you can read a sign across a
   * fence, but you can't talk to a keeper you never got to.
   */
  function targetAt(r, c) {
    const animalId = keeperAt(WORLD, mapId, { r, c });
    if (animalId) return { open: () => (keeper = ANIMALS[animalId]), adjacentOnly: true };

    const patron = patronAt(r, c);
    if (patron) return { open: () => (talking = patron), adjacentOnly: true };

    if (isStaffDoor(map.grid, r, c)) return { open: () => (signInfo = STAFF_ONLY) };

    if (isSign(map.grid, r, c)) {
      const record = signAt(WORLD, mapId, { r, c });
      return { open: () => (signInfo = record) };
    }

    if (isDisplay(map.grid, r, c)) {
      const station = exhibitAt(WORLD, mapId, { r, c });
      const animal = ANIMALS[station?.animal];
      const display = animal?.exhibit?.displays?.[station.key];
      return display ? { open: () => (exhibit = { animal, display }) } : null;
    }
    return null;
  }

  // Bumped from the tile alongside: open it where we stand. True if anything opened.
  function openTarget(r, c) {
    const target = targetAt(r, c);
    target?.open();
    return !!target;
  }

  // Clicked from across the map: walk over, then open.
  async function approachTarget(r, c, target) {
    const arrival = await approach(r, c);
    if (arrival === 'cancelled') return;
    if (arrival === 'unreachable' && target.adjacentOnly) return;
    target.open();
  }

  function resolvePatron() {
    talking = null;
    tick().then(() => stageEl?.focus());
  }

  function resolveSign() {
    signInfo = null;
    tick().then(() => stageEl?.focus());
  }

  function resolveExhibit() {
    exhibit = null;
    tick().then(() => stageEl?.focus());
  }

  function onCellClick(r, c) {
    if (crossing || encounter || keeper || talking || signInfo || exhibit) return;
    // A fresh click overrides an in-flight walk, so the new target is honoured from the
    // current tile instead of queueing behind the old path.
    if (moving) {
      walkSeq++;
      moving = false;
    }
    const target = targetAt(r, c);
    if (target) approachTarget(r, c, target);
    else walkTo(r, c);
  }

  function onKeyDown(e) {
    if (encounter || keeper || talking || signInfo || exhibit) return;
    const k = e.key.toLowerCase();
    if (!(k in KEYDIR)) return;
    e.preventDefault();
    if (e.repeat) return;
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
  class:interior={interior}
  bind:this={stageEl}
  tabindex="-1"
  role="application"
  aria-label="Zoo overworld. Walk with the arrow keys or WASD, or press Tab to move between characters and Enter to talk to them."
>
  <div class="board area-{mapId}" class:interior class:smooth={!reduceMotion && !snap}
    style="--step:{STEP_MS}ms; --water-shore:{shoreFill}; width:{map.cols * TILE}px; height:{map.rows * TILE}px;
      transform: translate({tx}px, {ty}px);">
    {#each map.grid as row, r}
      {#each row as code, c}
        {@const t = TILES[code] ?? TILES[CH.PATH]}
        {@const shore = t.cls === 'water' ? shoreFillByTile.get(`${r},${c}`) : null}
        <button
          class="cell {t.cls}{interior ? ' ' + wallEdge(r, c) : ''}"
          style="left:{c * TILE}px; top:{r * TILE}px; width:{TILE}px; height:{TILE}px;
            background-position:{-c * TILE}px {-r * TILE}px;{shore ? ` --water-shore:${shore};` : ''}"
          onclick={() => onCellClick(r, c)}
          tabindex="-1"
          aria-hidden="true"
        >
          {#if t.icon}<span class="glyph"><Icon name={t.icon === 'tree' && mapId === 'polar' ? 'tree-snow' : t.icon} /></span>{/if}
          {#if t.cls === 'ground' && !interior && hasTuft(r, c)}<GrassTuft dry={mapId === 'savanna'} snow={mapId === 'polar'} />{/if}
        </button>
      {/each}
    {/each}

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

    {#each buildingsOnMap as b (b.label)}
      <div class="building" style="left:{b.x}px; top:{b.y}px; width:{b.w}px; height:{b.h}px;" aria-hidden="true">
        <svg class="facade" viewBox="0 0 {b.w} {b.h}" width={b.w} height={b.h}>
          {#if b.style === 'ranger'}
            <rect x="6" y="44" width={b.w - 12} height={b.h - 44} fill="#e8dcc0" stroke="#7a6a4a" stroke-width="3" />
            {#each b.plankYs as py}
              <line x1="8" y1={py} x2={b.w - 8} y2={py} stroke="#cdbd99" stroke-width="1.5" />
            {/each}
            <polygon points="0,50 {b.w},50 {b.w - 24},8 24,8" fill="#2f6b3f" stroke="#1d4528" stroke-width="3" stroke-linejoin="round" />
            <rect x="26" y="11" width={b.w - 52} height="5" rx="2" fill="rgba(255,255,255,0.22)" />
            {#each b.winXs as wx}
              <rect x={wx} y={b.winY} width={b.winW} height={b.winH} rx="3" fill="#bfe0ea" stroke="#5a4a30" stroke-width="3" />
              <line x1={wx + b.winW / 2} y1={b.winY} x2={wx + b.winW / 2} y2={b.winY + b.winH} stroke="#5a4a30" stroke-width="2" />
              <line x1={wx} y1={b.winY + b.winH / 3} x2={wx + b.winW} y2={b.winY + b.winH / 3} stroke="#5a4a30" stroke-width="2" />
              <line x1={wx} y1={b.winY + (b.winH * 2) / 3} x2={wx + b.winW} y2={b.winY + (b.winH * 2) / 3} stroke="#5a4a30" stroke-width="2" />
            {/each}
            <rect x={b.doorX + 5} y={b.doorY - 8} width={TILE - 10} height={TILE + 8} rx="5" fill="#4a3a26" />
            <rect x={b.doorX + 11} y={b.doorY - 2} width={TILE - 22} height={TILE + 2} rx="3" fill="#8a7048" />
            <circle cx={b.doorX + TILE - 17} cy={b.doorY + TILE / 2} r="3.2" fill="#f5d65b" />
          {:else}
            <rect x="6" y="44" width={b.w - 12} height={b.h - 44} fill="#dcc6a2" stroke="#8a6a44" stroke-width="3" />
            <polygon points="0,50 {b.w},50 {b.w - 24},8 24,8" fill="#7a4d30" stroke="#543824" stroke-width="3" stroke-linejoin="round" />
            <rect x="26" y="11" width={b.w - 52} height="5" rx="2" fill="rgba(255,255,255,0.18)" />
            {#each b.winXs as wx}
              <rect x={wx} y={b.winY} width={b.winW} height={b.winH} rx="3" fill="#bfe0ea" stroke="#6f4630" stroke-width="3" />
              <line x1={wx + b.winW / 2} y1={b.winY} x2={wx + b.winW / 2} y2={b.winY + b.winH} stroke="#6f4630" stroke-width="2" />
              <line x1={wx} y1={b.winY + b.winH / 3} x2={wx + b.winW} y2={b.winY + b.winH / 3} stroke="#6f4630" stroke-width="2" />
              <line x1={wx} y1={b.winY + (b.winH * 2) / 3} x2={wx + b.winW} y2={b.winY + (b.winH * 2) / 3} stroke="#6f4630" stroke-width="2" />
            {/each}
            <rect x={b.doorX + 5} y={b.doorY - 8} width={TILE - 10} height={TILE + 8} rx="5" fill="#5a3a22" />
            <rect x={b.doorX + 11} y={b.doorY - 2} width={TILE - 22} height={TILE + 2} rx="3" fill="#a06a3a" />
            <circle cx={b.doorX + TILE - 17} cy={b.doorY + TILE / 2} r="3.2" fill="#f5d65b" />
          {/if}
        </svg>
      </div>
    {/each}

    {#if interior}
      <InteriorDecor tile={TILE} {mapId} />
    {/if}

    {#if mapId === 'savanna'}
      <SavannaDecor tile={TILE} />
    {/if}

    {#if mapId === 'plaza'}
      <PlazaDecor tile={TILE} />
    {/if}

    {#if mapId === 'polar'}
      <PolarDecor tile={TILE} />
    {/if}

    {#each keepersOnMap as e (e.animal)}
      <button class="sprite keeper-sprite"
        style="width:{TILE}px; height:{TILE}px;
          transform: translate3d({e.keeper.c * TILE}px, {e.keeper.r * TILE}px, 0);"
        onclick={() => onCellClick(e.keeper.r, e.keeper.c)}
        aria-label={`Talk to the ${ANIMALS[e.animal].name} keeper`}>
        <Keeper {...KEEPERS[e.animal]} />
      </button>
    {/each}

    {#each critters as cr (cr.id)}
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
        onclick={() => onCellClick(p.r, p.c)}
        aria-label={`Talk to ${p.name}`}>
        {#if p.sprite === 'keeper'}<Keeper {...p.look} />{:else}<Patron {...p.look} />{/if}
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
        rivals = { ...rivals, [talking.id]: outcome };
        rivalStore.set(rivals);
      }}
    />
  {:else}
    <PatronOverlay patron={talking} onResolve={resolvePatron} />
  {/if}
{/if}

{#if signInfo}
  <SignOverlay {...signInfo} onResolve={resolveSign} />
{/if}

{#if exhibit}
  <ExhibitOverlay animal={exhibit.animal} display={exhibit.display} onResolve={resolveExhibit} />
{/if}

<style>
  /* In normal flow, not fixed: the a11y audit treats a zero-height app root as hidden. */
  .stage {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: var(--zoo-grass);
    outline: none;
  }
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
  /* Tiles are decorative click targets; suppress the focus ring a mouse click leaves
     behind, or a later keypress flips it to :focus-visible on an already-left tile. */
  .cell:focus,
  .cell:focus-visible {
    outline: none;
    box-shadow: none;
  }
  .cell.ground,
  .cell.prop {
    background:
      radial-gradient(40px 28px at 22% 32%, var(--mottle-hi), transparent 72%),
      radial-gradient(46px 32px at 72% 64%, var(--mottle-lo), transparent 72%),
      radial-gradient(30px 30px at 88% 22%, var(--mottle-lo), transparent 70%),
      radial-gradient(34px 24px at 45% 85%, var(--mottle-hi), transparent 72%),
      var(--ground-field);
    background-size: 150px 120px;
  }
  .cell.grass { background: var(--tall-grass); }
  .cell.grass .glyph { color: #5f7a3e; }
  .board.area-polar .cell.grass .glyph { color: #8f8259; }
  .cell.path { background: var(--path); }
  /* The cell shows the shore colour; .water-layer paints the blue water over it. */
  .cell.water { background: var(--water-shore, var(--zoo-water)); cursor: not-allowed; }
  .water-layer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
  }
  .cell.hedge { background: var(--zoo-hedge); cursor: not-allowed; }
  .cell.pen,
  .cell.fence { background: var(--pen-floor); cursor: not-allowed; }
  .enclosure-layer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
  }
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
  .cell.keeper { background: var(--ground-earth); }
  .cell.building { background: var(--ground-field); cursor: not-allowed; }
  .cell.door { background: var(--ground-field); }
  .cell.staff-door { background: var(--building-wall); cursor: pointer; }
  .cell.desk { background: var(--desk-fill); cursor: not-allowed; }
  .cell.shelf { background: var(--shelf-fill); cursor: not-allowed; }
  .cell.sign { background: var(--ground-field); cursor: pointer; }
  .cell.prop { cursor: default; }
  .cell.display { background: var(--ground-field); cursor: pointer; }
  .cell.void { background: transparent; box-shadow: none; cursor: default; }

  .stage.interior { background: #2e2620; }

  /* Interior walls: a band on the outer edge of the floor tiles that face the void. Every
     interior uses the same eight edges; only --wall changes. */
  .we-top { box-shadow: inset 0 14px 0 var(--wall); }
  .we-bottom { box-shadow: inset 0 -14px 0 var(--wall); }
  .we-left { box-shadow: inset 14px 0 0 var(--wall); }
  .we-right { box-shadow: inset -14px 0 0 var(--wall); }
  .we-tl { box-shadow: inset 0 14px 0 var(--wall), inset 14px 0 0 var(--wall); }
  .we-tr { box-shadow: inset 0 14px 0 var(--wall), inset -14px 0 0 var(--wall); }
  .we-bl { box-shadow: inset 0 -14px 0 var(--wall), inset 14px 0 0 var(--wall); }
  .we-br { box-shadow: inset 0 -14px 0 var(--wall), inset -14px 0 0 var(--wall); }

  /* Every interior is the same plank floor; only the wall and door line change. */
  .board.interior {
    --wall: #6f4630;
    --plank: #d8b079;
    --plank-seam: #c49a62;
    --door-line: rgba(194, 118, 47, 0.6);
  }
  .board.area-polar-discovery {
    --wall: #4f6173;
    --door-line: rgba(79, 97, 115, 0.6);
  }

  /* 28px plank period divides the 56px tile, so seams stay continuous across tiles. */
  .board.interior .cell.ground,
  .board.interior .cell.building,
  .board.interior .cell.rack,
  .board.interior .cell.display {
    background:
      repeating-linear-gradient(0deg, var(--plank) 0 26px, var(--plank-seam) 26px 28px),
      var(--plank);
    background-size: auto;
    box-shadow: none;
  }

  .board.interior .cell.door,
  .board.interior .cell.staff-door {
    background: var(--ground-earth);
    box-shadow: inset 0 0 0 2px var(--door-line);
  }
  .board.interior .cell.door .glyph,
  .board.interior .cell.staff-door .glyph { display: none; }

  /* Gift-shop fittings — the only interior with furniture. */
  .board.area-centre .cell.desk {
    background:
      linear-gradient(#caa063, #b07f3f) top / 100% 12px no-repeat,
      linear-gradient(#8a5e30, #6f4a26);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  }

  .board.area-centre .cell.shelf {
    background:
      radial-gradient(7px 7px at 20% 24%, #d05b4a, transparent 60%),
      radial-gradient(7px 7px at 50% 22%, #4a78d0, transparent 60%),
      radial-gradient(7px 7px at 80% 26%, #e0a93f, transparent 60%),
      radial-gradient(7px 7px at 22% 70%, #5aa86a, transparent 60%),
      radial-gradient(7px 7px at 52% 72%, #c060a0, transparent 60%),
      radial-gradient(7px 7px at 82% 68%, #d8c84a, transparent 60%),
      repeating-linear-gradient(0deg, #8a6440 0 26px, #6f4f31 26px 28px);
    background-size: auto;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.22);
  }

  .board.area-centre .cell.table {
    background:
      radial-gradient(8px 8px at 30% 38%, #d05b4a, transparent 60%),
      radial-gradient(8px 8px at 64% 32%, #4a78d0, transparent 60%),
      radial-gradient(8px 8px at 46% 66%, #e0a93f, transparent 60%),
      radial-gradient(7px 7px at 78% 60%, #5aa86a, transparent 60%),
      linear-gradient(#c39a5e, #a87c3c);
    background-size: auto;
    box-shadow: inset 0 3px 0 rgba(255, 255, 255, 0.15), inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  }

  .cell.connector {
    background: var(--ground-earth);
    box-shadow: inset 0 0 0 2px rgba(194, 118, 47, 0.6);
  }
  .glyph { pointer-events: none; display: grid; place-items: center; }
  .glyph :global(svg) { width: 36px; height: 36px; }
  .cell.hedge .glyph :global(svg) { width: 54px; height: 54px; }

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

  .keeper-sprite,
  .patron-sprite {
    z-index: 2;
    align-items: end;
    pointer-events: auto;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
  }
  .keeper-sprite:focus,
  .patron-sprite:focus { outline: none; }
  .keeper-sprite:focus-visible,
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

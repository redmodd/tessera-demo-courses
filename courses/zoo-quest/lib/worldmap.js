// Tile codes used in the string maps below.
export const TILE = {
  PATH: '.',
  WALL: '#',
  WATER: '~',
  GRASS: 'g',
  CONNECTOR: '>',
  FENCE: 'F', // enclosure fence — blocks the player
  PEN: 'p', // enclosure interior — animals roam here; the player can't enter
  KEEPER: 'K', // a keeper stands here; stepping onto it talks to them
  PATH_DIRT: '+', // groomed dirt path — walkable, just a visual route
  BUILDING: 'W', // building wall — exterior facade and interior walls; blocks the player
  DOOR: 'D', // a door that links to another map; walkable, entry triggers crossTo
  STAFF_DOOR: 'E', // looks like a door, but only opens the "staff only" modal; blocks
  DESK: 'c', // checkout counter — scenery the player can't walk onto
  SHELF: 's', // gift-shop wall shelving — scenery the player can't walk onto
  RACK: 'h', // clothing rack of hanging garments — blocks the player
  TABLE: 't', // gift-shop display table — blocks the player
  SIGN: 'I', // a lawn sign — blocks the player; approaching it opens an info modal
  DISPLAY: 'X', // an exhibit display panel — blocks; approaching it opens the exhibit modal
  VOID: 'o', // empty space outside a room's walls — transparent, blocks the player
};

// The keeper stands on their tile, so the player can't walk onto it — you approach an
// adjacent tile and talk to them (by clicking, or via the Map menu). Building walls,
// the staff-only door, and the desk/shelf furniture are obstacles too.
const BLOCKED = new Set([
  TILE.WALL, TILE.WATER, TILE.FENCE, TILE.PEN, TILE.KEEPER,
  TILE.BUILDING, TILE.STAFF_DOOR, TILE.DESK, TILE.SHELF, TILE.RACK, TILE.TABLE, TILE.SIGN,
  TILE.DISPLAY, TILE.VOID,
]);

/**
 * Is tile (r, c) on `grid` something the avatar can stand on? In-bounds and not a
 * wall/water/fence/pen/keeper. Grass and connectors are walkable — you step onto them
 * to trigger their effect; the keeper tile is an obstacle you approach from beside.
 */
export function walkable(grid, r, c) {
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[r].length) return false;
  return !BLOCKED.has(grid[r][c]);
}

/**
 * If `pos` on `mapId` is an edge connector, return `{ to, entry }` — the map to
 * switch to and the tile to arrive on. Otherwise null.
 */
export function resolveLink(world, mapId, pos) {
  const links = world.links?.[mapId] ?? [];
  const hit = links.find((l) => l.at.r === pos.r && l.at.c === pos.c);
  return hit ? { to: hit.to, entry: hit.entry } : null;
}

/**
 * The enclosure whose keeper stands at `pos` on `mapId`, or null. The overworld uses
 * this to open the right keeper overlay when the player steps onto a `K` tile.
 */
export function keeperRecordAt(world, mapId, pos) {
  const list = world.enclosures?.[mapId] ?? [];
  return list.find((e) => e.keeper.r === pos.r && e.keeper.c === pos.c) ?? null;
}

/** The animal slug of the keeper at `pos`, or null. */
export function keeperAt(world, mapId, pos) {
  return keeperRecordAt(world, mapId, pos)?.animal ?? null;
}

/** Is tile (r, c) on `grid` a staff-only door — the "employees only" trap? */
export function isStaffDoor(grid, r, c) {
  return grid[r]?.[c] === TILE.STAFF_DOOR;
}

/** Is tile (r, c) on `grid` a lawn sign — approaching it opens the info modal? */
export function isSign(grid, r, c) {
  return grid[r]?.[c] === TILE.SIGN;
}

/** Is tile (r, c) on `grid` an exhibit display panel — approaching it opens the exhibit? */
export function isDisplay(grid, r, c) {
  return grid[r]?.[c] === TILE.DISPLAY;
}

/**
 * The sign record (`{ at, title, body }`) at `pos` on `mapId`, or null. Drives the
 * generalized SignOverlay so each lawn sign carries its own title/body.
 */
export function signAt(world, mapId, pos) {
  const list = world.signs?.[mapId] ?? [];
  return list.find((s) => s.at.r === pos.r && s.at.c === pos.c) ?? null;
}

/**
 * The animal id of the exhibit whose `bounds` contain `pos` on `mapId`, or null. An
 * exhibit panel can span several tiles (a wide board), so any tile inside the inclusive
 * bounds resolves to the same animal. Parallels keeperAt for walk-up kiosks.
 */
export function exhibitAt(world, mapId, pos) {
  const list = world.exhibits?.[mapId] ?? [];
  const hit = list.find(
    (e) =>
      pos.r >= e.bounds.r0 && pos.r <= e.bounds.r1 &&
      pos.c >= e.bounds.c0 && pos.c <= e.bounds.c1,
  );
  return hit ? hit.animal : null;
}

/**
 * Pick one of `mapId`'s grass encounters at random, or null if the map has none. The
 * map's `encounters` entry is a pool of animal ids that can appear in its tall grass;
 * each successful grass roll picks one uniformly at random (`rng` is injectable for
 * tests). Collection never removes them — encounters repeat, and more ids can be added
 * to a map's pool over time.
 */
export function pickEncounter(world, mapId, rng = Math.random) {
  const pool = world.encounters?.[mapId] ?? [];
  if (pool.length === 0) return null;
  return pool[Math.floor(rng() * pool.length)];
}

/** Parse a string map into a { grid, rows, cols } record. */
export function parseMap(str) {
  const grid = str
    .replace(/^\n/, '')
    .replace(/\n$/, '')
    .split('\n')
    .map((line) => [...line]);
  return { grid, rows: grid.length, cols: grid[0].length };
}

// ---- The world: a hub you walk between, Pokémon-style, into a real Savanna. ----
// '.' path  '#' wall/scenery  '~' water  'g' grass (encounter)  '>' edge connector
// 'F' enclosure fence  'p' pen interior (animals roam; player blocked)  'K' keeper.
// LINKS say where each connector leads; ENCLOSURES place the pens, their wandering
// animals, and the keeper out front. The entrance and plaza share one 32×20 size with
// connectors on row 10; the savanna is larger (40×26) with its connector on row 13, so
// maps are no longer uniform — each map carries its own size.

const ENTRANCE = parseMap(`
################################
#..............................#
#..............................#
#...............#..............#
#......###............###......#
#......###............###......#
#......###............###......#
#..............................#
#.............~~~~.............#
#.............~~~~.............#
#++++++++++++++++++++++++++++++>
#..............................#
#..............................#
#..............................#
#......###............###......#
#......###............###......#
#......###......#.....###......#
#..............................#
#..............................#
################################
`);

const PLAZA = parseMap(`
################################
#..............................#
#............WWWWW.............#
#.....###....WWWWW.....###.....#
#.....###....WWDWW.....###.....#
#.....###....I.+.......###.....#
#..............+...............#
#..............+...............#
#..........++++++++++..........#
#..........++~~~~~~++..........#
>++++++++++++~~~~~~++++++++++++>
#..........++~~~~~~++..........#
#..........++~~~~~~++..........#
#..........++++++++++..........#
#..............................#
#.....###..............###.....#
#.....###..............###.....#
#.....###..............###.....#
#..............................#
################################
`);

// The enlarged savanna (40×26). The Discovery Center building sits just past the entry
// (upper-left); the elephant pen is upper-right and the lion pen bottom-right, each with
// a keeper out front. A central watering hole, a squirrel grass patch, dirt trails that
// route around the water, and scenery groves fill it out. The left connector is on row
// 13 (not the shared row 10) — this is the first non-32×20 overworld map.
const SAVANNA = parseMap(`
########################################
#......................................#
#......................FFFFFFFF........#
#......................FppppppF........#
#.....WWWWW............FppppppF........#
#.....WWWWW............FppppppF........#
#.....WWDWW............FFFFFFFF........#
#......I+.......##.........+...........#
#.......+.......##........K+...........#
#.......+..................+.....##....#
#.......+..................+.....##....#
#.......+..................+...........#
#.......+.........~~~~~....+...........#
>+++++++++++++++++~~~~~....+...........#
#........gggggg..+~~~~~....+...........#
#........gggggg..++++++++++++++........#
#.....##.gggggg...............+........#
#.....##......................+FFFFFFFF#
#.............................+FppppppF#
#............................K+FppppppF#
#......##.....................+FppppppF#
#......##.....................+FFFFFFFF#
#......................................#
#......................................#
#......................................#
########################################
`);

// The Discovery Center interior — a single exhibit room that auto-centres in the
// viewport. The south door (D) returns to the savanna. Two walk-up exhibit display
// panels (X) — a lion board on the left, an elephant board on the right — sit against
// the back wall; bumping or clicking one opens its readable exhibit modal. Both doors
// sit just outside the walls, reached through an opening ringed by void ('o'). Walls/
// floor/boards are styled by .area-discovery + InteriorDecor.
const DISCOVERY = parseMap(`
ooooooooooooooooo
WWWWWWWWWWWWWWWWW
W...............W
W..XXX.....XXX..W
W...............W
W...............W
W...............W
W...............W
W...............W
W...............W
WWWWWWWW.WWWWWWWW
ooooooooDoooooooo
`);

// The gift shop interior — a small room that auto-centres in the viewport. The south
// door (D) returns to the plaza; the back-wall door (E) is the staff-only trap. Filled
// with merchandise: wall shelves (s) split around the staff door, clothing racks (h),
// a display table (t), and a checkout counter (c) the lone shopkeeper stands behind (see
// PEOPLE.centre). Both doors sit just *outside* the walls, reached through an opening: the
// staff-only door (E) above the top wall and the exit (D) below the bottom wall, each ringed
// by empty void ('o'). Walls/doors/floor/fixtures are styled by .area-centre + InteriorDecor.
const CENTRE = parseMap(`
oooooooooEoooooooo
WWWWWWWWW.WWWWWWWW
W................W
W.ssssss..ssssss.W
W................W
W..hhh.....ttt...W
W................W
W..hhh...........W
W.......cccc.....W
W................W
WWWWWWWW.WWWWWWWWW
ooooooooDooooooooo
`);

export const WORLD = {
  start: { map: 'entrance', r: 10, c: 3 },
  maps: {
    entrance: ENTRANCE,
    plaza: PLAZA,
    savanna: SAVANNA,
    centre: CENTRE,
    discovery: DISCOVERY,
  },
  // Interior maps auto-centre in the viewport and don't use edge connectors.
  interiors: ['centre', 'discovery'],
  // Each connector links to a tile just *inside* the destination, so arriving never
  // lands you back on a connector (which would loop straight back).
  links: {
    entrance: [{ at: { r: 10, c: 31 }, to: 'plaza', entry: { r: 10, c: 1 } }],
    plaza: [
      { at: { r: 10, c: 0 }, to: 'entrance', entry: { r: 10, c: 30 } },
      { at: { r: 10, c: 31 }, to: 'savanna', entry: { r: 13, c: 1 } },
      { at: { r: 4, c: 15 }, to: 'centre', entry: { r: 9, c: 8 } },
    ],
    savanna: [
      { at: { r: 13, c: 0 }, to: 'plaza', entry: { r: 10, c: 30 } },
      { at: { r: 6, c: 8 }, to: 'discovery', entry: { r: 9, c: 8 } }, // Discovery Center door
    ],
    centre: [{ at: { r: 11, c: 8 }, to: 'plaza', entry: { r: 5, c: 15 } }],
    discovery: [{ at: { r: 11, c: 8 }, to: 'savanna', entry: { r: 7, c: 8 } }],
  },
  // Pens and their keepers. `bounds` is the 'p' interior (where animals wander);
  // `keeper` is the walkable tile out front; `count` is how many animals to spawn.
  enclosures: {
    savanna: [
      { animal: 'lion', bounds: { r0: 18, r1: 20, c0: 32, c1: 37 }, keeper: { r: 19, c: 29 }, count: 5 },
      { animal: 'elephant', bounds: { r0: 3, r1: 5, c0: 24, c1: 29 }, keeper: { r: 8, c: 26 }, count: 4 },
    ],
  },
  // Buildings drawn on the overworld (roof + sign overlay). `bounds` is the full
  // footprint of 'W' tiles; `door` is the link tile in its base. `style` selects the
  // facade ('shop' = stucco + brown shingles; 'ranger' = plank + green gable + INFO board).
  buildings: {
    plaza: [
      { label: 'Gift Shop', style: 'shop', bounds: { r0: 2, r1: 4, c0: 13, c1: 17 }, door: { r: 4, c: 15 } },
    ],
    savanna: [
      { label: 'Discovery Center', style: 'ranger', bounds: { r0: 4, r1: 6, c0: 6, c1: 10 }, door: { r: 6, c: 8 } },
    ],
  },
  // Walk-up exhibit kiosks inside interior rooms. `bounds` is the inclusive footprint of
  // 'X' display tiles; any tile inside it opens that animal's exhibit modal.
  exhibits: {
    discovery: [
      { animal: 'lion', bounds: { r0: 3, r1: 3, c0: 3, c1: 5 } },
      { animal: 'elephant', bounds: { r0: 3, r1: 3, c0: 11, c1: 13 } },
    ],
  },
  // Lawn/standing signs: bumping or clicking one opens an info modal with this title/body.
  signs: {
    plaza: [
      { at: { r: 5, c: 13 }, title: 'Gift Shop',
        body: 'Welcome! Step inside for plush toys, mugs, tees, and souvenirs.' },
    ],
    savanna: [
      { at: { r: 7, c: 7 }, title: 'Savanna Discovery Center',
        body: 'Step inside to learn about the animals — then test yourself with the keepers.' },
    ],
  },
  // The pool of encounters that can appear in a map's tall grass. Each successful grass
  // roll picks one at random (see pickEncounter). One per map for now, but the array
  // lets a map host several findable animals later.
  encounters: {
    savanna: ['squirrel'],
  },
};

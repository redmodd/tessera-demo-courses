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
  PROP: 'B', // silent scenery prop (bench, bin, cart …) — blocks, no glyph, no popup
};

// The keeper stands on their tile, so the player can't walk onto it — you approach an
// adjacent tile and talk to them (by clicking, or via the Map menu). Building walls,
// the staff-only door, and the desk/shelf furniture are obstacles too.
const BLOCKED = new Set([
  TILE.WALL, TILE.WATER, TILE.FENCE, TILE.PEN, TILE.KEEPER,
  TILE.BUILDING, TILE.STAFF_DOOR, TILE.DESK, TILE.SHELF, TILE.RACK, TILE.TABLE, TILE.SIGN,
  TILE.DISPLAY, TILE.VOID, TILE.PROP,
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

/** The tiles a display station covers: `span` cells along its row, starting at `at`. */
export function exhibitFootprint(station) {
  const tiles = [];
  for (let i = 0; i < (station.span ?? 1); i++) tiles.push({ r: station.at.r, c: station.at.c + i });
  return tiles;
}

/**
 * The display station whose footprint contains `pos` on `mapId`, or null. A station spans
 * `span` tiles along its row (a wide board), so any tile under it resolves to the same
 * station. Returns the station record ({ animal, key, at, span }) — the caller looks up its
 * content via ANIMALS[animal].exhibit.displays[key]. Parallels keeperAt for walk-up kiosks.
 */
export function exhibitAt(world, mapId, pos) {
  const list = world.exhibits?.[mapId] ?? [];
  return (
    list.find(
      (s) => pos.r === s.at.r && pos.c >= s.at.c && pos.c < s.at.c + (s.span ?? 1),
    ) ?? null
  );
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
#B...........~~................#
#..BBB..I....~~................#
#..B.B.......~~................#
#..BBB.......~~................#
#..B.B.......~~................#
#............~~..............BB.#
#.####...++++~~++++..........BB.#
#.####...++++~~++++..........BB.#
#.####...++++~~++++..........BB.#
>++++++++++++++++++++++++++++++>
#.####...++++~~++++..........BB.#
#.####...++++~~++++..........BB.#
#.####...++++~~++++..........BB.#
#............~~..............BB.#
#............~~................#
#............~~................#
#............~~................#
#.......I....~~................#
################################
`);

// The plaza is deliberately *not* four-fold symmetric — that read as a grid, not a place.
// A central gift-shop facade (W, door D→centre at r4,c15) overlooks a chamfered reflecting
// pond, the main boulevard (row 10) splitting around it as a roundabout. The four tree
// groves are each a different irregular shape at staggered offsets; the food carts cluster
// — ice cream + snacks down the west path, drinks + souvenirs off the east — rather than
// sitting one-per-quadrant. Benches, lamps, a bin, and planters (all 'B' props drawn by
// PlazaDecor) scatter unevenly to give the square some life. Connector tiles, the door, the
// pond ring, and every patron's home tile stay walkable (see lib/world.test.js invariants).
const PLAZA = parseMap(`
################################
#.........B....................#
#............WWWWW.............#
#....###.....WWWWW.......#.....#
#.....##.....WWDWW........##...#
#....##......I.+...............#
#......B+....B.+.......+B..#...#
#.......+...B..+.......+.......#
#......B+..++++++++++..+.......#
#...B...+..+++~~~~+++..+.......#
>++++++++++++~~~~~~++++++++++++>
#...BB.....++~~~~~~++..+.......#
#..........+++~~~~+++..+.......#
#..........++++++++++..+B......#
#..................B...+.......#
#....#....................#....#
#....##..................##....#
#....###..................#....#
#....................B.........#
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
#.....##.gggggg.......+.......+........#
#.....##..............+I......+FFFFFFFF#
#.....................+.......+FppppppF#
#.....................+......K+FppppppF#
#......##.............+.......+FppppppF#
#......##..........BB+++BB....+FFFFFFFF#
#..................BBB+BB..............#
#...................BB+BB..............#
#.....................+................#
######################>#################
`);

// The Discovery Center interior — a gallery room that auto-centres in the viewport. The
// south door (D) returns to the savanna. Twelve walk-up display panels (X) fill the room:
// a lion gallery on the left, an elephant gallery on the right, each a mix of display
// types (poster, diet, size, touchscreen, specimen case, range map). Every X tile belongs
// to a station in WORLD.exhibits.discovery; bumping or clicking one opens that station's
// focused modal. A clear lane down column 8 leads to the door. The whole room is walkable
// floor ('.') enclosed by void ('o'); the slim wall is a band drawn on the floor's outer
// edge (see wallEdge), so the player can walk right up to it. Floor/walls are styled by
// .area-discovery; each panel's art is drawn by InteriorDecor from the station's type.
const DISCOVERY = parseMap(`
ooooooooooooooooo
.................
..X...X...X...X..
.................
..X...........X..
.................
..X...........X..
.................
.................
..X...X...X...X..
.................
ooooooooDoooooooo
`);

// The gift shop interior — a small room that auto-centres in the viewport. The south
// door (D) returns to the plaza; the north door (E) is the staff-only trap. Filled with
// merchandise: wall shelves (s), clothing racks (h), a display table (t), and a checkout
// counter (c) the lone shopkeeper stands behind (see PEOPLE.centre). The whole room is
// walkable floor ('.') enclosed by void ('o'); the slim wall is a band drawn on the
// floor's outer edge (see wallEdge), so the player can walk right up to it. Both doors sit
// just past the floor in the void — the staff door (E) above, the exit (D) below — each
// breaking the wall band where the floor meets it. Floor/doors/fixtures are styled by
// .area-centre + InteriorDecor.
const CENTRE = parseMap(`
oooooooooEoooooooo
..................
..................
..ssssss..ssssss..
..................
...hhh.....ttt....
..................
...hhh............
........cccc......
..................
..................
ooooooooDooooooooo
`);

// The Polar region (40×26), reached through the savanna's east edge. Snow-themed: a
// frozen lake in the middle, the penguin colony pen upper-right and the polar-bear den
// lower-right (each fenced, with a keeper out front), the Polar Research Station building
// upper-left (its door 'D' leads to the polar Discovery Center), a snowy encounter patch
// ('g') west of the lake, and a hot-cocoa hut ('B', drawn by PolarDecor) bottom-left. The
// north connector (a path down column 14) returns to the savanna — you arrive here by
// walking south out of the savanna. Frosty colours come from .area-polar.
const POLAR = parseMap(`
##############>#########################
#.............+........................#
#....WWWWW....+........FFFFFFFF....##..#
#....WWWWW....+........FppppppF........#
#....WWDWW....+........FppppppF........#
#.....I+......+........FppppppF........#
#......+......+........FFFFFFFF........#
#......+......+...........K............#
#......+......+........................#
#..#...+..gggg+........................#
#......+..gggg+........................#
#......+..gggg+.~~~~~..................#
#......+......+~~~~~~~.................#
#++++++++++++++~~~~~~~.................#
#......+........~~~~~..................#
#................~~~...................#
#...#..................................#
#..............................K.......#
#...........................FFFFFFFF...#
#...........................FppppppF...#
#...........................FppppppF...#
#......I....................FppppppF...#
#......BB...................FFFFFFFF...#
#...................#..................#
#......................................#
########################################
`);

// The Polar Discovery Center interior — same gallery shape as the savanna's, auto-centred
// in the viewport. The south door (D) returns to the polar map. Twelve walk-up panels (X):
// a penguin gallery on the left, a polar-bear gallery on the right. Styled by .area-polar-discovery.
const POLAR_DISCOVERY = parseMap(`
ooooooooooooooooo
.................
..X...X...X...X..
.................
..X...........X..
.................
..X...........X..
.................
.................
..X...X...X...X..
.................
ooooooooDoooooooo
`);

export const WORLD = {
  start: { map: 'plaza', r: 10, c: 1 },
  maps: {
    entrance: ENTRANCE,
    plaza: PLAZA,
    savanna: SAVANNA,
    centre: CENTRE,
    discovery: DISCOVERY,
    polar: POLAR,
    'polar-discovery': POLAR_DISCOVERY,
  },
  // Interior maps auto-centre in the viewport and don't use edge connectors.
  interiors: ['centre', 'discovery', 'polar-discovery'],
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
      { at: { r: 25, c: 22 }, to: 'polar', entry: { r: 1, c: 14 } }, // south edge → Polar (its north path)
    ],
    centre: [{ at: { r: 11, c: 8 }, to: 'plaza', entry: { r: 5, c: 15 } }],
    discovery: [{ at: { r: 11, c: 8 }, to: 'savanna', entry: { r: 7, c: 8 } }],
    polar: [
      { at: { r: 0, c: 14 }, to: 'savanna', entry: { r: 24, c: 22 } }, // north edge → Savanna (its south path)
      { at: { r: 4, c: 7 }, to: 'polar-discovery', entry: { r: 9, c: 8 } }, // Research Station door
    ],
    'polar-discovery': [{ at: { r: 11, c: 8 }, to: 'polar', entry: { r: 5, c: 7 } }],
  },
  // Pens and their keepers. `bounds` is the 'p' interior (where animals wander);
  // `keeper` is the walkable tile out front; `count` is how many animals to spawn.
  enclosures: {
    savanna: [
      { animal: 'lion', bounds: { r0: 18, r1: 20, c0: 32, c1: 37 }, keeper: { r: 19, c: 29 }, count: 5 },
      { animal: 'elephant', bounds: { r0: 3, r1: 5, c0: 24, c1: 29 }, keeper: { r: 8, c: 26 }, count: 4 },
    ],
    polar: [
      { animal: 'penguin', bounds: { r0: 3, r1: 5, c0: 24, c1: 29 }, keeper: { r: 7, c: 26 }, count: 6 },
      { animal: 'polar-bear', bounds: { r0: 19, r1: 21, c0: 29, c1: 34 }, keeper: { r: 17, c: 31 }, count: 2 },
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
    polar: [
      { label: 'Research Station', style: 'ranger', bounds: { r0: 2, r1: 4, c0: 5, c1: 9 }, door: { r: 4, c: 7 } },
    ],
  },
  // Walk-up display stations inside interior rooms. Each station occupies `span` 'X' tiles
  // along row `at.r` from column `at.c`; its `key` names the entry in
  // ANIMALS[animal].exhibit.displays (which carries the display `type` + content). Lions
  // fill the left of the Discovery Center, elephants the right; the mix of types gives the
  // room variety. Footprints must line up with the 'X' tiles in the DISCOVERY map above.
  exhibits: {
    discovery: [
      // Top row — lion left, elephant right
      { animal: 'lion',     key: 'pride', at: { r: 2, c: 2  } },
      { animal: 'lion',     key: 'diet',  at: { r: 2, c: 6  } },
      { animal: 'elephant', key: 'herd',  at: { r: 2, c: 10 } },
      { animal: 'elephant', key: 'diet',  at: { r: 2, c: 14 } },
      // Left wall — lion
      { animal: 'lion',     key: 'range', at: { r: 4, c: 2  } },
      { animal: 'lion',     key: 'build', at: { r: 6, c: 2  } },
      // Right wall — elephant
      { animal: 'elephant', key: 'range', at: { r: 4, c: 14 } },
      { animal: 'elephant', key: 'tusks', at: { r: 6, c: 14 } },
      // Bottom row — lion left, elephant right
      { animal: 'lion',     key: 'roar',  at: { r: 9, c: 2  } },
      { animal: 'lion',     key: 'size',  at: { r: 9, c: 6  } },
      { animal: 'elephant', key: 'ears',  at: { r: 9, c: 10 } },
      { animal: 'elephant', key: 'size',  at: { r: 9, c: 14 } },
    ],
    'polar-discovery': [
      // Top row — penguin left, polar bear right
      { animal: 'penguin',    key: 'colony', at: { r: 2, c: 2  } },
      { animal: 'penguin',    key: 'diet',   at: { r: 2, c: 6  } },
      { animal: 'polar-bear', key: 'arctic', at: { r: 2, c: 10 } },
      { animal: 'polar-bear', key: 'diet',   at: { r: 2, c: 14 } },
      // Left wall — penguin
      { animal: 'penguin',    key: 'range',  at: { r: 4, c: 2  } },
      { animal: 'penguin',    key: 'build',  at: { r: 6, c: 2  } },
      // Right wall — polar bear
      { animal: 'polar-bear', key: 'range',  at: { r: 4, c: 14 } },
      { animal: 'polar-bear', key: 'coat',   at: { r: 6, c: 14 } },
      // Bottom row — penguin left, polar bear right
      { animal: 'penguin',    key: 'swim',   at: { r: 9, c: 2  } },
      { animal: 'penguin',    key: 'size',   at: { r: 9, c: 6  } },
      { animal: 'polar-bear', key: 'nose',   at: { r: 9, c: 10 } },
      { animal: 'polar-bear', key: 'size',   at: { r: 9, c: 14 } },
    ],
  },
  // Lawn/standing signs: bumping or clicking one opens an info modal with this title/body.
  signs: {
    entrance: [
      { at: { r: 2, c: 8 }, title: 'Zoo Entrance',
        body: 'Welcome to the City Zoo! Ticket booths are just ahead.\n\nAdult: $12 · Child (3–12): $8 · Family of four: $36.' },
      { at: { r: 18, c: 8 }, title: 'Zoo Entrance',
        body: 'Thank you for visiting! We hope you enjoyed the lions, elephants, and everything in between. See you next time!' },
    ],
    plaza: [
      { at: { r: 5, c: 13 }, title: 'Gift Shop',
        body: 'Welcome! Step inside for plush toys, mugs, tees, and souvenirs.' },
    ],
    savanna: [
      { at: { r: 7, c: 7 }, title: 'Savanna Discovery Center',
        body: 'Step inside to learn about the animals — then test yourself with the keepers.' },
      { at: { r: 17, c: 23 }, title: "Marco's Snack Shack",
        body: 'Samosas, roasted peanuts, and mango lemonade. Perfect for a hot savanna day!' },
    ],
    polar: [
      { at: { r: 5, c: 6 }, title: 'Polar Research Station',
        body: 'Step inside to learn about the penguins and polar bears — then test yourself with the keepers.' },
      { at: { r: 21, c: 7 }, title: 'Polar Snack Hut',
        body: 'Hot cocoa, cinnamon buns, and maple toffee. Just the thing to warm up on the ice!' },
    ],
  },
  // The pool of encounters that can appear in a map's tall grass. Each successful grass
  // roll picks one at random (see pickEncounter). One per map for now, but the array
  // lets a map host several findable animals later.
  encounters: {
    savanna: ['squirrel'],
    polar: ['snowy-owl'],
  },
};

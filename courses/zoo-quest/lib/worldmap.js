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
  DESK: 'c', // service-desk counter — scenery the player can't walk onto
  SHELF: 's', // gift-shop shelving — scenery the player can't walk onto
};

// The keeper stands on their tile, so the player can't walk onto it — you approach an
// adjacent tile and talk to them (by clicking, or via the Map menu). Building walls,
// the staff-only door, and the desk/shelf furniture are obstacles too.
const BLOCKED = new Set([
  TILE.WALL, TILE.WATER, TILE.FENCE, TILE.PEN, TILE.KEEPER,
  TILE.BUILDING, TILE.STAFF_DOOR, TILE.DESK, TILE.SHELF,
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

/**
 * The encounter assigned to `mapId` that the player has NOT met yet, or null. Met
 * encounters are identified by id in `metIds` (the store's `fieldNotes`). Stepping on
 * grass rolls only when this returns a value.
 */
export function encounterFor(world, mapId, metIds = []) {
  const id = world.encounters?.[mapId];
  if (!id) return null;
  return metIds.includes(id) ? null : id;
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
// animals, and the keeper out front. All maps share one explorable size (32×20) with
// connectors aligned on row 10. Other regions append to plaza/links/enclosures later.

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
#...........WWWWWWW............#
#...........WWWWWWW............#
#.....###...WWWWWWW....###.....#
#.....###...WWWDWWW....###.....#
#.....###......+.......###.....#
#..............+...............#
#..............+...............#
#..........+++++++++...........#
#..........++~~~~~~+...........#
>++++++++++++~~~~~~++++++++++++>
#...........+~~~~~~+...........#
#............~~~~~~............#
#..............................#
#..............................#
#.....###..............###.....#
#.....###..............###.....#
#.....###..............###.....#
#..............................#
################################
`);

// Two fenced enclosures (lion NW, elephant NE) with keepers out front, a central
// watering hole, a grass patch for the squirrel, and scenery groves.
const SAVANNA = parseMap(`
################################
#..............................#
#...............#..............#
#...FFFFFFFF........FFFFFFFF...#
#...FppppppF........FppppppF...#
#...FppppppF........FppppppF...#
#...FppppppF........FppppppF...#
#...FFFFFFFF........FFFFFFFF...#
#......K...............K.......#
#+++++++++++++++++++++++.......#
>+.............................#
#.............................##
#..............................#
#....gg......~~~~~~~...........#
#....gg......~~~~~~~...........#
#............~~~~~~~...........#
#........###..........###......#
#...#....###..........###......#
#..............................#
################################
`);

// The visitor centre interior — a small room that auto-centres in the viewport. The
// south door (D) returns to the plaza; the back-wall door (E) is the staff-only trap.
// Service desk (c) on the left, gift-shop shelves (s) on the right; the clerk and
// shopkeeper (see PEOPLE.centre) stand in front of each.
const CENTRE = parseMap(`
WWWWWWWWWEWWWWWWWW
W................W
W.cccc.....ssss..W
W.cccc.....ssss..W
W................W
W................W
W................W
W................W
W................W
WWWWWWWWDWWWWWWWWW
`);

export const WORLD = {
  start: { map: 'entrance', r: 10, c: 3 },
  maps: {
    entrance: ENTRANCE,
    plaza: PLAZA,
    savanna: SAVANNA,
    centre: CENTRE,
  },
  // Interior maps don't share the 32×20 overworld size and don't use edge connectors.
  interiors: ['centre'],
  // Each connector links to a tile just *inside* the destination, so arriving never
  // lands you back on a connector (which would loop straight back).
  links: {
    entrance: [{ at: { r: 10, c: 31 }, to: 'plaza', entry: { r: 10, c: 1 } }],
    plaza: [
      { at: { r: 10, c: 0 }, to: 'entrance', entry: { r: 10, c: 30 } },
      { at: { r: 10, c: 31 }, to: 'savanna', entry: { r: 10, c: 1 } },
      { at: { r: 4, c: 15 }, to: 'centre', entry: { r: 8, c: 8 } },
    ],
    savanna: [{ at: { r: 10, c: 0 }, to: 'plaza', entry: { r: 10, c: 30 } }],
    centre: [{ at: { r: 9, c: 8 }, to: 'plaza', entry: { r: 5, c: 15 } }],
  },
  // Pens and their keepers. `bounds` is the 'p' interior (where animals wander);
  // `keeper` is the walkable tile out front; `count` is how many animals to spawn.
  enclosures: {
    savanna: [
      { animal: 'lion', bounds: { r0: 4, r1: 6, c0: 5, c1: 10 }, keeper: { r: 8, c: 7 }, count: 5 },
      { animal: 'elephant', bounds: { r0: 4, r1: 6, c0: 21, c1: 26 }, keeper: { r: 8, c: 23 }, count: 4 },
    ],
  },
  // Buildings drawn on the overworld (roof + sign overlay). `bounds` is the full
  // footprint of 'W' tiles; `door` is the link tile in its base.
  buildings: {
    plaza: [
      { label: 'Visitor Centre', bounds: { r0: 1, r1: 4, c0: 12, c1: 18 }, door: { r: 4, c: 15 } },
    ],
  },
  // Which encounter waits in a map's grass. One per map for now.
  encounters: {
    savanna: 'squirrel',
  },
};

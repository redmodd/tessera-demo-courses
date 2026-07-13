export const TILE = {
  PATH: '.',
  WALL: '#',
  WATER: '~',
  GRASS: 'g',
  CONNECTOR: '>',
  FENCE: 'F',
  PEN: 'p',
  KEEPER: 'K',
  PATH_DIRT: '+',
  BUILDING: 'W',
  DOOR: 'D',
  STAFF_DOOR: 'E',
  DESK: 'c',
  SHELF: 's',
  RACK: 'h',
  TABLE: 't',
  SIGN: 'I',
  DISPLAY: 'X',
  VOID: 'o',
  PROP: 'B',
};

const BLOCKED = new Set([
  TILE.WALL, TILE.WATER, TILE.FENCE, TILE.PEN, TILE.KEEPER,
  TILE.BUILDING, TILE.STAFF_DOOR, TILE.DESK, TILE.SHELF, TILE.RACK, TILE.TABLE, TILE.SIGN,
  TILE.DISPLAY, TILE.VOID, TILE.PROP,
]);

export function walkable(grid, r, c) {
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[r].length) return false;
  return !BLOCKED.has(grid[r][c]);
}

export function resolveLink(world, mapId, pos) {
  const links = world.links?.[mapId] ?? [];
  const hit = links.find((l) => l.at.r === pos.r && l.at.c === pos.c);
  return hit ? { to: hit.to, entry: hit.entry } : null;
}

export function keeperAt(world, mapId, pos) {
  const list = world.enclosures?.[mapId] ?? [];
  return list.find((e) => e.keeper.r === pos.r && e.keeper.c === pos.c)?.animal ?? null;
}

export function isStaffDoor(grid, r, c) {
  return grid[r]?.[c] === TILE.STAFF_DOOR;
}

export function isSign(grid, r, c) {
  return grid[r]?.[c] === TILE.SIGN;
}

export function isDisplay(grid, r, c) {
  return grid[r]?.[c] === TILE.DISPLAY;
}

export function signAt(world, mapId, pos) {
  const list = world.signs?.[mapId] ?? [];
  return list.find((s) => s.at.r === pos.r && s.at.c === pos.c) ?? null;
}

export function exhibitAt(world, mapId, pos) {
  const list = world.exhibits?.[mapId] ?? [];
  return list.find((s) => s.at.r === pos.r && s.at.c === pos.c) ?? null;
}

export function pickEncounter(world, mapId, rng = Math.random) {
  const pool = world.encounters?.[mapId] ?? [];
  if (pool.length === 0) return null;
  return pool[Math.floor(rng() * pool.length)];
}

export function parseMap(str) {
  const grid = str
    .replace(/^\n/, '')
    .replace(/\n$/, '')
    .split('\n')
    .map((line) => [...line]);
  return { grid, rows: grid.length, cols: grid[0].length };
}

// The plaza is where the visit starts, so its west edge is a wall, not a connector.
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
#++++++++++++~~~~~~++++++++++++>
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

// Both discovery interiors share one floor plan — the exhibits and decor differ, not the room.
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

const POLAR = parseMap(`
##############>#########################
#.............+....................#...#
#....WWWWW....+........FFFFFFFF....##..#
#....WWWWW....+........FppppppF...##...#
#....WWDWW....+........FppppppF....#...#
#.....I+......+........FppppppF........#
#......+......+........FFFFFFFF........#
#......+......+...........K............#
#......+......+++++++++++++......B.....#
#..#...+..gggg+...........+........#...#
#......+..gggg+...........+.......##...#
#......+..gggg+.~~~~~.....+........#...#
#......+......+~~~~~~~....+............#
#++++++++++++++~~~~~~~....+............#
#......+........~~~~~.....+...B.....#..#
#......+.........~~~......+........##..#
#...#..+++++++++++++++++++++++++.......#
#......+.......................K.......#
#......+....................FFFFFFFF...#
#......+....##..............FppppppF#..#
#......+....##...BBBB.......FppppppF##.#
#.......BB...#..............FppppppF#..#
#............B..............FFFFFFFF...#
#..#................#...##.............#
#..#....................#..............#
########################################
`);

export const WORLD = {
  start: { map: 'plaza', r: 10, c: 1 },
  maps: {
    plaza: PLAZA,
    savanna: SAVANNA,
    centre: CENTRE,
    discovery: DISCOVERY,
    polar: POLAR,
    'polar-discovery': DISCOVERY,
  },
  interiors: ['centre', 'discovery', 'polar-discovery'],
  // Each `entry` sits just inside the destination — landing on a connector would loop back.
  links: {
    plaza: [
      { at: { r: 10, c: 31 }, to: 'savanna', entry: { r: 13, c: 1 } },
      { at: { r: 4, c: 15 }, to: 'centre', entry: { r: 9, c: 8 } },
    ],
    savanna: [
      { at: { r: 13, c: 0 }, to: 'plaza', entry: { r: 10, c: 30 } },
      { at: { r: 6, c: 8 }, to: 'discovery', entry: { r: 9, c: 8 } },
      { at: { r: 25, c: 22 }, to: 'polar', entry: { r: 1, c: 14 } },
    ],
    centre: [{ at: { r: 11, c: 8 }, to: 'plaza', entry: { r: 5, c: 15 } }],
    discovery: [{ at: { r: 11, c: 8 }, to: 'savanna', entry: { r: 7, c: 8 } }],
    polar: [
      { at: { r: 0, c: 14 }, to: 'savanna', entry: { r: 24, c: 22 } },
      { at: { r: 4, c: 7 }, to: 'polar-discovery', entry: { r: 9, c: 8 } },
    ],
    'polar-discovery': [{ at: { r: 11, c: 8 }, to: 'polar', entry: { r: 5, c: 7 } }],
  },
  // `bounds` is the 'p' interior the animals wander; `keeper` is the walkable tile out front.
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
  // `bounds` is the full 'W' footprint; `door` is the link tile in its base.
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
  // `key` names the entry in ANIMALS[animal].exhibit.displays; `at` must line up with an 'X' tile.
  exhibits: {
    discovery: [
      { animal: 'lion',     key: 'pride', at: { r: 2, c: 2  } },
      { animal: 'lion',     key: 'diet',  at: { r: 2, c: 6  } },
      { animal: 'elephant', key: 'herd',  at: { r: 2, c: 10 } },
      { animal: 'elephant', key: 'diet',  at: { r: 2, c: 14 } },
      { animal: 'lion',     key: 'range', at: { r: 4, c: 2  } },
      { animal: 'lion',     key: 'build', at: { r: 6, c: 2  } },
      { animal: 'elephant', key: 'range', at: { r: 4, c: 14 } },
      { animal: 'elephant', key: 'tusks', at: { r: 6, c: 14 } },
      { animal: 'lion',     key: 'roar',  at: { r: 9, c: 2  } },
      { animal: 'lion',     key: 'size',  at: { r: 9, c: 6  } },
      { animal: 'elephant', key: 'ears',  at: { r: 9, c: 10 } },
      { animal: 'elephant', key: 'size',  at: { r: 9, c: 14 } },
    ],
    'polar-discovery': [
      { animal: 'penguin',    key: 'colony', at: { r: 2, c: 2  } },
      { animal: 'penguin',    key: 'diet',   at: { r: 2, c: 6  } },
      { animal: 'polar-bear', key: 'arctic', at: { r: 2, c: 10 } },
      { animal: 'polar-bear', key: 'diet',   at: { r: 2, c: 14 } },
      { animal: 'penguin',    key: 'range',  at: { r: 4, c: 2  } },
      { animal: 'penguin',    key: 'build',  at: { r: 6, c: 2  } },
      { animal: 'polar-bear', key: 'range',  at: { r: 4, c: 14 } },
      { animal: 'polar-bear', key: 'coat',   at: { r: 6, c: 14 } },
      { animal: 'penguin',    key: 'swim',   at: { r: 9, c: 2  } },
      { animal: 'penguin',    key: 'size',   at: { r: 9, c: 6  } },
      { animal: 'polar-bear', key: 'nose',   at: { r: 9, c: 10 } },
      { animal: 'polar-bear', key: 'size',   at: { r: 9, c: 14 } },
    ],
  },
  signs: {
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
    ],
  },
  encounters: {
    savanna: ['squirrel'],
    polar: ['snowy-owl'],
  },
};

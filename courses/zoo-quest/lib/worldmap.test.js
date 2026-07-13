import { describe, test, expect } from 'vitest';
import { walkable, resolveLink, keeperAt, isStaffDoor, isDisplay, exhibitAt, WORLD } from './worldmap.js';
import { bfs } from './engine.js';

// grid: '.' path, '#' wall, '~' water, 'F' fence, 'p' pen, 'K' keeper, '>' connector
const grid = [
  ['.', '#', '~'],
  ['F', 'p', 'K'],
  ['>', '.', '.'],
];

describe('walkable', () => {
  test('path tiles are walkable', () => {
    expect(walkable(grid, 0, 0)).toBe(true);
  });

  test('walls and water are not walkable', () => {
    expect(walkable(grid, 0, 1)).toBe(false);
    expect(walkable(grid, 0, 2)).toBe(false);
  });

  test('fence, pen, and keeper tiles are not walkable — they are obstacles', () => {
    expect(walkable(grid, 1, 0)).toBe(false); // fence
    expect(walkable(grid, 1, 1)).toBe(false); // pen
    expect(walkable(grid, 1, 2)).toBe(false); // keeper (you approach from beside)
  });

  test('connector tiles are walkable — you step onto them', () => {
    expect(walkable(grid, 2, 0)).toBe(true); // connector
  });

  test('out-of-bounds is not walkable', () => {
    expect(walkable(grid, -1, 0)).toBe(false);
    expect(walkable(grid, 0, -1)).toBe(false);
    expect(walkable(grid, 3, 0)).toBe(false);
    expect(walkable(grid, 0, 3)).toBe(false);
  });
});

// A fixture world: two maps connected by edge connectors, one enclosure with a keeper.
const world = {
  links: {
    entrance: [{ at: { r: 0, c: 1 }, to: 'savanna', entry: { r: 4, c: 1 } }],
    savanna: [{ at: { r: 4, c: 1 }, to: 'entrance', entry: { r: 0, c: 1 } }],
  },
  enclosures: {
    savanna: [
      { animal: 'lion', bounds: { r0: 1, r1: 1, c0: 1, c1: 1 }, keeper: { r: 2, c: 2 }, count: 1 },
    ],
  },
};

describe('resolveLink', () => {
  test('returns the target map and entry tile when standing on a connector', () => {
    expect(resolveLink(world, 'entrance', { r: 0, c: 1 })).toEqual({
      to: 'savanna',
      entry: { r: 4, c: 1 },
    });
  });

  test('returns null when not on a connector', () => {
    expect(resolveLink(world, 'entrance', { r: 1, c: 1 })).toBeNull();
  });

  test('returns null for a map with no links', () => {
    expect(resolveLink(world, 'nowhere', { r: 0, c: 0 })).toBeNull();
  });
});

describe('keeperAt', () => {
  test('returns the animal slug when standing on a keeper tile', () => {
    expect(keeperAt(world, 'savanna', { r: 2, c: 2 })).toBe('lion');
  });

  test('returns null when not on a keeper', () => {
    expect(keeperAt(world, 'savanna', { r: 0, c: 0 })).toBeNull();
    expect(keeperAt(world, 'entrance', { r: 2, c: 2 })).toBeNull();
  });
});

describe('savanna walkway to keepers', () => {
  const savanna = WORLD.maps.savanna.grid;
  const entry = { r: 13, c: 1 }; // where you arrive from the plaza

  test('the dirt path (+) tile is walkable', () => {
    expect(walkable([['+']], 0, 0)).toBe(true);
  });

  test('a walkable tile sits beside each keeper, reachable from the entry', () => {
    for (const keeper of [{ r: 8, c: 26 }, { r: 19, c: 29 }]) {
      const beside = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        .map(([dr, dc]) => ({ r: keeper.r + dr, c: keeper.c + dc }))
        .filter((t) => walkable(savanna, t.r, t.c));
      expect(beside.length).toBeGreaterThan(0);
      expect(beside.some((t) => bfs(savanna, entry, t))).toBe(true);
    }
  });
});

describe('isDisplay / exhibitAt', () => {
  // grid: '.' floor, 'W' wall, 'X' exhibit display panel
  const grid = [
    ['W', 'W', 'W', 'W', 'W'],
    ['W', 'X', 'X', '.', 'W'],
    ['W', '.', '.', '.', 'W'],
  ];
  const station = { animal: 'lion', key: 'pride', at: { r: 1, c: 1 } };
  const room = {
    maps: { gallery: { grid } },
    exhibits: { gallery: [station] },
  };

  test('isDisplay is true only on an X tile', () => {
    expect(isDisplay(grid, 1, 1)).toBe(true);
    expect(isDisplay(grid, 1, 3)).toBe(false);
    expect(isDisplay(grid, 0, 0)).toBe(false);
    expect(isDisplay(grid, 9, 9)).toBe(false);
  });

  test('exhibitAt returns the station on that tile, else null', () => {
    expect(exhibitAt(room, 'gallery', { r: 1, c: 1 })).toBe(station);
    expect(exhibitAt(room, 'gallery', { r: 1, c: 2 })).toBeNull(); // a display tile, but no station
    expect(exhibitAt(room, 'gallery', { r: 2, c: 1 })).toBeNull(); // wrong row
    expect(exhibitAt(room, 'nowhere', { r: 1, c: 1 })).toBeNull();
  });
});

describe('the plaza path to the exit', () => {
  const plaza = WORLD.maps.plaza.grid;

  test('the west edge is walled off — the plaza is where you start, not a doorway', () => {
    expect(plaza[10][0]).toBe('#');
    expect(WORLD.links.plaza.some((l) => l.at.c === 0)).toBe(false);
  });

  test('plaza path bypasses the pond over the top and links both doors', () => {
    expect(plaza[10][1]).toBe('+'); // the start tile
    expect(plaza[10][30]).toBe('+'); // east door side
    expect(plaza[8][12]).toBe('+'); // the over-the-top crossing (pond now one row lower)
    expect(plaza[10][13]).toBe('~'); // pond left intact
    expect(bfs(plaza, { r: 10, c: 1 }, { r: 10, c: 30 })).toBeTruthy();
  });
});

describe('isStaffDoor', () => {
  const room = [
    ['W', 'E', 'W'],
    ['.', '.', '.'],
  ];

  test('true only for a staff-only door tile', () => {
    expect(isStaffDoor(room, 0, 1)).toBe(true);
  });

  test('false for walls, floor, and out of bounds', () => {
    expect(isStaffDoor(room, 0, 0)).toBe(false);
    expect(isStaffDoor(room, 1, 1)).toBe(false);
    expect(isStaffDoor(room, 5, 5)).toBe(false);
  });
});

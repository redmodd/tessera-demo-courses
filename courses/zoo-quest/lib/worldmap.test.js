import { describe, test, expect } from 'vitest';
import { walkable, resolveLink, keeperAt, keeperRecordAt, isStaffDoor, WORLD } from './worldmap.js';
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

describe('keeperAt / keeperRecordAt', () => {
  test('returns the animal slug when standing on a keeper tile', () => {
    expect(keeperAt(world, 'savanna', { r: 2, c: 2 })).toBe('lion');
  });

  test('returns the full enclosure record at the keeper tile', () => {
    expect(keeperRecordAt(world, 'savanna', { r: 2, c: 2 })?.animal).toBe('lion');
  });

  test('returns null when not on a keeper', () => {
    expect(keeperAt(world, 'savanna', { r: 0, c: 0 })).toBeNull();
    expect(keeperAt(world, 'entrance', { r: 2, c: 2 })).toBeNull();
  });
});

describe('savanna walkway to keepers', () => {
  const savanna = WORLD.maps.savanna.grid;

  test('the dirt path (+) tile is walkable', () => {
    expect(walkable([['+']], 0, 0)).toBe(true);
  });

  test('the walkway tiles in front of both keepers are path tiles', () => {
    expect(savanna[10][1]).toBe('+'); // entrance stub
    expect(savanna[9][7]).toBe('+'); // in front of the lion keeper
    expect(savanna[9][23]).toBe('+'); // in front of the elephant keeper
  });

  test('the walkway connects the entrance to each keeper approach tile', () => {
    expect(bfs(savanna, { r: 10, c: 1 }, { r: 9, c: 7 })).toBeTruthy();
    expect(bfs(savanna, { r: 10, c: 1 }, { r: 9, c: 23 })).toBeTruthy();
  });
});

describe('entrance and plaza paths to the exits', () => {
  const entrance = WORLD.maps.entrance.grid;
  const plaza = WORLD.maps.plaza.grid;

  test('entrance has a straight path along row 10 to the east exit', () => {
    expect(entrance[10][1]).toBe('+');
    expect(entrance[10][30]).toBe('+');
    expect(bfs(entrance, { r: 10, c: 1 }, { r: 10, c: 30 })).toBeTruthy();
  });

  test('plaza path bypasses the pond over the top and links both doors', () => {
    expect(plaza[10][1]).toBe('+'); // west door side
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

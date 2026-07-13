import { describe, test, expect } from 'vitest';
import { WORLD, TILE, walkable, resolveLink, keeperAt, isStaffDoor, isDisplay, exhibitAt, pickEncounter } from './worldmap.js';
import { bfs } from './engine.js';
import { ANIMALS } from './zoodex.js';

// These guard the hand-authored map data: a connector on a wall, an entry that drops you in
// the void, a keeper sealed behind scenery — the mistakes a string grid makes easy.
describe('WORLD data invariants', () => {
  test('every overworld map is at least the base explorable size', () => {
    for (const [id, m] of Object.entries(WORLD.maps)) {
      if (WORLD.interiors.includes(id)) continue;
      expect(m.rows, `${id} rows`).toBeGreaterThanOrEqual(20);
      expect(m.cols, `${id} cols`).toBeGreaterThanOrEqual(32);
    }
  });

  test('start tile is walkable', () => {
    const { map, r, c } = WORLD.start;
    expect(walkable(WORLD.maps[map].grid, r, c)).toBe(true);
  });

  test('every connector and its destination entry are walkable', () => {
    for (const [mapId, links] of Object.entries(WORLD.links)) {
      for (const link of links) {
        expect(
          walkable(WORLD.maps[mapId].grid, link.at.r, link.at.c),
          `connector ${mapId} ${JSON.stringify(link.at)}`,
        ).toBe(true);
        expect(WORLD.maps[link.to], `dest map ${link.to}`).toBeDefined();
        expect(
          walkable(WORLD.maps[link.to].grid, link.entry.r, link.entry.c),
          `entry on ${link.to} ${JSON.stringify(link.entry)}`,
        ).toBe(true);
      }
    }
  });

  test('an entry tile is never itself a connector (would loop back instantly)', () => {
    for (const links of Object.values(WORLD.links)) {
      for (const link of links) {
        expect(resolveLink(WORLD, link.to, link.entry)).toBeNull();
      }
    }
  });

  test('every keeper tile is a blocked obstacle marked K, with a walkable neighbour, and resolves', () => {
    for (const [mapId, encs] of Object.entries(WORLD.enclosures)) {
      for (const e of encs) {
        const grid = WORLD.maps[mapId].grid;
        expect(walkable(grid, e.keeper.r, e.keeper.c)).toBe(false); // can't stand on the keeper
        expect(grid[e.keeper.r][e.keeper.c]).toBe(TILE.KEEPER);
        expect(keeperAt(WORLD, mapId, e.keeper)).toBe(e.animal);
        const hasSpot = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dr, dc]) =>
          walkable(grid, e.keeper.r + dr, e.keeper.c + dc),
        );
        expect(hasSpot, `keeper ${e.animal} has no walkable neighbour to talk from`).toBe(true);
      }
    }
  });

  test('every enclosure animal exists and has keeper-quiz data', () => {
    for (const encs of Object.values(WORLD.enclosures)) {
      for (const e of encs) {
        const animal = ANIMALS[e.animal];
        expect(animal, `animal ${e.animal}`).toBeDefined();
        expect(Array.isArray(animal.quizBank) && animal.quizBank.length > 0).toBe(true);
        for (const q of animal.quizBank) {
          expect(q.options[q.correct], `correct index for ${e.animal}`).toBeDefined();
        }
      }
    }
  });

  test('pens are fully fenced — no pen tile touches a walkable tile', () => {
    for (const { grid } of Object.values(WORLD.maps)) {
      grid.forEach((row, r) =>
        row.forEach((ch, c) => {
          if (ch !== TILE.PEN) return;
          for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const n = grid[r + dr]?.[c + dc];
            expect(
              n === TILE.PEN || n === TILE.FENCE,
              `pen (${r},${c}) leaks to '${n}'`,
            ).toBe(true);
          }
        }),
      );
    }
  });

  test('every grass-bearing map actually has at least one grass tile', () => {
    for (const mapId of Object.keys(WORLD.encounters)) {
      const grid = WORLD.maps[mapId].grid;
      const hasGrass = grid.some((row) => row.includes(TILE.GRASS));
      expect(hasGrass, `map ${mapId} declares an encounter but has no grass`).toBe(true);
    }
  });

  // The arrival tile for a map: WORLD.start for the starting map, otherwise the entry of
  // the first inbound link that targets it.
  function arrivalTile(mapId) {
    if (mapId === WORLD.start.map) return { r: WORLD.start.r, c: WORLD.start.c };
    for (const links of Object.values(WORLD.links)) {
      const inbound = links.find((l) => l.to === mapId);
      if (inbound) return inbound.entry;
    }
    throw new Error(`no arrival tile for ${mapId}`);
  }

  test('every keeper (via an adjacent tile), grass tile, and connector is reachable from where you arrive', () => {
    for (const [mapId, { grid }] of Object.entries(WORLD.maps)) {
      const from = arrivalTile(mapId);
      // A keeper is "reachable" if a walkable tile beside it is reachable.
      for (const e of WORLD.enclosures[mapId] ?? []) {
        const beside = [[-1, 0], [1, 0], [0, -1], [0, 1]]
          .map(([dr, dc]) => ({ r: e.keeper.r + dr, c: e.keeper.c + dc }))
          .filter((t) => walkable(grid, t.r, t.c));
        expect(
          beside.some((t) => bfs(grid, from, t)),
          `${mapId}: keeper ${e.animal} not approachable from ${JSON.stringify(from)}`,
        ).toBe(true);
      }
      const targets = [...(WORLD.links[mapId] ?? []).map((l) => l.at)];
      grid.forEach((row, r) =>
        row.forEach((ch, c) => {
          if (ch === TILE.GRASS) targets.push({ r, c });
        }),
      );
      for (const t of targets) {
        expect(
          bfs(grid, from, t),
          `${mapId}: ${JSON.stringify(t)} unreachable from ${JSON.stringify(from)}`,
        ).not.toBeNull();
      }
    }
  });

  test('you can walk plaza → savanna and reach both keepers', () => {
    expect(resolveLink(WORLD, 'plaza', { r: 10, c: 31 })).toEqual({
      to: 'savanna',
      entry: { r: 13, c: 1 },
    });
    expect(keeperAt(WORLD, 'savanna', { r: 19, c: 29 })).toBe('lion');
    expect(keeperAt(WORLD, 'savanna', { r: 8, c: 26 })).toBe('elephant');
  });

  test('the savanna Discovery Center door links to its interior and back', () => {
    expect(resolveLink(WORLD, 'savanna', { r: 6, c: 8 })).toEqual({
      to: 'discovery',
      entry: { r: 9, c: 8 },
    });
    expect(resolveLink(WORLD, 'discovery', { r: 11, c: 8 })).toEqual({
      to: 'savanna',
      entry: { r: 7, c: 8 },
    });
  });

  const DISPLAY_TYPES = new Set(['poster', 'diet', 'size', 'touchscreen', 'specimen', 'map']);

  test('every display station is a blocked display tile that resolves, bumps, and is reachable', () => {
    for (const [mapId, stations] of Object.entries(WORLD.exhibits ?? {})) {
      const { grid } = WORLD.maps[mapId];
      const from = arrivalTile(mapId);
      for (const { at, ...station } of stations) {
        expect(isDisplay(grid, at.r, at.c), `display ${mapId} (${at.r},${at.c})`).toBe(true);
        expect(walkable(grid, at.r, at.c)).toBe(false);
        expect(exhibitAt(WORLD, mapId, at)).toMatchObject(station);
        const beside = [[-1, 0], [1, 0], [0, -1], [0, 1]]
          .map(([dr, dc]) => ({ r: at.r + dr, c: at.c + dc }))
          .filter((t) => walkable(grid, t.r, t.c));
        expect(
          beside.some((t) => bfs(grid, from, t)),
          `station ${station.animal}/${station.key} not approachable from ${JSON.stringify(from)}`,
        ).toBe(true);
      }
    }
  });

  test('every display tile in an interior belongs to exactly one station', () => {
    for (const id of WORLD.interiors) {
      const { grid } = WORLD.maps[id];
      grid.forEach((row, r) =>
        row.forEach((ch, c) => {
          if (ch !== TILE.DISPLAY) return;
          const station = exhibitAt(WORLD, id, { r, c });
          expect(station, `orphan display tile ${id} (${r},${c}) has no station`).not.toBeNull();
        }),
      );
    }
  });

  test('every station resolves to a valid animal and a typed display with content', () => {
    for (const stations of Object.values(WORLD.exhibits ?? {})) {
      for (const s of stations) {
        const animal = ANIMALS[s.animal];
        expect(animal, `animal ${s.animal}`).toBeDefined();
        const display = animal.exhibit?.displays?.[s.key];
        expect(display, `display ${s.animal}/${s.key}`).toBeDefined();
        expect(DISPLAY_TYPES.has(display.type), `type ${display.type}`).toBe(true);
        expect(typeof display.title === 'string' && display.title.length > 0).toBe(true);
        // Each display carries readable content: a fact list, or a touchscreen Q&A.
        const hasFacts = Array.isArray(display.facts) && display.facts.length > 0;
        const hasQA = typeof display.question === 'string' && typeof display.answer === 'string';
        expect(hasFacts || hasQA, `display ${s.animal}/${s.key} has no content`).toBe(true);
      }
    }
  });

  test('you can walk plaza → centre and back through the gift-shop doors', () => {
    expect(resolveLink(WORLD, 'plaza', { r: 4, c: 15 })).toEqual({
      to: 'centre',
      entry: { r: 9, c: 8 },
    });
    expect(resolveLink(WORLD, 'centre', { r: 11, c: 8 })).toEqual({
      to: 'plaza',
      entry: { r: 5, c: 15 },
    });
  });

  test('interior rooms have no blocked wall tiles — the slim wall is a line on the floor edge', () => {
    // A blocked 'W' tile would render as plank floor with a wall band (see wallEdge), so it
    // looks walkable but isn't — the trap that blocked the player a tile short of the wall.
    for (const id of WORLD.interiors) {
      const { grid } = WORLD.maps[id];
      grid.forEach((row, r) =>
        row.forEach((ch, c) => {
          expect(ch, `${id} (${r},${c}) is a blocked wall tile that looks like floor`).not.toBe(
            TILE.BUILDING,
          );
        }),
      );
    }
  });

  test('an interior floor tile beside the void boundary is walkable — you reach the wall line', () => {
    for (const id of WORLD.interiors) {
      const { grid } = WORLD.maps[id];
      const edgeFloor = [];
      grid.forEach((row, r) =>
        row.forEach((ch, c) => {
          if (ch !== TILE.PATH) return;
          const bordersOutside = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dr, dc]) => {
            const n = grid[r + dr]?.[c + dc];
            return n === undefined || n === TILE.VOID;
          });
          if (bordersOutside) edgeFloor.push({ r, c });
        }),
      );
      expect(edgeFloor.length, `${id} has floor on its outer ring`).toBeGreaterThan(0);
      for (const t of edgeFloor) {
        expect(walkable(grid, t.r, t.c), `${id} edge floor ${JSON.stringify(t)}`).toBe(true);
      }
    }
  });

  test('the staff-only door is a blocked E tile with a walkable neighbour to bump from', () => {
    const grid = WORLD.maps.centre.grid;
    let found = null;
    grid.forEach((row, r) =>
      row.forEach((ch, c) => {
        if (ch === TILE.STAFF_DOOR) found = { r, c };
      }),
    );
    expect(found, 'centre has a staff-only door').not.toBeNull();
    expect(walkable(grid, found.r, found.c)).toBe(false);
    expect(isStaffDoor(grid, found.r, found.c)).toBe(true);
    const hasSpot = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dr, dc]) =>
      walkable(grid, found.r + dr, found.c + dc),
    );
    expect(hasSpot, 'staff door has no walkable neighbour to bump from').toBe(true);
  });
});

describe('pickEncounter', () => {
  test('returns a map encounter so it can be found in the grass', () => {
    expect(pickEncounter(WORLD, 'savanna', () => 0)).toBe('squirrel');
  });

  test('stays findable however many times — grass encounters repeat', () => {
    // pickEncounter never consults collection state; the same animal can reappear.
    expect(pickEncounter(WORLD, 'savanna', () => 0)).toBe('squirrel');
  });

  test('returns null for a map with no encounters', () => {
    expect(pickEncounter(WORLD, 'plaza')).toBeNull();
  });

  test('chooses among a map’s encounter pool by the rng', () => {
    const world = { encounters: { meadow: ['squirrel', 'rabbit', 'fox'] } };
    expect(pickEncounter(world, 'meadow', () => 0)).toBe('squirrel'); // index 0
    expect(pickEncounter(world, 'meadow', () => 0.5)).toBe('rabbit'); // index 1
    expect(pickEncounter(world, 'meadow', () => 0.99)).toBe('fox'); // index 2
  });
});

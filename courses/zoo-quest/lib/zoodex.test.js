import { describe, test, expect } from 'vitest';
import {
  readStore,
  updateStore,
  collect,
  earnBadge,
  logFieldNote,
  ALL_CARDS,
  TOTAL_ANIMALS,
  drawQuestions,
  ANIMALS,
} from './zoodex.js';
import { PEOPLE } from './people.js';

// A minimal stand-in for usePersistence(): synchronous get/set over an in-memory value.
function fakeStore(initial = null) {
  let value = initial;
  return {
    get: () => value,
    set: (v) => {
      value = v;
    },
  };
}

describe('ALL_CARDS', () => {
  test('includes every keeper exhibit and every hidden encounter', () => {
    const ids = ALL_CARDS.map((c) => c.id);
    expect(ids).toContain('lion');
    expect(ids).toContain('elephant');
    expect(ids).toContain('squirrel'); // a hidden grass encounter
  });

  test('length equals TOTAL_ANIMALS (the full collectable set)', () => {
    expect(ALL_CARDS.length).toBe(TOTAL_ANIMALS);
  });

  test('has no duplicate ids', () => {
    const ids = ALL_CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('is sorted ascending by dex number', () => {
    const dexes = ALL_CARDS.map((c) => c.dex);
    expect(dexes).toEqual([...dexes].sort((a, b) => a.localeCompare(b)));
  });

  test('every card carries the fields ZoodexCard renders', () => {
    for (const card of ALL_CARDS) {
      // `id` doubles as the <Animal kind> selector that draws the card's sprite.
      expect(card).toMatchObject({
        id: expect.any(String),
        dex: expect.any(String),
        name: expect.any(String),
        stats: expect.any(String),
        blurb: expect.any(String),
      });
      expect(Array.isArray(card.facts)).toBe(true);
    }
  });
});

describe('readStore', () => {
  test('defaults every field for an empty store', () => {
    expect(readStore(fakeStore())).toEqual({
      collected: [],
      badges: [],
      fieldNotes: [],
      map: null,
      avatar: null,
    });
  });

  test('passes through existing fields', () => {
    const s = fakeStore({ collected: ['lion'], map: 'savanna' });
    const out = readStore(s);
    expect(out.collected).toEqual(['lion']);
    expect(out.map).toBe('savanna');
    expect(out.badges).toEqual([]);
  });
});

describe('updateStore', () => {
  test('persists the result of the updater', () => {
    const s = fakeStore();
    updateStore(s, (cur) => ({ ...cur, map: 'plaza' }));
    expect(s.get().map).toBe('plaza');
  });

  test('does not mutate the previous value', () => {
    const prev = { collected: ['lion'], badges: [], fieldNotes: [], map: null, avatar: null };
    const s = fakeStore(prev);
    collect(s, 'elephant');
    expect(prev.collected).toEqual(['lion']); // untouched
    expect(s.get().collected).toEqual(['lion', 'elephant']);
  });
});

describe('collect / badge / field-note helpers', () => {
  test('collect adds and dedupes', () => {
    const s = fakeStore();
    collect(s, 'lion');
    collect(s, 'lion');
    collect(s, 'elephant');
    expect(s.get().collected).toEqual(['lion', 'elephant']);
  });

  test('collect awards the region badge only once every region animal is collected', () => {
    const s = fakeStore();
    collect(s, 'lion');
    expect(s.get().badges).toEqual([]); // savanna not complete yet (elephant missing)
    collect(s, 'elephant');
    expect(s.get().badges).toEqual(['savanna']); // both savanna animals collected
  });

  test('collect does not re-add a badge already earned', () => {
    const s = fakeStore({ collected: ['lion'], badges: ['savanna'] });
    collect(s, 'elephant');
    expect(s.get().badges).toEqual(['savanna']);
  });

  test('earnBadge adds and dedupes', () => {
    const s = fakeStore();
    earnBadge(s, 'savanna');
    earnBadge(s, 'savanna');
    expect(s.get().badges).toEqual(['savanna']);
  });

  test('logFieldNote adds and dedupes', () => {
    const s = fakeStore();
    logFieldNote(s, 'squirrel');
    logFieldNote(s, 'squirrel');
    expect(s.get().fieldNotes).toEqual(['squirrel']);
  });

  test('helpers preserve unrelated fields', () => {
    const s = fakeStore({ map: 'savanna', avatar: { x: 1, y: 2 } });
    collect(s, 'lion');
    expect(s.get().map).toBe('savanna');
    expect(s.get().avatar).toEqual({ x: 1, y: 2 });
  });
});

// Deterministic LCG so shuffles are reproducible in tests.
function seededRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

describe('drawQuestions', () => {
  const bank = Array.from({ length: 30 }, (_, i) => ({
    question: `q${i}`,
    options: ['a', 'b', 'c', 'd'],
    correct: 0,
  }));

  test('returns exactly n picks', () => {
    expect(drawQuestions(bank, 10, seededRng(1))).toHaveLength(10);
  });

  test('all picks are distinct', () => {
    const texts = drawQuestions(bank, 10, seededRng(2)).map((p) => p.question);
    expect(new Set(texts).size).toBe(10);
  });

  test('each pick carries its valid 1-based bank position n', () => {
    for (const p of drawQuestions(bank, 10, seededRng(3))) {
      expect(p.n).toBeGreaterThanOrEqual(1);
      expect(p.n).toBeLessThanOrEqual(bank.length);
      expect(bank[p.n - 1].question).toBe(p.question);
    }
  });

  test('n >= bank length returns the whole bank', () => {
    expect(drawQuestions(bank, 50, seededRng(4))).toHaveLength(30);
  });
});

describe('keeper banks', () => {
  test('every savanna keeper animal has a 30-question bank', () => {
    for (const id of ['lion', 'elephant']) {
      expect(ANIMALS[id].quizBank, id).toHaveLength(30);
    }
  });

  test('every bank question has a valid 0-based correct index into its options', () => {
    for (const a of Object.values(ANIMALS)) {
      for (const q of a.quizBank) {
        expect(q.options[q.correct], q.question).toBeDefined();
      }
    }
  });
});

describe('adversary questions stay separate from keeper banks', () => {
  test('no adversary question text appears in any keeper bank', () => {
    const bankQuestions = new Set(
      Object.values(ANIMALS).flatMap((a) => a.quizBank.map((q) => q.question)),
    );
    const quibble = PEOPLE.savanna.find((p) => p.kind === 'rival');
    expect(quibble.quiz).toHaveLength(5);
    for (const q of quibble.quiz) {
      expect(bankQuestions.has(q.question), `overlaps a keeper question: ${q.question}`).toBe(false);
    }
  });
});

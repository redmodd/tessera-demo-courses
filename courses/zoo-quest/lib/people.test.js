import { describe, test, expect } from 'vitest';
import { gradeRival, pickChatter, pickSmug, CHATTER, PEOPLE } from './people.js';

// A 3-question quiz shaped like PEOPLE[*].quiz entries: correct is a 0-based index.
const quiz = [
  { question: 'Q1', options: ['a', 'b', 'c', 'd'], correct: 1 },
  { question: 'Q2', options: ['a', 'b', 'c', 'd'], correct: 0 },
  { question: 'Q3', options: ['a', 'b', 'c', 'd'], correct: 2 },
];

describe('gradeRival', () => {
  test('all correct → won, full tally', () => {
    expect(gradeRival([1, 0, 2], quiz)).toEqual({
      answered: 3,
      correctCount: 3,
      won: true,
    });
  });

  test('any wrong → not won', () => {
    expect(gradeRival([1, 3, 2], quiz)).toEqual({
      answered: 3,
      correctCount: 2,
      won: false,
    });
  });

  test('unanswered questions count as not answered and never win', () => {
    expect(gradeRival([1, null, 2], quiz)).toEqual({
      answered: 2,
      correctCount: 2,
      won: false,
    });
  });

  test('no picks at all → zeroes, not won', () => {
    expect(gradeRival([null, null, null], quiz)).toEqual({
      answered: 0,
      correctCount: 0,
      won: false,
    });
  });
});

describe('pickChatter', () => {
  test('returns a greeting when rng < 0.5', () => {
    expect(CHATTER.greetings).toContain(pickChatter(() => 0));
  });

  test('returns a fact when rng >= 0.5', () => {
    expect(CHATTER.facts).toContain(pickChatter(() => 0.9));
  });
});

describe('pickSmug', () => {
  const quibble = PEOPLE.savanna.find((p) => p.id === 'quibble');

  test('draws from the won pool for a past win', () => {
    expect(quibble.smug.won).toContain(pickSmug(quibble, 'won', () => 0));
  });

  test('draws from the lost pool for a past loss', () => {
    expect(quibble.smug.lost).toContain(pickSmug(quibble, 'lost', () => 0));
  });
});

describe('PEOPLE.centre', () => {
  test('the clerk and shopkeeper are friendly patrons with their own dialog lines', () => {
    const centre = PEOPLE.centre;
    expect(centre).toHaveLength(2);
    for (const p of centre) {
      expect(p.kind).toBe('friendly');
      expect(p.roam).toBe(false);
      expect(Array.isArray(p.lines) && p.lines.length > 0).toBe(true);
    }
  });
});

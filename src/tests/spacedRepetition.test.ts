import { describe, it, expect } from 'vitest';
import {
  calculateMastery,
  recordItemAttempt,
  calculateReviewUrgency,
  selectAdaptiveItems,
  getWeakestWordIds,
} from '../engine/spacedRepetition';
import { ItemProgress } from '../types';

describe('spacedRepetition', () => {
  it('calculates mastery from accuracy and streak', () => {
    const fresh: ItemProgress = {
      itemId: 'test1',
      attempts: 5,
      correct: 5,
      incorrect: 0,
      lastSeen: Date.now(),
      streak: 5,
      avgResponseMs: 1500,
      mastery: 0,
    };
    const mastery = calculateMastery(fresh);
    expect(mastery).toBe(100); // 75 base + 25 streak
  });

  it('records correct and incorrect attempts updating stats', () => {
    let p = recordItemAttempt(undefined, 'word_1', true, 1200);
    expect(p.attempts).toBe(1);
    expect(p.correct).toBe(1);
    expect(p.streak).toBe(1);

    p = recordItemAttempt(p, 'word_1', false, 2000, 'confused_word_2');
    expect(p.attempts).toBe(2);
    expect(p.correct).toBe(1);
    expect(p.incorrect).toBe(1);
    expect(p.streak).toBe(0);
    expect(p.lastConfusionPartner).toBe('confused_word_2');
  });

  it('calculates higher urgency for items with errors and broken streaks', () => {
    const perfectItem: ItemProgress = {
      itemId: 'good',
      attempts: 6,
      correct: 6,
      incorrect: 0,
      lastSeen: Date.now(),
      streak: 6,
      avgResponseMs: 1200,
      mastery: 100,
    };

    const weakItem: ItemProgress = {
      itemId: 'bad',
      attempts: 6,
      correct: 2,
      incorrect: 4,
      lastSeen: Date.now(),
      streak: 0,
      avgResponseMs: 3000,
      mastery: 25,
    };

    const u1 = calculateReviewUrgency(perfectItem);
    const u2 = calculateReviewUrgency(weakItem);

    expect(u2).toBeGreaterThan(u1);
  });

  it('identifies weakest words accurately', () => {
    const map: Record<string, ItemProgress> = {
      w1: { itemId: 'w1', attempts: 5, correct: 5, incorrect: 0, lastSeen: 0, streak: 5, avgResponseMs: 0, mastery: 100 },
      w2: { itemId: 'w2', attempts: 5, correct: 1, incorrect: 4, lastSeen: 0, streak: 0, avgResponseMs: 0, mastery: 15 },
      w3: { itemId: 'w3', attempts: 4, correct: 2, incorrect: 2, lastSeen: 0, streak: 1, avgResponseMs: 0, mastery: 40 },
    };

    const weak = getWeakestWordIds(map, ['w1', 'w2', 'w3'], 2);
    expect(weak[0].id).toBe('w2');
    expect(weak[1].id).toBe('w3');
  });

  it('selects adaptive items prioritizing high urgency and confusion partners', () => {
    const map: Record<string, ItemProgress> = {
      a: { itemId: 'a', attempts: 10, correct: 2, incorrect: 8, lastSeen: 0, streak: 0, avgResponseMs: 0, mastery: 15 },
      b: { itemId: 'b', attempts: 10, correct: 10, incorrect: 0, lastSeen: Date.now(), streak: 10, avgResponseMs: 0, mastery: 100 },
      c: { itemId: 'c', attempts: 0, correct: 0, incorrect: 0, lastSeen: 0, streak: 0, avgResponseMs: 0, mastery: 0 },
    };

    const selected = selectAdaptiveItems(['a', 'b', 'c'], map, 2, { a: 'c' });
    expect(selected).toContain('a');
  });
});

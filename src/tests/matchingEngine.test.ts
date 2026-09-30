import { describe, it, expect } from 'vitest';
import { createMatchingCards, computeXpForMatch } from '../engine/matchingEngine';

describe('matchingEngine', () => {
  it('creates paired Telugu and Hindi match cards', () => {
    const items = [
      { id: '1', telugu: 'Nenu', hindi: 'Main' },
      { id: '2', telugu: 'Naaku', hindi: 'Mujhe' },
      { id: '3', telugu: 'Naa', hindi: 'Mera' },
    ];

    const cards = createMatchingCards(items);
    expect(cards).toHaveLength(6);

    const teluguCards = cards.filter((c) => c.type === 'telugu');
    const hindiCards = cards.filter((c) => c.type === 'hindi');

    expect(teluguCards).toHaveLength(3);
    expect(hindiCards).toHaveLength(3);

    // Verify each itemId has both a Telugu and Hindi card
    items.forEach((item) => {
      expect(cards.some((c) => c.itemId === item.id && c.type === 'telugu')).toBe(true);
      expect(cards.some((c) => c.itemId === item.id && c.type === 'hindi')).toBe(true);
    });
  });

  it('computes XP correctly with combos and speed bonus', () => {
    // Normal match
    const r1 = computeXpForMatch(false, 0);
    expect(r1.xp).toBe(10);
    expect(r1.comboBonus).toBe(0);
    expect(r1.speedBonus).toBe(0);

    // Fast match
    const r2 = computeXpForMatch(true, 1);
    expect(r2.xp).toBe(15);
    expect(r2.speedBonus).toBe(5);

    // 3 streak combo
    const r3 = computeXpForMatch(false, 3);
    expect(r3.xp).toBe(20); // 10 base + 10 combo
    expect(r3.comboBonus).toBe(10);

    // 10 streak combo + fast
    const r4 = computeXpForMatch(true, 10);
    expect(r4.xp).toBe(45); // 10 + 5 + 30
  });

  it('correctly evaluates pairs based on itemId matching', () => {
    const items = [
      { id: 'w1', telugu: 'Nenu', hindi: 'Main' },
      { id: 'w2', telugu: 'Naaku', hindi: 'Mujhe' },
    ];
    const cards = createMatchingCards(items);

    const teluguNenu = cards.find((c) => c.itemId === 'w1' && c.type === 'telugu')!;
    const hindiMain = cards.find((c) => c.itemId === 'w1' && c.type === 'hindi')!;
    const hindiMujhe = cards.find((c) => c.itemId === 'w2' && c.type === 'hindi')!;

    // Matching pair
    expect(teluguNenu.itemId === hindiMain.itemId).toBe(true);

    // Mismatched pair
    expect(teluguNenu.itemId === hindiMujhe.itemId).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { getLevelFromXp, calculateStreak, checkAchievements } from '../engine/progressEngine';
import { UserStats } from '../types';

describe('progressEngine', () => {
  it('calculates level and progress percent correctly from XP', () => {
    // 0 XP -> Level 1
    const l1 = getLevelFromXp(0);
    expect(l1.level).toBe(1);
    expect(l1.progressPercent).toBe(0);

    // 150 XP -> Level 2
    const l2 = getLevelFromXp(150);
    expect(l2.level).toBe(2);

    // 500 XP -> Level 3 (between 350 and 650)
    const l3 = getLevelFromXp(500);
    expect(l3.level).toBe(3);
    expect(l3.currentLevelXp).toBe(150);
    expect(l3.nextLevelXp).toBe(300);
    expect(l3.progressPercent).toBe(50);
  });

  it('increments streak on consecutive active days', () => {
    const res = calculateStreak('2026-09-29', 5, '2026-09-30');
    expect(res.newStreak).toBe(6);
    expect(res.isNewDay).toBe(true);
  });

  it('keeps streak intact when practicing multiple times on the same day', () => {
    const res = calculateStreak('2026-09-30', 5, '2026-09-30');
    expect(res.newStreak).toBe(5);
    expect(res.isNewDay).toBe(false);
  });

  it('resets streak to 1 if user skipped a day', () => {
    const res = calculateStreak('2026-09-27', 10, '2026-09-30');
    expect(res.newStreak).toBe(1);
    expect(res.isNewDay).toBe(true);
  });

  it('unlocks achievements based on stats and mastery', () => {
    const stats: UserStats = {
      xp: 1200,
      level: 5,
      currentStreak: 7,
      longestStreak: 7,
      lastActivityDate: '2026-09-30',
      todayXp: 100,
      dailyGoalXp: 50,
      totalAnswers: 150,
      correctAnswers: 120,
      completedStages: [0, 1, 2, 3, 4, 5, 6],
      completedConversations: ['conv_meeting_new_person'],
      unlockedAchievements: [],
    };

    const progressMap = {
      w1: { itemId: 'w1', attempts: 5, correct: 5, incorrect: 0, lastSeen: 0, streak: 5, avgResponseMs: 0, mastery: 80 },
    };

    const unlocked = checkAchievements(stats, progressMap);
    expect(unlocked).toContain('first_conversation');
    expect(unlocked).toContain('100_correct');
    expect(unlocked).toContain('streak_7');
    expect(unlocked).toContain('xp_1000');
    expect(unlocked).toContain('hostel_telugu');
  });
});

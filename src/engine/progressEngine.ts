import { UserAchievement, UserStats, ItemProgress } from '../types';

export const LEVEL_THRESHOLDS = [
  0,     // Level 1: 0 XP
  150,   // Level 2
  350,   // Level 3
  650,   // Level 4
  1050,  // Level 5
  1550,  // Level 6
  2150,  // Level 7
  2900,  // Level 8
  3800,  // Level 9
  4900,  // Level 10
  6200,  // Level 11+
];

export function getLevelFromXp(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const currentFloor = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextFloor = LEVEL_THRESHOLDS[level] || currentFloor + 1500;
  const needed = nextFloor - currentFloor;
  const earnedInLevel = Math.max(0, xp - currentFloor);
  const progressPercent = Math.min(100, Math.round((earnedInLevel / needed) * 100));

  return {
    level,
    currentLevelXp: earnedInLevel,
    nextLevelXp: needed,
    progressPercent,
  };
}

export function calculateStreak(
  lastDateStr: string,
  currentStreak: number,
  todayStr: string = new Date().toISOString().split('T')[0]
): { newStreak: number; isNewDay: boolean } {
  if (!lastDateStr) {
    return { newStreak: 1, isNewDay: true };
  }

  if (lastDateStr === todayStr) {
    return { newStreak: Math.max(1, currentStreak), isNewDay: false };
  }

  const lastDate = new Date(lastDateStr);
  const today = new Date(todayStr);
  const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    return { newStreak: currentStreak + 1, isNewDay: true };
  } else if (diffDays > 1) {
    // Streak broken
    return { newStreak: 1, isNewDay: true };
  }

  return { newStreak: currentStreak, isNewDay: false };
}

export const ACHIEVEMENTS_LIST: UserAchievement[] = [
  {
    id: 'first_10_words',
    title: 'First 10 Words',
    description: 'Learn your first 10 Telugu words with Hindi equivalents',
    icon: '🌱',
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'first_conversation',
    title: 'First Conversation',
    description: 'Successfully complete your first conversational scenario',
    icon: '💬',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: '100_correct',
    title: 'Century Marks',
    description: 'Answer 100 Telugu practice questions correctly',
    icon: '🎯',
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'streak_7',
    title: '7 Day Streak',
    description: 'Practice conversational Telugu for 7 days in a row',
    icon: '🔥',
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'pronoun_master',
    title: 'Pronoun Master',
    description: 'Master all primary pronouns: Nenu, Naaku, Nuvvu, Neeku, Meeru, etc.',
    icon: '👑',
    progress: 0,
    maxProgress: 8,
  },
  {
    id: 'question_master',
    title: 'Curious Mind',
    description: 'Master question words: Ekkada, Eppudu, Enduku, Ela, Entha',
    icon: '❓',
    progress: 0,
    maxProgress: 6,
  },
  {
    id: 'hostel_telugu',
    title: 'Campus Ready',
    description: 'Complete the College and Hostel Telugu conversational module',
    icon: '🎓',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'no_hindi_mode',
    title: 'Think in Telugu',
    description: 'Complete a scenario directly without relying on Hindi translation',
    icon: '🧠',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'xp_1000',
    title: 'Telugu Scholar',
    description: 'Earn 1000 Total XP across games and drills',
    icon: '⚡',
    progress: 0,
    maxProgress: 1000,
  },
  {
    id: 'first_free_response',
    title: 'Spoken Fluent',
    description: 'Successfully produce your first typed Roman Telugu sentence',
    icon: '✍️',
    progress: 0,
    maxProgress: 1,
  },
];

export function checkAchievements(
  stats: UserStats,
  progressMap: Record<string, ItemProgress>
): string[] {
  const newlyUnlocked: string[] = [];
  const currentUnlocked = new Set(stats.unlockedAchievements || []);

  const masteredCount = Object.values(progressMap).filter((p) => p.mastery >= 70).length;

  const checks: Record<string, boolean> = {
    first_10_words: masteredCount >= 10,
    first_conversation: stats.completedConversations.length >= 1,
    '100_correct': stats.correctAnswers >= 100,
    streak_7: stats.currentStreak >= 7,
    xp_1000: stats.xp >= 1000,
    hostel_telugu: stats.completedStages.includes(6),
  };

  for (const [id, passed] of Object.entries(checks)) {
    if (passed && !currentUnlocked.has(id)) {
      newlyUnlocked.push(id);
    }
  }

  return newlyUnlocked;
}

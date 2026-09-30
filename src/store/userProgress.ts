import { useState, useEffect } from 'react';
import { UserStats, ItemProgress } from '../types';
import { getLevelFromXp, calculateStreak, checkAchievements } from '../engine/progressEngine';
import { recordItemAttempt } from '../engine/spacedRepetition';

const STATS_STORAGE_KEY = 'telugu_quest_stats_v1';
const PROGRESS_STORAGE_KEY = 'telugu_quest_progress_v1';

export const INITIAL_USER_STATS: UserStats = {
  xp: 0,
  level: 1,
  currentStreak: 1,
  longestStreak: 1,
  lastActivityDate: new Date().toISOString().split('T')[0],
  todayXp: 0,
  dailyGoalXp: 50,
  totalAnswers: 0,
  correctAnswers: 0,
  completedStages: [],
  completedConversations: [],
  unlockedAchievements: [],
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return INITIAL_USER_STATS;
    const parsed = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];
    const { newStreak, isNewDay } = calculateStreak(parsed.lastActivityDate, parsed.currentStreak, today);

    return {
      ...INITIAL_USER_STATS,
      ...parsed,
      currentStreak: newStreak,
      longestStreak: Math.max(parsed.longestStreak || 1, newStreak),
      lastActivityDate: today,
      todayXp: isNewDay ? 0 : (parsed.todayXp || 0),
    };
  } catch {
    return INITIAL_USER_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save user stats', err);
  }
}

export function loadItemProgressMap(): Record<string, ItemProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveItemProgressMap(progressMap: Record<string, ItemProgress>): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressMap));
  } catch (err) {
    console.error('Failed to save progress map', err);
  }
}

// React custom hook for global user progress
export function useUserProgress() {
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [progressMap, setProgressMap] = useState<Record<string, ItemProgress>>(loadItemProgressMap);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<string | null>(null);

  useEffect(() => {
    saveUserStats(stats);
  }, [stats]);

  useEffect(() => {
    saveItemProgressMap(progressMap);
  }, [progressMap]);

  const addXp = (amount: number) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      const { level } = getLevelFromXp(newXp);
      const updated: UserStats = {
        ...prev,
        xp: newXp,
        level,
        todayXp: prev.todayXp + amount,
      };

      const newBadges = checkAchievements(updated, progressMap);
      if (newBadges.length > 0) {
        updated.unlockedAchievements = [...new Set([...prev.unlockedAchievements, ...newBadges])];
        setNewlyUnlockedBadge(newBadges[0]);
      }

      return updated;
    });
  };

  const recordAttempt = (
    itemId: string,
    isCorrect: boolean,
    responseTimeMs: number = 2000,
    confusionPartnerId?: string
  ) => {
    setProgressMap((prev) => {
      const updatedItem = recordItemAttempt(prev[itemId], itemId, isCorrect, responseTimeMs, confusionPartnerId);
      const nextMap = { ...prev, [itemId]: updatedItem };

      // Update answer stats
      setStats((prevStats) => {
        const nextStats: UserStats = {
          ...prevStats,
          totalAnswers: prevStats.totalAnswers + 1,
          correctAnswers: prevStats.correctAnswers + (isCorrect ? 1 : 0),
        };

        const newBadges = checkAchievements(nextStats, nextMap);
        if (newBadges.length > 0) {
          nextStats.unlockedAchievements = [...new Set([...prevStats.unlockedAchievements, ...newBadges])];
          setNewlyUnlockedBadge(newBadges[0]);
        }

        return nextStats;
      });

      return nextMap;
    });
  };

  const completeStage = (stageNum: number) => {
    setStats((prev) => {
      if (prev.completedStages.includes(stageNum)) return prev;
      return {
        ...prev,
        completedStages: [...prev.completedStages, stageNum],
      };
    });
  };

  const completeConversation = (convId: string) => {
    setStats((prev) => {
      if (prev.completedConversations.includes(convId)) return prev;
      const nextStats = {
        ...prev,
        completedConversations: [...prev.completedConversations, convId],
      };
      const newBadges = checkAchievements(nextStats, progressMap);
      if (newBadges.length > 0) {
        nextStats.unlockedAchievements = [...new Set([...prev.unlockedAchievements, ...newBadges])];
        setNewlyUnlockedBadge(newBadges[0]);
      }
      return nextStats;
    });
  };

  const clearBadgeAlert = () => setNewlyUnlockedBadge(null);

  const resetAllProgress = () => {
    localStorage.removeItem(STATS_STORAGE_KEY);
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    setStats(INITIAL_USER_STATS);
    setProgressMap({});
  };

  const exportDataJson = () => {
    return JSON.stringify({
      stats,
      progressMap,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.stats && data.progressMap) {
        setStats(data.stats);
        setProgressMap(data.progressMap);
        saveUserStats(data.stats);
        saveItemProgressMap(data.progressMap);
        return true;
      }
    } catch {
      // parse error
    }
    return false;
  };

  return {
    stats,
    progressMap,
    addXp,
    recordAttempt,
    completeStage,
    completeConversation,
    newlyUnlockedBadge,
    clearBadgeAlert,
    resetAllProgress,
    exportDataJson,
    importDataJson,
  };
}

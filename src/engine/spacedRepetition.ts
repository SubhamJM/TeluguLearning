import { ItemProgress } from '../types';

export const INITIAL_PROGRESS = (itemId: string): ItemProgress => ({
  itemId,
  attempts: 0,
  correct: 0,
  incorrect: 0,
  lastSeen: 0,
  streak: 0,
  avgResponseMs: 0,
  mastery: 0,
});

/**
 * Calculates mastery percentage (0-100) based on accuracy, streak, and recent performance.
 */
export function calculateMastery(p: ItemProgress): number {
  if (p.attempts === 0) return 0;
  
  const accuracy = (p.correct / p.attempts) * 100;
  // Streak bonus: up to +25 points for reaching a streak of 5+
  const streakBonus = Math.min(25, p.streak * 5);
  // Volume factor: gently scale if fewer than 3 attempts
  const volumeWeight = Math.min(1, p.attempts / 3);

  const baseMastery = accuracy * 0.75 + streakBonus;
  return Math.min(100, Math.round(baseMastery * volumeWeight));
}

/**
 * Updates an item's progress with a new attempt result.
 */
export function recordItemAttempt(
  current: ItemProgress | undefined,
  itemId: string,
  isCorrect: boolean,
  responseTimeMs: number = 2500,
  confusionPartnerId?: string
): ItemProgress {
  const prev = current || INITIAL_PROGRESS(itemId);
  const attempts = prev.attempts + 1;
  const correct = prev.correct + (isCorrect ? 1 : 0);
  const incorrect = prev.incorrect + (isCorrect ? 0 : 1);
  const streak = isCorrect ? prev.streak + 1 : 0;
  const now = Date.now();

  const prevTotalTime = prev.avgResponseMs * prev.attempts;
  const avgResponseMs = Math.round((prevTotalTime + responseTimeMs) / attempts);

  const temp: ItemProgress = {
    ...prev,
    itemId,
    attempts,
    correct,
    incorrect,
    streak,
    lastSeen: now,
    avgResponseMs,
    mastery: 0,
    lastConfusionPartner: !isCorrect && confusionPartnerId ? confusionPartnerId : prev.lastConfusionPartner,
  };

  temp.mastery = calculateMastery(temp);
  return temp;
}

/**
 * Priority score for adaptive selection.
 * Higher score = higher urgency to review.
 */
export function calculateReviewUrgency(
  progress: ItemProgress | undefined,
  now: number = Date.now()
): number {
  if (!progress || progress.attempts === 0) {
    // Unseen items have high priority to be introduced
    return 70;
  }

  // Factor 1: Low mastery (scale 0-60 points)
  const masteryUrgency = Math.max(0, 100 - progress.mastery) * 0.6;

  // Factor 2: High recent error rate
  const errorRate = progress.incorrect / Math.max(1, progress.attempts);
  const errorBonus = errorRate * 35;

  // Factor 3: Time elapsed since last seen (Spaced Repetition decay)
  const hoursSinceLastSeen = (now - progress.lastSeen) / (1000 * 60 * 60);
  const decayUrgency = Math.min(25, hoursSinceLastSeen * 1.5);

  // Factor 4: Negative streak penalty (breaks confidence)
  const brokenStreakPenalty = progress.streak === 0 ? 15 : 0;

  return masteryUrgency + errorBonus + decayUrgency + brokenStreakPenalty;
}

/**
 * Selects an adaptive mix of items for a drill or daily session:
 * Prioritizes:
 * 1. Weakest items (low accuracy / high mistake)
 * 2. Confused items
 * 3. Due for review
 * 4. New items
 */
export function selectAdaptiveItems(
  availableItemIds: string[],
  progressMap: Record<string, ItemProgress>,
  count: number = 10,
  pairedConfusionMap?: Record<string, string>
): string[] {
  if (availableItemIds.length <= count) {
    return [...availableItemIds];
  }

  const now = Date.now();
  // Score all available items
  const scored = availableItemIds.map((id) => {
    const prog = progressMap[id];
    let urgency = calculateReviewUrgency(prog, now);

    // If item has an active confusion partner, give a slight boost to test discrimination
    if (prog?.lastConfusionPartner || (pairedConfusionMap && pairedConfusionMap[id])) {
      urgency += 10;
    }

    return { id, urgency };
  });

  // Sort descending by urgency
  scored.sort((a, b) => b.urgency - a.urgency);

  // Take top candidates with slight random jitter among similar urgency
  const selected: string[] = [];
  const pool = [...scored];

  while (selected.length < count && pool.length > 0) {
    const chosen = pool.shift()!;
    selected.push(chosen.id);

    // If this item was confused with a partner, try to pull the partner into the drill next!
    const partnerId = pairedConfusionMap?.[chosen.id];
    if (partnerId && !selected.includes(partnerId) && availableItemIds.includes(partnerId) && selected.length < count) {
      const partnerIdx = pool.findIndex((p) => p.id === partnerId);
      if (partnerIdx !== -1) {
        selected.push(pool.splice(partnerIdx, 1)[0].id);
      }
    }
  }

  return selected;
}

export function getWeakestWordIds(
  progressMap: Record<string, ItemProgress>,
  allIds: string[],
  limit: number = 5
): Array<{ id: string; accuracy: number; attempts: number; mastery: number }> {
  const attempted = allIds
    .map((id) => progressMap[id])
    .filter((p): p is ItemProgress => !!p && p.attempts > 0);

  attempted.sort((a, b) => {
    // Lowest mastery first, then lowest accuracy
    if (a.mastery !== b.mastery) {
      return a.mastery - b.mastery;
    }
    const accA = a.correct / a.attempts;
    const accB = b.correct / b.attempts;
    return accA - accB;
  });

  return attempted.slice(0, limit).map((p) => ({
    id: p.itemId,
    accuracy: Math.round((p.correct / p.attempts) * 100),
    attempts: p.attempts,
    mastery: p.mastery,
  }));
}

export function getStrongestWordIds(
  progressMap: Record<string, ItemProgress>,
  allIds: string[],
  limit: number = 5
): Array<{ id: string; accuracy: number; mastery: number }> {
  const attempted = allIds
    .map((id) => progressMap[id])
    .filter((p): p is ItemProgress => !!p && p.attempts >= 2);

  attempted.sort((a, b) => {
    if (b.mastery !== a.mastery) {
      return b.mastery - a.mastery;
    }
    return (b.correct / b.attempts) - (a.correct / a.attempts);
  });

  return attempted.slice(0, limit).map((p) => ({
    id: p.itemId,
    accuracy: Math.round((p.correct / p.attempts) * 100),
    mastery: p.mastery,
  }));
}

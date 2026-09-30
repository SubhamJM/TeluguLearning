export interface MatchCard {
  id: string;
  itemId: string;
  type: 'telugu' | 'hindi';
  text: string;
  subtext?: string;
  isMatched: boolean;
  isSelected: boolean;
  isError: boolean;
}

export interface MatchingState {
  cards: MatchCard[];
  selectedTeluguCardId: string | null;
  selectedHindiCardId: string | null;
  combo: number;
  maxCombo: number;
  totalMatches: number;
  totalAttempts: number;
  mistakes: number;
  earnedXp: number;
  isCompleted: boolean;
  feedbackMessage: string | null;
}

export function createMatchingCards(
  items: Array<{ id: string; telugu: string; hindi: string }>
): MatchCard[] {
  const teluguCards: MatchCard[] = items.map((item) => ({
    id: `telugu-${item.id}`,
    itemId: item.id,
    type: 'telugu',
    text: item.telugu,
    isMatched: false,
    isSelected: false,
    isError: false,
  }));

  const hindiCards: MatchCard[] = items.map((item) => ({
    id: `hindi-${item.id}`,
    itemId: item.id,
    type: 'hindi',
    text: item.hindi,
    isMatched: false,
    isSelected: false,
    isError: false,
  }));

  // Shuffle both lists independently for clean grid pairing
  const shuffledTelugu = [...teluguCards].sort(() => Math.random() - 0.5);
  const shuffledHindi = [...hindiCards].sort(() => Math.random() - 0.5);

  return [...shuffledTelugu, ...shuffledHindi];
}

export function computeXpForMatch(
  isFast: boolean,
  combo: number
): { xp: number; comboBonus: number; speedBonus: number } {
  const base = 10;
  const speedBonus = isFast ? 5 : 0;
  let comboBonus = 0;

  if (combo >= 10) {
    comboBonus = 30;
  } else if (combo >= 5) {
    comboBonus = 15;
  } else if (combo >= 3) {
    comboBonus = 10;
  }

  return {
    xp: base + speedBonus + comboBonus,
    comboBonus,
    speedBonus,
  };
}

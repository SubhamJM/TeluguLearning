export type WordCategory =
  | 'survival'
  | 'pronoun'
  | 'demonstrative'
  | 'location'
  | 'question'
  | 'connector'
  | 'action'
  | 'food'
  | 'time'
  | 'college'
  | 'shopping'
  | 'travel'
  | 'common';

export interface WordItem {
  id: string;
  telugu: string;
  hindi: string;
  english: string;
  teluguScript?: string;
  category: WordCategory;
  difficulty: number;
  confusionGroup?: string;
  confusionNotes?: string;
  exampleSentence?: {
    telugu: string;
    hindi: string;
    english: string;
  };
}

export interface PatternBreakdown {
  telugu: string;
  hindi: string;
  english: string;
  role: string;
}

export interface PatternVariation {
  telugu: string;
  hindi: string;
  english: string;
  highlightSlot?: string;
}

export interface SentencePattern {
  id: string;
  pattern: string;
  hindiPattern: string;
  englishPattern: string;
  explanation: string;
  breakdown: PatternBreakdown[];
  variations: PatternVariation[];
  difficulty: number;
  stage: number;
}

export interface PracticalSentence {
  id: string;
  telugu: string;
  hindi: string;
  english: string;
  teluguScript?: string;
  stage: number;
  category: string;
  patternId?: string;
  wordTokens: string[];
  distractorTokens?: string[];
  blankQuestion?: {
    sentenceWithBlank: string;
    correctAnswer: string;
    options: string[];
    hint: string;
  };
}

export interface ConfusionPair {
  id: string;
  title: string;
  teluguA: string;
  hindiA: string;
  teluguB: string;
  hindiB: string;
  tip: string;
  drills: Array<{
    id: string;
    promptHindi: string;
    promptEnglish: string;
    contextSentenceTelugu?: string;
    correctChoice: 'A' | 'B';
    explanation: string;
  }>;
}

export interface ConversationOption {
  id: string;
  telugu: string;
  hindi: string;
  english: string;
  isCorrect: boolean;
  feedback: string;
}

export interface ConversationStep {
  id: string;
  speaker: 'npc' | 'user';
  speakerName: string;
  speakerAvatar?: string;
  telugu: string;
  hindi: string;
  english: string;
  notes?: string;
  interactionType?: 'multiple_choice' | 'sentence_build' | 'free_response';
  options?: ConversationOption[];
  expectedTokens?: string[];
  distractorTokens?: string[];
  acceptableVariations?: string[];
}

export interface ConversationScenario {
  id: string;
  title: string;
  hindiTitle: string;
  scenarioDescription: string;
  stage: number;
  location: string;
  avatar: string;
  steps: ConversationStep[];
}

export interface CurriculumStage {
  stageNumber: number;
  title: string;
  subtitle: string;
  hindiBridgeSummary: string;
  description: string;
  vocabIds: string[];
  patternIds: string[];
  sentenceIds: string[];
  confusionPairIds: string[];
  conversationScenarioId?: string;
  unlockRequirementMastery: number; // e.g. 70 means 70% of previous stage mastered
}

export interface ItemProgress {
  itemId: string;
  attempts: number;
  correct: number;
  incorrect: number;
  lastSeen: number; // timestamp
  streak: number;
  avgResponseMs: number;
  mastery: number; // 0 - 100
  lastConfusionPartner?: string;
}

export interface PlaygroundMapping {
  id: string;
  telugu: string;
  hindi: string;
  english?: string;
}

export interface PlaygroundPhrase {
  id: string;
  telugu: string;
  hindi: string;
  english?: string;
}

export interface PlaygroundSet {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  mappings: PlaygroundMapping[];
  phrases: PlaygroundPhrase[];
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
}

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // YYYY-MM-DD
  todayXp: number;
  dailyGoalXp: number;
  totalAnswers: number;
  correctAnswers: number;
  completedStages: number[];
  completedConversations: string[];
  unlockedAchievements: string[];
}

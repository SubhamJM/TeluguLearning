export type LlmProvider = 'gemini' | 'openrouter' | 'custom';

export interface LlmConfig {
  provider: LlmProvider;
  apiKey: string;
  model: string;
  customEndpoint?: string;
}

export interface LlmTranslationResult {
  telugu: string;
  teluguScript?: string;
  hindi: string;
  breakdown?: string;
  exampleTelugu?: string;
  exampleHindi?: string;
  notes?: string;
}

export type AiPracticeFilter = 'weak' | 'completed' | 'all';
export type AiPracticeMode = 'fill_blank' | 'roleplay' | 'challenge';

export interface AiTaskOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface AiPracticeTask {
  id: string;
  mode: AiPracticeMode;
  scenarioTitle: string;
  situationHindi: string;
  targetWordIds: string[];
  targetWordsSummary: { id: string; telugu: string; hindi: string }[];
  
  // Fill in the blank / Sentence Challenge fields
  promptTelugu?: string;
  promptHindi: string;
  promptEnglish?: string;
  blankOptions?: string[];
  correctAnswer: string;
  
  // Roleplay dialogue fields
  partnerRole?: string;
  partnerAvatar?: string;
  partnerDialogueTelugu?: string;
  partnerDialogueHindi?: string;
  expectedGoalHindi?: string;
  roleplayOptions?: AiTaskOption[];
  
  explanation: string;
  hintHindi: string;
}

export interface AiEvaluationResult {
  isCorrect: boolean;
  score: number;
  feedbackHindi: string;
  feedbackTelugu: string;
  suggestedImprovement?: string;
}

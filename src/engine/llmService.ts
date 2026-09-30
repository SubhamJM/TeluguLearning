import {
  LlmConfig,
  LlmTranslationResult,
  AiPracticeMode,
  AiPracticeTask,
  AiEvaluationResult,
} from '../types/llm';
import { VOCABULARY_DATA } from '../data/vocabulary';
import { PRACTICAL_SENTENCES } from '../data/practicalSentences';
import { evaluateTeluguAnswer } from './answerNormalizer';

const CONFIG_STORAGE_KEY = 'telugu_quest_llm_config_v1';

export const DEFAULT_LLM_CONFIG: LlmConfig = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.0-flash-lite',
  customEndpoint: 'https://openrouter.ai/api/v1',
};

export function getLlmConfig(): LlmConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_LLM_CONFIG;
    return { ...DEFAULT_LLM_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_LLM_CONFIG;
  }
}

export function saveLlmConfig(config: LlmConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save LLM config', err);
  }
}

export function hasApiKey(): boolean {
  const cfg = getLlmConfig();
  return Boolean(cfg.apiKey && cfg.apiKey.trim().length > 5);
}

/**
 * Executes a call to the configured LLM (Gemini REST API or OpenRouter/OpenAI-compatible endpoint).
 */
export async function callLlmRaw(
  prompt: string,
  systemPrompt: string,
  config?: LlmConfig,
  jsonMode: boolean = false
): Promise<string> {
  const cfg = config || getLlmConfig();
  if (!cfg.apiKey || !cfg.apiKey.trim()) {
    throw new Error('No API key provided. Please configure your API key in AI settings.');
  }

  if (cfg.provider === 'gemini') {
    const model = cfg.model || 'gemini-2.0-flash-lite';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
      cfg.apiKey.trim()
    )}`;

    const body: Record<string, unknown> = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
        ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      let errDetail = errText;
      try {
        const parsed = JSON.parse(errText);
        errDetail = parsed?.error?.message || errText;
      } catch {
        // use raw errText
      }
      throw new Error(`Gemini API Error (${res.status}): ${errDetail}`);
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) {
      throw new Error('Gemini returned an empty response.');
    }
    return candidate;
  } else {
    // OpenRouter or OpenAI-compatible endpoint
    const endpoint = (cfg.customEndpoint || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
    const url = `${endpoint}/chat/completions`;
    const model = cfg.model || 'qwen/qwen-2.5-72b-instruct';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.apiKey.trim()}`,
        'HTTP-Referer': 'https://teluguquest.local',
        'X-Title': 'Telugu Quest Learning App',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`LLM Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidate = data?.choices?.[0]?.message?.content;
    if (!candidate) {
      throw new Error('LLM returned an empty response.');
    }
    return candidate;
  }
}

/**
 * Tests connection with a tiny lightweight ping.
 */
export async function testLlmConnection(
  config?: LlmConfig
): Promise<{ success: boolean; message: string }> {
  try {
    const raw = await callLlmRaw(
      'Respond with the single word: "READY"',
      'You are a testing assistant. Respond with the single word READY only.',
      config,
      false
    );
    if (raw.toLowerCase().includes('ready') || raw.length > 0) {
      return { success: true, message: 'Connection successful! Model responded promptly.' };
    }
    return { success: false, message: 'Received unexpected response from model.' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg };
  }
}

/**
 * Translates a user word or sentence into spoken conversational Roman Telugu via LLM.
 * Returns concise, punchy information without long essays.
 */
export async function translateQuery(
  query: string,
  config?: LlmConfig
): Promise<LlmTranslationResult> {
  const cfg = config || getLlmConfig();
  const trimmed = query.trim();

  // If no API key is set, use the offline dictionary matcher
  if (!cfg.apiKey || !cfg.apiKey.trim()) {
    return generateOfflineTranslation(trimmed);
  }

  const systemPrompt = `You are an ultra-concise spoken Telugu tutor for an Indian learner who understands Hindi.
The student will ask how to say a word or sentence in spoken conversational Telugu.

CRITICAL RULES:
1. DO NOT write long explanations, greetings, or conversational filler.
2. The user wants to speak Roman Telugu immediately.
3. Respond ONLY with a valid JSON object matching this schema:
{
  "telugu": "spoken Roman Telugu transliteration",
  "teluguScript": "తెలుగు script equivalent",
  "hindi": "exact Hindi equivalent / concept bridge",
  "breakdown": "word = word breakdown (short, 1 line)",
  "exampleTelugu": "1 short conversational sentence using this",
  "exampleHindi": "Hindi meaning of example sentence",
  "notes": "1 brief sentence tip (e.g. polite vs casual) or empty string"
}
`;

  const userPrompt = `Translate this query into natural spoken Roman Telugu: "${trimmed}"`;

  try {
    const raw = await callLlmRaw(userPrompt, systemPrompt, cfg, true);
    // Parse JSON
    const cleaned = raw.replace(/^```json/i, '').replace(/```$/i, '').trim();
    const parsed: LlmTranslationResult = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.warn('LLM translate failed, using offline fallback', err);
    return generateOfflineTranslation(trimmed);
  }
}

/**
 * Generates an adaptive practice task based on the user's weak words or completed words.
 */
export async function generateAdaptiveTask(
  targetItems: { id: string; telugu: string; hindi: string; english?: string }[],
  mode: AiPracticeMode,
  config?: LlmConfig
): Promise<AiPracticeTask> {
  const cfg = config || getLlmConfig();

  if (!cfg.apiKey || !cfg.apiKey.trim()) {
    return generateOfflineAdaptiveTask(targetItems, mode);
  }

  const wordsSummary = targetItems.map((w) => `${w.telugu} (Hindi: ${w.hindi})`).join(', ');

  const systemPrompt = `You are an interactive Telugu practice engine.
You design ultra-fun, realistic everyday mini-tasks for a student who understands Hindi.
The task must test these target Telugu words that the user has already learned or is struggling with:
${wordsSummary}

Mode: ${mode}
- "fill_blank": A conversational sentence with a blank (_____) where one of the target words fits. Include 4 plausible options.
- "roleplay": A 1-turn situational dialogue (e.g. at hostel, auto rickshaw, canteen, pharmacy) where the user must reply using the target word.
- "challenge": Ask the user to express a Hindi thought in spoken Telugu.

CRITICAL: Return ONLY a valid JSON object matching this schema:
{
  "id": "task_${Date.now()}",
  "mode": "${mode}",
  "scenarioTitle": "Short title (e.g. At the Hostel Corridor)",
  "situationHindi": "Context in Hindi (e.g. Tumhe paani chahiye aur tum dost se pooch rahe ho)",
  "promptTelugu": "Sentence with _____ blank or context sentence",
  "promptHindi": "Hindi meaning of prompt",
  "promptEnglish": "English gloss",
  "blankOptions": ["option1", "option2", "option3", "option4"],
  "correctAnswer": "exact correct Telugu word or phrase",
  "partnerRole": "Role name if roleplay (e.g. Auto Driver)",
  "partnerAvatar": "Emoji (e.g. 🛺)",
  "partnerDialogueTelugu": "Partner spoken Telugu line",
  "partnerDialogueHindi": "Partner Hindi meaning",
  "expectedGoalHindi": "What the user needs to reply in Hindi",
  "roleplayOptions": [
    { "id": "opt1", "text": "Telugu response 1", "isCorrect": true, "explanation": "Why correct" },
    { "id": "opt2", "text": "Telugu response 2", "isCorrect": false, "explanation": "Why incorrect" }
  ],
  "explanation": "Why this word/answer is right",
  "hintHindi": "Helpful Hindi mental bridge hint"
}
`;

  const userPrompt = `Generate a level-appropriate ${mode} practice task using these target words: ${wordsSummary}`;

  try {
    const raw = await callLlmRaw(userPrompt, systemPrompt, cfg, true);
    const cleaned = raw.replace(/^```json/i, '').replace(/```$/i, '').trim();
    const parsed: AiPracticeTask = JSON.parse(cleaned);
    parsed.targetWordIds = targetItems.map((w) => w.id);
    parsed.targetWordsSummary = targetItems.map((w) => ({
      id: w.id,
      telugu: w.telugu,
      hindi: w.hindi,
    }));
    return parsed;
  } catch (err) {
    console.warn('LLM task generation failed, using offline generator', err);
    return generateOfflineAdaptiveTask(targetItems, mode);
  }
}

/**
 * Evaluates the user's response to an AI task.
 */
export async function evaluateUserAnswer(
  task: AiPracticeTask,
  userAnswer: string,
  config?: LlmConfig
): Promise<AiEvaluationResult> {
  const match = evaluateTeluguAnswer(userAnswer, task.correctAnswer);

  // Fast path: if exact or fuzzy match with expected answer
  if (match.isMatch) {
    return {
      isCorrect: true,
      score: match.score,
      feedbackHindi: 'Ekdam sahi! Shandaar Telugu expression.',
      feedbackTelugu: `Baagundi! "${task.correctAnswer}" is correct.`,
    };
  }

  const cfg = config || getLlmConfig();
  if (!cfg.apiKey || !cfg.apiKey.trim()) {
    return {
      isCorrect: false,
      score: 0,
      feedbackHindi: `Sahi uttar hai: "${task.correctAnswer}". ${task.explanation}`,
      feedbackTelugu: `Correct answer: ${task.correctAnswer}`,
      suggestedImprovement: task.correctAnswer,
    };
  }

  // LLM detailed evaluation
  const systemPrompt = `You evaluate a student's conversational Roman Telugu response.
Be encouraging, fair with spelling variations, and return JSON ONLY:
{
  "isCorrect": boolean,
  "score": number (0 to 100),
  "feedbackHindi": "1 short encouraging Hindi sentence",
  "feedbackTelugu": "1 short Telugu feedback phrase (e.g. Baagundi / Sari chesukondi)",
  "suggestedImprovement": "Proper Roman Telugu answer if mistake"
}`;

  const userPrompt = `
Task: ${task.promptHindi} (${task.promptTelugu || ''})
Expected Concept: ${task.correctAnswer}
Student Answer: "${userAnswer}"
Did the student convey the meaning naturally in spoken Telugu?
`;

  try {
    const raw = await callLlmRaw(userPrompt, systemPrompt, cfg, true);
    const cleaned = raw.replace(/^```json/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      isCorrect: false,
      score: 0,
      feedbackHindi: `Sahi shabd tha: "${task.correctAnswer}". ${task.explanation}`,
      feedbackTelugu: `Sahi: ${task.correctAnswer}`,
      suggestedImprovement: task.correctAnswer,
    };
  }
}

/**
 * Offline fallback translation using local vocabulary and sentence datasets.
 */
function generateOfflineTranslation(query: string): LlmTranslationResult {
  const q = query.toLowerCase().trim();

  // Search in vocabulary
  const vocabMatch = VOCABULARY_DATA.find(
    (v) =>
      v.hindi.toLowerCase().includes(q) ||
      v.english.toLowerCase().includes(q) ||
      v.telugu.toLowerCase().includes(q)
  );

  if (vocabMatch) {
    return {
      telugu: vocabMatch.telugu,
      teluguScript: vocabMatch.teluguScript || '',
      hindi: vocabMatch.hindi,
      breakdown: `${vocabMatch.telugu} = ${vocabMatch.hindi}`,
      exampleTelugu: vocabMatch.exampleSentence?.telugu || `Naaku ${vocabMatch.telugu} kaavali`,
      exampleHindi: vocabMatch.exampleSentence?.hindi || `Mujhe ${vocabMatch.hindi} chahiye`,
      notes: vocabMatch.confusionNotes || 'From core Telugu learning database.',
    };
  }

  // Search in practical sentences
  const sentenceMatch = PRACTICAL_SENTENCES.find(
    (s) =>
      s.hindi.toLowerCase().includes(q) ||
      s.english.toLowerCase().includes(q) ||
      s.telugu.toLowerCase().includes(q)
  );

  if (sentenceMatch) {
    return {
      telugu: sentenceMatch.telugu,
      teluguScript: sentenceMatch.teluguScript || '',
      hindi: sentenceMatch.hindi,
      breakdown: sentenceMatch.wordTokens ? sentenceMatch.wordTokens.join(' + ') : '',
      exampleTelugu: sentenceMatch.telugu,
      exampleHindi: sentenceMatch.hindi,
      notes: 'Matches practical spoken sentence pattern.',
    };
  }

  // Default simulated response
  return {
    telugu: `"${query}" (Demo Mode)`,
    hindi: `"${query}" ka Telugu anuvad`,
    breakdown: 'Add your free Gemini API Key in Settings for unlimited AI translations!',
    exampleTelugu: 'Naaku telusu (Mujhe pata hai)',
    exampleHindi: 'Mujhe pata hai',
    notes: 'Tip: Add a free Google Gemini key in AI Settings for real-time generative responses.',
  };
}

/**
 * Offline fallback practice task using user's target items.
 */
function generateOfflineAdaptiveTask(
  targetItems: { id: string; telugu: string; hindi: string }[],
  mode: AiPracticeMode
): AiPracticeTask {
  const primary = targetItems[0] || {
    id: 'v_kaavali',
    telugu: 'Kaavali',
    hindi: 'Chahiye',
  };

  const distractorWords = VOCABULARY_DATA.filter((v) => v.id !== primary.id)
    .slice(0, 3)
    .map((v) => v.telugu);

  const options = [primary.telugu, ...distractorWords].sort(() => 0.5 - Math.random());

  if (mode === 'roleplay') {
    return {
      id: `offline_task_${Date.now()}`,
      mode: 'roleplay',
      scenarioTitle: 'Hostel Roommate Interaction',
      situationHindi: `Dost se kehna hai ki tumhe ${primary.hindi} chahiye`,
      promptHindi: `Mujhe ${primary.hindi} chahiye.`,
      correctAnswer: primary.telugu,
      partnerRole: 'Roommate',
      partnerAvatar: '🧑‍🎓',
      partnerDialogueTelugu: 'Emi kaavali mama?',
      partnerDialogueHindi: 'Kya chahiye bhai?',
      expectedGoalHindi: `Usse kaho: "Naaku ${primary.telugu}"`,
      roleplayOptions: [
        {
          id: 'opt1',
          text: `Naaku ${primary.telugu} kaavali`,
          isCorrect: true,
          explanation: `Correct! "${primary.telugu}" means "${primary.hindi}".`,
        },
        {
          id: 'opt2',
          text: `Nenu ${distractorWords[0] || 'vaddu'}`,
          isCorrect: false,
          explanation: `Incorrect choice.`,
        },
      ],
      explanation: `${primary.telugu} directly translates to ${primary.hindi}.`,
      hintHindi: `Yaad karo: ${primary.telugu} = ${primary.hindi}`,
      targetWordIds: [primary.id],
      targetWordsSummary: [primary],
    };
  }

  return {
    id: `offline_task_${Date.now()}`,
    mode: 'fill_blank',
    scenarioTitle: 'Conversational Fill-in-the-Blank',
    situationHindi: `Sahi shabd chuno jiska matlab "${primary.hindi}" ho:`,
    promptTelugu: `Naaku _____ kaavali.`,
    promptHindi: `Mujhe ${primary.hindi} chahiye.`,
    promptEnglish: `I want ${primary.hindi}.`,
    blankOptions: options,
    correctAnswer: primary.telugu,
    explanation: `${primary.telugu} is the exact Telugu word for ${primary.hindi}.`,
    hintHindi: `Mental bridge: ${primary.telugu} = ${primary.hindi}`,
    targetWordIds: [primary.id],
    targetWordsSummary: [primary],
  };
}

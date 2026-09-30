import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLlmConfig,
  saveLlmConfig,
  hasApiKey,
  translateQuery,
  generateAdaptiveTask,
  evaluateUserAnswer,
  DEFAULT_LLM_CONFIG,
} from '../engine/llmService';

const storageMock: Record<string, string> = {};
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: (key: string) => storageMock[key] ?? null,
    setItem: (key: string, value: string) => {
      storageMock[key] = String(value);
    },
    removeItem: (key: string) => {
      delete storageMock[key];
    },
    clear: () => {
      Object.keys(storageMock).forEach((k) => delete storageMock[k]);
    },
    key: (i: number) => Object.keys(storageMock)[i] ?? null,
    length: 0,
  } as Storage;
}

describe('LLM Service & Adaptive Arena Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default LLM config and saves custom config properly', () => {
    const initial = getLlmConfig();
    expect(initial.provider).toBe('gemini');
    expect(hasApiKey()).toBe(false);

    saveLlmConfig({
      provider: 'gemini',
      apiKey: 'test-api-key-12345',
      model: 'gemini-2.0-flash-lite',
    });

    expect(hasApiKey()).toBe(true);
    const updated = getLlmConfig();
    expect(updated.apiKey).toBe('test-api-key-12345');
    expect(updated.provider).toBe('gemini');
  });

  it('translates words via offline fallback when no API key is present', async () => {
    // When translating "water" or "neellu"
    const res = await translateQuery('water');
    expect(res).toBeDefined();
    expect(res.telugu.toLowerCase()).toContain('neellu');
    expect(res.hindi.toLowerCase()).toContain('paani');
    expect(res.exampleTelugu).toBeDefined();
  });

  it('translates practical phrases via offline fallback', async () => {
    const res = await translateQuery('Mujhe Telugu nahi aati');
    expect(res).toBeDefined();
    expect(res.telugu.toLowerCase()).toContain('telugu');
    expect(res.hindi).toBeDefined();
  });

  it('generates adaptive practice tasks for user target words', async () => {
    const targetWords = [
      { id: 'v_kaavali', telugu: 'Kaavali', hindi: 'Chahiye' },
      { id: 'v_vaddu', telugu: 'Vaddu', hindi: 'Nahi chahiye' },
    ];

    const task = await generateAdaptiveTask(targetWords, 'fill_blank');
    expect(task).toBeDefined();
    expect(task.mode).toBe('fill_blank');
    expect(task.targetWordIds).toContain('v_kaavali');
    expect(task.correctAnswer).toBe('Kaavali');
    expect(task.blankOptions).toBeDefined();
    expect(task.blankOptions!.length).toBeGreaterThanOrEqual(2);
  });

  it('generates roleplay tasks with dialogue and options', async () => {
    const targetWords = [
      { id: 'v_neellu', telugu: 'Neellu', hindi: 'Paani' },
    ];

    const task = await generateAdaptiveTask(targetWords, 'roleplay');
    expect(task).toBeDefined();
    expect(task.mode).toBe('roleplay');
    expect(task.partnerRole).toBeDefined();
    expect(task.partnerDialogueTelugu).toBeDefined();
    expect(task.roleplayOptions).toBeDefined();
  });

  it('evaluates user answers accurately with fuzzy normalizer', async () => {
    const task = await generateAdaptiveTask(
      [{ id: 'v_kaavali', telugu: 'Kaavali', hindi: 'Chahiye' }],
      'fill_blank'
    );

    // Exact match
    const evalExact = await evaluateUserAnswer(task, 'Kaavali');
    expect(evalExact.isCorrect).toBe(true);
    expect(evalExact.score).toBe(100);

    // Minor transliteration variation (kavali instead of kaavali)
    const evalFuzzy = await evaluateUserAnswer(task, 'kavali');
    expect(evalFuzzy.isCorrect).toBe(true);

    // Completely incorrect answer
    const evalWrong = await evaluateUserAnswer(task, 'vaddu');
    expect(evalWrong.isCorrect).toBe(false);
  });
});

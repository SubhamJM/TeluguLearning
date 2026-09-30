import { describe, it, expect } from 'vitest';
import {
  canonicalizeTeluguToken,
  canonicalizeSentence,
  evaluateTeluguAnswer,
} from '../engine/answerNormalizer';

describe('answerNormalizer', () => {
  it('canonicalizes phonetic variations in Roman Telugu', () => {
    // kaavali vs kavali
    expect(canonicalizeTeluguToken('kaavali')).toBe(canonicalizeTeluguToken('kavali'));
    // meeru vs meru
    expect(canonicalizeTeluguToken('meeru')).toBe(canonicalizeTeluguToken('meru'));
    // kooda vs kuda
    expect(canonicalizeTeluguToken('kooda')).toBe(canonicalizeTeluguToken('kuda'));
    // telusu vs telusoo
    expect(canonicalizeTeluguToken('telusu')).toBe(canonicalizeTeluguToken('telusoo'));
  });

  it('normalizes sentence with punctuation and whitespace', () => {
    const s1 = '  Naaku coffee kaavali!  ';
    const s2 = 'naaku coffee kavali';
    expect(canonicalizeSentence(s1)).toBe(canonicalizeSentence(s2));
  });

  it('accepts exact match regardless of case and punctuation', () => {
    const res = evaluateTeluguAnswer('Naaku neellu kaavali.', 'naaku neellu kaavali');
    expect(res.isMatch).toBe(true);
    expect(res.isExact).toBe(true);
    expect(res.score).toBe(100);
  });

  it('accepts phonetic romanization variations as match', () => {
    const res = evaluateTeluguAnswer('naaku coffee kavali', 'Naaku coffee kaavali');
    expect(res.isMatch).toBe(true);
    expect(res.score).toBeGreaterThanOrEqual(90);
  });

  it('accepts verb ending variations like chestunnanu / chestunna', () => {
    const res = evaluateTeluguAnswer('nenu work chestunna', 'Nenu work chestunnanu');
    expect(res.isMatch).toBe(true);
  });

  it('accepts alternative acceptable variations list', () => {
    const res = evaluateTeluguAnswer('1 plate samosa ivvandi', 'One plate samosa ivvandi', [
      '1 plate samosa ivvandi',
    ]);
    expect(res.isMatch).toBe(true);
  });

  it('rejects incorrect answers', () => {
    const res = evaluateTeluguAnswer('Nenu coffee vaddu', 'Naaku coffee kaavali');
    expect(res.isMatch).toBe(false);
  });
});

/**
 * Answer Normalizer for Roman Telugu
 * Allows natural transliteration variations commonly used by learners and native speakers.
 */

// Common phonetic replacements for Roman Telugu equivalence
export function canonicalizeTeluguToken(token: string): string {
  let t = token
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ''); // strip hyphens, punctuation

  // Collapse double vowels that learners interchangeably use
  // aa -> a
  t = t.replace(/aa+/g, 'a');
  // 'ee' -> 'e' (e.g. meeru / meru)
  t = t.replace(/ee+/g, 'e');
  t = t.replace(/ii+/g, 'i');
  // In Roman Indian scripts, 'oo' is frequently written for 'u' / 'uu' (e.g. kooda / kuda)
  t = t.replace(/oo+/g, 'u');
  t = t.replace(/uu+/g, 'u');

  // Aspirated / non-aspirated dental consonants
  t = t.replace(/th/g, 't');
  t = t.replace(/dh/g, 'd');
  t = t.replace(/bh/g, 'b');
  t = t.replace(/ph/g, 'p');
  t = t.replace(/kh/g, 'k');
  t = t.replace(/gh/g, 'g');

  // Double consonants learners often single out
  t = t.replace(/nn+/g, 'n');
  t = t.replace(/ll+/g, 'l');
  t = t.replace(/mm+/g, 'm');
  t = t.replace(/tt+/g, 't');
  t = t.replace(/dd+/g, 'd');
  t = t.replace(/ss+/g, 's');
  t = t.replace(/vv+/g, 'v');

  // Common ending variation: 'chestunnanu' -> 'chestunna', 'vellanu' -> 'vella'
  if (t.endsWith('anu') && t.length > 4) {
    t = t.slice(0, -3) + 'a';
  } else if (t.endsWith('nu') && t.length > 4) {
    t = t.slice(0, -2);
  }

  // Common word ending variations (e.g., 'enti' vs 'emiti')
  if (t === 'enti') return 'emiti';
  if (t === 'em') return 'emiti';

  return t;
}

export function cleanDisplayString(input: string): string {
  return input
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '')
    .replace(/\s+/g, ' ');
}

export function canonicalizeSentence(sentence: string): string {
  const cleaned = cleanDisplayString(sentence);
  if (!cleaned) return '';

  const tokens = cleaned.split(' ');
  return tokens.map(canonicalizeTeluguToken).filter(Boolean).join(' ');
}

/**
 * Standard Levenshtein distance algorithm for evaluating minor typographical errors
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix: number[][] = [];
  for (let i = 0; i <= bn; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= an; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[bn][an];
}

export interface MatchResult {
  isMatch: boolean;
  isExact: boolean;
  score: number; // 0 to 100
  userCanonical: string;
  expectedCanonical: string;
  feedback: string;
}

/**
 * Compares user's Roman Telugu response against expected phrase and acceptable alternatives.
 */
export function evaluateTeluguAnswer(
  userAnswer: string,
  expectedAnswer: string,
  acceptableVariations: string[] = []
): MatchResult {
  const userClean = cleanDisplayString(userAnswer);
  const expectedClean = cleanDisplayString(expectedAnswer);

  if (!userClean) {
    return {
      isMatch: false,
      isExact: false,
      score: 0,
      userCanonical: '',
      expectedCanonical: canonicalizeSentence(expectedAnswer),
      feedback: 'Please type an answer before submitting.',
    };
  }

  // 1. Exact match (ignoring case & surrounding punctuation)
  if (userClean.toLowerCase() === expectedClean.toLowerCase()) {
    return {
      isMatch: true,
      isExact: true,
      score: 100,
      userCanonical: canonicalizeSentence(userAnswer),
      expectedCanonical: canonicalizeSentence(expectedAnswer),
      feedback: 'Spot on! Perfect Telugu.',
    };
  }

  // 2. Exact match with any listed acceptable variations
  for (const alt of acceptableVariations) {
    if (userClean.toLowerCase() === cleanDisplayString(alt).toLowerCase()) {
      return {
        isMatch: true,
        isExact: true,
        score: 100,
        userCanonical: canonicalizeSentence(userAnswer),
        expectedCanonical: canonicalizeSentence(expectedAnswer),
        feedback: 'Spot on! Accepted variation.',
      };
    }
  }

  // 3. Phonetic canonical comparison
  const userCanon = canonicalizeSentence(userAnswer);
  const expectedCanon = canonicalizeSentence(expectedAnswer);

  if (userCanon === expectedCanon) {
    return {
      isMatch: true,
      isExact: false,
      score: 95,
      userCanonical: userCanon,
      expectedCanonical: expectedCanon,
      feedback: 'Great! Meaning and pronunciation are correct.',
    };
  }

  for (const alt of acceptableVariations) {
    if (userCanon === canonicalizeSentence(alt)) {
      return {
        isMatch: true,
        isExact: false,
        score: 95,
        userCanonical: userCanon,
        expectedCanonical: expectedCanon,
        feedback: 'Great! Meaning and pronunciation are correct.',
      };
    }
  }

  // 4. Fuzzy Levenshtein match for slight typos (e.g. single missing char)
  const dist = levenshteinDistance(userCanon, expectedCanon);
  const maxLen = Math.max(userCanon.length, expectedCanon.length);
  const similarity = maxLen > 0 ? (1 - dist / maxLen) * 100 : 0;

  // If sentence is at least 6 letters and typo distance is <= 2 or similarity >= 82%
  if ((dist <= 2 && maxLen >= 8) || similarity >= 82) {
    return {
      isMatch: true,
      isExact: false,
      score: Math.round(similarity),
      userCanonical: userCanon,
      expectedCanonical: expectedCanon,
      feedback: 'Close enough! Watch out for minor spelling.',
    };
  }

  return {
    isMatch: false,
    isExact: false,
    score: Math.round(Math.max(0, similarity)),
    userCanonical: userCanon,
    expectedCanonical: expectedCanon,
    feedback: 'Not quite. Check the expected Telugu formulation.',
  };
}

import { useState, useEffect } from 'react';
import { PlaygroundSet } from '../types';

const PLAYGROUND_STORAGE_KEY = 'telugu_quest_playground_sets_v1';

export const SEED_PLAYGROUND_SETS: PlaygroundSet[] = [
  {
    id: 'set_seed_basics',
    name: 'My Telugu Basics',
    description: 'Core 1st & 2nd person pronouns and essentials',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    mappings: [
      { id: 'm1', telugu: 'Nenu', hindi: 'Main', english: 'I' },
      { id: 'm2', telugu: 'Naaku', hindi: 'Mujhe', english: 'To me' },
      { id: 'm3', telugu: 'Naa', hindi: 'Mera', english: 'My' },
      { id: 'm4', telugu: 'Nuvvu', hindi: 'Tum', english: 'You' },
      { id: 'm5', telugu: 'Neeku', hindi: 'Tumhe', english: 'To you' },
      { id: 'm6', telugu: 'Nee', hindi: 'Tumhara', english: 'Your' },
    ],
    phrases: [
      { id: 'p1', telugu: 'Naaku coffee kaavali', hindi: 'Mujhe coffee chahiye', english: 'I want coffee' },
      { id: 'p2', telugu: 'Naaku Telugu raadu', hindi: 'Mujhe Telugu nahi aati', english: "I don't know Telugu" },
      { id: 'p3', telugu: 'Nee peru enti?', hindi: 'Tumhara naam kya hai?', english: 'What is your name?' },
    ],
  },
  {
    id: 'set_seed_hostel',
    name: 'Hostel Telugu',
    description: 'Common quick words used around the campus hostel',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    mappings: [
      { id: 'mh1', telugu: 'Mess', hindi: 'Mess', english: 'Mess dining' },
      { id: 'mh2', telugu: 'Neellu', hindi: 'Paani', english: 'Water' },
      { id: 'mh3', telugu: 'Kura', hindi: 'Sabzi', english: 'Curry' },
      { id: 'mh4', telugu: 'Chappati', hindi: 'Roti', english: 'Flatbread' },
      { id: 'mh5', telugu: 'Pappu', hindi: 'Daal', english: 'Dal' },
      { id: 'mh6', telugu: 'Veldama?', hindi: 'Chalein kya?', english: 'Shall we go?' },
    ],
    phrases: [
      { id: 'ph1', telugu: 'Mess ki veldama?', hindi: 'Mess chalein kya?', english: 'Shall we go to the mess?' },
      { id: 'ph2', telugu: 'Konchem neellu ivvandi', hindi: 'Thoda paani dijiye', english: 'Please give some water' },
      { id: 'ph3', telugu: 'Nenu room lo unnanu', hindi: 'Main room mein hoon', english: 'I am in the room' },
    ],
  },
  {
    id: 'set_seed_forgetting',
    name: 'Words I Keep Forgetting',
    description: 'Frequently tricky words and direction particles',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    mappings: [
      { id: 'mf1', telugu: 'Ekkadiki', hindi: 'Kidhar', english: 'Towards where' },
      { id: 'mf2', telugu: 'Ikkada', hindi: 'Yahan', english: 'Here' },
      { id: 'mf3', telugu: 'Akkada', hindi: 'Wahan', english: 'There' },
      { id: 'mf4', telugu: 'Kudi', hindi: 'Daayan', english: 'Right side' },
      { id: 'mf5', telugu: 'Edama', hindi: 'Baayan', english: 'Left side' },
      { id: 'mf6', telugu: 'Endukante', hindi: 'Kyunki', english: 'Because' },
    ],
    phrases: [
      { id: 'pf1', telugu: 'Kudi vaipu tiragandi', hindi: 'Daayein taraf mudiye', english: 'Turn right' },
      { id: 'pf2', telugu: 'Nuvvu ekkadiki veltunnavu?', hindi: 'Tum kidhar ja rahe ho?', english: 'Where are you going?' },
    ],
  },
];

export function loadPlaygroundSets(): PlaygroundSet[] {
  try {
    const raw = localStorage.getItem(PLAYGROUND_STORAGE_KEY);
    if (!raw) return SEED_PLAYGROUND_SETS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SEED_PLAYGROUND_SETS;
  } catch {
    return SEED_PLAYGROUND_SETS;
  }
}

export function savePlaygroundSets(sets: PlaygroundSet[]): void {
  try {
    localStorage.setItem(PLAYGROUND_STORAGE_KEY, JSON.stringify(sets));
  } catch (err) {
    console.error('Failed to save playground sets', err);
  }
}

export function usePlaygroundStore() {
  const [sets, setSets] = useState<PlaygroundSet[]>(loadPlaygroundSets);

  useEffect(() => {
    savePlaygroundSets(sets);
  }, [sets]);

  const addSet = (name: string, description: string = ''): PlaygroundSet => {
    const newSet: PlaygroundSet = {
      id: `custom_set_${Date.now()}`,
      name: name.trim() || 'Untitled Set',
      description: description.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mappings: [],
      phrases: [],
    };
    setSets((prev) => [newSet, ...prev]);
    return newSet;
  };

  const updateSet = (id: string, updates: Partial<PlaygroundSet>) => {
    setSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s))
    );
  };

  const deleteSet = (id: string) => {
    setSets((prev) => prev.filter((s) => s.id !== id));
  };

  const addMappingToSet = (
    setId: string,
    telugu: string,
    hindi: string,
    english?: string
  ) => {
    setSets((prev) =>
      prev.map((s) => {
        if (s.id !== setId) return s;
        const newMapping = {
          id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          telugu: telugu.trim(),
          hindi: hindi.trim(),
          english: english?.trim(),
        };
        return {
          ...s,
          mappings: [...s.mappings, newMapping],
          updatedAt: Date.now(),
        };
      })
    );
  };

  const removeMappingFromSet = (setId: string, mappingId: string) => {
    setSets((prev) =>
      prev.map((s) => {
        if (s.id !== setId) return s;
        return {
          ...s,
          mappings: s.mappings.filter((m) => m.id !== mappingId),
          updatedAt: Date.now(),
        };
      })
    );
  };

  const addPhraseToSet = (
    setId: string,
    telugu: string,
    hindi: string,
    english?: string
  ) => {
    setSets((prev) =>
      prev.map((s) => {
        if (s.id !== setId) return s;
        const newPhrase = {
          id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          telugu: telugu.trim(),
          hindi: hindi.trim(),
          english: english?.trim(),
        };
        return {
          ...s,
          phrases: [...s.phrases, newPhrase],
          updatedAt: Date.now(),
        };
      })
    );
  };

  const removePhraseFromSet = (setId: string, phraseId: string) => {
    setSets((prev) =>
      prev.map((s) => {
        if (s.id !== setId) return s;
        return {
          ...s,
          phrases: s.phrases.filter((p) => p.id !== phraseId),
          updatedAt: Date.now(),
        };
      })
    );
  };

  const resetToSeedSets = () => {
    setSets(SEED_PLAYGROUND_SETS);
    savePlaygroundSets(SEED_PLAYGROUND_SETS);
  };

  return {
    sets,
    addSet,
    updateSet,
    deleteSet,
    addMappingToSet,
    removeMappingFromSet,
    addPhraseToSet,
    removePhraseFromSet,
    resetToSeedSets,
  };
}

import React, { useState } from 'react';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { PlaygroundSet } from '../../types';
import { MatchingGame } from '../modes/MatchingGame';
import { SpeedRound } from '../modes/SpeedRound';
import { SentenceBuilder } from '../modes/SentenceBuilder';
import {
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
  Gamepad2,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../../engine/audioPlayer';

interface PlaygroundViewProps {
  onAddXp?: (amount: number) => void;
  onRecordAttempt?: (itemId: string, isCorrect: boolean) => void;
}

type PlaygroundGameMode = 'match' | 'speed' | 'sentence' | null;

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  onAddXp,
  onRecordAttempt,
}) => {
  const {
    sets,
    addSet,
    deleteSet,
    addMappingToSet,
    removeMappingFromSet,
    addPhraseToSet,
    removePhraseFromSet,
    resetToSeedSets,
  } = usePlaygroundStore();

  const [activeSetId, setActiveSetId] = useState<string>(sets[0]?.id || '');
  const activeSet: PlaygroundSet | undefined =
    sets.find((s) => s.id === activeSetId) || sets[0];

  // Forms state
  const [newSetName, setNewSetName] = useState<string>('');
  const [isCreatingSet, setIsCreatingSet] = useState<boolean>(false);

  // New word mapping inputs
  const [newTeluguWord, setNewTeluguWord] = useState<string>('');
  const [newHindiWord, setNewHindiWord] = useState<string>('');
  const [newEnglishWord, setNewEnglishWord] = useState<string>('');

  // New phrase inputs
  const [newTeluguPhrase, setNewTeluguPhrase] = useState<string>('');
  const [newHindiPhrase, setNewHindiPhrase] = useState<string>('');
  const [newEnglishPhrase, setNewEnglishPhrase] = useState<string>('');

  // Active game mode state
  const [activeGameMode, setActiveGameMode] = useState<PlaygroundGameMode>(null);

  const handleCreateSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSetName.trim()) return;
    const created = addSet(newSetName.trim());
    setActiveSetId(created.id);
    setNewSetName('');
    setIsCreatingSet(false);
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeluguWord.trim() || !newHindiWord.trim() || !activeSet) return;
    addMappingToSet(activeSet.id, newTeluguWord, newHindiWord, newEnglishWord);
    setNewTeluguWord('');
    setNewHindiWord('');
    setNewEnglishWord('');
  };

  const handleAddPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeluguPhrase.trim() || !newHindiPhrase.trim() || !activeSet) return;
    addPhraseToSet(activeSet.id, newTeluguPhrase, newHindiPhrase, newEnglishPhrase);
    setNewTeluguPhrase('');
    setNewHindiPhrase('');
    setNewEnglishPhrase('');
  };

  // Convert playground phrases into SentenceBuilder-compatible PracticalSentence
  const getSentenceForBuilder = () => {
    if (!activeSet || activeSet.phrases.length === 0) return null;
    const p = activeSet.phrases[0];
    const tokens = p.telugu.split(' ');
    return {
      id: p.id,
      telugu: p.telugu,
      hindi: p.hindi,
      english: p.english || '',
      stage: 1,
      category: 'playground',
      wordTokens: tokens,
      distractorTokens: ['Nenu', 'kaavali', 'vaddu'],
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/10">
        <div className="flex items-center space-x-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Custom Mappings & Instant Game Generator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Playground Mode
        </h2>
        <p className="text-indigo-100 text-sm max-w-2xl">
          Create your own Telugu ↔ Hindi vocabulary sets (e.g. for your hostel, department, or tricky words).
          The app will instantly auto-generate playable games from whatever you type!
        </p>
      </div>

      {/* Active Game Mode View */}
      {activeGameMode !== null && activeSet && (
        <div className="space-y-4">
          <button
            onClick={() => setActiveGameMode(null)}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Set Editor</span>
          </button>

          {activeGameMode === 'match' && (
            <MatchingGame
              items={activeSet.mappings.map((m) => ({
                id: m.id,
                telugu: m.telugu,
                hindi: m.hindi,
                english: m.english,
              }))}
              title={`Match Game: ${activeSet.name}`}
              subtitle="Pair your custom Telugu words with their Hindi bridge meanings"
              onComplete={(xp) => {
                if (onAddXp) onAddXp(xp);
              }}
              onAddXp={onAddXp}
              onRecordAttempt={onRecordAttempt}
            />
          )}

          {activeGameMode === 'speed' && (
            <SpeedRound
              vocabulary={activeSet.mappings.map((m) => ({
                id: m.id,
                telugu: m.telugu,
                hindi: m.hindi,
                english: m.english || '',
              }))}
              durationSeconds={45}
              onComplete={(xp) => {
                if (onAddXp) onAddXp(xp);
              }}
              onRecordAttempt={onRecordAttempt}
            />
          )}

          {activeGameMode === 'sentence' && (
            <div>
              {getSentenceForBuilder() ? (
                <SentenceBuilder
                  sentence={getSentenceForBuilder()!}
                  onNext={(isCorrect) => {
                    if (isCorrect && onAddXp) onAddXp(25);
                    setActiveGameMode(null);
                  }}
                />
              ) : (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center">
                  <p className="text-slate-500 mb-4">
                    Please add at least one phrase to this set first!
                  </p>
                  <button
                    onClick={() => setActiveGameMode(null)}
                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Editor & Manager View */}
      {activeGameMode === null && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sets List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                  Your Sets ({sets.length})
                </span>
                <button
                  onClick={() => setIsCreatingSet(!isCreatingSet)}
                  className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                  title="Create new set"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* New Set Input */}
              {isCreatingSet && (
                <form onSubmit={handleCreateSet} className="mb-3 space-y-2 animate-pop">
                  <input
                    type="text"
                    value={newSetName}
                    onChange={(e) => setNewSetName(e.target.value)}
                    placeholder="Set name (e.g. Canteen Telugu)..."
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={!newSetName.trim()}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-bold"
                    >
                      Save Set
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingSet(false)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Sets List */}
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto no-scrollbar">
                {sets.map((set) => {
                  const isSelected = set.id === activeSet?.id;
                  return (
                    <div
                      key={set.id}
                      onClick={() => setActiveSetId(set.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">{set.name}</div>
                        <div className="text-xs text-slate-400">
                          {set.mappings.length} words • {set.phrases.length} phrases
                        </div>
                      </div>

                      {sets.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSet(set.id);
                          }}
                          className="p-1 text-slate-300 hover:text-rose-500 rounded-md"
                          title="Delete set"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 text-center">
                <button
                  onClick={resetToSeedSets}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                >
                  Reset pre-made seed sets
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Active Set Editor & Game Launcher */}
          {activeSet && (
            <div className="lg:col-span-8 space-y-6">
              {/* Game Generator Launcher Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {activeSet.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeSet.description || 'Custom user vocabulary set'}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg">
                    {activeSet.mappings.length} Mappings
                  </span>
                </div>

                {/* Instant Game Launch Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    disabled={activeSet.mappings.length < 3}
                    onClick={() => setActiveGameMode('match')}
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm shadow-emerald-600/20 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Match Game</span>
                  </button>

                  <button
                    disabled={activeSet.mappings.length < 4}
                    onClick={() => setActiveGameMode('speed')}
                    className="p-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm shadow-amber-600/20 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Speed Round</span>
                  </button>

                  <button
                    disabled={activeSet.phrases.length === 0}
                    onClick={() => setActiveGameMode('sentence')}
                    className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm shadow-indigo-600/20 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Sentence Builder</span>
                  </button>
                </div>
              </div>

              {/* Word Mappings List & Add Form */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-3">
                  Telugu ↔ Hindi Word Pairs ({activeSet.mappings.length})
                </span>

                {/* Add new mapping form */}
                <form
                  onSubmit={handleAddWord}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700"
                >
                  <input
                    type="text"
                    value={newTeluguWord}
                    onChange={(e) => setNewTeluguWord(e.target.value)}
                    placeholder="Telugu (e.g. Nenu)"
                    className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newHindiWord}
                    onChange={(e) => setNewHindiWord(e.target.value)}
                    placeholder="Hindi (e.g. Main)"
                    className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newEnglishWord}
                    onChange={(e) => setNewEnglishWord(e.target.value)}
                    placeholder="English (optional)"
                    className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!newTeluguWord.trim() || !newHindiWord.trim()}
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    + Add Word
                  </button>
                </form>

                {/* Existing Mappings Table */}
                <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1 no-scrollbar">
                  {activeSet.mappings.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 flex items-center justify-between text-xs sm:text-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {m.telugu}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400">
                          {m.hindi}
                        </span>
                        {m.english && (
                          <span className="text-slate-400 text-xs">({m.english})</span>
                        )}
                      </div>

                      <button
                        onClick={() => removeMappingFromSet(activeSet.id, m.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded-md"
                        title="Delete word"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phrase / Sentences Section */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-3">
                  Phrases & Sentences ({activeSet.phrases.length})
                </span>

                <form
                  onSubmit={handleAddPhrase}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700"
                >
                  <input
                    type="text"
                    value={newTeluguPhrase}
                    onChange={(e) => setNewTeluguPhrase(e.target.value)}
                    placeholder="Telugu: Naaku tea kaavali"
                    className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newHindiPhrase}
                    onChange={(e) => setNewHindiPhrase(e.target.value)}
                    placeholder="Hindi: Mujhe chai chahiye"
                    className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!newTeluguPhrase.trim() || !newHindiPhrase.trim()}
                    className="py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    + Add Phrase
                  </button>
                </form>

                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 no-scrollbar">
                  {activeSet.phrases.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          {p.telugu}
                        </div>
                        <div className="text-xs text-teal-600 dark:text-teal-400">
                          {p.hindi}
                        </div>
                      </div>

                      <button
                        onClick={() => removePhraseFromSet(activeSet.id, p.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded-md"
                        title="Delete phrase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { SENTENCE_PATTERNS } from '../../data/sentencePatterns';
import { SentencePattern } from '../../types';
import { sound } from '../../engine/audioPlayer';
import { Sparkles, Volume2, ArrowRight, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

interface PatternExplorerProps {
  initialPatternId?: string;
  onPracticePattern?: (pattern: SentencePattern) => void;
}

export const PatternExplorer: React.FC<PatternExplorerProps> = ({
  initialPatternId,
  onPracticePattern,
}) => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(
    initialPatternId || SENTENCE_PATTERNS[0].id
  );
  const [customSlotWord, setCustomSlotWord] = useState<string>('coffee');

  const pattern: SentencePattern =
    SENTENCE_PATTERNS.find((p) => p.id === selectedPatternId) || SENTENCE_PATTERNS[0];

  const quickItems = ['coffee', 'tea', 'neellu (paani)', 'food (khaana)', 'sahayam (madad)'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Pattern Header / Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-500/10">
        <div className="flex items-center space-x-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Telugu Sentence Pattern Lab</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Master Reusable Telugu Patterns
        </h2>
        <p className="text-emerald-100 text-sm max-w-2xl">
          Don't memorize hundreds of isolated sentences. Learn recurring grammatical templates with Hindi as the conceptual bridge and swap in any word!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pattern Selector List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 h-fit max-h-[550px] overflow-y-auto no-scrollbar shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1 block">
            Core Patterns ({SENTENCE_PATTERNS.length})
          </span>
          <div className="space-y-1 mt-1">
            {SENTENCE_PATTERNS.map((p) => {
              const isSelected = p.id === pattern.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatternId(p.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{p.pattern}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {p.hindiPattern}
                    </div>
                  </div>
                  {isSelected && <ChevronRight className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pattern Detail & Interactive Lab */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            {/* Pattern Title */}
            <div className="flex items-start justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Pattern Formula
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{pattern.pattern}</span>
                  <button
                    onClick={() => sound.speakTelugu(pattern.variations[0]?.telugu || pattern.pattern)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg"
                    title="Pronounce"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </h3>
                <div className="text-base font-semibold text-teal-700 dark:text-teal-400 mt-1">
                  Hindi Equivalent: <span className="underline decoration-teal-400/40">{pattern.hindiPattern}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  English: {pattern.englishPattern}
                </div>
              </div>

              <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                Stage {pattern.stage}
              </span>
            </div>

            {/* Explanation with Hindi bridge */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-sm text-slate-700 dark:text-slate-300 mb-6">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                How It Works (Hindi Concept Bridge):
              </span>
              <p>{pattern.explanation}</p>
            </div>

            {/* Word-by-word Breakdown Table */}
            <div className="mb-6">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-3">
                Word-by-Word Anatomy
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pattern.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center"
                  >
                    <div className="font-extrabold text-base text-slate-900 dark:text-white">
                      {item.telugu}
                    </div>
                    <div className="text-xs font-bold text-teal-600 dark:text-teal-400 my-0.5">
                      = {item.hindi}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Variations List */}
            <div className="mb-6">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-3">
                Real Conversational Variations
              </span>
              <div className="space-y-2.5">
                {pattern.variations.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white text-base">
                        {v.telugu}
                      </div>
                      <div className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                        {v.hindi}
                      </div>
                      <div className="text-[11px] text-slate-400">{v.english}</div>
                    </div>
                    <button
                      onClick={() => sound.speakTelugu(v.telugu)}
                      className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg"
                      title="Pronounce variation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Slot Generator (Try it yourself!) */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-2">
                Interactive Slot Generator
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                Click a word to test slot replacement in this pattern:
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {quickItems.map((item) => {
                  const rawWord = item.split(' ')[0];
                  return (
                    <button
                      key={item}
                      onClick={() => setCustomSlotWord(rawWord)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        customSlotWord === rawWord
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* Generated Result Card */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
                <div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {pattern.pattern.replace('[X]', customSlotWord)}
                  </div>
                  <div className="text-xs font-semibold text-teal-600 dark:text-teal-300 mt-0.5">
                    {pattern.hindiPattern.replace('[X]', customSlotWord)}
                  </div>
                </div>
                <button
                  onClick={() =>
                    sound.speakTelugu(pattern.pattern.replace('[X]', customSlotWord))
                  }
                  className="p-2 text-emerald-600 hover:text-emerald-700 rounded-lg"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

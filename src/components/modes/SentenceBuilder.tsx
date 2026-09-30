import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, RotateCcw, ArrowRight, AlertCircle, HelpCircle } from 'lucide-react';
import { PracticalSentence } from '../../types';
import { sound } from '../../engine/audioPlayer';

interface SentenceBuilderProps {
  sentence: PracticalSentence;
  onNext: (isCorrect: boolean) => void;
  showTeluguScript?: boolean;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  sentence,
  onNext,
  showTeluguScript,
}) => {
  // Pool of available token chips
  const [poolTokens, setPoolTokens] = useState<Array<{ id: string; text: string }>>([]);
  const [selectedTokens, setSelectedTokens] = useState<Array<{ id: string; text: string }>>([]);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Initialize randomized token pool with distractors
  useEffect(() => {
    const tokens = [...sentence.wordTokens, ...(sentence.distractorTokens || [])];
    const randomized = tokens
      .map((t, idx) => ({ id: `token_${idx}_${t}`, text: t }))
      .sort(() => Math.random() - 0.5);

    setPoolTokens(randomized);
    setSelectedTokens([]);
    setIsEvaluated(false);
    setIsCorrect(false);
  }, [sentence.id]);

  const handlePickToken = (token: { id: string; text: string }) => {
    if (isEvaluated) return;
    setPoolTokens((prev) => prev.filter((t) => t.id !== token.id));
    setSelectedTokens((prev) => [...prev, token]);
  };

  const handleRemoveToken = (token: { id: string; text: string }) => {
    if (isEvaluated) return;
    setSelectedTokens((prev) => prev.filter((t) => t.id !== token.id));
    setPoolTokens((prev) => [...prev, token]);
  };

  const handleReset = () => {
    if (isEvaluated) return;
    const tokens = [...sentence.wordTokens, ...(sentence.distractorTokens || [])];
    const randomized = tokens
      .map((t, idx) => ({ id: `token_${idx}_${t}`, text: t }))
      .sort(() => Math.random() - 0.5);
    setPoolTokens(randomized);
    setSelectedTokens([]);
  };

  const handleCheck = () => {
    const userBuilt = selectedTokens.map((t) => t.text).join(' ');
    const expected = sentence.wordTokens.join(' ');

    // Normalize comparison: remove trailing punctuation
    const cleanUser = userBuilt.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim().toLowerCase();
    const cleanExpected = expected.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim().toLowerCase();

    const correct = cleanUser === cleanExpected;
    setIsCorrect(correct);
    setIsEvaluated(true);

    if (correct) {
      sound.playCorrect();
      sound.speakTelugu(sentence.telugu);
    } else {
      sound.playError();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-xl mx-auto shadow-sm">
      <div className="text-center mb-6">
        <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
          Build the Telugu Sentence
        </span>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          "{sentence.hindi}"
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {sentence.english}
        </p>
      </div>

      {/* Assembly Area */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Your Telugu sentence:</span>
          {selectedTokens.length > 0 && !isEvaluated && (
            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div
          className={`min-h-[72px] p-3 rounded-2xl border-2 flex flex-wrap gap-2 items-center transition-all ${
            isEvaluated
              ? isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500'
              : selectedTokens.length > 0
              ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600'
              : 'bg-slate-50/50 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700'
          }`}
        >
          {selectedTokens.length === 0 ? (
            <span className="text-sm text-slate-400 italic mx-auto">
              Tap the word chips below to place them in order
            </span>
          ) : (
            selectedTokens.map((token) => (
              <button
                key={token.id}
                disabled={isEvaluated}
                onClick={() => handleRemoveToken(token)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm shadow-sm border border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-transform active:scale-95"
              >
                {token.text}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Available Word Chips Pool */}
      <div className="mb-6">
        <div className="text-xs text-slate-400 mb-2">Available word chips:</div>
        <div className="flex flex-wrap gap-2 min-h-[50px]">
          {poolTokens.map((token) => (
            <button
              key={token.id}
              disabled={isEvaluated}
              onClick={() => handlePickToken(token)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200/80 dark:border-slate-700 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-800 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-xs"
            >
              {token.text}
            </button>
          ))}
        </div>
      </div>

      {/* Action / Evaluation Area */}
      {!isEvaluated ? (
        <button
          disabled={selectedTokens.length === 0}
          onClick={handleCheck}
          className="w-full py-3 bg-emerald-600 disabled:opacity-40 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/30 transition-all"
        >
          Check Sentence
        </button>
      ) : (
        <div className="animate-pop border-t border-slate-100 dark:border-slate-800 pt-4">
          <div
            className={`p-4 rounded-xl mb-4 text-sm font-medium ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Correct! +20 XP</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span>Not quite! Expected Telugu:</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
              <span className="font-extrabold text-base">{sentence.telugu}</span>
              <button
                onClick={() => sound.speakTelugu(sentence.telugu)}
                className="p-1.5 hover:text-emerald-600 rounded-lg text-slate-500"
                title="Hear audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={() => onNext(isCorrect)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/30 transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

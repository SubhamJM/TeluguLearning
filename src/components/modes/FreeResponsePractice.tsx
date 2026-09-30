import React, { useState, useEffect, useRef } from 'react';
import { evaluateTeluguAnswer, MatchResult } from '../../engine/answerNormalizer';
import { sound } from '../../engine/audioPlayer';
import { CheckCircle2, AlertCircle, Volume2, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';

interface FreeResponseItem {
  id: string;
  situationOrHindi: string;
  englishPrompt: string;
  expectedTelugu: string;
  acceptableVariations?: string[];
  isThinkInTeluguMode?: boolean;
  hint?: string;
}

interface FreeResponsePracticeProps {
  items: FreeResponseItem[];
  onComplete: (earnedXp: number, score: number) => void;
  onRecordAttempt?: (itemId: string, isCorrect: boolean) => void;
}

export const FreeResponsePractice: React.FC<FreeResponsePracticeProps> = ({
  items,
  onComplete,
  onRecordAttempt,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userTyped, setUserTyped] = useState<string>('');
  const [evaluation, setEvaluation] = useState<MatchResult | null>(null);
  const [earnedXp, setEarnedXp] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentItem = items[currentIndex];

  useEffect(() => {
    setUserTyped('');
    setEvaluation(null);
    setShowHint(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [currentIndex, currentItem]);

  if (!currentItem) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (evaluation || !userTyped.trim()) return;

    const result = evaluateTeluguAnswer(
      userTyped,
      currentItem.expectedTelugu,
      currentItem.acceptableVariations || []
    );

    setEvaluation(result);

    if (onRecordAttempt) {
      onRecordAttempt(currentItem.id, result.isMatch);
    }

    if (result.isMatch) {
      sound.playCorrect();
      setCorrectCount((prev) => prev + 1);
      setEarnedXp((prev) => prev + 25);
      sound.speakTelugu(currentItem.expectedTelugu);
    } else {
      sound.playError();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(earnedXp + 50, correctCount);
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / items.length) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-xl mx-auto shadow-sm">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {currentItem.isThinkInTeluguMode ? 'Think in Telugu (No Hindi)' : 'Free Telugu Response'}
          </span>
          <span className="font-semibold">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Prompt Card */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center mb-6">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-1">
          {currentItem.isThinkInTeluguMode ? 'Situation Context' : 'Hindi Target Phrase'}
        </span>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white my-1">
          "{currentItem.situationOrHindi}"
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {currentItem.englishPrompt}
        </p>

        {currentItem.hint && (
          <div className="mt-3">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-xs text-slate-400 hover:text-emerald-600 font-semibold inline-flex items-center gap-1"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Show hint</span>
              </button>
            ) : (
              <p className="text-xs text-amber-600 dark:text-amber-300 font-medium">
                💡 Hint: {currentItem.hint}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Typed Input Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
            Type in Roman Telugu:
          </label>
          <input
            ref={inputRef}
            type="text"
            disabled={!!evaluation}
            value={userTyped}
            onChange={(e) => setUserTyped(e.target.value)}
            placeholder="e.g. Naaku coffee kaavali..."
            className="w-full px-4 py-3.5 text-base sm:text-lg font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all placeholder:text-slate-400 font-sans"
          />
        </div>

        {!evaluation && (
          <button
            type="submit"
            disabled={!userTyped.trim()}
            className="w-full py-3 bg-emerald-600 disabled:opacity-40 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/30 transition-all"
          >
            Check Answer
          </button>
        )}
      </form>

      {/* Evaluation Results Banner */}
      {evaluation && (
        <div className="animate-pop border-t border-slate-100 dark:border-slate-800 pt-4">
          <div
            className={`p-4 rounded-xl mb-4 text-sm font-medium ${
              evaluation.isMatch
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-2">
              {evaluation.isMatch ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{evaluation.feedback} (+25 XP)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span>{evaluation.feedback}</span>
                </>
              )}
            </div>

            <div className="space-y-1 text-xs sm:text-sm pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="flex justify-between">
                <span className="text-slate-500">Your answer:</span>
                <span className="font-bold">{userTyped}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Expected Telugu:</span>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {currentItem.expectedTelugu}
                  </span>
                  <button
                    onClick={() => sound.speakTelugu(currentItem.expectedTelugu)}
                    className="p-1 text-slate-400 hover:text-emerald-600 rounded-md"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/30 transition-all"
          >
            <span>{currentIndex + 1 < items.length ? 'Next Question' : 'Complete Practice'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { CONFUSION_PAIRS } from '../../data/confusionPairs';
import { ConfusionPair } from '../../types';
import { sound } from '../../engine/audioPlayer';
import { CheckCircle2, AlertCircle, ArrowRight, Lightbulb, GitCompare, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfusionDrillProps {
  pairId?: string;
  onComplete?: (earnedXp: number) => void;
  onRecordAttempt?: (itemId: string, isCorrect: boolean, responseTimeMs?: number, confusionPartnerId?: string) => void;
}

export const ConfusionDrill: React.FC<ConfusionDrillProps> = ({
  pairId = 'nenu_vs_naaku',
  onComplete,
  onRecordAttempt,
}) => {
  const [selectedPairId, setSelectedPairId] = useState<string>(pairId);
  const activePair: ConfusionPair =
    CONFUSION_PAIRS.find((p) => p.id === selectedPairId) || CONFUSION_PAIRS[0];

  const [drillIndex, setDrillIndex] = useState<number>(0);
  const [chosenChoice, setChosenChoice] = useState<'A' | 'B' | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [earnedXp, setEarnedXp] = useState<number>(0);

  const currentDrill = activePair.drills[drillIndex];

  const handleChoose = (choice: 'A' | 'B') => {
    if (isAnswered) return;
    setChosenChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentDrill.correctChoice;
    const partnerTelugu = choice === 'A' ? activePair.teluguB : activePair.teluguA;

    if (onRecordAttempt) {
      const activeWord = choice === 'A' ? activePair.teluguA : activePair.teluguB;
      onRecordAttempt(activeWord, isCorrect, 1500, partnerTelugu);
    }

    if (isCorrect) {
      sound.playCorrect();
      setCorrectStreak((prev) => prev + 1);
      setEarnedXp((prev) => prev + 15);
    } else {
      sound.playError();
      setCorrectStreak(0);
    }
  };

  const handleNext = () => {
    if (drillIndex + 1 < activePair.drills.length) {
      setDrillIndex((prev) => prev + 1);
      setChosenChoice(null);
      setIsAnswered(false);
    } else {
      // Finished drills for this pair
      sound.playLevelUp();
      confetti({ particleCount: 60, spread: 50 });
      if (onComplete) {
        onComplete(earnedXp + 30);
      }
      setDrillIndex(0);
      setChosenChoice(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Pair Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {CONFUSION_PAIRS.map((pair) => {
          const isSelected = pair.id === selectedPairId;
          return (
            <button
              key={pair.id}
              onClick={() => {
                setSelectedPairId(pair.id);
                setDrillIndex(0);
                setChosenChoice(null);
                setIsAnswered(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
              }`}
            >
              {pair.teluguA} vs {pair.teluguB}
            </button>
          );
        })}
      </div>

      {/* Main Confusion Drill Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-900">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {activePair.title}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Drill {drillIndex + 1} of {activePair.drills.length}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>+{earnedXp} XP</span>
          </div>
        </div>

        {/* Tip Box */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-900 dark:text-amber-200 mb-1">
              Mental Bridge Formula:
            </div>
            <p>{activePair.tip}</p>
          </div>
        </div>

        {/* Exercise Prompt */}
        <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 mb-6">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-1 block">
            Select the exact Telugu word needed:
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white my-2">
            "{currentDrill.promptHindi}"
          </div>
          {currentDrill.contextSentenceTelugu && (
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-2 tracking-wide font-mono">
              {currentDrill.contextSentenceTelugu}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            ({currentDrill.promptEnglish})
          </p>
        </div>

        {/* Binary Discrimination Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          {/* Choice A */}
          <button
            disabled={isAnswered}
            onClick={() => handleChoose('A')}
            className={`p-3.5 sm:p-5 rounded-2xl font-bold border-2 transition-all text-center flex flex-col items-center justify-center space-y-1 ${
              isAnswered
                ? currentDrill.correctChoice === 'A'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-400'
                  : chosenChoice === 'A'
                  ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-800 dark:text-rose-200'
                  : 'opacity-40 border-slate-200 dark:border-slate-800'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/30 text-slate-900 dark:text-white active:scale-95 shadow-sm'
            }`}
          >
            <span className="text-xl sm:text-2xl font-extrabold">{activePair.teluguA}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {activePair.hindiA}
            </span>
          </button>

          {/* Choice B */}
          <button
            disabled={isAnswered}
            onClick={() => handleChoose('B')}
            className={`p-3.5 sm:p-5 rounded-2xl font-bold border-2 transition-all text-center flex flex-col items-center justify-center space-y-1 ${
              isAnswered
                ? currentDrill.correctChoice === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-400'
                  : chosenChoice === 'B'
                  ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-800 dark:text-rose-200'
                  : 'opacity-40 border-slate-200 dark:border-slate-800'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/30 text-slate-900 dark:text-white active:scale-95 shadow-sm'
            }`}
          >
            <span className="text-xl sm:text-2xl font-extrabold">{activePair.teluguB}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {activePair.hindiB}
            </span>
          </button>
        </div>

        {/* Feedback & Continue */}
        {isAnswered && (
          <div className="animate-pop border-t border-slate-100 dark:border-slate-800 pt-4">
            <div
              className={`p-4 rounded-xl mb-4 text-xs sm:text-sm font-medium ${
                chosenChoice === currentDrill.correctChoice
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {chosenChoice === currentDrill.correctChoice ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>Correct distinction!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <span>Remember the rule:</span>
                  </>
                )}
              </div>
              <p className="mt-1">{currentDrill.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/30 transition-all"
            >
              <span>{drillIndex + 1 < activePair.drills.length ? 'Next Drill' : 'Complete Drill Round'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

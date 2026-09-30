import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Flame, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { sound } from '../../engine/audioPlayer';
import confetti from 'canvas-confetti';

interface SpeedRoundProps {
  vocabulary: Array<{ id: string; telugu: string; hindi: string; english: string }>;
  durationSeconds?: number;
  onComplete: (earnedXp: number, correctCount: number) => void;
  onRecordAttempt?: (itemId: string, isCorrect: boolean) => void;
}

export const SpeedRound: React.FC<SpeedRoundProps> = ({
  vocabulary,
  durationSeconds = 45,
  onComplete,
  onRecordAttempt,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [earnedXp, setEarnedXp] = useState<number>(0);

  // Question state
  const [currentPrompt, setCurrentPrompt] = useState<{
    id: string;
    telugu: string;
    hindi: string;
    isTeluguPrompt: boolean;
    options: string[];
    correctAnswer: string;
  } | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generates next random multiple-choice question
  const generateQuestion = () => {
    if (vocabulary.length < 4) return;
    const target = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    const isTeluguPrompt = Math.random() > 0.5;

    const correctAnswer = isTeluguPrompt ? target.hindi : target.telugu;
    const distractors = vocabulary
      .filter((v) => v.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v) => (isTeluguPrompt ? v.hindi : v.telugu));

    const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

    setCurrentPrompt({
      id: target.id,
      telugu: target.telugu,
      hindi: target.hindi,
      isTeluguPrompt,
      options,
      correctAnswer,
    });
  };

  const startRound = () => {
    setTimeLeft(durationSeconds);
    setScore(0);
    setCurrentStreak(0);
    setEarnedXp(0);
    setIsGameOver(false);
    setIsActive(true);
    generateQuestion();
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsGameOver(true);
      sound.playLevelUp();
      confetti({ particleCount: 80, spread: 70 });
      onComplete(earnedXp + score * 5, score);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleOptionClick = (option: string) => {
    if (!isActive || !currentPrompt) return;

    const isCorrect = option === currentPrompt.correctAnswer;

    if (onRecordAttempt) {
      onRecordAttempt(currentPrompt.id, isCorrect);
    }

    if (isCorrect) {
      sound.playCorrect();
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      setScore((prev) => prev + 1);

      const bonus = nextStreak >= 5 ? 15 : nextStreak >= 3 ? 10 : 5;
      setEarnedXp((prev) => prev + bonus);
    } else {
      sound.playError();
      setCurrentStreak(0);
    }

    // Immediately trigger next rapid-fire question
    generateQuestion();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8 max-w-xl mx-auto shadow-sm">
      {/* Top Header Status */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div
            className={`p-1.5 sm:p-2 rounded-xl flex items-center gap-1 font-bold text-xs sm:text-sm ${
              timeLeft <= 10
                ? 'bg-rose-50 text-rose-600 animate-pulse'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>

          {currentStreak >= 3 && (
            <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{currentStreak} Streak</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Score: <span className="text-slate-900 dark:text-white font-extrabold text-sm">{score}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2 sm:px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/60">
            <Zap className="w-3.5 h-3.5" />
            <span>+{earnedXp} XP</span>
          </div>
        </div>
      </div>

      {!isActive && !isGameOver && (
        <div className="text-center py-6 sm:py-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Timer className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
            Speed Round Challenge
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-sm mx-auto mb-4 sm:mb-6">
            Answer as many Telugu ↔ Hindi translations as you can in {durationSeconds} seconds!
          </p>
          <button
            onClick={startRound}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm sm:text-base active:scale-95"
          >
            Start {durationSeconds}s Speed Round
          </button>
        </div>
      )}

      {isActive && currentPrompt && (
        <div className="space-y-4 sm:space-y-6 animate-pop">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-6 rounded-2xl text-center border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-1">
              {currentPrompt.isTeluguPrompt ? 'Telugu Word' : 'Hindi Meaning'}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentPrompt.isTeluguPrompt ? currentPrompt.telugu : currentPrompt.hindi}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {currentPrompt.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className="p-3 sm:p-4 rounded-xl font-bold text-xs sm:text-base bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-slate-700 active:scale-95 transition-all text-slate-800 dark:text-slate-100 shadow-xs"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="text-center py-8 animate-pop">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Time's Up!
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            You answered <span className="font-extrabold text-slate-900 dark:text-white">{score}</span> correct translations and earned <span className="font-bold text-emerald-600">+{earnedXp + score * 5} XP</span>!
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={startRound}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

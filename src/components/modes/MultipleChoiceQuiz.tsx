import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../../engine/audioPlayer';

export interface QuizQuestion {
  id: string;
  prompt: string;
  promptSubtext?: string;
  promptType: 'telugu' | 'hindi';
  correctAnswer: string;
  correctAnswerId: string;
  options: Array<{
    id: string;
    text: string;
    subtext?: string;
    isCorrect: boolean;
  }>;
  explanation: string;
}

interface MultipleChoiceQuizProps {
  questions: QuizQuestion[];
  onComplete: (xpEarned: number, correctCount: number) => void;
  onRecordAttempt?: (itemId: string, isCorrect: boolean) => void;
  title?: string;
}

export const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({
  questions,
  onComplete,
  onRecordAttempt,
  title = 'Pick the Meaning',
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [earnedXp, setEarnedXp] = useState<number>(0);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    if (currentQ && currentQ.promptType === 'telugu') {
      sound.speakTelugu(currentQ.prompt);
    }
  }, [currentIndex, currentQ]);

  // Keyboard shortcuts 1, 2, 3, 4 and Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasSubmitted) {
        if (e.key === 'Enter') {
          handleNext();
        }
        return;
      }

      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQ?.options[idx]) {
          handleSelectOption(currentQ.options[idx].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSubmitted, currentQ, currentIndex]);

  if (!currentQ) {
    return null;
  }

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optionId);
    setHasSubmitted(true);

    const chosen = currentQ.options.find((o) => o.id === optionId);
    const isCorrect = !!chosen?.isCorrect;

    if (onRecordAttempt) {
      onRecordAttempt(currentQ.correctAnswerId, isCorrect);
    }

    if (isCorrect) {
      sound.playCorrect();
      setCorrectCount((prev) => prev + 1);
      setEarnedXp((prev) => prev + 15);
    } else {
      sound.playError();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all questions
      const finalXp = earnedXp + 40; // bonus
      onComplete(finalXp, correctCount + (currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect ? 1 : 0));
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-xl mx-auto shadow-sm">
      {/* Progress & Title */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {title}
          </span>
          <span className="font-semibold">
            {currentIndex + 1} / {questions.length}
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
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 text-center border border-slate-200/60 dark:border-slate-700/60 mb-6">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-1 block">
          {currentQ.promptType === 'telugu' ? 'Roman Telugu Word' : 'Hindi Meaning'}
        </span>
        <div className="flex items-center justify-center space-x-2 my-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {currentQ.prompt}
          </h2>
          {currentQ.promptType === 'telugu' && (
            <button
              onClick={() => sound.speakTelugu(currentQ.prompt)}
              className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-full"
              title="Pronounce"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>
        {currentQ.promptSubtext && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {currentQ.promptSubtext}
          </p>
        )}
      </div>

      {/* Multiple Choice Options */}
      <div className="space-y-3 mb-6">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          let style =
            'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 text-slate-800 dark:text-slate-100';

          if (hasSubmitted) {
            if (option.isCorrect) {
              style =
                'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500';
            } else if (isSelected && !option.isCorrect) {
              style =
                'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500';
            } else {
              style = 'opacity-40 border-slate-200 dark:border-slate-800';
            }
          }

          return (
            <button
              key={option.id}
              disabled={hasSubmitted}
              onClick={() => handleSelectOption(option.id)}
              className={`w-full p-4 rounded-xl font-bold border transition-all text-left flex items-center justify-between ${style}`}
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="text-base sm:text-lg">{option.text}</span>
              </div>

              {hasSubmitted && option.isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
              {hasSubmitted && isSelected && !option.isCorrect && (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Continue */}
      {hasSubmitted && (
        <div className="pt-2 animate-pop border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl mb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              Hindi Bridge Insight:
            </span>
            {currentQ.explanation}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/30 transition-all"
          >
            <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Summary'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

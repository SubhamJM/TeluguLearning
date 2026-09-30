import React, { useState } from 'react';
import { WordItem, PracticalSentence, CurriculumStage } from '../../types';
import { MatchingGame } from './MatchingGame';
import { MultipleChoiceQuiz, QuizQuestion } from './MultipleChoiceQuiz';
import { SentenceBuilder } from './SentenceBuilder';
import { sound } from '../../engine/audioPlayer';
import {
  Volume2,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonContainerProps {
  title: string;
  subtitle: string;
  vocabItems: WordItem[];
  sentences: PracticalSentence[];
  onCompleteLesson: (earnedXp: number) => void;
  onRecordAttempt: (itemId: string, isCorrect: boolean) => void;
  onExit: () => void;
  showTeluguScript?: boolean;
}

type LessonStepType = 'intro' | 'match' | 'quiz' | 'sentence' | 'summary';

export const LessonContainer: React.FC<LessonContainerProps> = ({
  title,
  subtitle,
  vocabItems,
  sentences,
  onCompleteLesson,
  onRecordAttempt,
  onExit,
  showTeluguScript,
}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [accumulatedXp, setAccumulatedXp] = useState<number>(0);

  // Lesson progression steps:
  // Step 0: Vocabulary Concept Card Introduction
  // Step 1: Telugu ↔ Hindi Matching Game
  // Step 2: Meaning Quiz (Pick the Meaning)
  // Step 3: Sentence Builder (if sentences exist)
  // Step 4: Summary

  const handleNextStep = (earnedXp: number = 0) => {
    setAccumulatedXp((prev) => prev + earnedXp);
    setStepIndex((prev) => prev + 1);
  };

  const handleFinish = () => {
    sound.playLevelUp();
    confetti({ particleCount: 90, spread: 70 });
    const finalXp = accumulatedXp + 50; // Completion bonus
    onCompleteLesson(finalXp);
  };

  const vocabItemsForMatch = React.useMemo(() => vocabItems.slice(0, 6), [vocabItems]);

  // Convert vocab into MultipleChoice questions
  const quizQuestions: QuizQuestion[] = React.useMemo(() => {
    return vocabItems.slice(0, 5).map((target) => {
      const distractors = vocabItems
        .filter((v) => v.id !== target.id)
        .slice(0, 3)
        .map((d) => ({
          id: `dist_${d.id}`,
          text: d.hindi,
          isCorrect: false,
        }));

      const options = [
        { id: `correct_${target.id}`, text: target.hindi, isCorrect: true },
        ...distractors,
      ].sort(() => Math.random() - 0.5);

      return {
        id: `q_${target.id}`,
        prompt: target.telugu,
        promptType: 'telugu',
        correctAnswer: target.hindi,
        correctAnswerId: target.id,
        options,
        explanation: `${target.telugu} maps directly to Hindi "${target.hindi}".`,
      };
    });
  }, [vocabItems]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Progress & Exit Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
        <button
          onClick={onExit}
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Lesson</span>
        </button>

        <span className="font-bold uppercase tracking-wider text-emerald-600">
          Lesson Step {stepIndex + 1} of 4
        </span>
      </div>

      {/* STEP 0: CONCEPT INTRODUCTION */}
      {stepIndex === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm animate-pop">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 block mb-1">
              {title}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Core Building Blocks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          </div>

          <div className="space-y-3 mb-6">
            {vocabItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => sound.speakTelugu(item.telugu)}
                    className="p-2 text-slate-400 hover:text-emerald-600 rounded-xl bg-white dark:bg-slate-700 shadow-xs"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {item.telugu}
                      {showTeluguScript && item.teluguScript && (
                        <span className="ml-2 text-xs font-normal text-slate-400">
                          ({item.teluguScript})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{item.english}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-teal-600 dark:text-teal-400">
                    = {item.hindi}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Hindi Bridge
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleNextStep(20)}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/30 transition-all text-base"
          >
            <span>Practice Matching</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 1: MATCHING GAME */}
      {stepIndex === 1 && (
        <MatchingGame
          items={vocabItemsForMatch}
          title="Card Match Practice"
          subtitle="Pair each Telugu token with its Hindi bridge equivalent"
          onComplete={(xp) => handleNextStep(xp)}
          onAddXp={(xp) => setAccumulatedXp((prev) => prev + xp)}
          onRecordAttempt={onRecordAttempt}
          showTeluguScript={showTeluguScript}
        />
      )}

      {/* STEP 2: MULTIPLE CHOICE QUIZ */}
      {stepIndex === 2 && (
        <MultipleChoiceQuiz
          questions={quizQuestions}
          title="Meaning Drill"
          onComplete={(xp) => handleNextStep(xp)}
          onRecordAttempt={onRecordAttempt}
        />
      )}

      {/* STEP 3: SENTENCE BUILDER */}
      {stepIndex === 3 && (
        <div>
          {sentences.length > 0 ? (
            <SentenceBuilder
              sentence={sentences[0]}
              onNext={(isCorrect) => handleNextStep(isCorrect ? 30 : 10)}
              showTeluguScript={showTeluguScript}
            />
          ) : (
            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl p-6">
              <p className="text-slate-500 mb-4">No sentence step for this introductory lesson.</p>
              <button
                onClick={() => handleNextStep(10)}
                className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl"
              >
                Go to Summary
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: LESSON SUMMARY */}
      {stepIndex >= 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-lg animate-pop">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Lesson Completed!
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-sm mx-auto mb-6">
            Outstanding work! You reinforced the Hindi bridge mappings and earned{' '}
            <span className="font-extrabold text-emerald-600">+{accumulatedXp + 50} XP</span>.
          </p>

          <button
            onClick={handleFinish}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all text-base"
          >
            Claim XP & Continue
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Flame,
  Volume2,
  Brain,
  MessageSquare,
  HelpCircle,
  Settings,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserStats, ItemProgress } from '../../types';
import {
  AiPracticeFilter,
  AiPracticeMode,
  AiPracticeTask,
  AiEvaluationResult,
} from '../../types/llm';
import { VOCABULARY_DATA } from '../../data/vocabulary';
import {
  generateAdaptiveTask,
  evaluateUserAnswer,
  hasApiKey,
} from '../../engine/llmService';
import { sound } from '../../engine/audioPlayer';

interface AiPlaygroundViewProps {
  stats: UserStats;
  progressMap: Record<string, ItemProgress>;
  onAddXp: (amount: number) => void;
  onRecordAttempt: (itemId: string, isCorrect: boolean, responseTimeMs?: number) => void;
  onOpenSettings: () => void;
}

export const AiPlaygroundView: React.FC<AiPlaygroundViewProps> = ({
  stats,
  progressMap,
  onAddXp,
  onRecordAttempt,
  onOpenSettings,
}) => {
  const [filter, setFilter] = useState<AiPracticeFilter>('weak');
  const [mode, setMode] = useState<AiPracticeMode>('fill_blank');

  // Task generation state
  const [currentTask, setCurrentTask] = useState<AiPracticeTask | null>(null);
  const [loadingTask, setLoadingTask] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [evaluation, setEvaluation] = useState<AiEvaluationResult | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [sessionCompletedTasks, setSessionCompletedTasks] = useState<number>(0);
  const [sessionEarnedXp, setSessionEarnedXp] = useState<number>(0);

  const isKeyConfigured = hasApiKey();

  // Extract completed and weak words from progressMap
  const allAttemptedItems = Object.values(progressMap).filter((p) => p.attempts > 0);
  const completedWordIds = allAttemptedItems.map((p) => p.itemId);

  const weakWordItems = allAttemptedItems.filter(
    (p) => p.mastery < 70 || (p.correct / p.attempts) < 0.65
  );
  const weakWordIds = weakWordItems.map((p) => p.itemId);

  // Pool of target words based on selected filter
  const getTargetPool = () => {
    if (filter === 'weak') {
      if (weakWordIds.length > 0) {
        return VOCABULARY_DATA.filter((v) => weakWordIds.includes(v.id));
      }
      // If no weak words yet, fall back to initial 5 words
      return VOCABULARY_DATA.slice(0, 5);
    } else if (filter === 'completed') {
      if (completedWordIds.length > 0) {
        return VOCABULARY_DATA.filter((v) => completedWordIds.includes(v.id));
      }
      return VOCABULARY_DATA.slice(0, 8);
    } else {
      return VOCABULARY_DATA.slice(0, 15);
    }
  };

  const loadNewTask = async () => {
    setLoadingTask(true);
    setEvaluation(null);
    setUserAnswer('');

    const pool = getTargetPool();
    // Pick 2 to 4 words from the target pool for this task
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const targetWords = shuffled.slice(0, 3).map((w) => ({
      id: w.id,
      telugu: w.telugu,
      hindi: w.hindi,
      english: w.english,
    }));

    try {
      const task = await generateAdaptiveTask(targetWords, mode);
      setCurrentTask(task);
    } catch (err) {
      console.error('Failed to generate task', err);
    } finally {
      setLoadingTask(false);
    }
  };

  useEffect(() => {
    loadNewTask();
  }, [filter, mode]);

  const handleSubmitAnswer = async (selectedOption?: string) => {
    if (!currentTask || evaluating || evaluation) return;
    const finalAnswer = selectedOption || userAnswer;
    if (!finalAnswer.trim()) return;

    setEvaluating(true);
    try {
      const res = await evaluateUserAnswer(currentTask, finalAnswer);
      setEvaluation(res);

      if (res.isCorrect) {
        sound.playCorrect();
        const xpGain = 15;
        onAddXp(xpGain);
        setSessionEarnedXp((prev) => prev + xpGain);
        setSessionCompletedTasks((prev) => prev + 1);

        // Record successful attempt for each target word in this task
        currentTask.targetWordIds.forEach((wordId) => {
          onRecordAttempt(wordId, true, 2000);
        });

        if ((sessionCompletedTasks + 1) % 5 === 0) {
          confetti({ particleCount: 70, spread: 60 });
          sound.playLevelUp();
        }
      } else {
        sound.playError();
        currentTask.targetWordIds.forEach((wordId) => {
          onRecordAttempt(wordId, false, 3500);
        });
      }
    } catch (err) {
      console.error('Evaluation failed', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Brain className="w-3.5 h-3.5" />
              <span>Adaptive AI Practice Arena</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dynamic LLM Training Ground
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Generates custom tasks strictly from words you've learned. Target your weak spots or sharpen your full completed vocabulary!
            </p>
          </div>

          {/* Session Metrics Pill */}
          <div className="bg-black/20 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10 flex items-center space-x-4 flex-shrink-0">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-amber-400">
                +{sessionEarnedXp}
              </div>
              <div className="text-[10px] text-emerald-200 uppercase font-bold">XP Earned</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-white">
                {sessionCompletedTasks}
              </div>
              <div className="text-[10px] text-emerald-200 uppercase font-bold">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scope Selector: Weak Areas vs All Completed Words */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">
              1. Choose Word Scope
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {weakWordIds.length > 0
                ? `${weakWordIds.length} weak words need review • ${completedWordIds.length} words learned`
                : `${completedWordIds.length} words encountered so far`}
            </span>
          </div>

          {/* Scope Segmented Control */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => setFilter('weak')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                filter === 'weak'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-rose-500'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Weak Areas Only ({weakWordIds.length})</span>
            </button>

            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                filter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All Completed ({completedWordIds.length})</span>
            </button>
          </div>
        </div>

        {/* Task Mode Selector */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
            2. Select Game Mode
          </span>

          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <button
              onClick={() => setMode('fill_blank')}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                mode === 'fill_blank'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              Fill-in-the-Blank
            </button>

            <button
              onClick={() => setMode('roleplay')}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                mode === 'roleplay'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              Mini Roleplay Dialogue
            </button>

            <button
              onClick={() => setMode('challenge')}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                mode === 'challenge'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              Sentence Challenge
            </button>
          </div>
        </div>
      </div>

      {/* Notice if running without key */}
      {!isKeyConfigured && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl text-xs flex items-center justify-between text-amber-800 dark:text-amber-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Currently running in Demo Mode. Connect your free Google Gemini API key for dynamic generation!</span>
          </div>
          <button
            onClick={onOpenSettings}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] whitespace-nowrap ml-2"
          >
            Add Key
          </button>
        </div>
      )}

      {/* Active Task Card Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        {loadingTask ? (
          <div className="py-16 text-center space-y-3 animate-pulse">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Crafting AI task tailored to your {filter === 'weak' ? 'weak' : 'learned'} words...
            </p>
          </div>
        ) : currentTask ? (
          <div className="space-y-6 animate-pop">
            {/* Task Header & Context */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  {currentTask.scenarioTitle}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentTask.situationHindi}
                </h3>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={loadNewTask}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Skip to next task"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Target Words Pills */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Target Words Tested:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentTask.targetWordsSummary.map((w) => (
                  <span
                    key={w.id}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-xs font-bold text-emerald-800 dark:text-emerald-200"
                  >
                    {w.telugu} = <span className="text-slate-500 dark:text-slate-400">{w.hindi}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Roleplay Dialogue Display (if roleplay mode) */}
            {currentTask.mode === 'roleplay' && currentTask.partnerDialogueTelugu && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start space-x-3">
                <div className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs flex-shrink-0">
                  {currentTask.partnerAvatar || '🧑'}
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-400">
                    {currentTask.partnerRole || 'Partner'}:
                  </span>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>"{currentTask.partnerDialogueTelugu}"</span>
                    <button
                      onClick={() => sound.speakTelugu(currentTask.partnerDialogueTelugu!)}
                      className="p-1 text-slate-400 hover:text-emerald-600"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  {currentTask.partnerDialogueHindi && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ({currentTask.partnerDialogueHindi})
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Sentence Prompt Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {currentTask.mode === 'fill_blank'
                  ? 'Fill the blank in spoken Telugu:'
                  : currentTask.mode === 'roleplay'
                  ? 'Respond in Telugu:'
                  : 'Translate this concept to Telugu:'}
              </span>

              {currentTask.promptTelugu && (
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono tracking-wide">
                  {currentTask.promptTelugu}
                </div>
              )}

              <div className="text-sm font-bold text-teal-700 dark:text-teal-400">
                "{currentTask.promptHindi}"
              </div>

              {currentTask.hintHindi && !evaluation && (
                <p className="text-xs text-amber-600 dark:text-amber-400 pt-1">
                  💡 Hint: {currentTask.hintHindi}
                </p>
              )}
            </div>

            {/* Options or Answer Input */}
            {currentTask.blankOptions && currentTask.blankOptions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTask.blankOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={!!evaluation}
                    onClick={() => {
                      setUserAnswer(opt);
                      handleSubmitAnswer(opt);
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl text-center font-bold text-sm sm:text-base border-2 transition-all ${
                      evaluation
                        ? opt.toLowerCase() === currentTask.correctAnswer.toLowerCase()
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-400'
                          : userAnswer === opt
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200'
                          : 'opacity-40 border-slate-200 dark:border-slate-800'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-900 dark:text-white active:scale-95 shadow-xs'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : currentTask.roleplayOptions && currentTask.roleplayOptions.length > 0 ? (
              <div className="space-y-2.5">
                {currentTask.roleplayOptions.map((opt) => (
                  <button
                    key={opt.id}
                    disabled={!!evaluation}
                    onClick={() => {
                      setUserAnswer(opt.text);
                      handleSubmitAnswer(opt.text);
                    }}
                    className={`w-full p-4 rounded-xl text-left font-bold text-sm border-2 transition-all flex items-center justify-between ${
                      evaluation
                        ? opt.isCorrect
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-400'
                          : userAnswer === opt.text
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200'
                          : 'opacity-40 border-slate-200 dark:border-slate-800'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-900 dark:text-white active:scale-95 shadow-xs'
                    }`}
                  >
                    <span>{opt.text}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitAnswer();
                }}
                className="space-y-3"
              >
                <div className="relative">
                  <input
                    type="text"
                    disabled={!!evaluation}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your Roman Telugu answer here..."
                    className="w-full px-4 py-3 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs"
                  />
                  <button
                    type="submit"
                    disabled={!userAnswer.trim() || !!evaluation || evaluating}
                    className="absolute right-2 top-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    {evaluating ? 'Evaluating...' : 'Check Answer'}
                  </button>
                </div>
              </form>
            )}

            {/* Evaluation & Feedback Block */}
            {evaluation && (
              <div className="animate-pop pt-2 space-y-3">
                <div
                  className={`p-4 rounded-2xl border ${
                    evaluation.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold mb-1">
                    {evaluation.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm font-extrabold">{evaluation.feedbackTelugu}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        <span className="text-sm font-extrabold">Keep practicing!</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium">{evaluation.feedbackHindi}</p>
                  {currentTask.explanation && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {currentTask.explanation}
                    </p>
                  )}
                </div>

                {/* Continue button */}
                <button
                  onClick={loadNewTask}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                >
                  <span>Next AI Task</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            No task loaded. Please click Refresh.
          </div>
        )}
      </div>
    </div>
  );
};

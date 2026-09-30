import React from 'react';
import { CURRICULUM_STAGES } from '../../data/curriculum';
import { CurriculumStage, UserStats, ItemProgress } from '../../types';
import { Lock, CheckCircle2, Play, BookOpen, MessageSquare, GitCompare, Sparkles } from 'lucide-react';

interface CurriculumViewProps {
  stats: UserStats;
  progressMap: Record<string, ItemProgress>;
  onStartStageLesson: (stage: CurriculumStage) => void;
  onOpenStageConversation?: (scenarioId: string) => void;
  onOpenConfusionDrill?: (pairId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  stats,
  progressMap,
  onStartStageLesson,
  onOpenStageConversation,
  onOpenConfusionDrill,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-600/10">
        <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider block mb-1">
          Zero to Spoken Telugu Journey
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Structured Hindi-to-Telugu Curriculum
        </h2>
        <p className="text-emerald-100 text-sm max-w-2xl">
          Progress from Stage 0 Survival greetings up to real-life campus and city conversations. Review any unlocked stage at your own pace anytime.
        </p>
      </div>

      {/* Stage Roadmap Steps */}
      <div className="space-y-4">
        {CURRICULUM_STAGES.map((stage) => {
          const isCompleted = stats.completedStages.includes(stage.stageNumber);
          // Unlock rule: Stage 0 is always open. Subsequent stages unlock if previous stage is completed or user has enough XP/mastery.
          const isUnlocked =
            stage.stageNumber === 0 ||
            stats.completedStages.includes(stage.stageNumber - 1) ||
            stats.level >= stage.stageNumber;

          // Compute stage mastery from vocab items
          let stageMastery = 0;
          if (stage.vocabIds.length > 0) {
            const attempted = stage.vocabIds.map((id) => progressMap[id]?.mastery || 0);
            stageMastery = Math.round(
              attempted.reduce((a, b) => a + b, 0) / stage.vocabIds.length
            );
          }

          return (
            <div
              key={stage.stageNumber}
              className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                !isUnlocked
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : isCompleted
                  ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/60 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Stage {stage.stageNumber}
                    </span>

                    {isCompleted && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mastered</span>
                      </span>
                    )}

                    {!isUnlocked && (
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Lock className="w-3 h-3" />
                        <span>Unlock at Stage {stage.stageNumber - 1}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {stage.title}
                  </h3>

                  <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    Hindi Bridge Focus: {stage.hindiBridgeSummary}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-0.5 max-w-xl">
                    {stage.description}
                  </p>
                </div>

                {/* Stage Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:self-center">
                  {isUnlocked ? (
                    <>
                      <button
                        onClick={() => onStartStageLesson(stage)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center space-x-2 shadow-sm shadow-emerald-600/20 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                      </button>

                      {stage.conversationScenarioId && onOpenStageConversation && (
                        <button
                          onClick={() => onOpenStageConversation(stage.conversationScenarioId!)}
                          className="px-3.5 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center space-x-1.5 transition-all"
                          title="Play conversational scenario"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Scenario</span>
                        </button>
                      )}

                      {stage.confusionPairIds.length > 0 && onOpenConfusionDrill && (
                        <button
                          onClick={() => onOpenConfusionDrill(stage.confusionPairIds[0])}
                          className="px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-200 dark:border-amber-800 flex items-center space-x-1.5 transition-all"
                          title="Practice confusion pairs"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Drills</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar inside stage */}
              {isUnlocked && stage.vocabIds.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Stage Vocabulary Mastery:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${stageMastery}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {stageMastery}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { UserStats, ItemProgress } from '../../types';
import { getLevelFromXp } from '../../engine/progressEngine';
import { getWeakestWordIds, getStrongestWordIds } from '../../engine/spacedRepetition';
import { VOCABULARY_DATA } from '../../data/vocabulary';
import { PRACTICAL_SENTENCES } from '../../data/practicalSentences';
import { CONVERSATION_SCENARIOS } from '../../data/conversations';
import {
  Flame,
  Zap,
  ArrowRight,
  BookOpen,
  Target,
  Clock,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  Volume2,
} from 'lucide-react';
import { sound } from '../../engine/audioPlayer';

interface DashboardProps {
  stats: UserStats;
  progressMap: Record<string, ItemProgress>;
  onContinueLearning: () => void;
  onStartDailyPractice: () => void;
  onOpenPlayground: () => void;
  onDrillWeakWord: (wordId: string) => void;
  onOpenCurriculum: () => void;
  onOpenConversations: () => void;
  onOpenAiArena?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  progressMap,
  onContinueLearning,
  onStartDailyPractice,
  onOpenPlayground,
  onDrillWeakWord,
  onOpenCurriculum,
  onOpenConversations,
  onOpenAiArena,
}) => {
  const { level, currentLevelXp, nextLevelXp, progressPercent } = getLevelFromXp(stats.xp);

  // Computed metrics
  const totalWordsLearned = Object.values(progressMap).filter((p) => p.attempts > 0).length;
  const wordsMastered = Object.values(progressMap).filter((p) => p.mastery >= 70).length;
  const sentencesMastered = Object.values(progressMap).filter(
    (p) => p.itemId.startsWith('s_') && p.mastery >= 70
  ).length;

  const accuracy =
    stats.totalAnswers > 0
      ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100)
      : 100;

  const dailyGoalPercent = Math.min(
    100,
    Math.round((stats.todayXp / Math.max(1, stats.dailyGoalXp)) * 100)
  );

  const allVocabIds = VOCABULARY_DATA.map((v) => v.id);
  const topWeakWords = getWeakestWordIds(progressMap, allVocabIds, 4);
  const topStrongWords = getStrongestWordIds(progressMap, allVocabIds, 4);

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Hero Welcome / Level Progress Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white relative overflow-hidden border border-emerald-900/60 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span>TELUGU QUEST</span>
              <span>•</span>
              <span>HINDI BRIDGE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Level {level} Explorer
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg">
              Translating Hindi concepts to spoken Telugu: <span className="font-bold text-emerald-400">Nenu → Main</span>, <span className="font-bold text-emerald-400">Naaku → Mujhe</span>, <span className="font-bold text-emerald-400">Nuvvu → Tum</span>.
            </p>
          </div>

          {/* Quick Streak & XP Callout */}
          <div className="flex items-center justify-around sm:justify-start gap-3 sm:gap-4 bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 sm:w-7 sm:h-7 fill-orange-500 text-orange-500" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-extrabold">{stats.currentStreak} Days</div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-semibold">Active Streak</div>
              </div>
            </div>

            <div className="h-8 sm:h-10 w-px bg-white/10" />

            <div>
              <div className="text-lg sm:text-2xl font-extrabold text-emerald-400">{stats.xp}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold">Total XP</div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="relative z-10 mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-300 mb-1.5 sm:mb-2 font-semibold">
            <span>
              Level {level} Progress ({currentLevelXp} / {nextLevelXp} XP)
            </span>
            <span>{progressPercent}% to Lvl {level + 1}</span>
          </div>
          <div className="w-full bg-white/10 h-2 sm:h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Action Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        {/* Continue Lesson CTA */}
        <button
          onClick={onContinueLearning}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-left transition-all shadow-md shadow-emerald-600/20 flex items-center justify-between group active:scale-[0.99]"
        >
          <div>
            <div className="text-[10px] sm:text-xs text-emerald-200 uppercase font-extrabold tracking-wider">
              Resume Journey
            </div>
            <div className="text-base sm:text-lg font-extrabold mt-0.5">Continue Learning</div>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform flex-shrink-0">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </button>

        {/* Quick 5-Min Practice CTA */}
        <button
          onClick={onStartDailyPractice}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-left transition-all shadow-md shadow-amber-500/20 flex items-center justify-between group active:scale-[0.99]"
        >
          <div>
            <div className="text-[10px] sm:text-xs text-amber-100 uppercase font-extrabold tracking-wider">
              Today's Session
            </div>
            <div className="text-base sm:text-lg font-extrabold mt-0.5">Daily 5-Min Drill</div>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </button>

        {/* Playground CTA */}
        <button
          onClick={onOpenPlayground}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-left transition-all shadow-md shadow-indigo-600/20 flex items-center justify-between group active:scale-[0.99]"
        >
          <div>
            <div className="text-[10px] sm:text-xs text-indigo-200 uppercase font-extrabold tracking-wider">
              Custom Mappings
            </div>
            <div className="text-base sm:text-lg font-extrabold mt-0.5">Open Playground</div>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </button>
      </div>

      {/* Core Metrics & Today's Goal Grid (2x2 on mobile, 4 columns on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5 sm:mb-1 truncate">
            Words Mastered
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {wordsMastered}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">
            of {VOCABULARY_DATA.length} core words
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5 sm:mb-1 truncate">
            Sentences Mastered
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {sentencesMastered}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">
            of {PRACTICAL_SENTENCES.length} phrases
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5 sm:mb-1 truncate">
            Accuracy Rate
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {accuracy}%
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">
            {stats.totalAnswers} total drills
          </div>
        </div>

        {/* Metric 4: Daily Goal */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5 sm:mb-1">
            <span className="truncate">Today's Goal</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{dailyGoalPercent}%</span>
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white truncate">
            {stats.todayXp} <span className="text-xs font-normal text-slate-400">/ {stats.dailyGoalXp} XP</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 sm:h-2 rounded-full overflow-hidden mt-1.5 sm:mt-2">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${dailyGoalPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weak Words & Confusion Focus Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Weak Words Card with targeted 1-click drill */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Words Needing Practice
              </h3>
            </div>
            {onOpenAiArena && (
              <button
                onClick={onOpenAiArena}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition-colors"
                title="Practice weak words with AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Practice</span>
              </button>
            )}
          </div>

          {topWeakWords.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p>No weak words registered yet! Complete more lessons to surface tricky items.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {topWeakWords.map((item, idx) => {
                const word = VOCABULARY_DATA.find((v) => v.id === item.id);
                if (!word) return null;
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          {word.telugu}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          = {word.hindi}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                        {item.accuracy}% acc
                      </span>
                      <button
                        onClick={() => onDrillWeakWord(word.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs"
                      >
                        Drill
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Strongest Mastered Words */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Your Strongest Words
              </h3>
            </div>
            <span className="text-xs text-slate-400">High Confidence</span>
          </div>

          {topStrongWords.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>Practice words across multiple rounds to build top mastery rankings.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {topStrongWords.map((item) => {
                const word = VOCABULARY_DATA.find((v) => v.id === item.id);
                if (!word) return null;
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-sm"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {word.telugu}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        = {word.hindi}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        {item.mastery}% mastery
                      </span>
                      <button
                        onClick={() => sound.speakTelugu(word.telugu)}
                        className="p-1 text-slate-400 hover:text-emerald-600"
                        title="Pronounce"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

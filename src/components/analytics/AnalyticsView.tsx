import React, { useState } from 'react';
import { UserStats, ItemProgress } from '../../types';
import { VOCABULARY_DATA } from '../../data/vocabulary';
import { ACHIEVEMENTS_LIST } from '../../engine/progressEngine';
import { getWeakestWordIds, getStrongestWordIds } from '../../engine/spacedRepetition';
import {
  BarChart3,
  Flame,
  Zap,
  Target,
  Clock,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react';

interface AnalyticsViewProps {
  stats: UserStats;
  progressMap: Record<string, ItemProgress>;
  onDrillWeakWord: (wordId: string) => void;
  onExportData: () => string;
  onImportData: (jsonStr: string) => boolean;
  onResetProgress: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  stats,
  progressMap,
  onDrillWeakWord,
  onExportData,
  onImportData,
  onResetProgress,
}) => {
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [showImportBox, setShowImportBox] = useState<boolean>(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const allVocabIds = VOCABULARY_DATA.map((v) => v.id);
  const totalLearned = Object.values(progressMap).filter((p) => p.attempts > 0).length;
  const wordsMastered = Object.values(progressMap).filter((p) => p.mastery >= 70).length;
  const wordsLearning = Object.values(progressMap).filter(
    (p) => p.attempts > 0 && p.mastery < 70
  ).length;

  const weakWords = getWeakestWordIds(progressMap, allVocabIds, 6);
  const strongWords = getStrongestWordIds(progressMap, allVocabIds, 6);

  // Compute average response time in seconds
  const attemptedItems = Object.values(progressMap).filter((p) => p.attempts > 0);
  const avgResponseTimeSec =
    attemptedItems.length > 0
      ? (
          attemptedItems.reduce((acc, p) => acc + (p.avgResponseMs || 2500), 0) /
          attemptedItems.length /
          1000
        ).toFixed(1)
      : '2.5';

  const accuracy =
    stats.totalAnswers > 0
      ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100)
      : 100;

  const handleDownloadBackup = () => {
    const jsonStr = onExportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telugu_quest_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDoImport = () => {
    if (!importJsonText.trim()) return;
    const ok = onImportData(importJsonText);
    if (ok) {
      setImportNotice('✓ Progress restored successfully!');
      setShowImportBox(false);
      setImportJsonText('');
    } else {
      setImportNotice('❌ Invalid backup JSON file.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <span className="text-teal-200 text-xs font-bold uppercase tracking-wider block mb-1">
          Performance & Spaced Repetition Insights
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Learning Analytics
        </h2>
        <p className="text-teal-100 text-sm max-w-2xl">
          Track your Telugu mastery, identify weak words for targeted repetition, and back up your local progress.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Learned
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalLearned}
          </div>
          <div className="text-xs text-slate-400 mt-1">Unique items</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Mastered Words
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {wordsMastered}
          </div>
          <div className="text-xs text-slate-400 mt-1">≥ 70% Mastery</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            In Progress
          </div>
          <div className="text-3xl font-extrabold text-amber-500">
            {wordsLearning}
          </div>
          <div className="text-xs text-slate-400 mt-1">Needs review</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Avg Speed
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {avgResponseTimeSec}s
          </div>
          <div className="text-xs text-slate-400 mt-1">Per question</div>
        </div>
      </div>

      {/* Weak Words vs Strongest Words Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Weak Words */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Top Weak Words
              </h3>
            </div>
            <span className="text-xs text-slate-400">Low Accuracy</span>
          </div>

          {weakWords.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No weak words detected. Keep practicing!
            </p>
          ) : (
            <div className="space-y-2">
              {weakWords.map((item, idx) => {
                const word = VOCABULARY_DATA.find((v) => v.id === item.id);
                if (!word) return null;
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="font-bold text-slate-400">#{idx + 1}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {word.telugu}
                      </span>
                      <span className="text-slate-400 font-medium">({word.hindi})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md text-xs">
                        {item.accuracy}%
                      </span>
                      <button
                        onClick={() => onDrillWeakWord(word.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
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

        {/* Strongest Words */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Strongest Words
              </h3>
            </div>
            <span className="text-xs text-slate-400">High Confidence</span>
          </div>

          {strongWords.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Practice words to build your top mastered leaderboard.
            </p>
          ) : (
            <div className="space-y-2">
              {strongWords.map((item, idx) => {
                const word = VOCABULARY_DATA.find((v) => v.id === item.id);
                if (!word) return null;
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="font-bold text-emerald-600">✓</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {word.telugu}
                      </span>
                      <span className="text-slate-400 font-medium">({word.hindi})</span>
                    </div>

                    <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md text-xs">
                      {item.mastery}% mastery
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Achievements Gallery */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Achievements ({stats.unlockedAchievements?.length || 0} / {ACHIEVEMENTS_LIST.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Gamification Badges</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = stats.unlockedAchievements?.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80'
                    : 'opacity-40 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs flex-shrink-0">
                  {ach.icon}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{ach.title}</span>
                    {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Local Data Backup & Persistence Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Local Storage & Data Backup
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          All your learning data is preserved offline in your browser. You can export a backup JSON file or import it on any device without internet.
        </p>

        {importNotice && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold">
            {importNotice}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup JSON</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                onResetProgress();
              }
            }}
            className="px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 font-bold text-xs rounded-xl flex items-center space-x-1.5 ml-auto transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>

        {showImportBox && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-pop">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
              Paste Backup JSON:
            </label>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='Paste exported JSON here {"stats": ...}'
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowImportBox(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDoImport}
                className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Restore Progress
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

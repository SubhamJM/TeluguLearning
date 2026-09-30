import React from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  BookOpen,
  Sparkles,
  Gamepad2,
  GitCompare,
  Layers,
  MessageSquare,
  BarChart3,
  Sliders,
  Type,
} from 'lucide-react';
import { UserStats } from '../../types';
import { getLevelFromXp } from '../../engine/progressEngine';
import { sound } from '../../engine/audioPlayer';

export type ActiveTab =
  | 'dashboard'
  | 'curriculum'
  | 'modes'
  | 'patterns'
  | 'conversations'
  | 'confusion'
  | 'playground'
  | 'analytics';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: UserStats;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  showTeluguScript: boolean;
  setShowTeluguScript: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  showTeluguScript,
  setShowTeluguScript,
}) => {
  const { level, currentLevelXp, nextLevelXp, progressPercent } = getLevelFromXp(stats.xp);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playCorrect();
  };

  const navLinks: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'curriculum', label: 'Curriculum', icon: <Layers className="w-4 h-4" /> },
    { id: 'patterns', label: 'Patterns', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'modes', label: 'Practice Games', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'confusion', label: 'Confusion Drills', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'conversations', label: 'Conversations', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'playground', label: 'Playground', icon: <Sliders className="w-4 h-4" /> },
    { id: 'analytics', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tight">త</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  Telugu<span className="text-emerald-600 dark:text-emerald-400">Quest</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
                  Hindi Bridge
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Main → Nenu • Mujhe → Naaku
              </p>
            </div>
          </div>

          {/* User Gamification Stats Pills */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Level & XP */}
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lvl</span>
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{level}</span>
              </div>
              <div className="w-14 sm:w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden md:inline">
                {currentLevelXp}/{nextLevelXp} XP
              </span>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{stats.currentStreak}d</span>
            </div>

            {/* Total XP pill */}
            <div className="hidden lg:flex items-center space-x-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-1.5 rounded-xl text-xs font-semibold">
              <span>⚡ {stats.xp} XP</span>
            </div>

            {/* Utility Toggles */}
            <div className="flex items-center space-x-1 border-l border-slate-200 dark:border-slate-800 pl-2">
              {/* Telugu Script Toggle */}
              <button
                onClick={() => setShowTeluguScript(!showTeluguScript)}
                title={showTeluguScript ? 'Telugu script enabled (click to hide)' : 'Show Telugu script alongside Roman'}
                className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                  showTeluguScript
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="font-semibold text-xs flex items-center gap-1">
                  <Type className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">తెలుగు</span>
                </span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800/60 no-scrollbar">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

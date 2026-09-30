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
  Brain,
  Bot,
  Settings,
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
  | 'ai-arena'
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
  onOpenAiDrawer: () => void;
  onOpenAiSettings: () => void;
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
  onOpenAiDrawer,
  onOpenAiSettings,
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
    { id: 'ai-arena', label: 'AI Arena', icon: <Brain className="w-4 h-4 text-emerald-500" /> },
    { id: 'patterns', label: 'Patterns', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'modes', label: 'Practice Games', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'confusion', label: 'Confusion Drills', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'conversations', label: 'Conversations', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'playground', label: 'Playground', icon: <Sliders className="w-4 h-4" /> },
    { id: 'analytics', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const [showMoreMenu, setShowMoreMenu] = React.useState<boolean>(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & Brand */}
            <div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-base sm:text-xl tracking-tight">త</span>
              </div>
              <div>
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                    Telugu<span className="text-emerald-600 dark:text-emerald-400">Quest</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
                    Hindi
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Main → Nenu • Mujhe → Naaku
                </p>
              </div>
            </div>

            {/* User Gamification Stats Pills */}
            <div className="flex items-center space-x-1.5 sm:space-x-3">
              {/* Level & XP */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center space-x-1">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Lvl</span>
                  <span className="font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">{level}</span>
                </div>
                <div className="w-10 sm:w-20 bg-slate-200 dark:bg-slate-700 h-1.5 sm:h-2 rounded-full overflow-hidden">
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
              <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl font-bold text-xs sm:text-sm">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <span>{stats.currentStreak}d</span>
              </div>

              {/* Total XP pill (Desktop) */}
              <div className="hidden lg:flex items-center space-x-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-1.5 rounded-xl text-xs font-semibold">
                <span>⚡ {stats.xp} XP</span>
              </div>

              {/* Ask AI Quick Trigger Button */}
              <button
                onClick={onOpenAiDrawer}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                title="Ask Telugu AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>

              {/* Utility Toggles */}
              <div className="flex items-center space-x-0.5 sm:space-x-1 border-l border-slate-200 dark:border-slate-800 pl-1.5 sm:pl-2">
                {/* Telugu Script Toggle */}
                <button
                  onClick={() => setShowTeluguScript(!showTeluguScript)}
                  title={showTeluguScript ? 'Telugu script enabled' : 'Show Telugu script'}
                  className={`p-1.5 sm:p-2 rounded-lg text-xs font-bold transition-colors ${
                    showTeluguScript
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                </button>

                {/* Sound Toggle */}
                <button
                  onClick={toggleSound}
                  title={soundEnabled ? 'Mute audio' : 'Enable audio'}
                  className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  title="Toggle theme"
                  className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs Bar (hidden on mobile) */}
          <nav className="hidden md:flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800/60 no-scrollbar">
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

      {/* Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1 safe-bottom shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'dashboard' ? 'bg-emerald-100 dark:bg-emerald-950/80' : ''}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="mt-0.5">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'curriculum'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'curriculum' ? 'bg-emerald-100 dark:bg-emerald-950/80' : ''}`}>
              <Layers className="w-4 h-4" />
            </div>
            <span className="mt-0.5">Stages</span>
          </button>

          <button
            onClick={() => setActiveTab('modes')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'modes'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'modes' ? 'bg-emerald-100 dark:bg-emerald-950/80' : ''}`}>
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="mt-0.5">Games</span>
          </button>

          <button
            onClick={() => setActiveTab('conversations')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'conversations'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'conversations' ? 'bg-emerald-100 dark:bg-emerald-950/80' : ''}`}>
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="mt-0.5">Chat</span>
          </button>

          <button
            onClick={() => setShowMoreMenu(true)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
              ['patterns', 'confusion', 'playground', 'analytics'].includes(activeTab)
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-lg ${['patterns', 'confusion', 'playground', 'analytics'].includes(activeTab) ? 'bg-emerald-100 dark:bg-emerald-950/80' : ''}`}>
              <Sliders className="w-4 h-4" />
            </div>
            <span className="mt-0.5">More</span>
          </button>
        </div>
      </div>

      {/* Mobile "More" Drawer Modal */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs md:hidden animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto" />
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                More Modules & Tools
              </span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setActiveTab('ai-arena');
                  setShowMoreMenu(false);
                }}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  activeTab === 'ai-arena'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                }`}
              >
                <Brain className="w-5 h-5 text-emerald-500 mb-2" />
                <div className="font-bold text-xs">AI Practice Arena</div>
                <div className="text-[10px] text-slate-400">Weak words & tasks</div>
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenAiDrawer();
                }}
                className="p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
              >
                <Sparkles className="w-5 h-5 text-emerald-600 mb-2" />
                <div className="font-bold text-xs">Ask Telugu AI</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Instant lookup</div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('patterns');
                  setShowMoreMenu(false);
                }}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  activeTab === 'patterns'
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-400 text-purple-900 dark:text-purple-200'
                    : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                }`}
              >
                <Sparkles className="w-5 h-5 text-purple-500 mb-2" />
                <div className="font-bold text-xs">Sentence Patterns</div>
                <div className="text-[10px] text-slate-400">Reusable grammar</div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('confusion');
                  setShowMoreMenu(false);
                }}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  activeTab === 'confusion'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200'
                    : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                }`}
              >
                <GitCompare className="w-5 h-5 text-rose-500 mb-2" />
                <div className="font-bold text-xs">Confusion Drills</div>
                <div className="text-[10px] text-slate-400">Nenu vs Naaku</div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('playground');
                  setShowMoreMenu(false);
                }}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  activeTab === 'playground'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-900 dark:text-indigo-200'
                    : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                }`}
              >
                <Sliders className="w-5 h-5 text-indigo-500 mb-2" />
                <div className="font-bold text-xs">Playground</div>
                <div className="text-[10px] text-slate-400">Custom vocabulary</div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setShowMoreMenu(false);
                }}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-400 text-teal-900 dark:text-teal-200'
                    : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                }`}
              >
                <BarChart3 className="w-5 h-5 text-teal-500 mb-2" />
                <div className="font-bold text-xs">Progress & Backup</div>
                <div className="text-[10px] text-slate-400">Stats, export/import</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

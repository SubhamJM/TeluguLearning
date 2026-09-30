import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ACHIEVEMENTS_LIST } from '../../engine/progressEngine';
import { sound } from '../../engine/audioPlayer';
import { Sparkles, X } from 'lucide-react';

interface BadgeAlertModalProps {
  badgeId: string | null;
  onClose: () => void;
}

export const BadgeAlertModal: React.FC<BadgeAlertModalProps> = ({ badgeId, onClose }) => {
  useEffect(() => {
    if (badgeId) {
      sound.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [badgeId]);

  if (!badgeId) return null;

  const achievement = ACHIEVEMENTS_LIST.find((a) => a.id === badgeId);
  if (!achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-emerald-500/30 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-3xl shadow-inner">
          {achievement.icon}
        </div>

        <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Achievement Unlocked!</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {achievement.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          {achievement.description}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/30"
        >
          Keep Going!
        </button>
      </div>
    </div>
  );
};

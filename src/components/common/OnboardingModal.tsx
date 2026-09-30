import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Flame, Check } from 'lucide-react';
import { sound } from '../../engine/audioPlayer';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartZero: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartZero,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-pop">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-500/20 text-center relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center mx-auto mb-4 text-3xl font-extrabold shadow-lg shadow-emerald-500/20">
          త
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Local-First Telugu Learning</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Welcome to Telugu Quest
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-sm mx-auto">
          Your goal: go from <strong className="text-emerald-600 dark:text-emerald-400">ZERO Telugu</strong> to <strong className="text-emerald-600 dark:text-emerald-400">BASIC CONVERSATION</strong> using Hindi as your conceptual bridge!
        </p>

        {/* Bridge Illustration */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 mb-6 text-left space-y-2 text-xs font-semibold">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">
            Intuitive Hindi Bridge Mappings:
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-200">
            <div>• <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Nenu</span> → Main</div>
            <div>• <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Naaku</span> → Mujhe</div>
            <div>• <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Nuvvu</span> → Tum</div>
            <div>• <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Neeku</span> → Tumhe</div>
            <div>• <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Meeru</span> → Aap</div>
            <div>• <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Meeku</span> → Aapko</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2">
          <button
            onClick={() => {
              sound.playCorrect();
              onStartZero();
            }}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all text-base"
          >
            <span>Start from Zero (Stage 0)</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              onClose();
            }}
            className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Skip to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

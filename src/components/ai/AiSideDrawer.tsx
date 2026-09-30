import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Search,
  Volume2,
  Copy,
  Check,
  BookmarkPlus,
  Settings,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { LlmTranslationResult } from '../../types/llm';
import { translateQuery, hasApiKey } from '../../engine/llmService';
import { sound } from '../../engine/audioPlayer';
import { usePlaygroundStore } from '../../store/playgroundStore';

interface AiSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const AiSideDrawer: React.FC<AiSideDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<LlmTranslationResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>([
    'How much is this?',
    'Where is the mess?',
    'Mujhe thoda paani chahiye',
    'Can you speak slowly?',
  ]);

  const { sets, addMappingToSet, addPhraseToSet, addSet } = usePlaygroundStore();
  const isKeyConfigured = hasApiKey();

  if (!isOpen) return null;

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch || query;
    if (!q.trim()) return;

    setLoading(true);
    setResult(null);
    setSavedSuccess(null);

    try {
      const res = await translateQuery(q);
      setResult(res);

      setRecentQueries((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== q.toLowerCase());
        return [q, ...filtered].slice(0, 5);
      });
    } catch (err) {
      console.error('Translation failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToPlayground = () => {
    if (!result) return;

    let targetSet = sets[0];
    if (!targetSet) {
      targetSet = addSet('AI Lookups', 'Words saved from AI Telugu Assistant');
    }

    const isSentence = result.telugu.includes(' ');
    if (isSentence) {
      addPhraseToSet(targetSet.id, result.telugu, result.hindi, query);
    } else {
      addMappingToSet(targetSet.id, result.telugu, result.hindi, query);
    }

    setSavedSuccess(`Saved to "${targetSet.name}" deck!`);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fade-in">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 animate-slide-left">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-500 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Telugu AI Assistant
                </h3>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Instant
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ask in Hindi or English → get spoken Roman Telugu
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Configure AI Model / API Key"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice if running without custom API key */}
        {!isKeyConfigured && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-200 flex items-center justify-between">
            <span>Demo Mode (Local matchers). Add a free Gemini key for full AI.</span>
            <button
              onClick={onOpenSettings}
              className="font-bold underline text-amber-900 dark:text-amber-100 ml-2"
            >
              Set Key
            </button>
          </div>
        )}

        {/* Search Query Input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="relative"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. How much is this? or Mujhe paani chahiye..."
              className="w-full pl-10 pr-20 py-3 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="absolute right-2 top-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              {loading ? 'Asking...' : 'Translate'}
            </button>
          </form>

          {/* Quick preset chips */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {recentQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(item);
                  handleSearch(item);
                }}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap text-[11px] transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Result Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          {loading && (
            <div className="py-12 text-center space-y-3 animate-pulse">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <p className="text-xs font-bold text-slate-500">
                Translating to natural conversational Telugu...
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4 animate-pop">
              {/* Primary Telugu Hero Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 shadow-xs relative">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Spoken Roman Telugu
                </span>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {result.telugu}
                    </h4>
                    {result.teluguScript && (
                      <span className="text-sm font-semibold text-emerald-700/80 dark:text-emerald-400/80 font-telugu block mt-0.5">
                        {result.teluguScript}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <button
                      onClick={() => sound.speakTelugu(result.telugu)}
                      className="p-2 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 rounded-xl shadow-xs transition-colors"
                      title="Pronounce Telugu"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(result.telugu)}
                      className="p-2 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 rounded-xl shadow-xs transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Hindi Bridge Equivalent */}
                <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Hindi Concept Bridge:</span>
                  <div className="text-sm font-bold text-teal-800 dark:text-teal-300">
                    "{result.hindi}"
                  </div>
                </div>
              </div>

              {/* Word Breakdown */}
              {result.breakdown && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Word-by-Word Breakdown
                  </span>
                  <p className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    {result.breakdown}
                  </p>
                </div>
              )}

              {/* Conversational Example */}
              {result.exampleTelugu && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Everyday Example
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {result.exampleTelugu}
                    </span>
                    <button
                      onClick={() => sound.speakTelugu(result.exampleTelugu!)}
                      className="p-1 text-slate-400 hover:text-emerald-600"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {result.exampleHindi && (
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      = {result.exampleHindi}
                    </p>
                  )}
                </div>
              )}

              {/* Tip / Notes */}
              {result.notes && (
                <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                  <span>{result.notes}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={handleSaveToPlayground}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <BookmarkPlus className="w-4 h-4 text-emerald-600" />
                  <span>Save to My Playground Decks</span>
                </button>
                {savedSuccess && (
                  <p className="text-center text-xs font-bold text-emerald-600 mt-1.5 animate-pop">
                    ✓ {savedSuccess}
                  </p>
                )}
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold">
                Type any word or sentence in Hindi or English.
              </p>
              <p className="text-[11px] max-w-xs mx-auto text-slate-400">
                Get the exact spoken Telugu phrase, Hindi concept bridge, and pronunciation instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

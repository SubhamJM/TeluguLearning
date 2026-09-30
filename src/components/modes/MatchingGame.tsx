import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, RefreshCw, CheckCircle2, AlertCircle, Zap, ArrowRight, Flame, XCircle } from 'lucide-react';
import { MatchCard, createMatchingCards, computeXpForMatch } from '../../engine/matchingEngine';
import { sound } from '../../engine/audioPlayer';
import confetti from 'canvas-confetti';

export interface MatchingGameProps {
  items: Array<{ id: string; telugu: string; hindi: string; english?: string }>;
  title?: string;
  subtitle?: string;
  onComplete: (earnedXp: number, mistakes: number) => void;
  onRecordAttempt?: (itemId: string, isCorrect: boolean) => void;
  onAddXp?: (amount: number) => void;
  showTeluguScript?: boolean;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({
  items,
  title = 'Telugu ↔ Hindi Match',
  subtitle = 'Click a Telugu card and its corresponding Hindi bridge card',
  onComplete,
  onRecordAttempt,
  onAddXp,
  showTeluguScript,
}) => {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedTelugu, setSelectedTelugu] = useState<MatchCard | null>(null);
  const [selectedHindi, setSelectedHindi] = useState<MatchCard | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [earnedXp, setEarnedXp] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [lastMatchTime, setLastMatchTime] = useState<number>(Date.now());
  const [feedback, setFeedback] = useState<{ isError: boolean; message: string } | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Derive stable items key so parent re-renders don't wipe game state
  const itemsKey = useMemo(() => items.map((i) => i.id).join(','), [items]);
  const prevItemsKeyRef = useRef<string>('');

  // Initialize or reset cards
  const initializeGame = () => {
    // Select up to 6 items per round for comfortable grid layout
    const pool = [...items];
    const activeItems = pool.slice(0, 6);
    const newCards = createMatchingCards(activeItems);
    setCards(newCards);
    setSelectedTelugu(null);
    setSelectedHindi(null);
    setIsEvaluating(false);
    setCombo(0);
    setMaxCombo(0);
    setEarnedXp(0);
    setMistakes(0);
    setFeedback(null);
    setIsFinished(false);
    setLastMatchTime(Date.now());
  };

  useEffect(() => {
    if (prevItemsKeyRef.current !== itemsKey) {
      prevItemsKeyRef.current = itemsKey;
      initializeGame();
    }
  }, [itemsKey]);

  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched || isEvaluating) return;

    // Pronounce if Telugu card clicked
    if (card.type === 'telugu') {
      sound.speakTelugu(card.text);
    }

    if (card.type === 'telugu') {
      // Toggle off if already selected
      if (selectedTelugu?.id === card.id) {
        setSelectedTelugu(null);
        return;
      }
      setSelectedTelugu(card);
      // If Hindi card is already selected, evaluate pair!
      if (selectedHindi) {
        evaluatePair(card, selectedHindi);
      }
    } else {
      // Hindi card clicked
      if (selectedHindi?.id === card.id) {
        setSelectedHindi(null);
        return;
      }
      setSelectedHindi(card);
      // If Telugu card is already selected, evaluate pair!
      if (selectedTelugu) {
        evaluatePair(selectedTelugu, card);
      }
    }
  };

  const evaluatePair = (tCard: MatchCard, hCard: MatchCard) => {
    const isCorrect = tCard.itemId === hCard.itemId;
    const now = Date.now();
    const isFast = now - lastMatchTime < 3000;
    setLastMatchTime(now);

    // Record SRS progress attempt
    if (onRecordAttempt) {
      onRecordAttempt(tCard.itemId, isCorrect);
    }

    if (isCorrect) {
      sound.playCorrect();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));

      const { xp, comboBonus, speedBonus } = computeXpForMatch(isFast, nextCombo);
      setEarnedXp((prev) => prev + xp);
      if (onAddXp) {
        onAddXp(xp);
      }

      let msg = `✓ Correct! ${tCard.text} = ${hCard.text}`;
      if (comboBonus > 0) msg += ` • 🔥 Combo x${nextCombo}! (+${comboBonus} XP)`;
      if (speedBonus > 0) msg += ` • ⚡ Fast! (+${speedBonus} XP)`;

      setFeedback({ isError: false, message: msg });

      // Mark matched cards
      setCards((prev) =>
        prev.map((c) =>
          c.id === tCard.id || c.id === hCard.id
            ? { ...c, isMatched: true, isSelected: false, isError: false }
            : c
        )
      );
      setSelectedTelugu(null);
      setSelectedHindi(null);

      // Check if all cards in the round are matched
      const remainingUnmatched = cards.filter(
        (c) => !c.isMatched && c.id !== tCard.id && c.id !== hCard.id
      );

      if (remainingUnmatched.length === 0) {
        setIsFinished(true);
        sound.playLevelUp();
        confetti({ particleCount: 80, spread: 70 });
        const roundCompletionBonus = 50;
        const finalXp = earnedXp + xp + roundCompletionBonus;
        setEarnedXp(finalXp);
        if (onAddXp) {
          onAddXp(roundCompletionBonus);
        }
        onComplete(finalXp, mistakes);
      }
    } else {
      sound.playError();
      setCombo(0);
      setMistakes((prev) => prev + 1);
      setIsEvaluating(true);

      // Flash cards with error
      setCards((prev) =>
        prev.map((c) =>
          c.id === tCard.id || c.id === hCard.id ? { ...c, isError: true } : c
        )
      );

      // Find correct meanings for clarification
      const correctItem = items.find((i) => i.id === tCard.itemId);
      const wrongHindiItem = items.find((i) => i.id === hCard.itemId);

      setFeedback({
        isError: true,
        message: `Not quite! ${tCard.text} = ${correctItem?.hindi || '?'}. (${hCard.text} = ${wrongHindiItem?.telugu || '?'})`,
      });

      // Clear error after 850ms and unfreeze clicks
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === tCard.id || c.id === hCard.id ? { ...c, isError: false } : c
          )
        );
        setSelectedTelugu(null);
        setSelectedHindi(null);
        setIsEvaluating(false);
      }, 850);
    }
  };

  const teluguCards = cards.filter((c) => c.type === 'telugu');
  const hindiCards = cards.filter((c) => c.type === 'hindi');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-7 shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-5 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="min-w-0">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2 truncate">
            <span>{title}</span>
            {combo >= 2 && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-1.5 sm:px-2 py-0.5 rounded-full animate-bounce">
                <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                <span>x{combo}</span>
              </span>
            )}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-1 sm:space-x-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{earnedXp} XP</span>
          </div>

          <button
            onClick={initializeGame}
            title="Restart round"
            className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-2.5 sm:p-3 rounded-xl mb-3 sm:mb-5 text-xs sm:text-sm font-medium flex items-center justify-between animate-pop ${
            feedback.isError
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.isError ? (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Side-by-Side Cards columns (Visible side-by-side even on mobile!) */}
      {!isFinished ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-6">
          {/* Telugu Column */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400 truncate">
                Telugu
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {selectedTelugu ? 'Selected' : 'Tap to select'}
              </span>
            </div>
            <div className="space-y-1.5 sm:space-y-2.5">
              {teluguCards.map((card) => {
                const isSelected = selectedTelugu?.id === card.id;
                return (
                  <button
                    key={card.id}
                    disabled={card.isMatched || isEvaluating}
                    onClick={() => handleCardClick(card)}
                    className={`w-full p-2.5 sm:p-4 rounded-xl font-bold text-left transition-all border flex items-center justify-between active:scale-95 ${
                      card.isMatched
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 shadow-xs cursor-default'
                        : card.isError
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400'
                        : isSelected
                        ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500 shadow-md scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-emerald-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="text-xs sm:text-base truncate">{card.text}</span>
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
                      {card.isMatched ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : card.isError ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.speakTelugu(card.text);
                          }}
                          className="p-1 hover:text-emerald-600 rounded-md transition-colors text-slate-400"
                        >
                          <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hindi Bridge Column */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-teal-700 dark:text-teal-400 truncate">
                Hindi
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {selectedHindi ? 'Selected' : 'Tap to pair'}
              </span>
            </div>
            <div className="space-y-1.5 sm:space-y-2.5">
              {hindiCards.map((card) => {
                const isSelected = selectedHindi?.id === card.id;
                return (
                  <button
                    key={card.id}
                    disabled={card.isMatched || isEvaluating}
                    onClick={() => handleCardClick(card)}
                    className={`w-full p-2.5 sm:p-4 rounded-xl font-bold text-left transition-all border flex items-center justify-between active:scale-95 ${
                      card.isMatched
                        ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300 shadow-xs cursor-default'
                        : card.isError
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400'
                        : isSelected
                        ? 'bg-teal-100 dark:bg-teal-950 border-teal-500 text-teal-900 dark:text-teal-100 ring-2 ring-teal-500 shadow-md scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-teal-300 hover:shadow-xs'
                    }`}
                  >
                    <span className="text-xs sm:text-base truncate">{card.text}</span>
                    {card.isMatched ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0 ml-1" />
                    ) : card.isError ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 ml-1" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Round completed congratulation banner */
        <div className="py-8 text-center animate-pop">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Round Completed!
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            You earned <span className="font-bold text-emerald-600">+{earnedXp} XP</span> with a max combo of <span className="font-bold text-amber-500">x{maxCombo}</span>.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={initializeGame}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all"
            >
              <span>Play Next Round</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

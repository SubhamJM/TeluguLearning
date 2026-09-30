import React, { useState, useEffect, useRef } from 'react';
import { ConversationScenario, ConversationStep } from '../../types';
import { sound } from '../../engine/audioPlayer';
import { evaluateTeluguAnswer } from '../../engine/answerNormalizer';
import { Volume2, CheckCircle2, MessageSquare, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConversationPlayerProps {
  scenario: ConversationScenario;
  onComplete: (earnedXp: number) => void;
  onRestart?: () => void;
}

export const ConversationPlayer: React.FC<ConversationPlayerProps> = ({
  scenario,
  onComplete,
  onRestart,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [userTyped, setUserTyped] = useState<string>('');
  const [isTurnEvaluated, setIsTurnEvaluated] = useState<boolean>(false);
  const [turnFeedback, setTurnFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [earnedXp, setEarnedXp] = useState<number>(0);
  const [isScenarioFinished, setIsScenarioFinished] = useState<boolean>(false);

  const currentStep: ConversationStep | undefined = scenario.steps[currentStepIndex];
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize step
  useEffect(() => {
    if (!currentStep) return;

    setSelectedOptionId(null);
    setSelectedTokens([]);
    setUserTyped('');
    setIsTurnEvaluated(false);
    setTurnFeedback(null);

    if (currentStep.speaker === 'npc') {
      sound.speakTelugu(currentStep.telugu);
    } else if (currentStep.speaker === 'user' && currentStep.expectedTokens) {
      const allTokens = [...currentStep.expectedTokens, ...(currentStep.distractorTokens || [])];
      setAvailableTokens([...allTokens].sort(() => Math.random() - 0.5));
    }

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }, [currentStepIndex, scenario]);

  const handleNpcNext = () => {
    setCompletedSteps((prev) => [...prev, currentStepIndex]);
    if (currentStepIndex + 1 < scenario.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      finishScenario();
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (isTurnEvaluated || !currentStep?.options) return;
    setSelectedOptionId(optionId);
    setIsTurnEvaluated(true);

    const option = currentStep.options.find((o) => o.id === optionId);
    const correct = !!option?.isCorrect;

    if (correct) {
      sound.playCorrect();
      setEarnedXp((prev) => prev + 25);
      setTurnFeedback({ isCorrect: true, text: option.feedback });
      sound.speakTelugu(option.telugu);
    } else {
      sound.playError();
      setTurnFeedback({ isCorrect: false, text: option?.feedback || 'Incorrect choice.' });
    }
  };

  const handleAddToken = (token: string) => {
    if (isTurnEvaluated) return;
    setAvailableTokens((prev) => {
      const idx = prev.indexOf(token);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
    setSelectedTokens((prev) => [...prev, token]);
  };

  const handleRemoveToken = (token: string, tokenIndex: number) => {
    if (isTurnEvaluated) return;
    setSelectedTokens((prev) => prev.filter((_, idx) => idx !== tokenIndex));
    setAvailableTokens((prev) => [...prev, token]);
  };

  const handleCheckBuiltSentence = () => {
    if (!currentStep?.expectedTokens || isTurnEvaluated) return;
    const built = selectedTokens.join(' ').toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();
    const expected = currentStep.expectedTokens.join(' ').toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();

    const isMatch = built === expected;
    setIsTurnEvaluated(true);

    if (isMatch) {
      sound.playCorrect();
      sound.speakTelugu(currentStep.telugu);
      setEarnedXp((prev) => prev + 30);
      setTurnFeedback({ isCorrect: true, text: 'Spot on sentence construction!' });
    } else {
      sound.playError();
      setTurnFeedback({ isCorrect: false, text: `Expected: "${currentStep.telugu}"` });
    }
  };

  const handleCheckFreeTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStep || isTurnEvaluated || !userTyped.trim()) return;

    const res = evaluateTeluguAnswer(
      userTyped,
      currentStep.telugu,
      currentStep.acceptableVariations || []
    );

    setIsTurnEvaluated(true);

    if (res.isMatch) {
      sound.playCorrect();
      sound.speakTelugu(currentStep.telugu);
      setEarnedXp((prev) => prev + 35);
      setTurnFeedback({ isCorrect: true, text: res.feedback });
    } else {
      sound.playError();
      setTurnFeedback({ isCorrect: false, text: `Expected: "${currentStep.telugu}"` });
    }
  };

  const handleContinueAfterTurn = () => {
    setCompletedSteps((prev) => [...prev, currentStepIndex]);
    if (currentStepIndex + 1 < scenario.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      finishScenario();
    }
  };

  const finishScenario = () => {
    setIsScenarioFinished(true);
    sound.playLevelUp();
    confetti({ particleCount: 100, spread: 80 });
    const finalTotal = earnedXp + 150; // Scenario completion bonus
    setEarnedXp(finalTotal);
    onComplete(finalTotal);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-7 max-w-2xl mx-auto shadow-sm">
      {/* Scenario Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <span className="text-2xl sm:text-3xl flex-shrink-0">{scenario.avatar}</span>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {scenario.title}
            </h2>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
              <span className="truncate">{scenario.hindiTitle}</span>
              <span>•</span>
              <span className="bg-slate-100 dark:bg-slate-800 px-1.5 sm:px-2 py-0.5 rounded-md font-medium truncate">
                {scenario.location}
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 sm:px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex-shrink-0 ml-2">
          +{earnedXp} XP
        </div>
      </div>

      {/* Dialog History Stream */}
      <div className="space-y-3.5 mb-4 sm:mb-6 max-h-[360px] sm:max-h-[420px] overflow-y-auto pr-1 sm:pr-2 no-scrollbar">
        {scenario.steps.slice(0, currentStepIndex + (currentStep?.speaker === 'npc' ? 1 : 0)).map((step, idx) => {
          const isNpc = step.speaker === 'npc';
          return (
            <div
              key={step.id}
              className={`flex items-start gap-2 sm:gap-2.5 animate-pop ${
                isNpc ? 'justify-start' : 'justify-end'
              }`}
            >
              {isNpc && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                  {scenario.avatar}
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-4 shadow-xs ${
                  isNpc
                    ? 'bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs'
                    : 'bg-emerald-600 text-white rounded-tr-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-bold ${isNpc ? 'text-slate-500 dark:text-slate-400' : 'text-emerald-200'}`}>
                    {step.speakerName}
                  </span>
                  <button
                    onClick={() => sound.speakTelugu(step.telugu)}
                    className={`p-1 rounded-md transition-colors ${
                      isNpc
                        ? 'text-slate-400 hover:text-emerald-600'
                        : 'text-emerald-200 hover:text-white'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="font-extrabold text-base mb-1">{step.telugu}</div>
                <div className={`text-xs ${isNpc ? 'text-teal-700 dark:text-teal-300 font-medium' : 'text-emerald-100'}`}>
                  Hindi: {step.hindi}
                </div>
                <div className={`text-[11px] ${isNpc ? 'text-slate-400' : 'text-emerald-200/80'}`}>
                  {step.english}
                </div>

                {step.notes && (
                  <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px] italic text-slate-500 dark:text-slate-400">
                    💡 {step.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* User Input or NPC Step Prompt Action */}
      {!isScenarioFinished && currentStep && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          {currentStep.speaker === 'npc' ? (
            <button
              onClick={handleNpcNext}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/30 transition-all"
            >
              <span>Your Turn to Respond</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2">
                Your Response Goal: "{currentStep.hindi}"
              </span>

              {/* Interaction Type 1: Multiple Choice */}
              {currentStep.options && (
                <div className="space-y-2 mb-4">
                  {currentStep.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    let style =
                      'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100';

                    if (isTurnEvaluated) {
                      if (opt.isCorrect) {
                        style =
                          'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500';
                      } else if (isSelected && !opt.isCorrect) {
                        style =
                          'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-800 dark:text-rose-200';
                      } else {
                        style = 'opacity-40 border-slate-200 dark:border-slate-800';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isTurnEvaluated}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full p-3.5 rounded-xl border text-left font-bold text-sm transition-all flex items-center justify-between ${style}`}
                      >
                        <div>
                          <div>{opt.telugu}</div>
                          <div className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            {opt.hindi}
                          </div>
                        </div>
                        {isTurnEvaluated && opt.isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Interaction Type 2: Sentence Chip Building */}
              {currentStep.expectedTokens && (
                <div className="space-y-3 mb-4">
                  <div className="min-h-[50px] p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 items-center">
                    {selectedTokens.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">
                        Tap word chips below to build your reply...
                      </span>
                    ) : (
                      selectedTokens.map((token, idx) => (
                        <button
                          key={`${token}_${idx}`}
                          disabled={isTurnEvaluated}
                          onClick={() => handleRemoveToken(token, idx)}
                          className="px-2.5 py-1.5 bg-white dark:bg-slate-700 rounded-lg text-xs font-bold shadow-xs border border-slate-200 dark:border-slate-600"
                        >
                          {token}
                        </button>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableTokens.map((token, idx) => (
                      <button
                        key={`${token}_${idx}`}
                        disabled={isTurnEvaluated}
                        onClick={() => handleAddToken(token)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold"
                      >
                        {token}
                      </button>
                    ))}
                  </div>

                  {!isTurnEvaluated && (
                    <button
                      disabled={selectedTokens.length === 0}
                      onClick={handleCheckBuiltSentence}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm"
                    >
                      Check & Send Response
                    </button>
                  )}
                </div>
              )}

              {/* Interaction Type 3: Free Response Typing */}
              {currentStep.interactionType === 'free_response' && (
                <form onSubmit={handleCheckFreeTyped} className="space-y-3 mb-4">
                  <input
                    type="text"
                    disabled={isTurnEvaluated}
                    value={userTyped}
                    onChange={(e) => setUserTyped(e.target.value)}
                    placeholder="Type your Roman Telugu reply..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  {!isTurnEvaluated && (
                    <button
                      type="submit"
                      disabled={!userTyped.trim()}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm"
                    >
                      Send Spoken Telugu
                    </button>
                  )}
                </form>
              )}

              {/* Feedback and Continue button */}
              {isTurnEvaluated && turnFeedback && (
                <div className="animate-pop">
                  <div
                    className={`p-3 rounded-xl mb-3 text-xs sm:text-sm font-medium flex items-center gap-2 ${
                      turnFeedback.isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    {turnFeedback.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    )}
                    <span>{turnFeedback.text}</span>
                  </div>

                  <button
                    onClick={handleContinueAfterTurn}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2"
                  >
                    <span>Continue Dialogue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Finished Scenario Summary */}
      {isScenarioFinished && (
        <div className="text-center py-6 animate-pop">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Conversation Completed!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You successfully held a conversation in spoken Telugu and earned{' '}
            <span className="font-extrabold text-emerald-600">+{earnedXp} XP</span>!
          </p>

          <div className="flex justify-center space-x-3">
            {onRestart && (
              <button
                onClick={onRestart}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300"
              >
                Replay Scenario
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

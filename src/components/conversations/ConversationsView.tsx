import React, { useState } from 'react';
import { CONVERSATION_SCENARIOS } from '../../data/conversations';
import { ConversationPlayer } from '../modes/ConversationPlayer';
import { UserStats } from '../../types';
import { MessageSquare, CheckCircle2, ArrowRight, Play, ArrowLeft } from 'lucide-react';

interface ConversationsViewProps {
  stats: UserStats;
  onCompleteConversation: (scenarioId: string, earnedXp: number) => void;
  initialScenarioId?: string | null;
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({
  stats,
  onCompleteConversation,
  initialScenarioId,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    initialScenarioId || null
  );

  const activeScenario = CONVERSATION_SCENARIOS.find((s) => s.id === selectedScenarioId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {activeScenario ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedScenarioId(null)}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Scenarios</span>
          </button>

          <ConversationPlayer
            scenario={activeScenario}
            onComplete={(xp) => {
              onCompleteConversation(activeScenario.id, xp);
            }}
            onRestart={() => {
              // restart by toggling
              setSelectedScenarioId(null);
              setTimeout(() => setSelectedScenarioId(activeScenario.id), 50);
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider block mb-1">
              Conversational Telugu Simulator
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Real-World Spoken Scenarios
            </h2>
            <p className="text-indigo-100 text-sm max-w-2xl">
              Simulate true-to-life everyday situations: hostel corridors, mess food, canteen snacks, auto rides, and meeting seniors with spoken Telugu dialogue!
            </p>
          </div>

          {/* Scenarios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONVERSATION_SCENARIOS.map((scenario) => {
              const isCompleted = stats.completedConversations?.includes(scenario.id);
              return (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${
                    isCompleted
                      ? 'border-emerald-300 dark:border-emerald-800'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                        {scenario.avatar}
                      </span>

                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          Stage {scenario.stage}
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-0.5">
                      {scenario.title}
                    </h3>

                    <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">
                      {scenario.hindiTitle}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {scenario.scenarioDescription}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>{isCompleted ? 'Replay Conversation' : 'Start Conversation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

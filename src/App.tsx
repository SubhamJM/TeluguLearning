import React, { useState, useEffect } from 'react';
import { useUserProgress } from './store/userProgress';
import { ActiveTab, Navbar } from './components/common/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { PatternExplorer } from './components/patterns/PatternExplorer';
import { ModesHub } from './components/modes/ModesHub';
import { ConversationsView } from './components/conversations/ConversationsView';
import { ConfusionDrill } from './components/modes/ConfusionDrill';
import { PlaygroundView } from './components/playground/PlaygroundView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { LessonContainer } from './components/modes/LessonContainer';
import { BadgeAlertModal } from './components/common/BadgeAlertModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { CURRICULUM_STAGES } from './data/curriculum';
import { VOCABULARY_DATA } from './data/vocabulary';
import { PRACTICAL_SENTENCES } from './data/practicalSentences';
import { CurriculumStage } from './types';
import { selectAdaptiveItems } from './engine/spacedRepetition';

export const App: React.FC = () => {
  const {
    stats,
    progressMap,
    addXp,
    recordAttempt,
    completeStage,
    completeConversation,
    newlyUnlockedBadge,
    clearBadgeAlert,
    resetAllProgress,
    exportDataJson,
    importDataJson,
  } = useUserProgress();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeLessonStage, setActiveLessonStage] = useState<CurriculumStage | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConfusionPairId, setActiveConfusionPairId] = useState<string>('nenu_vs_naaku');

  // Preferences
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('telugu_quest_theme') === 'dark';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTeluguScript, setShowTeluguScript] = useState<boolean>(false);

  // Onboarding modal (shown once if user has 0 XP)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('telugu_quest_onboarded') && stats.xp === 0;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('telugu_quest_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('telugu_quest_theme', 'light');
    }
  }, [darkMode]);

  const handleStartStageLesson = (stage: CurriculumStage) => {
    setActiveLessonStage(stage);
  };

  const handleStartDailyPractice = () => {
    // Select adaptive 6 items based on SRS
    const allIds = VOCABULARY_DATA.map((v) => v.id);
    const adaptiveIds = selectAdaptiveItems(allIds, progressMap, 6);
    const dailyVocab = VOCABULARY_DATA.filter((v) => adaptiveIds.includes(v.id));

    const pseudoDailyStage: CurriculumStage = {
      stageNumber: 999,
      title: "Today's Adaptive 5-Min Practice",
      subtitle: 'Focused on your weak items & spaced review',
      hindiBridgeSummary: 'Adaptive personalized session',
      description: 'Strengthen weak mappings and reinforce sentence structure.',
      vocabIds: dailyVocab.map((v) => v.id),
      patternIds: [],
      sentenceIds: ['s_stage2_1'],
      confusionPairIds: [],
      unlockRequirementMastery: 0,
    };

    setActiveLessonStage(pseudoDailyStage);
  };

  const handleContinueLearning = () => {
    // Find first uncompleted stage or default to Stage 0
    const uncompleted = CURRICULUM_STAGES.find(
      (s) => !stats.completedStages.includes(s.stageNumber)
    );
    const targetStage = uncompleted || CURRICULUM_STAGES[0];
    setActiveLessonStage(targetStage);
  };

  const handleDrillWeakWord = (wordId: string) => {
    const word = VOCABULARY_DATA.find((v) => v.id === wordId);
    if (word?.confusionGroup) {
      setActiveTab('confusion');
    } else {
      setActiveTab('modes');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveLessonStage(null);
          setActiveConversationId(null);
          setActiveTab(tab);
        }}
        stats={stats}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        showTeluguScript={showTeluguScript}
        setShowTeluguScript={setShowTeluguScript}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* If user is inside an active structured lesson runner */}
        {activeLessonStage ? (
          <LessonContainer
            title={activeLessonStage.title}
            subtitle={activeLessonStage.subtitle}
            vocabItems={VOCABULARY_DATA.filter((v) =>
              activeLessonStage.vocabIds.includes(v.id)
            )}
            sentences={PRACTICAL_SENTENCES.filter((s) =>
              activeLessonStage.sentenceIds.includes(s.id)
            )}
            onCompleteLesson={(earnedXp) => {
              addXp(earnedXp);
              if (activeLessonStage.stageNumber < 900) {
                completeStage(activeLessonStage.stageNumber);
              }
              setActiveLessonStage(null);
              setActiveTab('dashboard');
            }}
            onRecordAttempt={recordAttempt}
            onExit={() => setActiveLessonStage(null)}
            showTeluguScript={showTeluguScript}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                stats={stats}
                progressMap={progressMap}
                onContinueLearning={handleContinueLearning}
                onStartDailyPractice={handleStartDailyPractice}
                onOpenPlayground={() => setActiveTab('playground')}
                onDrillWeakWord={handleDrillWeakWord}
                onOpenCurriculum={() => setActiveTab('curriculum')}
                onOpenConversations={() => setActiveTab('conversations')}
              />
            )}

            {activeTab === 'curriculum' && (
              <CurriculumView
                stats={stats}
                progressMap={progressMap}
                onStartStageLesson={handleStartStageLesson}
                onOpenStageConversation={(scenarioId) => {
                  setActiveConversationId(scenarioId);
                  setActiveTab('conversations');
                }}
                onOpenConfusionDrill={(pairId) => {
                  setActiveConfusionPairId(pairId);
                  setActiveTab('confusion');
                }}
              />
            )}

            {activeTab === 'patterns' && <PatternExplorer />}

            {activeTab === 'modes' && (
              <ModesHub
                onAddXp={addXp}
                onRecordAttempt={recordAttempt}
                showTeluguScript={showTeluguScript}
              />
            )}

            {activeTab === 'confusion' && (
              <ConfusionDrill
                pairId={activeConfusionPairId}
                onComplete={(xp) => addXp(xp)}
                onRecordAttempt={recordAttempt}
              />
            )}

            {activeTab === 'conversations' && (
              <ConversationsView
                stats={stats}
                onCompleteConversation={(scenarioId, xp) => {
                  addXp(xp);
                  completeConversation(scenarioId);
                }}
                initialScenarioId={activeConversationId}
              />
            )}

            {activeTab === 'playground' && (
              <PlaygroundView onAddXp={addXp} onRecordAttempt={recordAttempt} />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                stats={stats}
                progressMap={progressMap}
                onDrillWeakWord={handleDrillWeakWord}
                onExportData={exportDataJson}
                onImportData={importDataJson}
                onResetProgress={resetAllProgress}
              />
            )}
          </>
        )}
      </main>

      {/* Achievement Unlocked Pop-up Modal */}
      <BadgeAlertModal
        badgeId={newlyUnlockedBadge}
        onClose={clearBadgeAlert}
      />

      {/* Onboarding Welcome Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => {
          localStorage.setItem('telugu_quest_onboarded', 'true');
          setShowOnboarding(false);
        }}
        onStartZero={() => {
          localStorage.setItem('telugu_quest_onboarded', 'true');
          setShowOnboarding(false);
          handleStartStageLesson(CURRICULUM_STAGES[0]);
        }}
      />
    </div>
  );
};

export default App;

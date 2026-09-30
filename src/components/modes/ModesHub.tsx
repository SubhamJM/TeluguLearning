import React, { useState } from 'react';
import { MatchingGame } from './MatchingGame';
import { MultipleChoiceQuiz, QuizQuestion } from './MultipleChoiceQuiz';
import { SentenceBuilder } from './SentenceBuilder';
import { SpeedRound } from './SpeedRound';
import { ConfusionDrill } from './ConfusionDrill';
import { FreeResponsePractice } from './FreeResponsePractice';
import { VOCABULARY_DATA } from '../../data/vocabulary';
import { PRACTICAL_SENTENCES } from '../../data/practicalSentences';
import {
  Gamepad2,
  GitCompare,
  Timer,
  Type,
  Sparkles,
  Layers,
  ArrowLeft,
  ArrowRight,
  Brain,
  Sliders,
} from 'lucide-react';

interface ModesHubProps {
  onAddXp: (amount: number) => void;
  onRecordAttempt: (itemId: string, isCorrect: boolean) => void;
  showTeluguScript?: boolean;
}

type ActiveGame =
  | 'match'
  | 'reverse_match'
  | 'quiz_meaning'
  | 'quiz_telugu'
  | 'sentence_builder'
  | 'speed_round'
  | 'confusion'
  | 'think_in_telugu'
  | null;

export const ModesHub: React.FC<ModesHubProps> = ({
  onAddXp,
  onRecordAttempt,
  showTeluguScript,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [sentenceIndex, setSentenceIndex] = useState<number>(0);

  // Multiple Choice Questions generator for Mode C (Telugu -> Hindi)
  const generateMeaningQuestions = (): QuizQuestion[] => {
    return VOCABULARY_DATA.slice(0, 10).map((v) => {
      const distractors = VOCABULARY_DATA.filter((item) => item.id !== v.id)
        .slice(0, 3)
        .map((d) => ({
          id: `dist_${d.id}`,
          text: d.hindi,
          isCorrect: false,
        }));
      const options = [
        { id: `c_${v.id}`, text: v.hindi, isCorrect: true },
        ...distractors,
      ].sort(() => Math.random() - 0.5);

      return {
        id: `q_${v.id}`,
        prompt: v.telugu,
        promptType: 'telugu',
        correctAnswer: v.hindi,
        correctAnswerId: v.id,
        options,
        explanation: `${v.telugu} = ${v.hindi}. (${v.english})`,
      };
    });
  };

  // Multiple Choice Questions generator for Mode D (Hindi -> Telugu)
  const generateTeluguQuestions = (): QuizQuestion[] => {
    return VOCABULARY_DATA.slice(0, 10).map((v) => {
      const distractors = VOCABULARY_DATA.filter((item) => item.id !== v.id)
        .slice(0, 3)
        .map((d) => ({
          id: `dist_${d.id}`,
          text: d.telugu,
          isCorrect: false,
        }));
      const options = [
        { id: `c_${v.id}`, text: v.telugu, isCorrect: true },
        ...distractors,
      ].sort(() => Math.random() - 0.5);

      return {
        id: `q_tel_${v.id}`,
        prompt: v.hindi,
        promptType: 'hindi',
        correctAnswer: v.telugu,
        correctAnswerId: v.id,
        options,
        explanation: `Hindi "${v.hindi}" in spoken Telugu is "${v.telugu}".`,
      };
    });
  };

  const matchingVocab = React.useMemo(() => VOCABULARY_DATA.slice(0, 10), []);
  const meaningQuestions = React.useMemo(() => generateMeaningQuestions(), []);
  const teluguQuestions = React.useMemo(() => generateTeluguQuestions(), []);

  // Free response items for Think-in-Telugu
  const thinkInTeluguItems = [
    {
      id: 'tit_1',
      situationOrHindi: 'You want a cup of coffee',
      englishPrompt: 'Say: "I want coffee"',
      expectedTelugu: 'Naaku coffee kaavali',
      acceptableVariations: ['naaku coffee kavali', 'naku coffee kaavali'],
      isThinkInTeluguMode: true,
      hint: 'Naaku + coffee + kaavali',
    },
    {
      id: 'tit_2',
      situationOrHindi: 'You are introducing yourself as Rohan',
      englishPrompt: 'Say: "My name is Rohan"',
      expectedTelugu: 'Naa peru Rohan',
      acceptableVariations: ['na peru rohan'],
      isThinkInTeluguMode: true,
      hint: 'Naa peru ...',
    },
    {
      id: 'tit_3',
      situationOrHindi: 'Letting someone know you don’t speak Telugu yet',
      englishPrompt: 'Say: "I don\'t know Telugu"',
      expectedTelugu: 'Naaku Telugu raadu',
      acceptableVariations: ['naaku telugu radu', 'naku telugu radu'],
      isThinkInTeluguMode: true,
      hint: 'Naaku Telugu raadu',
    },
    {
      id: 'tit_4',
      situationOrHindi: 'Asking where the mess/canteen is located',
      englishPrompt: 'Say: "Where is the mess?"',
      expectedTelugu: 'Mess ekkada undi',
      acceptableVariations: ['mess ekkada undi?', 'mess ekada undi'],
      isThinkInTeluguMode: true,
      hint: 'Mess + ekkada undi',
    },
  ];

  const modesList = [
    {
      id: 'match' as ActiveGame,
      title: 'Mode A: Telugu ↔ Hindi Match',
      desc: 'Interactive matching cards with combo streaks and audio pronunciation.',
      icon: <Layers className="w-5 h-5 text-emerald-500" />,
      color: 'border-emerald-200 hover:border-emerald-400',
    },
    {
      id: 'quiz_meaning' as ActiveGame,
      title: 'Mode C: Pick the Meaning',
      desc: 'Given a Telugu word (e.g. Naaku), pick the Hindi equivalent (Mujhe).',
      icon: <Brain className="w-5 h-5 text-teal-500" />,
      color: 'border-teal-200 hover:border-teal-400',
    },
    {
      id: 'quiz_telugu' as ActiveGame,
      title: 'Mode D: Pick the Telugu',
      desc: 'Given a Hindi concept (Tumhe), choose the spoken Telugu form (Neeku).',
      icon: <Type className="w-5 h-5 text-indigo-500" />,
      color: 'border-indigo-200 hover:border-indigo-400',
    },
    {
      id: 'sentence_builder' as ActiveGame,
      title: 'Mode E: Build the Sentence',
      desc: 'Arrange scrambled Telugu word chips to assemble practical phrases.',
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      color: 'border-purple-200 hover:border-purple-400',
    },
    {
      id: 'speed_round' as ActiveGame,
      title: 'Mode G: 45s Speed Round',
      desc: 'Rapid-fire 45 second speed round to test automatic recognition reflexes.',
      icon: <Timer className="w-5 h-5 text-amber-500" />,
      color: 'border-amber-200 hover:border-amber-400',
    },
    {
      id: 'confusion' as ActiveGame,
      title: 'Mode I: Confusion Drills',
      desc: 'Drill tricky distinctions: Nenu vs Naaku, Nuvvu vs Neeku, Idi vs Adi.',
      icon: <GitCompare className="w-5 h-5 text-rose-500" />,
      color: 'border-rose-200 hover:border-rose-400',
    },
    {
      id: 'think_in_telugu' as ActiveGame,
      title: 'Mode J: "Think in Telugu"',
      desc: 'Direct situation prompts with typed Roman Telugu answers (fuzzy evaluation).',
      icon: <Sparkles className="w-5 h-5 text-cyan-500" />,
      color: 'border-cyan-200 hover:border-cyan-400',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {activeGame !== null ? (
        <div className="space-y-4">
          <button
            onClick={() => setActiveGame(null)}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Game Modes</span>
          </button>

          {activeGame === 'match' && (
            <MatchingGame
              items={matchingVocab}
              onComplete={(xp) => onAddXp(xp)}
              onAddXp={onAddXp}
              onRecordAttempt={onRecordAttempt}
              showTeluguScript={showTeluguScript}
            />
          )}

          {activeGame === 'quiz_meaning' && (
            <MultipleChoiceQuiz
              questions={meaningQuestions}
              title="Pick the Hindi Meaning"
              onComplete={(xp) => {
                onAddXp(xp);
                setActiveGame(null);
              }}
              onRecordAttempt={onRecordAttempt}
            />
          )}

          {activeGame === 'quiz_telugu' && (
            <MultipleChoiceQuiz
              questions={teluguQuestions}
              title="Pick the Spoken Telugu"
              onComplete={(xp) => {
                onAddXp(xp);
                setActiveGame(null);
              }}
              onRecordAttempt={onRecordAttempt}
            />
          )}

          {activeGame === 'sentence_builder' && (
            <SentenceBuilder
              sentence={PRACTICAL_SENTENCES[sentenceIndex % PRACTICAL_SENTENCES.length]}
              onNext={(isCorrect) => {
                if (isCorrect) onAddXp(25);
                setSentenceIndex((prev) => prev + 1);
              }}
              showTeluguScript={showTeluguScript}
            />
          )}

          {activeGame === 'speed_round' && (
            <SpeedRound
              vocabulary={VOCABULARY_DATA}
              durationSeconds={45}
              onComplete={(xp) => onAddXp(xp)}
              onRecordAttempt={onRecordAttempt}
            />
          )}

          {activeGame === 'confusion' && (
            <ConfusionDrill
              onComplete={(xp) => onAddXp(xp)}
              onRecordAttempt={onRecordAttempt}
            />
          )}

          {activeGame === 'think_in_telugu' && (
            <FreeResponsePractice
              items={thinkInTeluguItems}
              onComplete={(xp) => {
                onAddXp(xp);
                setActiveGame(null);
              }}
              onRecordAttempt={onRecordAttempt}
            />
          )}
        </div>
      ) : (
        /* Game Modes Grid */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
            <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider block mb-1">
              Interactive Mini-Games
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Practice Modes & Challenges
            </h2>
            <p className="text-emerald-100 text-sm max-w-2xl">
              Choose your favorite interactive training mode: matching cards, speed rounds, sentence builders, or direct "Think in Telugu" drills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modesList.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveGame(m.id)}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between group ${m.color}`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    {m.icon}
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-1">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Play Mode</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

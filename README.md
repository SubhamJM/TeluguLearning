# Telugu Quest 🎯

> **A Local-First, Gamified Web App for Learning Conversational Telugu via Hindi**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-Vitest%20Passed-brightgreen.svg)](https://vitest.dev/)
[![Offline](https://img.shields.io/badge/Local--First-100%25%20Offline-success.svg)]()

---

## 🌟 Overview & Learning Philosophy

**Telugu Quest** is built specifically for absolute beginners who understand **Hindi** and want to achieve conversational spoken Telugu quickly.

Instead of wrestling with abstract grammar rules or unfamiliar scripts, the app uses **Hindi as the intuitive conceptual bridge**:

| Spoken Roman Telugu | Hindi Bridge Equivalent | Meaning |
| :--- | :--- | :--- |
| **Nenu** | **Main** (Subject doing action) | *I* |
| **Naaku** | **Mujhe** (Need / Feeling / State) | *To me / I want* |
| **Naa** | **Mera / Meri** (Possession) | *My* |
| **Nuvvu** | **Tum** (Informal subject) | *You* |
| **Neeku** | **Tumhe** (Need / State) | *To you* |
| **Nee** | **Tumhara / Tumhari** | *Your* |
| **Meeru** | **Aap** (Polite / Respectful) | *You (polite)* |
| **Meeku** | **Aapko** (Need / Respectful) | *To you (polite)* |
| **Mee** | **Aapka / Aapki** | *Your (polite)* |

The app primarily teaches **Roman Telugu** (phonetic transliteration) because immediate conversational fluency is the learner's top goal. An optional Telugu script toggle (`తెలుగు`) is available on demand.

The app is **100% local-first**: no cloud backend, no account creation, no external API calls, and zero internet connection required after cloning.

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Run Locally in Development Mode

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 3. Run Production Build

```bash
npm run build
npm run preview
```

### 4. Run Automated Test Suite

```bash
npm test
```

All 21 test suites across answer normalization, matching engine, spaced repetition, level/streak progress, and custom playgrounds pass with Vitest.

---

## 🎮 Key Features & Game Modes

### 1. 10-Stage Structured Curriculum
From absolute zero survival greetings to fluent conversational situations:
* **Stage 0: Telugu Survival** — Greetings, please, thank you, sorry, *Naaku Telugu raadu* (*Mujhe Telugu nahi aati*).
* **Stage 1: Telugu Building Blocks** — Pronouns (*Nenu, Naaku, Naa, Nuvvu, Neeku, Nee, Meeru, Meeku, Mee*), Demonstratives (*Idi, Adi*), and Locations (*Ikkada, Akkada*).
* **Stage 2: Expressing Needs & Knowledge** — *Naaku [X] kaavali* (*Mujhe [X] chahiye*), *Naaku [X] vaddu* (*Mujhe nahi chahiye*), *Naaku telusu* (*Mujhe pata hai*).
* **Stage 3: Everyday Actions & Verbs** — Present continuous verbs (*Veltunnanu, Vastunnanu, Chestunnanu, Tintunnanu*).
* **Stage 4: Questions & Navigation** — *Ekkada, Eppudu, Enduku, Ela, Entha, Evaru*.
* **Stage 5: College & Hostel Life** — *Mess ki veldama?*, *Repu exam undi*, *Naaku konchem notes ivvava?*
* **Stage 6: Food, Mess & Canteen** — Ordering food, spice levels (*Kaaram ga undi*), requesting items (*Konchem pappu ivvandi*).
* **Stage 7: Shopping & Payments** — Prices (*Idi entha?*), bargaining (*Konchem thakkuva cheyandi*), UPI payments (*Online payment unda?*).
* **Stage 8: Directions & Auto Travel** — *Straight vellandi*, *Kudi* (Daayan), *Edama* (Baayan), auto negotiations.
* **Stage 9: Casual Chat & Socializing** — Making plans with friends, hobbies, weekend outings.
* **Stage 10: Conversational Fluency** — Direct "Think in Telugu" free responses.

### 2. Sentence Pattern Lab (20+ Reusable Templates)
Deconstructs sentence patterns rather than memorizing isolated phrases:
* Telugu sentence + Hindi template + English gloss
* Word-by-word anatomical breakdown
* Multiple real conversational variations
* **Interactive Slot Generator**: click any slot item (`coffee`, `tea`, `neellu`, `food`, `help`) to generate and pronounce instant sentences.

### 3. Interactive Matching Cards (Modes A & B)
* Telugu ↔ Hindi card grid
* Dynamic combo multiplier (`x2`, `x3`, `x5`, `x10`) with celebration sound effects
* Immediate corrective feedback displaying exact Hindi comparisons on mismatch
* Web Speech API Roman Telugu pronunciation

### 4. Meaning & Telugu Quizzes (Modes C & D)
* **Mode C (Pick the Meaning)**: Telugu prompt → choose Hindi meaning
* **Mode D (Pick the Telugu)**: Hindi concept prompt → choose Roman Telugu form
* Keyboard shortcuts (`1`, `2`, `3`, `4` and `Enter`) for rapid, smooth training

### 5. Sentence Builder (Mode E)
* Arrange scrambled word chips into practical sentences
* Chip selection, removal, clear, and instant verification
* Audio pronunciation of assembled Telugu sentences

### 6. Focused Confusion Drills (Mode I)
Directly addresses common pitfalls:
* `Nenu` (Main) ↔ `Naaku` (Mujhe)
* `Naa` (Mera) ↔ `Naaku` (Mujhe)
* `Nuvvu` (Tum) ↔ `Neeku` (Tumhe)
* `Nee` (Tumhara) ↔ `Neeku` (Tumhe)
* `Meeru` (Aap) ↔ `Meeku` (Aapko)
* `Idi` (Yeh) ↔ `Adi` (Woh)
* `Ikkada` (Yahan) ↔ `Akkada` (Wahan)
* `Ekkada` (Kahan) ↔ `Ekkadiki` (Kidhar)
* `Manam` (Hum sab) ↔ `Memu` (Hum log)

### 7. 45-Second Speed Round (Mode G)
* Rapid-fire translation drill against a ticking clock
* Score, correct streaks, and XP bonuses

### 8. 10 Interactive Conversation Scenarios
Turn-by-turn conversational dialogue with avatars, Hindi hints, and branching responses:
1. Meeting a Fellow Student
2. Hostel Corridor Chat
3. Dinner at the Mess
4. Ordering at the Canteen
5. Buying Groceries & Essentials
6. Finding the Administrative Block
7. Weekend Plans with a Friend
8. Respectful Chat with a Senior
9. Hiring an Auto-Rickshaw
10. Full Introduction (Think in Telugu)

### 9. Fuzzy Transliteration Evaluator & "Think in Telugu" Mode
* Evaluates typed Roman Telugu without strict string matching
* Accepts reasonable transliteration variations:
  * `kaavali` == `kavali`
  * `meeru` == `meru`
  * `kooda` == `kuda`
  * `chestunnanu` == `chestunna`
  * Case-insensitive and punctuation-tolerant

### 10. Custom Playground Mode
* Build your own vocabulary sets (*"My Telugu Basics"*, *"Hostel Telugu"*, *"Words I Keep Forgetting"*)
* Save sets to LocalStorage
* **Instant game generation**: launch Match games, Speed rounds, or Sentence builders from your custom entries!

### 11. Adaptive Repetition Engine (SRS)
* Tracks attempts, correct/incorrect count, response time, streak, and mastery (0–100%)
* Automatically surfaces **Top Weak Words** with a 1-click drill button
* Calculates time-decay urgency and prioritizes confused pairs

### 12. Local Data Backup
* Export progress to a standalone `.json` file
* Import and restore progress anywhere without internet

---

## 📂 Project Architecture

```text
src/
├── types/
│   └── index.ts                 # TypeScript data contracts & models
├── data/
│   ├── vocabulary.ts            # 110+ curated foundational words with Hindi bridges
│   ├── sentencePatterns.ts      # 20+ sentence patterns with breakdown & variations
│   ├── practicalSentences.ts    # 105+ practical phrases with tokens & blank questions
│   ├── confusionPairs.ts        # Commonly confused pairs & targeted drills
│   ├── conversations.ts         # 10 multi-step interactive scenarios
│   └── curriculum.ts            # Stages 0 to 10 progression & unlock rules
├── engine/
│   ├── answerNormalizer.ts      # Roman Telugu phonetic canonicalizer & fuzzy evaluator
│   ├── matchingEngine.ts        # Card pairing logic, combo streaks & XP math
│   ├── spacedRepetition.ts      # Adaptive SRS urgency scoring & weak words detection
│   ├── progressEngine.ts        # Level curves, streaks, daily goals & achievements
│   └── audioPlayer.ts           # Web Audio API synthesizers & browser speech synthesis
├── store/
│   ├── userProgress.ts          # LocalStorage persistence hook for user stats & SRS
│   └── playgroundStore.ts       # Custom user sets & mapping storage
├── components/
│   ├── common/
│   │   ├── Navbar.tsx           # Responsive header, live stats pills, theme & audio toggles
│   │   ├── BadgeAlertModal.tsx  # Gamified achievement modal with confetti
│   │   └── OnboardingModal.tsx    # First-time zero-to-conversation welcome modal
│   ├── dashboard/
│   │   └── Dashboard.tsx        # Modern dashboard with metrics, streaks, weak word drills
│   ├── curriculum/
│   │   └── CurriculumView.tsx   # Visual 10-stage roadmap with launch buttons
│   ├── patterns/
│   │   └── PatternExplorer.tsx  # Interactive sentence pattern lab with slot generator
│   ├── modes/
│   │   ├── ModesHub.tsx         # Practice mini-games hub
│   │   ├── MatchingGame.tsx     # Mode A & B Telugu ↔ Hindi card match
│   │   ├── MultipleChoiceQuiz.tsx # Mode C & D Meaning & Telugu quizzes
│   │   ├── SentenceBuilder.tsx  # Mode E Sentence token arranger
│   │   ├── SpeedRound.tsx       # Mode G 45-second timed quiz
│   │   ├── ConfusionDrill.tsx   # Mode I Focused discrimination drills
│   │   ├── FreeResponsePractice.tsx # Mode J "Think in Telugu" typed production
│   │   ├── ConversationPlayer.tsx # Turn-by-turn conversational dialogue player
│   │   └── LessonContainer.tsx  # Multi-step structured stage lesson runner
│   ├── playground/
│   │   └── PlaygroundView.tsx   # Custom vocabulary/phrase set builder & game launcher
│   └── analytics/
│       └── AnalyticsView.tsx    # Spaced repetition stats, badges & JSON backup
├── tests/
│   ├── answerNormalizer.test.ts # Tests for transliteration matching
│   ├── matchingEngine.test.ts   # Tests for cards & combo XP
│   ├── spacedRepetition.test.ts # Tests for mastery & adaptive selection
│   ├── progressEngine.test.ts   # Tests for levels, streaks & achievements
│   └── playground.test.ts       # Tests for playground seed datasets
├── App.tsx                      # Root application coordinating tabs and views
├── main.tsx                     # React DOM entry point
└── index.css                    # Tailwind CSS base and animations
```

---

## 🧪 Testing

Run all unit tests:

```bash
npm test
```

Tests cover:
* **Answer Normalization**: Verifies phonetic equivalence (`kaavali` == `kavali`, `meeru` == `meru`, `kooda` == `kuda`, `chestunnanu` == `chestunna`).
* **Matching Engine**: Verifies card pair generation, XP scoring, combo bonus steps, and speed bonuses.
* **Spaced Repetition**: Verifies mastery calculation, error-rate urgency weighting, streak decay, and adaptive item selection.
* **Progress Engine**: Verifies XP-to-level progression, consecutive-day streak logic, same-day preservation, and achievement triggers.
* **Playground Store**: Verifies seed mappings (`Nenu -> Main`, `Naaku -> Mujhe`) and custom sets.

---

## 🔒 Privacy & Offline Guarantee

* **No tracking, telemetry, or remote analytics.**
* **No external servers or cloud dependencies.**
* **All data is saved locally in browser `localStorage`.**
* **Audio effects are synthesized natively using the browser's Web Audio API.**

---

## 📄 License

MIT. Built with ❤️ for everyone starting their Telugu learning adventure.

# Telugu Quest 🎯

> **A Local-First, Gamified Web App for Learning Spoken Conversational Telugu via the Hindi Conceptual Bridge**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-22%20Vitest%20Passed-brightgreen.svg)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Mobile%20Ready-orange.svg)]()
[![Offline](https://img.shields.io/badge/Local--First-100%25%20Offline-success.svg)]()

---

## 🌟 Overview & Learning Philosophy

**Telugu Quest** is designed specifically for absolute beginners who understand **Hindi** and want to achieve conversational fluency in Telugu quickly without getting bogged down by script or complex grammatical jargon.

### The "Hindi Bridge" Principle
Telugu grammar and Hindi grammar share remarkably intuitive structural parallels. Rather than translating through English (which often inverts word order and case markers), Telugu Quest anchors every Telugu concept directly to its natural Hindi counterpart:

| Spoken Roman Telugu | Hindi Bridge Equivalent | Concept / Grammatical Role |
| :--- | :--- | :--- |
| **Nenu** | **Main** | Subject performing an action (*Nenu tintunnanu* = *Main khaa raha hoon*) |
| **Naaku** | **Mujhe** | Indirect subject / Need / Sensation (*Naaku kaavali* = *Mujhe chahiye*) |
| **Naa** | **Mera / Meri** | Possessive pronoun (*Naa peru* = *Mera naam*) |
| **Nuvvu** | **Tum** | Informal subject |
| **Neeku** | **Tumhe** | Informal need / sensation (*Neeku telusa?* = *Kya tumhe pata hai?*) |
| **Nee** | **Tumhara / Tumhari** | Informal possessive pronoun |
| **Meeru** | **Aap** | Respectful / Polite subject & plural |
| **Meeku** | **Aapko** | Polite need / sensation (*Meeku coffee kaavala?* = *Kya aapko coffee chahiye?*) |
| **Mee** | **Aapka / Aapki** | Polite possessive pronoun (*Mee peru emiti?* = *Aapka naam kya hai?*) |
| **Idi / Adi** | **Yeh / Woh** | Proximal / Distant demonstrative (*Idi baagundi* = *Yeh accha hai*) |
| **Ikkada / Akkada** | **Yahan / Wahan** | Locations (*Ikkada undi* = *Yahan hai*) |
| **Kaavali / Vaddu** | **Chahiye / Nahi chahiye** | Core requests (*Neellu kaavali* = *Paani chahiye*) |

### Roman Telugu First
The app prioritizes **Roman Telugu** (phonetic English script) because the learner's immediate priority is conversational speech in everyday environments (hostel, college, mess, auto travel, pharmacy, shopping). Telugu script (`తెలుగు`) is included as an optional toggle for learners who want to explore native orthography at their own pace.

### 100% Local-First & Single-User
* **Zero Backend / No Database Server**: Everything runs in the client's browser.
* **No Authentication / No Login**: No passwords or account setup; jump straight into learning.
* **100% Offline Persistence**: User progress, streaks, accuracy, custom playground sets, and spaced repetition metrics are saved in `localStorage`.
* **Complete Data Portability**: 1-click JSON backup export and restore in the Analytics tab.

---

## 🚀 Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/TeluguLearning.git
cd TeluguLearning
npm install
```

### 2. Development Server (Desktop)
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Test on Mobile Phone via Local Wi-Fi
To open the web app on your phone connected to the same Wi-Fi network:
```bash
npm run dev -- --host
```
Vite will output your local network address:
```text
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.XX:5173/
```
Open `http://192.168.1.XX:5173/` on your phone's browser (Safari or Chrome).

### 4. Run Test Suite
```bash
npm test
```
Runs all 22 Vitest unit tests verifying answer normalization, matching engine, spaced repetition, progress, and playground storage.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 📱 Mobile & PWA Experience

Telugu Quest is fully responsive and optimized for mobile screens (360px–430px viewports):
* **Native Bottom Dock Navigation**: Quick thumb access to **Home**, **Stages**, **Games**, **Chat**, and a slide-up **More** drawer (Patterns, Confusion Drills, Playground, Analytics).
* **Zero-Scroll Side-by-Side Matching**: Telugu and Hindi cards sit in an adaptive 2-column grid (`grid-cols-2`) so users can match pairs on small screens without vertical scrolling.
* **PWA Standalone Mode**: Configured with [`public/manifest.json`](file:///home/ricing/Documents/code/Projects/TeluguLearning/public/manifest.json) and iOS safe-area viewport tags (`viewport-fit=cover`).
* **Install to Home Screen**:
  * **iOS (Safari)**: Tap **Share** → Tap **"Add to Home Screen"**.
  * **Android (Chrome)**: Tap **⋮** (Menu) → Tap **"Add to Home screen"** or **"Install app"**.

---

## 📚 Complete 16-Stage Curriculum

The app features a structured progression from absolute zero to spontaneous conversation:

| Stage | Title | Focus & Hindi Bridge Summary |
| :--- | :--- | :--- |
| **Stage 0** | **Telugu Survival** | Greetings, politeness, *Namaskaram*, *Dhanyavadalu*, *Naaku Telugu raadu* (*Mujhe Telugu nahi aati*), *Konchem konchem telusu*. |
| **Stage 1** | **Telugu Building Blocks** | Core pronouns (*Nenu/Naaku/Naa*, *Nuvvu/Neeku/Nee*, *Meeru/Meeku/Mee*), Demonstratives (*Idi/Adi*), Question words (*Ekkada, Eppudu, Enduku*). |
| **Stage 2** | **Expressing Needs & Knowledge** | *Kaavali* (Chahiye), *Vaddu* (Nahi chahiye), *Telusu* (Pata hai), *Teliyadu* (Pata nahi hai). |
| **Stage 3** | **Everyday Actions & Verbs** | Continuous verbs: *Veltunnanu* (Ja raha hoon), *Vastunnanu* (Aa raha hoon), *Chestunnanu* (Kar raha hoon), *Tintunnanu* (Khaa raha hoon). |
| **Stage 4** | **Questions & Navigation** | Inquiring about places, timings, reasons, costs (*Entha?*, *Edi?*, *Evaru?*). |
| **Stage 5** | **College & Hostel Life** | Campus interactions: *Mess ki veldama?*, *Repu exam undi*, *Notes ivvava?*, sharing room supplies. |
| **Stage 6** | **Food, Mess & Canteen** | Ordering snacks, tea/coffee, spice levels (*Kaaram ga undi*), requesting seconds (*Konchem pappu ivvandi*). |
| **Stage 7** | **Shopping & Payments** | Inquiring prices (*Idi entha?*), bargaining (*Konchem thakkuva cheyandi*), UPI payments (*PhonePe / scanner unda?*). |
| **Stage 8** | **Directions & Auto Travel** | *Straight vellandi*, *Kudi* (Daayan), *Edama* (Baayan), auto-rickshaw fare negotiations (*Meter vesthara?*). |
| **Stage 9** | **Casual Chat & Socializing** | Making plans, hobbies, weekend meetups, asking about someone's hometown (*Mee ooru ekkada?*). |
| **Stage 10** | **Conversational Fluency** | "Think in Telugu" free responses, combining grammar building blocks into natural speech. |
| **Stage 11** | **Health, Pharmacy & Clinic** | Describing symptoms (*Jwaram*, *Talanoppi*, *Kadupunoppi*), asking for tablets at medical stores (*Maathralu ivvandi*). |
| **Stage 12** | **Numbers, Money & Time Logistics** | Numbers 1 to 100, calculating rent and deposits, hours (*Ganta*), minutes (*Nimisham*), schedules. |
| **Stage 13** | **Permissions, Etiquette & Campus Rules** | *Vellavachha?* (Kya main ja sakta hoon?), *Koodadu* (Mana hai), polite requests with *-andi*, library rules. |
| **Stage 14** | **Past vs Future Actions & Preferences** | Past vs Future verbs (*Vachanu* vs *Vastanu*, *Vellanu* vs *Veltanu*, *Tinnanu* vs *Tintanu*), expressing likes (*Ishtam*). |
| **Stage 15** | **Conditionals, Native Particles & Street Slang** | Conditionals with *-te* (*Nuvvu vaste nenu vasta* = *Agar tum aao to main aaunga*), tag questions (*Kada?* = *Hai na?*), slang (*Mama*, *Lite theesuko*, *Anthe*). |

---

## 🎮 Game Modes & Interactive Labs

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                             PRACTICE HUB                                 │
├────────────────────┬────────────────────┬────────────────────────────────┤
│ Mode A / B         │ Mode C / D         │ Mode E                         │
│ Telugu ↔ Hindi     │ Quizzes            │ Sentence Builder               │
│ Card Matching      │ Meaning & Telugu   │ Arranging token chips          │
├────────────────────┼────────────────────┼────────────────────────────────┤
│ Mode G             │ Mode I             │ Mode J                         │
│ 45s Speed Round    │ Confusion Drills   │ "Think in Telugu"              │
│ Rapid translation  │ Binary Nenu/Naaku  │ Free typing + fuzzy evaluator  │
├────────────────────┼────────────────────┼────────────────────────────────┤
│ Pattern Lab        │ Chat Scenarios     │ Custom Playground              │
│ 29+ templates with │ 15 Branching real  │ User custom decks with         │
│ slot generators    │ life conversations │ auto-generated mini-games      │
└────────────────────┴────────────────────┴────────────────────────────────┘
```

1. **Telugu ↔ Hindi Card Matching (Modes A & B)**:
   - Dynamic combo multipliers (`x2`, `x3`, `x5`, `x10`) with synthesized sound effects.
   - Zero-scroll 2-column mobile layout.
   - Corrective cards showing side-by-side Hindi bridge comparisons on mistakes.

2. **Quizzes (Modes C & D)**:
   - Mode C: Given Telugu → Pick Hindi meaning.
   - Mode D: Given Hindi prompt → Pick Telugu translation.
   - Full keyboard shortcut support (`1`, `2`, `3`, `4` and `Enter`) for fast desktop review.

3. **Sentence Builder (Mode E)**:
   - Construct real sentences from scrambled word chips with Hindi concept guidance.
   - Instant audio pronunciation upon assembly.

4. **Speed Round (Mode G)**:
   - 45-second high-energy challenge testing reflexive recall.

5. **Confusion Drills (Mode I)**:
   - Targets commonly confused pairs:
     - `Nenu` (Main) vs `Naaku` (Mujhe)
     - `Naa` (Mera) vs `Naaku` (Mujhe)
     - `Nuvvu` (Tum) vs `Neeku` (Tumhe)
     - `Meeru` (Aap) vs `Meeku` (Aapko)
     - `Idi` (Yeh) vs `Adi` (Woh)
     - `Ikkada` (Yahan) vs `Akkada` (Wahan)
     - `Ekkada` (Kahan) vs `Ekkadiki` (Kidhar)
     - `Manam` (Hum sab) vs `Memu` (Hum log)
     - `Vachanu` (Aaya) vs `Vastanu` (Aaunga)
     - `Vellanu` (Gaya) vs `Veltanu` (Jaaunga)
     - `Tinnanu` (Khaya) vs `Tintanu` (Khaaunga)
     - `Ledu` (Nahi hai) vs `Kaadu` (Woh nahi hai)

6. **15 Interactive Conversation Scenarios**:
   - Turn-by-turn dialogue with avatars, Hindi hints, speech synthesis, and branching dialogue choices:
     - Meeting a Fellow Student
     - Hostel Corridor Chat
     - Dinner at the Mess
     - Ordering at the Canteen
     - Buying Groceries & Essentials
     - Finding the Administrative Block
     - Weekend Plans with a Friend
     - Respectful Chat with a Senior
     - Hiring an Auto-Rickshaw
     - Full Self Introduction
     - At the Medical Store (Pharmacy)
     - Finding a PG Room & Rent Inquiry
     - Library Etiquette & Inquiries
     - Weekend Movie Outing with Friends
     - Hostel Out-Pass Permission

7. **Pattern Explorer Lab**:
   - 29+ reusable sentence templates.
   - Word-by-word anatomical breakdown with grammatical roles.
   - Interactive slot generator: click any replacement item to instantly build and pronounce variations.

8. **Custom Playground Mode**:
   - Build your own decks (*"Hostel Slang"*, *"Lab Telugu"*, *"Difficult Verbs"*).
   - Instantly launches auto-generated Matching Games, Speed Rounds, and Sentence Builders using your custom cards.

---

## 🏗️ Project Architecture & Directory Structure

```text
TeluguLearning/
├── public/
│   ├── manifest.json            # Web App Manifest for mobile PWA standalone install
│   ├── icon.svg                 # Vector app icon
│   └── _redirects               # SPA routing rewrite rules for Netlify
├── src/
│   ├── types/
│   │   └── index.ts             # TypeScript definitions (VocabularyItem, SentencePattern, etc.)
│   ├── data/
│   │   ├── vocabulary.ts        # 190+ vocabulary entries mapped to Hindi bridges
│   │   ├── sentencePatterns.ts  # 29 sentence pattern formulas & slot templates
│   │   ├── practicalSentences.ts# 98 practical sentences with tokens & fill-in-blanks
│   │   ├── conversations.ts     # 15 multi-step conversational scenarios
│   │   ├── confusionPairs.ts    # 13 confusion pairs with targeted discrimination drills
│   │   └── curriculum.ts        # Stages 0–15 structure, metadata & unlock thresholds
│   ├── engine/
│   │   ├── answerNormalizer.ts  # Phonetic Roman Telugu canonicalizer & fuzzy evaluator
│   │   ├── matchingEngine.ts    # Matching game pairing, combo multiplier & scoring logic
│   │   ├── spacedRepetition.ts  # Spaced repetition engine (SRS urgency & mastery tracking)
│   │   ├── progressEngine.ts    # Level thresholds, streaks, daily goals & achievements
│   │   └── audioPlayer.ts       # Synthesizer (Web Audio API) + Web Speech API synthesis
│   ├── store/
│   │   ├── userProgress.ts      # React hook managing localStorage sync for user stats & SRS
│   │   └── playgroundStore.ts   # React hook managing custom decks & seed presets
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx       # Desktop header & mobile bottom dock navigation
│   │   │   ├── BadgeAlertModal.tsx # Celebration modal when unlocking achievements
│   │   │   └── OnboardingModal.tsx # First-time welcome walkthrough
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx    # Metric cards, active streak, daily goal & weak word alerts
│   │   ├── curriculum/
│   │   │   └── CurriculumView.tsx # Visual roadmap of all 16 stages with lesson launch
│   │   ├── patterns/
│   │   │   └── PatternExplorer.tsx # Sentence pattern explorer with mobile picker & slot generator
│   │   ├── modes/
│   │   │   ├── ModesHub.tsx     # Game selector grid
│   │   │   ├── MatchingGame.tsx # Modes A & B Telugu ↔ Hindi card match
│   │   │   ├── MultipleChoiceQuiz.tsx # Modes C & D Quizzes
│   │   │   ├── SentenceBuilder.tsx # Mode E Scrambled sentence tokens
│   │   │   ├── SpeedRound.tsx   # Mode G 45-second timed quiz
│   │   │   ├── ConfusionDrill.tsx # Mode I Discrimination drills
│   │   │   ├── FreeResponsePractice.tsx # Mode J "Think in Telugu" typed production
│   │   │   ├── ConversationPlayer.tsx # Interactive scenario chat simulator
│   │   │   └── LessonContainer.tsx # Structured step-by-step stage lesson flow
│   │   ├── playground/
│   │   │   └── PlaygroundView.tsx # Custom deck editor, manager & instant game launcher
│   │   └── analytics/
│   │       └── AnalyticsView.tsx # SRS analytics, weak/strong word rankings, JSON backup/restore
│   ├── tests/
│   │   ├── answerNormalizer.test.ts # Tests for phonetic equivalence & fuzzy matching
│   │   ├── matchingEngine.test.ts   # Tests for card pairing & combo multipliers
│   │   ├── spacedRepetition.test.ts # Tests for mastery decay & SRS urgency scoring
│   │   ├── progressEngine.test.ts   # Tests for XP curves, streaks & achievements
│   │   └── playground.test.ts       # Tests for custom decks & seed persistence
│   ├── App.tsx                  # Main application orchestrating tabs, modals & sound
│   ├── main.tsx                 # React DOM mount point
│   └── index.css                # Tailwind CSS styling, custom keyframes & scrollbars
├── index.html                   # HTML entry point with PWA meta tags & viewport settings
├── vercel.json                  # SPA routing configuration for Vercel deployment
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Vitest setup
└── package.json                 # Project dependencies & scripts
```

---

## 🛠️ How to Extend the Application (Developer Guide)

Future developers or contributors can easily add content by modifying the static data files in `src/data/`:

### 1. Adding a New Vocabulary Word
Open [`src/data/vocabulary.ts`](file:///home/ricing/Documents/code/Projects/TeluguLearning/src/data/vocabulary.ts) and append to `VOCABULARY_DATA`:
```typescript
{
  id: 'v_my_word',
  telugu: 'Kotha',               // Spoken Roman Telugu
  teluguScript: 'కొత్త',          // Native script (optional)
  hindi: 'Naya',                 // Hindi bridge equivalent
  english: 'New',                // English gloss
  stage: 3,                      // Stage number (0 to 15)
  category: 'descriptors',       // 'pronoun' | 'verb' | 'food' | 'location' | etc.
  confusedWith: ['v_paatha'],    // Optional word IDs that students confuse this with
  notes: 'Used to describe new objects: Kotha battalu (Naye kapde)'
}
```

### 2. Adding a New Sentence Pattern
Open [`src/data/sentencePatterns.ts`](file:///home/ricing/Documents/code/Projects/TeluguLearning/src/data/sentencePatterns.ts) and append to `SENTENCE_PATTERNS`:
```typescript
{
  id: 'pat_naaku_ishtam',
  pattern: 'Naaku [X] ishtam',
  hindiPattern: 'Mujhe [X] pasand hai',
  englishPattern: 'I like [X]',
  stage: 2,
  explanation: 'Use Naaku (Mujhe) whenever expressing personal taste or fondness.',
  breakdown: [
    { telugu: 'Naaku', hindi: 'Mujhe', role: 'Indirect pronoun' },
    { telugu: '[X]', hindi: '[X]', role: 'Item / Activity' },
    { telugu: 'ishtam', hindi: 'pasand hai', role: 'Predicate adjective' }
  ],
  variations: [
    { telugu: 'Naaku tea ishtam', hindi: 'Mujhe chai pasand hai', english: 'I like tea' },
    { telugu: 'Naaku cricket ishtam', hindi: 'Mujhe cricket pasand hai', english: 'I like cricket' }
  ]
}
```

### 3. Adding a Practical Sentence (with Word Tokens)
Open [`src/data/practicalSentences.ts`](file:///home/ricing/Documents/code/Projects/TeluguLearning/src/data/practicalSentences.ts) and append to `PRACTICAL_SENTENCES`:
```typescript
{
  id: 's_my_sentence',
  telugu: 'Nenu repu vastanu',
  teluguScript: 'నేను రేపు వస్తాను',
  hindi: 'Main kal aaunga',
  english: 'I will come tomorrow',
  stage: 14,
  category: 'action',
  wordTokens: ['Nenu', 'repu', 'vastanu'],           // Correct sequence for Sentence Builder
  distractorTokens: ['Naaku', 'ninna', 'veltunnanu'],// Distractor chips shown in Sentence Builder
  blankQuestion: {
    questionPromptTelugu: 'Nenu repu _____.',
    questionPromptHindi: 'Main kal aaunga.',
    correctWord: 'vastanu',
    options: ['vastanu', 'veltunnanu', 'tinnanu', 'kaavali']
  }
}
```

### 4. Adding a Conversation Scenario
Open [`src/data/conversations.ts`](file:///home/ricing/Documents/code/Projects/TeluguLearning/src/data/conversations.ts) and append to `CONVERSATION_SCENARIOS`:
```typescript
{
  id: 'sc_my_scenario',
  title: 'Ordering Juice at the Stall',
  description: 'Practice asking for fresh fruit juice and checking price.',
  category: 'canteen',
  stage: 6,
  turns: [
    {
      speaker: 'Shopkeeper',
      speakerAvatar: '🥤',
      telugu: 'Emi kaavali thammudu?',
      hindi: 'Kya chahiye chote bhai?',
      english: 'What do you want brother?',
      isUserTurn: false,
    },
    {
      speaker: 'You',
      speakerAvatar: '🧑',
      telugu: '',
      hindi: 'Mujhe mosambi juice chahiye, cheeni mat daalna.',
      english: 'I want sweet lime juice, do not add sugar.',
      isUserTurn: true,
      options: [
        {
          id: 'opt_1',
          telugu: 'Naaku mosambi juice kaavali, sugar vaddu.',
          hindi: 'Mujhe mosambi juice chahiye, cheeni nahi chahiye.',
          isCorrect: true,
          feedback: 'Perfect! "Sugar vaddu" means do not want sugar.'
        },
        {
          id: 'opt_2',
          telugu: 'Nenu juice tintunnanu.',
          hindi: 'Main juice khaa raha hoon.',
          isCorrect: false,
          feedback: 'Remember: Tintunnanu is for eating solid food, not drinking.'
        }
      ]
    }
  ]
}
```

### 5. Adding a Confusion Pair Drill
Open [`src/data/confusionPairs.ts`](file:///home/ricing/Documents/code/Projects/TeluguLearning/src/data/confusionPairs.ts) and append to `CONFUSION_PAIRS`:
```typescript
{
  id: 'pair_undu_vs_ledu',
  title: 'Undi vs Ledu (Hai vs Nahi hai)',
  teluguA: 'Undi',
  hindiA: 'Hai (Available / Present)',
  teluguB: 'Ledu',
  hindiB: 'Nahi hai (Absent / Unavailable)',
  tip: 'Undi denotes presence or availability; Ledu denotes total absence.',
  drills: [
    {
      promptHindi: 'Yahan paani hai.',
      promptEnglish: 'Water is available here.',
      contextSentenceTelugu: 'Ikkada neellu _____',
      correctChoice: 'A',
      explanation: 'Undi means "is there / available".'
    },
    {
      promptHindi: 'Hostel mein current nahi hai.',
      promptEnglish: 'There is no electricity in the hostel.',
      contextSentenceTelugu: 'Hostel lo current _____',
      correctChoice: 'B',
      explanation: 'Ledu means "not there / unavailable".'
    }
  ]
}
```

---

## 🧠 Spaced Repetition System (SRS) Mechanics

The spaced repetition algorithm in [`src/engine/spacedRepetition.ts`](file:///home/ricing/Documents/code/Projects/TeluguLearning/src/engine/spacedRepetition.ts) calculates an **urgency score** for every vocabulary item:

$$\text{Urgency} = \text{Recency Weight} + (100 - \text{Mastery}) \times 0.6 + (\text{Confusion Bias}) + (\text{Response Latency Penalty})$$

* **Mastery Score (0–100%)**: Scales up with consecutive correct answers and scales down on mistakes.
* **Top Weak Words**: Items with low accuracy and high attempt counts are automatically extracted and surfaced on the Dashboard and Analytics view with a 1-click **Drill** button.
* **Confusion Pair Tracking**: When an item is confused with its designated partner (e.g. answering `Nenu` when `Naaku` was expected), both items receive priority scheduling in subsequent practice sessions.

---

## 🌐 Free Deployment Instructions

Telugu Quest requires **no server infrastructure**, making it free to deploy anywhere.

### 1. Deploy on Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. Framework Preset: **Vite** (detected automatically).
5. Click **Deploy**.
> Note: SPA routing is already configured via [`vercel.json`](file:///home/ricing/Documents/code/Projects/TeluguLearning/vercel.json).

### 2. Deploy on Netlify
1. Sign in to [Netlify](https://netlify.com) and click **"Add new site"** → **"Import an existing project"**.
2. Select your repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy**.
> Note: Netlify SPA rewrites are already handled by [`public/_redirects`](file:///home/ricing/Documents/code/Projects/TeluguLearning/public/_redirects).

### 3. Deploy on GitHub Pages
1. In `vite.config.ts`, set `base: '/<REPO_NAME>/'`.
2. Build with `npm run build`.
3. Use `gh-pages` or a GitHub Action to deploy the `dist/` folder to the `gh-pages` branch.

---

## 🧪 Testing & Code Quality

Vitest is configured for unit testing. All tests are located in `src/tests/`:

```bash
npm test
```

| Test Suite | File | What It Covers |
| :--- | :--- | :--- |
| **Answer Normalizer** | `src/tests/answerNormalizer.test.ts` | Fuzzy string matching, canonical transliterations (`kavali` == `kaavali`, `meru` == `meeru`, `kuda` == `kooda`), punctuation and case insensitivity. |
| **Matching Engine** | `src/tests/matchingEngine.test.ts` | Telugu/Hindi card pairing, instant evaluation, combo streaks, and XP reward calculations. |
| **Spaced Repetition** | `src/tests/spacedRepetition.test.ts` | Item mastery progression, SRS urgency prioritization, and weak word extraction. |
| **Progress Engine** | `src/tests/progressEngine.test.ts` | XP-to-level curves, daily streak logic, same-day preservation, and milestone achievement unlocks. |
| **Playground Store** | `src/tests/playground.test.ts` | Custom user deck creation, mapping mutations, phrase additions, and seed dataset integrity. |

---

## 🔒 Privacy Guarantee

* **100% Client-Side**: No telemetry, analytics trackers, or third-party cookies.
* **No Account Required**: Single-user progress is completely private and saved exclusively in your browser's local storage.
* **Offline Audio**: Sound effects are generated mathematically using the browser's native Web Audio API oscillators; speech is synthesized locally via the browser's Web Speech API.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it for personal or educational purposes.

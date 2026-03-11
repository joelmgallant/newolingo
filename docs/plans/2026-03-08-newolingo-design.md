# Newolingo: Mi'kmaw Language Learning App — Design Document

**Date:** 2026-03-08
**Status:** Draft — Awaiting Review

---

## 1. Vision & Purpose

Newolingo is a mobile-first, gamified language learning app for Mi'kmaw (Mi'kmaq), modeled on Duolingo's proven learning mechanics. The app targets learners at all levels — from complete beginners to intermediate speakers seeking fluency — and serves the urgent need for Mi'kmaw language revitalization.

**Why this matters:** UNESCO classifies Mi'kmaw as "vulnerable." The percentage of children aged 0-4 learning Mi'kmaw dropped from 44% (1999) to 20% (2013). Without intervention, intergenerational transmission will collapse. Digital tools that make learning accessible, fun, and self-paced are a critical supplement to community immersion programs.

**Name:** "Newolingo" — a portmanteau referencing the Mi'kmaw language in a playful, recognizable format.

---

## 2. Target Users

| Persona | Description | Primary Goal |
|---------|-------------|-------------|
| **Heritage Learner** | Mi'kmaw community member (teen/adult) wanting to reconnect with their language | Conversational fluency, cultural connection |
| **Student** | University/school student taking Mi'kmaw courses | Supplement classroom learning, vocab drilling |
| **Curious Beginner** | Non-Indigenous person interested in learning | Basic phrases, cultural awareness |
| **Parent/Educator** | Parent or teacher wanting to learn alongside children | Model language use, support children's learning |

**Primary platform:** iOS and Android via React Native
**Secondary platform:** Web (future consideration, not MVP)

---

## 3. Linguistic Design Decisions

### 3.1 Orthography

**Primary:** Francis-Smith orthography — the standard used in Nova Scotia education, the most widely adopted, and supported by Mi'kmaw Kina'matnewey.

- Short vowels: a, e, i, o, u
- Long vowels: marked with apostrophe (a', e', i', o', u') — displayed with acute accent as fallback (á, é, í, ó, ú)
- Schwa: barred-i (ɨ, U+0268)
- Consonants: j, k, l, m, n, p, q, s, t, w + digraphs kw, qw, tl

**Secondary (toggle):** Listuguj orthography support — users can switch between Mi'kmaw (Francis-Smith) and Mi'gmaq (Listuguj) display. This is a settings toggle that maps between the two systems (primarily k↔g substitution and schwa representation).

**Special character handling:**
- Custom keyboard overlay for Mi'kmaw-specific characters (ɨ, Ɨ, apostrophe for vowel length)
- Prevent autocorrect from converting straight apostrophes to curly quotes
- All text stored in Unicode with consistent apostrophe normalization

### 3.2 Audio

Audio is non-negotiable for a polysynthetic language where pronunciation patterns are complex. Every vocabulary item and sentence must have audio.

**Audio sourcing strategy:**
- **Ideal:** Recorded audio from native Mi'kmaw speakers (multiple speakers per item to expose learners to natural variation)
- **Realistic MVP:** Integrate with existing audio from Mi'gmaq Online Talking Dictionary (mikmaqonline.org) where licensing permits, supplemented by commissioned recordings
- **Fallback:** TTS as absolute last resort for gap-filling only, clearly marked as synthetic

### 3.3 Dialect Handling

The app defaults to the Nova Scotia Mi'kmaw dialect (Francis-Smith) but acknowledges dialect variation:
- Vocabulary items flag known dialect differences (e.g., animacy of "bus" varies by community)
- Cultural notes explain regional variation without prescribing "correct" forms
- Future: community-contributed dialect packs

### 3.4 Grammar Scaffolding

Mi'kmaw is polysynthetic — single words can encode entire sentences. This requires a fundamentally different teaching approach than Duolingo uses for European languages:

- **Start with whole phrases**, not isolated words — learners hear and repeat "nmis" (my older sister) before learning the morpheme breakdown
- **Introduce animacy early** — it's a core concept that affects verb selection (VAI/VII/VTA/VTI)
- **Verb morphology is taught incrementally** — start with fixed verb forms, then introduce conjugation patterns one at a time
- **Word order is taught as flexible** — emphasize that Mi'kmaw encodes meaning in morphology, not position

---

## 4. App Architecture

### 4.1 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Mobile Framework** | React Native (Expo) | Cross-platform, large ecosystem, rapid development |
| **Language** | TypeScript | Type safety, better DX |
| **Navigation** | Expo Router (file-based) | Convention over config, deep linking |
| **State Management** | Zustand | Lightweight, simple, good for offline-first |
| **Local Storage** | SQLite (expo-sqlite) | Offline-first lesson content + progress |
| **Audio** | expo-av | Audio playback for pronunciation |
| **Animations** | React Native Reanimated + Moti | Smooth gamification animations |
| **Backend** | Supabase | Auth, PostgreSQL, real-time, storage — minimal backend work |
| **Content CMS** | Custom admin panel or Supabase Studio | Lesson content management |
| **Analytics** | PostHog (React Native SDK) | Privacy-respecting, self-hostable |
| **Testing** | Jest + React Native Testing Library | Unit & integration tests |
| **E2E Testing** | Maestro | Mobile-native E2E testing |
| **CI/CD** | EAS Build + EAS Submit | Expo's managed build/submit pipeline |

### 4.2 Offline-First Architecture

Language learners are often in areas with limited connectivity (rural/reserve communities). The app must work fully offline:

```
┌─────────────────────────────────────────────┐
│                   App Layer                  │
│  ┌──────────┐ ┌───────────┐ ┌────────────┐  │
│  │  Lessons  │ │  Progress │ │   Audio    │  │
│  │  Screen   │ │  Tracker  │ │   Player   │  │
│  └────┬─────┘ └─────┬─────┘ └─────┬──────┘  │
│       │             │             │          │
│  ┌────▼─────────────▼─────────────▼──────┐   │
│  │         Zustand Store (Runtime)       │   │
│  └────────────────┬──────────────────────┘   │
│                   │                          │
│  ┌────────────────▼──────────────────────┐   │
│  │        SQLite (Persistent)            │   │
│  │  - Lesson content (bundled)           │   │
│  │  - User progress                      │   │
│  │  - Cached audio references            │   │
│  └────────────────┬──────────────────────┘   │
│                   │ (sync when online)       │
└───────────────────┼──────────────────────────┘
                    │
            ┌───────▼───────┐
            │   Supabase    │
            │  - Auth       │
            │  - Progress   │
            │    backup     │
            │  - Content    │
            │    updates    │
            │  - Audio CDN  │
            │  - Leaderboard│
            └───────────────┘
```

**Content bundling:** Core lesson content (text, phonetic guides) ships with the app binary. Audio files are downloaded on-demand and cached locally. Content updates are pulled incrementally when online.

### 4.3 Data Model

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Course     │     │    Unit       │     │   Lesson     │
│──────────────│     │──────────────│     │──────────────│
│ id           │────▶│ id           │────▶│ id           │
│ title        │  1:N│ courseId      │  1:N│ unitId       │
│ description  │     │ title        │     │ title        │
│ level        │     │ description  │     │ type         │
│ sortOrder    │     │ sortOrder    │     │ sortOrder    │
│ icon         │     │ icon         │     │ xpReward     │
└──────────────┘     │ unlockCriteria│    └──────┬───────┘
                     └──────────────┘           │ 1:N
                                         ┌──────▼───────┐
                                         │  Exercise    │
                                         │──────────────│
                                         │ id           │
                                         │ lessonId     │
                                         │ type         │
                                         │ prompt       │
                                         │ choices      │
                                         │ correctAnswer│
                                         │ audioUrl     │
                                         │ imageUrl     │
                                         │ hint         │
                                         │ grammarNote  │
                                         │ culturalNote │
                                         │ sortOrder    │
                                         └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User       │     │  Progress    │     │   Streak     │
│──────────────│     │──────────────│     │──────────────│
│ id           │────▶│ id           │     │ id           │
│ displayName  │  1:N│ userId       │     │ userId       │
│ email        │     │ lessonId     │     │ currentStreak│
│ avatarUrl    │     │ score        │     │ longestStreak│
│ xpTotal      │     │ completed    │     │ lastPractice │
│ level        │     │ attempts     │     │ freezesLeft  │
│ createdAt    │     │ bestScore    │     └──────────────┘
│ orthoPref    │     │ completedAt  │
│ dailyGoal    │     └──────────────┘     ┌──────────────┐
│ soundEnabled │                          │  Achievement │
└──────────────┘     ┌──────────────┐     │──────────────│
                     │  WordBank    │     │ id           │
                     │──────────────│     │ userId       │
                     │ id           │     │ type         │
                     │ userId       │     │ earnedAt     │
                     │ mikmaw       │     │ title        │
                     │ english      │     │ description  │
                     │ audioUrl     │     └──────────────┘
                     │ strength     │
                     │ lastPracticed│
                     │ nextReview   │  (spaced repetition)
                     │ animacy      │  (animate/inanimate)
                     │ verbClass    │  (VAI/VII/VTA/VTI)
                     │ culturalNote │
                     └──────────────┘
```

---

## 5. Feature Design

### 5.1 Course Structure (Skill Tree)

Modeled on Duolingo's skill tree / path, adapted for Mi'kmaw:

**Course 1: Foundations (A1 equivalent)**
| Unit | Topic | Key Content |
|------|-------|-------------|
| 1 | Greetings & Introductions | Kwe' (hello), basic phrases, situating yourself |
| 2 | Family & Relationships | Kinship terms (critical in Mi'kmaw culture) |
| 3 | Numbers & Counting | Cardinal numbers 1-20, basic counting |
| 4 | Animals & Nature | Common animals, animacy introduction |
| 5 | Food & Drink | Basic food vocabulary, meal phrases |
| 6 | Body & Health | Body parts, basic health phrases |
| 7 | Colors & Descriptions | Adjective patterns, descriptive verbs |
| 8 | Weather & Seasons | 7 Mi'kmaw seasons, weather expressions |
| 9 | Daily Routines | VAI verb introduction, time expressions |
| 10 | Places & Directions | Location words, basic navigation |

**Course 2: Building Blocks (A2 equivalent)**
| Unit | Topic | Key Content |
|------|-------|-------------|
| 1 | Verb Basics | VAI/VII distinction, simple conjugation |
| 2 | Animate vs. Inanimate | Animacy system deep dive, noun classes |
| 3 | Transitive Verbs | VTA/VTI introduction |
| 4 | Questions & Answers | Question formation, conversational patterns |
| 5 | Past & Future | Temporal aspect markers |
| 6 | Home & Community | Domestic vocabulary, community life |
| 7 | Land & Water | Environmental vocabulary (culturally significant) |
| 8 | Stories & Legends | Narrative forms, storytelling conventions |
| 9 | Emotions & Opinions | Expressing feelings, polysynthetic expression |
| 10 | Review & Consolidation | Comprehensive review, conversation practice |

**Course 3: Conversational Mi'kmaw (B1 equivalent)** — future expansion.

### 5.2 Exercise Types

Each lesson contains 10-15 exercises, mixing these types:

| Exercise Type | Description | Mi'kmaw Adaptation |
|--------------|-------------|-------------------|
| **Translation (L2→L1)** | Translate Mi'kmaw to English | Whole-phrase translation, not word-by-word |
| **Translation (L1→L2)** | Translate English to Mi'kmaw | Word bank with morpheme tiles for complex words |
| **Listening** | Hear audio, select/type what was said | Critical for pronunciation patterns |
| **Speaking** | Record pronunciation, compare to native audio | Waveform comparison (not speech-to-text, which doesn't support Mi'kmaw) |
| **Matching** | Match Mi'kmaw words to English/images | Pair audio + text for reinforcement |
| **Fill in the Blank** | Complete a sentence with correct morpheme/word | Teaches morphological patterns |
| **Image Selection** | See Mi'kmaw word/phrase, select correct image | Visual vocabulary building |
| **Animacy Sort** | Sort nouns into animate/inanimate categories | Unique to Mi'kmaw — teaches core concept |
| **Verb Class ID** | Identify verb class (VAI/VII/VTA/VTI) from context | Introduced in Course 2+ |
| **Word Building** | Assemble morphemes to build polysynthetic words | Drag-and-drop morpheme tiles |
| **Cultural Context** | Short cultural note with comprehension question | Integrates culture with language |

### 5.3 Gamification System

Duolingo's gamification mechanics, adapted:

**XP (Experience Points)**
- Earn XP for completing exercises (10 XP per correct answer)
- Bonus XP for perfect lessons (no mistakes): +20 XP
- Bonus XP for speed completion: +10 XP
- Daily XP goals: 10 (casual), 20 (regular), 30 (serious), 50 (intense)

**Streaks**
- Daily streak counter for consecutive days of practice
- Streak freeze: earned through XP milestones or in-app currency
- Streak repair: one-time use after missing a day
- Weekend amulet: protects streak over weekends (earned)

**Hearts / Health System**
- 5 hearts per session
- Lose 1 heart per wrong answer
- Hearts regenerate over time (1 per hour) or via practice sessions
- Optional: "no hearts" mode for committed learners (premium or earned)

**Leaderboards**
- Weekly leagues (Bronze → Silver → Gold → Sapphire → Ruby → Emerald → Diamond)
- Compete with cohort of ~30 users
- Top 10 advance, bottom 5 drop
- Optional: community-specific leaderboards (by First Nation community)

**Achievements / Badges**
- Milestone badges: first lesson, first unit, first course
- Streak badges: 7-day, 30-day, 100-day, 365-day
- Skill badges: master specific topics
- Cultural badges: complete cultural context exercises
- Social badges: invite friends, help others

**In-App Currency ("Wampum" — working name, to be validated with community)**
- Earned through lessons, streaks, achievements
- Spend on: streak freezes, heart refills, bonus lessons, avatar customization
- No real-money purchases for MVP (avoid pay-to-win dynamics in a revitalization context)

### 5.4 Spaced Repetition System (SRS)

Built-in SRS for vocabulary retention, based on SM-2 algorithm:

- Each word in the user's WordBank has a "strength" score (0.0 → 1.0)
- Words decay over time based on difficulty and review history
- "Practice" mode surfaces weak words for review
- Visual indicator on skill tree shows which skills need review (strength bar / crack animation)
- Push notifications remind users to review decaying words

### 5.5 Cultural Integration

Language cannot be separated from culture. Every unit includes:

- **Cultural Context Cards:** Brief, respectful explanations of cultural significance (e.g., why kinship terms are taught early, the importance of the 7 seasons)
- **Story Mode:** Short traditional stories (with community permission) told in Mi'kmaw with guided comprehension
- **Community Attribution:** Every audio recording, story, and cultural note credits the speaker, elder, or community that contributed it
- **Land Acknowledgment:** App onboarding includes acknowledgment of Mi'kma'ki (traditional territory)

### 5.6 Mi'kmaw-Specific Input

**Custom Keyboard Overlay:**
- Appears above the standard keyboard during Mi'kmaw text input
- Quick-access buttons for: ɨ, Ɨ, a', e', i', o', u' (or á, é, í, ó, ú)
- Autocorrect disabled for Mi'kmaw input fields
- Smart apostrophe handling: always inserts straight apostrophe (U+0027) in Mi'kmaw context

---

## 6. Screen Flow & Navigation

### 6.1 Navigation Structure

```
Tab Bar (Bottom)
├── Home (Skill Tree)
│   ├── Course selector
│   ├── Unit nodes (locked/unlocked/completed)
│   └── Lesson entry → Exercise flow
├── Practice
│   ├── Weak words review
│   ├── Listening practice
│   ├── Speaking practice
│   └── Mistakes review
├── Dictionary
│   ├── Search (Mi'kmaw ↔ English)
│   ├── Word detail (audio, examples, animacy, verb class)
│   ├── Saved words
│   └── Browse by category
├── Leaderboard
│   ├── Weekly league
│   ├── Friends list
│   └── Community boards
└── Profile
    ├── Stats (XP, streak, level, words learned)
    ├── Achievements
    ├── Settings
    │   ├── Orthography preference (Francis-Smith / Listuguj)
    │   ├── Daily goal
    │   ├── Sound / haptics
    │   ├── Notifications
    │   └── Offline content management
    └── Account
```

### 6.2 Lesson Flow

```
Lesson Start
  │
  ├── Progress bar (top) — shows exercise count
  ├── Hearts display (top-right)
  │
  ▼
Exercise 1 of N
  │
  ├── [Correct] → success animation + XP → next exercise
  ├── [Incorrect] → shake + correct answer shown + heart lost → next exercise
  │
  ▼
  ... exercises 2-N ...
  │
  ▼
Lesson Complete Screen
  ├── XP earned (with animation)
  ├── Accuracy percentage
  ├── New words learned (added to WordBank)
  ├── Streak update
  └── [Continue] → back to skill tree (next lesson unlocked)
```

### 6.3 Key Screens

1. **Onboarding:** Language selection is just Mi'kmaw (single-language app). Brief intro to Mi'kma'ki, orthography choice, daily goal selection, optional account creation.
2. **Skill Tree:** Vertical scrolling path with unit nodes. Each node shows completion state, strength indicator. Duolingo-style winding path.
3. **Exercise Screen:** Clean, focused. Large text, prominent audio button, clear answer options. Minimal chrome to reduce distraction.
4. **Dictionary:** Searchable word bank. Each entry shows Mi'kmaw text, English translation, audio player, animacy tag, example sentences, cultural notes.
5. **Profile/Stats:** Gamification dashboard. Streak calendar, XP graph, level progress, achievement gallery.

---

## 7. Audio Architecture

### 7.1 Audio Pipeline

```
Recording (Native speakers)
  │
  ▼
Processing (normalize levels, trim silence, format to AAC)
  │
  ▼
Storage (Supabase Storage / CDN)
  │
  ▼
App (download on-demand, cache in SQLite blob or local filesystem)
  │
  ▼
Playback (expo-av, with speed controls: 0.5x, 1x)
```

### 7.2 Audio Requirements

- **Format:** AAC (.m4a), 44.1kHz, mono, ~64kbps (small files for offline caching)
- **Per vocabulary item:** At least 1 speaker recording, ideally 2-3 for variation
- **Per sentence/phrase:** 1 recording at natural speed, 1 at slow speed
- **Total estimated audio:** ~5,000-8,000 clips for MVP (Courses 1-2)
- **Storage estimate:** ~200-400 MB total, ~50 MB bundled with app, rest downloaded

### 7.3 Speaking Exercises

Since speech-to-text doesn't support Mi'kmaw:
- User records their pronunciation
- Side-by-side waveform comparison with native speaker
- Playback both recordings for self-assessment
- No automated scoring — user self-evaluates (honest approach for an unsupported language)
- Future: train a custom pronunciation model with community partnership

---

## 8. Content Pipeline

### 8.1 Content Creation Workflow

```
Curriculum Designer (linguistic expertise)
  │
  ▼
Draft lesson content (vocab, sentences, exercises, grammar notes)
  │
  ▼
Community Review (elders, speakers validate language + cultural accuracy)
  │
  ▼
Audio Recording (native speakers record vocab + sentences)
  │
  ▼
Content Entry (admin panel → Supabase)
  │
  ▼
QA Testing (exercise flow, audio playback, edge cases)
  │
  ▼
Publish (push to app via content sync)
```

### 8.2 Content Format (JSON)

```json
{
  "lesson": {
    "id": "foundations-greetings-1",
    "unitId": "foundations-greetings",
    "title": "Greetings 1",
    "exercises": [
      {
        "type": "listening",
        "prompt": "What do you hear?",
        "audioUrl": "audio/kwe.m4a",
        "choices": ["Kwe'", "Kesalk", "Wela'lin"],
        "correctAnswer": "Kwe'",
        "hint": "This is the most common greeting",
        "culturalNote": "Kwe' is used as a general greeting, similar to 'hello' in English."
      },
      {
        "type": "translation_l2_l1",
        "prompt": "Translate: Kwe', Me' tal-a-sey?",
        "audioUrl": "audio/kwe_me_tal_a_sey.m4a",
        "choices": [
          "Hello, how are you?",
          "Goodbye, see you later",
          "My name is..."
        ],
        "correctAnswer": "Hello, how are you?"
      },
      {
        "type": "animacy_sort",
        "prompt": "Sort these nouns by animacy",
        "items": [
          { "word": "lentug", "english": "deer", "animacy": "animate" },
          { "word": "wi'kuom", "english": "house", "animacy": "inanimate" },
          { "word": "ji'nm", "english": "man", "animacy": "animate" },
          { "word": "kuow", "english": "bus", "animacy": "animate", "note": "Animacy may vary by community" }
        ]
      }
    ]
  }
}
```

---

## 9. Accessibility & Inclusivity

- **Font sizing:** Dynamic type support, minimum 16pt for Mi'kmaw text
- **Color contrast:** WCAG AA minimum, dark mode support
- **Screen reader:** VoiceOver/TalkBack compatible, with audio descriptions for images
- **Reduced motion:** Respect system setting, provide static alternatives to animations
- **Age range:** Content appropriate for ages 10+ (younger learners would use a separate kids mode in future)
- **Monetization:** Free. No paywalls. No ads. Language revitalization should not be gatekept by money. Funding model is grants/donations, not user payment.

---

## 10. Privacy & Data

- **Minimal data collection:** Only what's needed for account sync and progress tracking
- **No selling data:** Ever. This is a revitalization tool, not an ad platform.
- **Audio recordings:** User speaking exercise recordings stay on-device, never uploaded
- **COPPA compliance:** If under-13 features are added, implement parental consent
- **Data sovereignty:** User data stored in Canadian data centers (Supabase supports region selection)
- **Export/delete:** Users can export or delete all their data at any time

---

## 11. Community & Attribution

### 11.1 Principles

- **Community ownership:** The app is a tool for the community. Content decisions should be guided by Mi'kmaw educators and elders.
- **Attribution always:** Every recording, story, and cultural note credits its source.
- **Open content consideration:** Language data (vocabulary, grammar rules) could be open-sourced to benefit other revitalization efforts, with community consent.
- **Feedback loop:** In-app mechanism for speakers to flag errors or suggest improvements.

### 11.2 Community Engagement (Pre-Development)

Before building, the following partnerships should be established:
- **Mi'kmaw Kina'matnewey** — primary education authority, potential co-developer
- **Mi'gmaq Online / Talking Dictionary team** — audio licensing, vocabulary alignment
- **FirstVoices** — potential data sharing, keyboard integration
- **Elder advisory council** — cultural review board for all content
- **University partners** (Dalhousie, UPEI, CBU) — linguistic review, curriculum design

---

## 12. Technical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Audio sourcing bottleneck | High — app is unusable without audio | Start with high-frequency vocabulary, partner with existing audio projects |
| Autocorrect/apostrophe corruption | Medium — breaks text display and search | Normalize all text on input, disable autocorrect in Mi'kmaw fields |
| Barred-i (ɨ) rendering | Low — some fonts don't support it | Bundle a font that includes IPA Extensions block |
| No speech-to-text for Mi'kmaw | Medium — limits speaking exercises | Use waveform comparison instead, clearly communicate limitation |
| Polysynthetic grammar doesn't fit Duolingo model | High — wrong pedagogy wastes effort | Adapt exercise types (word building, morpheme tiles), consult linguists |
| Community buy-in | Critical — app without community is empty | Establish partnerships before development, involve community in design |
| Content volume | High — need thousands of exercises | Start with 2 courses (20 units), expand iteratively |
| Offline audio storage | Medium — large download sizes | Progressive download, audio compression, user-controlled caching |

---

## 13. MVP Scope

### In Scope (v1.0)
- Course 1: Foundations (10 units, ~100 lessons, ~1,000-1,500 exercises)
- All exercise types except Word Building and Verb Class ID
- Audio for all vocabulary and sentences
- XP, streaks, hearts, daily goals
- Offline lesson content (text), on-demand audio caching
- Dictionary with search, audio, animacy tags
- User accounts with cloud progress sync
- Francis-Smith orthography (primary)
- iOS and Android via Expo

### Out of Scope (Future)
- Listuguj orthography toggle
- Leaderboards and social features
- Course 2 and beyond
- Word Building and Verb Class ID exercises
- Story mode with traditional stories
- Community contribution portal
- Web version
- Kids mode (under 10)
- Push notification reminders
- Premium/subscription features
- Custom pronunciation model

---

## 14. Success Metrics

| Metric | Target (6 months post-launch) |
|--------|------------------------------|
| Downloads | 5,000+ |
| DAU (Daily Active Users) | 500+ |
| 7-day retention | 40%+ |
| 30-day retention | 20%+ |
| Lessons completed per user per week | 5+ |
| Average streak length | 7+ days |
| Words learned per active user | 200+ |
| Community satisfaction (survey) | 4.0+ / 5.0 |
| App store rating | 4.5+ |

---

## 15. Open Questions (For Review)

1. **App name:** Is "Newolingo" culturally appropriate? Should the name be in Mi'kmaw?
2. **In-app currency name:** "Wampum" may be culturally sensitive — needs community input.
3. **Monetization:** Fully free is ideal but requires sustainable funding. Grant strategy needed.
4. **Audio licensing:** Can we partner with mikmaqonline.org for existing recordings?
5. **Orthography default:** Should Listuguj users see their orthography by default based on location?
6. **Community advisory board:** Who should be invited? What governance structure?
7. **Open source:** Should the app code be open source? What about content?
8. **Age gating:** Should there be a kids mode from the start or is 10+ sufficient for MVP?

---

## Appendix A: Mi'kmaw Orthography Quick Reference

### Francis-Smith System

**Vowels:**

| Short | Long | IPA (approx) |
|-------|------|-------------|
| a | a' (á) | /a/ → /aː/ |
| e | e' (é) | /e/ → /eː/ |
| i | i' (í) | /i/ → /iː/ |
| o | o' (ó) | /o/ → /oː/ |
| u | u' (ú) | /u/ → /uː/ |
| ɨ | — | /ə/ (schwa) |

**Consonants:**

| Letter | IPA | Notes |
|--------|-----|-------|
| j | /tʃ/ ~ /dʒ/ | Voiced between sonorants |
| k | /k/ ~ /g/ | Voiced between sonorants |
| l | /l/ | |
| m | /m/ | |
| n | /n/ | |
| p | /p/ ~ /b/ | Voiced between sonorants |
| q | /q/ ~ /ɢ/ | Uvular, voiced between sonorants |
| s | /s/ ~ /z/ | Voiced between sonorants |
| t | /t/ ~ /d/ | Voiced between sonorants |
| w | /w/ | |
| kw | /kw/ | Labialized velar |
| qw | /qw/ | Labialized uvular |
| tl | /tl/ | Lateral affricate |

### Listuguj Differences

| Francis-Smith | Listuguj | Example |
|--------------|----------|---------|
| k | g | Mi'kmaw → Mi'gmaq |
| ɨ (barred-i) | ' (apostrophe) | |
| a' (long vowel) | aa (doubled) | |

---

## Appendix B: Reference Resources

- Mi'gmaq Online Talking Dictionary: mikmaqonline.org
- Learn Mi'gmaq Online: learn.migmaq.org
- Jilaptoq Mi'kmaw Language Center: jilaptoq.ca
- FirstVoices Mi'kmaw: firstvoices.com
- Mi'kmaw Kina'matnewey: kfrancis.ca / mikmawey.ca
- The Conjugator (SayItFirst): sayitfirst.ca
- Mi'kmaw Language Act (Nova Scotia, 2022)
- Mi'kmaw Language ReVITALization Strategy (March 2025)

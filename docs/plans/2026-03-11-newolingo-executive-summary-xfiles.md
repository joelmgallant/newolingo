---
layout: default
title: "NEWOLINGO — Executive Summary"
---

# NEWOLINGO — Executive Summary

### A Mi'kmaw Language Learning App

**Classification:** ~~CLASSIFIED~~ Open Source | **Case File:** X-2026-0311-MIKMAW

---

**SCULLY:** Mulder, I've been reviewing your latest project proposal. You want to build... a Duolingo clone for Mi'kmaw?

**MULDER:** Not a clone, Scully. An adaptation. Mi'kmaw is a polysynthetic language — a single word can contain an entire sentence. You can't just slap a Duolingo skin on that. The truth is out there, and the truth is that this language needs a fundamentally different teaching approach.

**SCULLY:** Walk me through it. What are we actually building?

**MULDER:** A React Native app — Expo, TypeScript, SQLite for offline storage, Supabase on the backend. iOS and Android from day one. The architecture is offline-first because many learners are in rural and reserve communities. Lessons, vocabulary, and cached audio all live on-device. Sync when you can.

**SCULLY:** And the linguistic approach? You mentioned polysynthesis.

**MULDER:** We teach whole phrases first, not isolated words. A learner hears "nmis" — "my older sister" — as a unit before they ever see the morpheme breakdown. We introduce animacy early — Mi'kmaw classifies every noun as animate or inanimate, and it changes which verb class you use. There are four verb classes: VAI, VII, VTA, VTI. We even have a custom exercise type — Animacy Sort — where you drag nouns into categories. Scully, a bus is grammatically *alive* in some Mi'kmaw communities.

**SCULLY:** That's... actually fascinating. What about the writing system?

**MULDER:** Francis-Smith orthography is the standard — five short vowels, five long vowels marked with apostrophes, the barred-i schwa, and eleven consonants including uvular stops that don't exist in English. We bundle a custom font. We disable autocorrect. We normalize every apostrophe to prevent the curly-quote corruption that has plagued Mi'kmaw digital text for decades. There's a toggle for the Listuguj orthography used in Quebec.

**SCULLY:** Audio?

**MULDER:** Non-negotiable. Every vocabulary item, every sentence — recorded by native speakers. We partner with the Mi'gmaq Online Talking Dictionary for existing clips, commission new recordings, and cache everything locally. For speaking exercises, since no speech-to-text engine supports Mi'kmaw, we do side-by-side waveform comparison. Honest, not hacky.

**SCULLY:** Gamification. I assume there's the usual suspects?

**MULDER:** XP, daily streaks, hearts, leaderboards with weekly leagues from Bronze to Diamond, achievements, spaced repetition using SM-2. But here's where it diverges — no paywalls, no ads, no monetization whatsoever. This is a revitalization tool, Scully, not an ad platform. The funding model is grants. Canada already committed $7.1 million over five years to Mi'kmaw Kina'matnewey. Nova Scotia puts in $1.3 million annually.

**SCULLY:** MVP scope?

**MULDER:** Course 1 — "Foundations." Ten units covering greetings, family, numbers, animals, food, body, colors, the seven Mi'kmaw seasons, daily routines, and places. Roughly one hundred lessons, one thousand to fifteen hundred exercises across nine exercise types. Dictionary with search, audio playback, animacy tags. User accounts with cloud sync. Both platforms.

**SCULLY:** What's explicitly *out* of scope?

**MULDER:** Leaderboards, story mode, community contribution portal, the Listuguj toggle, Course 2, word-building exercises, web version, kids mode, push notifications. All deferred to post-MVP.

**SCULLY:** Risks?

**MULDER:** Five big ones. Audio sourcing is the bottleneck — the app is useless without it. The polysynthetic grammar doesn't map cleanly onto Duolingo's European-language pedagogy — we mitigate with custom exercise types and linguist consultation. Community buy-in is critical — we don't build without partnership with Mi'kmaw Kina'matnewey and an elder advisory council. Content volume is massive — we start with high-frequency vocabulary and expand. And offline audio storage could bloat the app — we use progressive downloads and AAC compression.

**SCULLY:** Privacy?

**MULDER:** Minimal collection. Canadian data residency. User speaking recordings never leave the device. No data sales, ever. Full export and delete capability. COPPA-compliant if we add a kids mode.

**SCULLY:** Success metrics?

**MULDER:** Five thousand downloads in six months. Five hundred daily active users. Forty percent seven-day retention. Twenty percent thirty-day retention. Two hundred words learned per active user. Four-point-five app store rating.

**SCULLY:** And the open questions?

**MULDER:** Is the name "Newolingo" culturally appropriate — should it be in Mi'kmaw instead? The working name for in-app currency is "Wampum" — that might be sensitive. Can we license audio from mikmaqonline.org? Who sits on the community advisory board? Should the code be open source?

**SCULLY:** Mulder, I have to admit — this might be one of your more grounded proposals.

**MULDER:** The truth doesn't have to be paranormal to matter, Scully. UNESCO says this language is vulnerable. Children learning it dropped from forty-four percent to twenty percent in fourteen years. If we don't build tools like this, intergenerational transmission collapses. That's not a conspiracy — it's a countdown.

**SCULLY:** Then I suppose we should get started.

**MULDER:** *Kwe', Scully.*

---

*The full technical design document is available at `docs/plans/2026-03-08-newolingo-design.md`.*

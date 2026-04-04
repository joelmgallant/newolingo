/** User-related data types — progress, streaks, achievements. */

import type { Animacy, VerbClass } from './content';

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  xpTotal: number;
  level: number;
  orthoPref: 'francis-smith' | 'listuguj';
  dailyGoal: 10 | 20 | 30 | 50;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  score: number;
  completed: boolean;
  attempts: number;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastPractice: string; // ISO date
  freezesLeft: number;
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  earnedAt: string; // ISO date
}

export interface WordBankEntry {
  id: string;
  mikmaw: string;
  english: string;
  /** SRS strength score: 0.0 (forgotten) to 1.0 (mastered) */
  strength: number;
  animacy?: Animacy;
  verbClass?: VerbClass;
  audioUrl?: string;
}

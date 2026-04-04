/**
 * User state store (Zustand).
 *
 * Holds runtime user state — profile, progress, streak, word bank.
 * Will be hydrated from SQLite on app launch and synced to Supabase
 * when online.
 */

import { create } from 'zustand';

import type { Achievement, LessonProgress, Streak, UserProfile, WordBankEntry } from '@/types/user';

interface UserState {
  /** Current user profile (null when not logged in / first launch) */
  profile: UserProfile | null;
  streak: Streak;
  progress: LessonProgress[];
  wordBank: WordBankEntry[];
  achievements: Achievement[];

  /** Actions */
  setProfile: (profile: UserProfile) => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, score: number) => void;
  addWord: (word: WordBankEntry) => void;
  updateWordStrength: (wordId: string, strength: number) => void;
}

const defaultStreak: Streak = {
  currentStreak: 0,
  longestStreak: 0,
  lastPractice: '',
  freezesLeft: 2,
};

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  streak: defaultStreak,
  progress: [],
  wordBank: [],
  achievements: [],

  setProfile: (profile) => set({ profile }),

  addXp: (amount) =>
    set((state) => {
      if (!state.profile) return state;
      const xpTotal = state.profile.xpTotal + amount;
      const level = Math.floor(xpTotal / 100) + 1;
      return {
        profile: { ...state.profile, xpTotal, level },
      };
    }),

  completeLesson: (lessonId, score) =>
    set((state) => {
      const existing = state.progress.find((p) => p.lessonId === lessonId);
      if (existing) {
        return {
          progress: state.progress.map((p) =>
            p.lessonId === lessonId
              ? { ...p, score: Math.max(p.score, score), completed: true, attempts: p.attempts + 1 }
              : p,
          ),
        };
      }
      return {
        progress: [
          ...state.progress,
          {
            id: `progress-${Date.now()}`,
            userId: state.profile?.id ?? '',
            lessonId,
            score,
            completed: true,
            attempts: 1,
          },
        ],
      };
    }),

  addWord: (word) =>
    set((state) => ({
      wordBank: [...state.wordBank, word],
    })),

  updateWordStrength: (wordId, strength) =>
    set((state) => ({
      wordBank: state.wordBank.map((w) => (w.id === wordId ? { ...w, strength } : w)),
    })),
}));

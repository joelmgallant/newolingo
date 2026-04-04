/** Content data types — mirrors the design document data model. */

export type Animacy = 'animate' | 'inanimate';
export type VerbClass = 'VAI' | 'VII' | 'VTA' | 'VTI';
export type Orthography = 'francis-smith' | 'listuguj';

export type ExerciseType =
  | 'translation_l2_l1'
  | 'translation_l1_l2'
  | 'listening'
  | 'speaking'
  | 'matching'
  | 'fill_blank'
  | 'image_selection'
  | 'animacy_sort'
  | 'verb_class_id'
  | 'word_building'
  | 'cultural_context';

export interface Course {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface Unit {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
  unlockCriteria: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  type: string;
  sortOrder: number;
  xpReward: number;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  prompt: string;
  choices?: string[];
  correctAnswer: string;
  audioUrl?: string;
  hint?: string;
  culturalNote?: string;
  /** For animacy_sort exercises */
  items?: Array<{
    word: string;
    english: string;
    animacy: Animacy;
    note?: string;
  }>;
}

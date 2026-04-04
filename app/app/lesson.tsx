import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Exercise } from '@/types/content';

// ── Sample exercises — Greetings 1 ────────────────────────────────
const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 'greet-1',
    lessonId: 'foundations-greetings-1',
    type: 'translation_l2_l1',
    prompt: "Kwe'",
    choices: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
    correctAnswer: 'Hello',
    hint: 'The most common Mi\'kmaw greeting',
    culturalNote:
      "Kwe' is a universal greeting used across all Mi'kmaw communities.",
  },
  {
    id: 'greet-2',
    lessonId: 'foundations-greetings-1',
    type: 'translation_l1_l2',
    prompt: 'How are you?',
    choices: ["Me' tal-a-sey?", "Wela'lin", "Nmultes", "App"],
    correctAnswer: "Me' tal-a-sey?",
    hint: 'A common follow-up to a greeting',
  },
  {
    id: 'greet-3',
    lessonId: 'foundations-greetings-1',
    type: 'translation_l2_l1',
    prompt: "Wela'lin",
    choices: ['Goodbye', 'Please', 'Thank you', 'Hello'],
    correctAnswer: 'Thank you',
    culturalNote:
      "Wela'lin expresses gratitude and is used widely in daily conversation.",
  },
  {
    id: 'greet-4',
    lessonId: 'foundations-greetings-1',
    type: 'translation_l1_l2',
    prompt: 'Goodbye',
    choices: ["Kwe'", "Nmultes", "Wela'lin", "Me' tal-a-sey?"],
    correctAnswer: 'Nmultes',
    hint: "Literally means 'I'll see you again'",
  },
  {
    id: 'greet-5',
    lessonId: 'foundations-greetings-1',
    type: 'translation_l2_l1',
    prompt: "Kwe', Me' tal-a-sey?",
    choices: [
      'Hello, how are you?',
      'Goodbye, see you later',
      'Thank you very much',
      'My name is...',
    ],
    correctAnswer: 'Hello, how are you?',
    culturalNote:
      "This is the most common greeting exchange. Respond with 'Weli ey' (I'm fine).",
  },
];

const HEARTS_MAX = 5;
const XP_PER_CORRECT = 10;
const XP_PERFECT_BONUS = 20;

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

/**
 * Lesson screen — interactive multiple-choice exercise flow.
 *
 * Walks the user through a set of exercises with:
 * - Progress bar tracking advancement
 * - Hearts (lives) system
 * - Selection → Check → Feedback → Continue loop
 * - Completion summary with XP, accuracy, and hearts
 */
export default function LessonScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const exercises = SAMPLE_EXERCISES;
  const totalExercises = exercises.length;

  // ── State ──────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [hearts, setHearts] = useState(HEARTS_MAX);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const exercise = exercises[currentIndex];
  const progressPercent = ((currentIndex + (answerState !== 'unanswered' ? 1 : 0)) / totalExercises) * 100;

  const promptLabel = useMemo(() => {
    if (!exercise) return '';
    if (exercise.type === 'translation_l2_l1') return 'Translate this phrase';
    if (exercise.type === 'translation_l1_l2') return "Translate to Mi'kmaw";
    return 'Choose the correct answer';
  }, [exercise]);

  // ── Handlers ───────────────────────────────────────────────────
  const handleCheck = useCallback(() => {
    if (!selectedChoice || !exercise) return;

    if (selectedChoice === exercise.correctAnswer) {
      setAnswerState('correct');
      setCorrectCount((prev) => prev + 1);
      setXpEarned((prev) => prev + XP_PER_CORRECT);
    } else {
      setAnswerState('incorrect');
      setHearts((prev) => Math.max(0, prev - 1));
    }
  }, [selectedChoice, exercise]);

  const handleContinue = useCallback(() => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= totalExercises || hearts <= 0) {
      // Lesson over — either finished all exercises or out of hearts
      if (hearts > 0 && correctCount + (answerState === 'correct' ? 0 : 0) === totalExercises) {
        // Perfect lesson bonus is calculated at completion
      }
      setIsComplete(true);
      return;
    }

    setCurrentIndex(nextIndex);
    setSelectedChoice(null);
    setAnswerState('unanswered');
  }, [currentIndex, totalExercises, hearts, correctCount, answerState]);

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  // ── Choice button styling ──────────────────────────────────────
  const getChoiceStyle = useCallback(
    (choice: string) => {
      if (answerState === 'unanswered') {
        // Selection highlight
        if (choice === selectedChoice) {
          return {
            borderColor: colors.brand,
            backgroundColor: colorScheme === 'dark' ? '#1a3a25' : '#e8f5ec',
          };
        }
        return { borderColor: colors.border, backgroundColor: 'transparent' };
      }

      // After checking — show correct/incorrect
      if (choice === exercise?.correctAnswer) {
        return {
          borderColor: colors.success,
          backgroundColor: colorScheme === 'dark' ? '#0f2a18' : '#dcfce7',
        };
      }
      if (choice === selectedChoice && answerState === 'incorrect') {
        return {
          borderColor: colors.error,
          backgroundColor: colorScheme === 'dark' ? '#2a0f0f' : '#fef2f2',
        };
      }
      return {
        borderColor: colors.border,
        backgroundColor: 'transparent',
        opacity: 0.4,
      };
    },
    [answerState, selectedChoice, exercise, colors, colorScheme],
  );

  // ── Completion summary ─────────────────────────────────────────
  if (isComplete) {
    const accuracy = Math.round((correctCount / totalExercises) * 100);
    const isPerfect = correctCount === totalExercises;
    const totalXp = xpEarned + (isPerfect ? XP_PERFECT_BONUS : 0);

    return (
      <ThemedView style={styles.container}>
        <View style={styles.summaryContent}>
          <ThemedText style={styles.summaryEmoji}>
            {hearts <= 0 ? '💔' : isPerfect ? '🌟' : '✨'}
          </ThemedText>

          <ThemedText type="title" style={styles.summaryTitle}>
            {hearts <= 0 ? 'Out of hearts!' : isPerfect ? 'Perfect!' : 'Lesson complete!'}
          </ThemedText>

          <View style={styles.summaryStats}>
            <View style={styles.statBox}>
              <ThemedText style={[styles.statValue, { color: colors.xp }]}>
                {totalXp}
              </ThemedText>
              <ThemedText style={styles.statLabel}>XP earned</ThemedText>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

            <View style={styles.statBox}>
              <ThemedText style={[styles.statValue, { color: colors.success }]}>
                {accuracy}%
              </ThemedText>
              <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

            <View style={styles.statBox}>
              <ThemedText style={[styles.statValue, { color: colors.error }]}>
                {'❤️'.repeat(hearts)}{'🖤'.repeat(HEARTS_MAX - hearts)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Hearts</ThemedText>
            </View>
          </View>

          {isPerfect && (
            <ThemedText style={[styles.bonusText, { color: colors.xp }]}>
              +{XP_PERFECT_BONUS} XP perfect bonus!
            </ThemedText>
          )}

          {exercise?.culturalNote && correctCount > 0 && (
            <View style={[styles.culturalNote, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ThemedText style={styles.culturalNoteTitle}>Cultural note</ThemedText>
              <ThemedText style={styles.culturalNoteText}>
                {exercises[totalExercises - 1]?.culturalNote ?? ''}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: colors.brand }]}
            onPress={handleClose}>
            <ThemedText style={styles.actionButtonText}>Continue</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  // ── Exercise screen ────────────────────────────────────────────
  return (
    <ThemedView style={styles.container}>
      {/* Header — progress bar + hearts + close */}
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={handleClose}>
          <ThemedText style={{ color: colors.icon, fontSize: 20, fontWeight: '700' }}>✕</ThemedText>
        </Pressable>

        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.brand, width: `${progressPercent}%` },
            ]}
          />
        </View>

        <ThemedText style={styles.heartsDisplay}>
          {'❤️'.repeat(hearts)}{'🖤'.repeat(HEARTS_MAX - hearts)}
        </ThemedText>
      </View>

      {/* Exercise area */}
      <View style={styles.exerciseArea}>
        <ThemedText type="subtitle" style={styles.instructionText}>
          {promptLabel}
        </ThemedText>

        <ThemedText style={[styles.promptText, { color: colors.brand }]}>
          {exercise?.prompt ?? ''}
        </ThemedText>

        {exercise?.hint && answerState === 'unanswered' && (
          <ThemedText style={[styles.hintText, { color: colors.icon }]}>
            💡 {exercise.hint}
          </ThemedText>
        )}

        {/* Choices */}
        <View style={styles.choices}>
          {exercise?.choices?.map((choice) => {
            const choiceStyle = getChoiceStyle(choice);
            const isDisabled = answerState !== 'unanswered';

            return (
              <Pressable
                key={choice}
                style={[styles.choiceButton, choiceStyle]}
                onPress={() => {
                  if (!isDisabled) setSelectedChoice(choice);
                }}
                disabled={isDisabled}>
                <ThemedText style={styles.choiceText}>{choice}</ThemedText>
                {answerState !== 'unanswered' && choice === exercise.correctAnswer && (
                  <ThemedText style={styles.choiceIcon}>✓</ThemedText>
                )}
                {answerState === 'incorrect' && choice === selectedChoice && (
                  <ThemedText style={styles.choiceIcon}>✕</ThemedText>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Feedback banner */}
      {answerState !== 'unanswered' && (
        <View
          style={[
            styles.feedbackBanner,
            {
              backgroundColor:
                answerState === 'correct'
                  ? colorScheme === 'dark' ? '#0f2a18' : '#dcfce7'
                  : colorScheme === 'dark' ? '#2a0f0f' : '#fef2f2',
            },
          ]}>
          <ThemedText
            style={[
              styles.feedbackTitle,
              { color: answerState === 'correct' ? colors.success : colors.error },
            ]}>
            {answerState === 'correct' ? 'Correct! 🎉' : 'Incorrect'}
          </ThemedText>

          {answerState === 'incorrect' && (
            <ThemedText style={styles.feedbackDetail}>
              Correct answer: {exercise?.correctAnswer}
            </ThemedText>
          )}

          {answerState === 'correct' && exercise?.culturalNote && (
            <ThemedText style={[styles.feedbackDetail, { color: colors.icon }]}>
              {exercise.culturalNote}
            </ThemedText>
          )}
        </View>
      )}

      {/* Footer — Check / Continue button */}
      <View style={styles.footer}>
        {answerState === 'unanswered' ? (
          <Pressable
            style={[
              styles.actionButton,
              {
                backgroundColor: selectedChoice ? colors.brand : colors.border,
              },
            ]}
            onPress={handleCheck}
            disabled={!selectedChoice}>
            <ThemedText
              style={[
                styles.actionButtonText,
                { opacity: selectedChoice ? 1 : 0.5 },
              ]}>
              Check
            </ThemedText>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.actionButton, { backgroundColor: colors.brand }]}
            onPress={handleContinue}>
            <ThemedText style={styles.actionButtonText}>Continue</ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  closeButton: {
    padding: 4,
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    borderRadius: 5,
  },
  heartsDisplay: {
    fontSize: 14,
    letterSpacing: -1,
  },

  // Exercise
  exerciseArea: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  instructionText: {
    textAlign: 'center',
  },
  promptText: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 44,
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Choices
  choices: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  choiceText: {
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
  choiceIcon: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Feedback banner
  feedbackBanner: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    gap: 4,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  feedbackDetail: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Footer
  footer: {
    paddingBottom: 40,
  },
  actionButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },

  // Summary
  summaryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  summaryEmoji: {
    fontSize: 64,
  },
  summaryTitle: {
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  statBox: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  bonusText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  culturalNote: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    width: '100%',
    gap: 4,
  },
  culturalNoteTitle: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  culturalNoteText: {
    fontSize: 15,
    lineHeight: 22,
  },
});

import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Lesson screen — full-screen exercise flow.
 *
 * This is a placeholder for the exercise engine. The real implementation will:
 * - Load exercises for the selected lesson from SQLite
 * - Render exercise components by type (translation, listening, matching, etc.)
 * - Track hearts, XP, and progress
 * - Show completion summary at the end
 */
export default function LessonScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      {/* Progress bar placeholder */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { backgroundColor: colors.brand, width: '30%' }]} />
      </View>

      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <ThemedText style={{ color: colors.icon }}>X</ThemedText>
      </Pressable>

      <View style={styles.exerciseArea}>
        <ThemedText type="subtitle">Translate this phrase</ThemedText>
        <ThemedText style={[styles.prompt, { color: colors.brand }]}>{"Kwe'"}</ThemedText>

        <View style={styles.choices}>
          {['Hello', 'Goodbye', 'Thank you'].map((choice) => (
            <Pressable
              key={choice}
              style={[styles.choiceButton, { borderColor: colors.border }]}>
              <ThemedText>{choice}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.checkButton, { backgroundColor: colors.brand }]}>
          <ThemedText style={styles.checkText}>Check</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e5e5',
    marginBottom: 16,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    padding: 8,
  },
  exerciseArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  prompt: {
    fontSize: 36,
    fontWeight: '700',
  },
  choices: {
    width: '100%',
    gap: 12,
  },
  choiceButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  footer: {
    paddingBottom: 40,
  },
  checkButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  checkText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

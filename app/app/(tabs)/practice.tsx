import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

/** Practice tab — spaced repetition review sessions */
export default function PracticeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Practice</ThemedText>
      <ThemedText style={styles.subtitle}>Review weak words and past mistakes</ThemedText>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">No words to review yet</ThemedText>
        <ThemedText style={styles.hint}>
          Complete lessons to build your word bank. Words you struggle with will appear here for
          spaced repetition practice.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  subtitle: {
    opacity: 0.6,
    marginBottom: 32,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    gap: 8,
  },
  hint: {
    opacity: 0.5,
    lineHeight: 22,
  },
});

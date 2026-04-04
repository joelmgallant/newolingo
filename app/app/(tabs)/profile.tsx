import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Profile tab — stats, achievements, settings */
export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <ThemedText style={[styles.statValue, { color: colors.xp }]}>0</ThemedText>
          <ThemedText style={styles.statLabel}>Total XP</ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={[styles.statValue, { color: colors.success }]}>0</ThemedText>
          <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={[styles.statValue, { color: colors.brand }]}>1</ThemedText>
          <ThemedText style={styles.statLabel}>Level</ThemedText>
        </View>
      </View>

      <View style={[styles.section, { borderColor: colors.border }]}>
        <ThemedText type="subtitle">Achievements</ThemedText>
        <ThemedText style={styles.hint}>Complete lessons to earn badges</ThemedText>
      </View>

      <View style={[styles.section, { borderColor: colors.border }]}>
        <ThemedText type="subtitle">Settings</ThemedText>
        <ThemedText style={styles.hint}>Orthography: Francis-Smith</ThemedText>
        <ThemedText style={styles.hint}>Daily goal: 10 XP</ThemedText>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.6,
  },
  section: {
    borderTopWidth: 1,
    paddingVertical: 20,
    gap: 8,
  },
  hint: {
    opacity: 0.5,
  },
});

import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Leaderboard tab — weekly leagues */
export default function LeaderboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Leaderboard</ThemedText>
      <ThemedText style={styles.subtitle}>Weekly leagues</ThemedText>

      <View style={[styles.leagueBadge, { backgroundColor: colors.accent + '20' }]}>
        <ThemedText style={[styles.leagueText, { color: colors.accent }]}>Bronze League</ThemedText>
      </View>

      <View style={styles.emptyState}>
        <ThemedText style={styles.emptyText}>
          Complete lessons to earn XP and climb the leaderboard. Compete with other learners in
          weekly leagues.
        </ThemedText>
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
  subtitle: {
    opacity: 0.6,
    marginBottom: 24,
  },
  leagueBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 32,
  },
  leagueText: {
    fontWeight: '700',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    lineHeight: 22,
  },
});

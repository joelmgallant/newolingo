import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Home tab — skill tree / course path */
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Wapn</ThemedText>
        <ThemedText style={{ color: colors.icon }}>{"Mi'kmaw Language"}</ThemedText>
      </View>

      <View style={styles.content}>
        <Pressable
          style={[styles.unitNode, { backgroundColor: colors.brand }]}
          onPress={() => router.push('/lesson')}>
          <ThemedText style={styles.unitEmoji}>1</ThemedText>
          <ThemedText style={styles.unitLabel}>Greetings</ThemedText>
        </Pressable>

        <View style={[styles.connector, { backgroundColor: colors.border }]} />

        <View style={[styles.unitNode, { backgroundColor: colors.border, opacity: 0.5 }]}>
          <ThemedText style={styles.unitEmoji}>2</ThemedText>
          <ThemedText style={[styles.unitLabel, { color: colors.icon }]}>Family</ThemedText>
        </View>

        <View style={[styles.connector, { backgroundColor: colors.border }]} />

        <View style={[styles.unitNode, { backgroundColor: colors.border, opacity: 0.5 }]}>
          <ThemedText style={styles.unitEmoji}>3</ThemedText>
          <ThemedText style={[styles.unitLabel, { color: colors.icon }]}>Numbers</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.placeholder}>Tap Greetings to start a lesson</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
    gap: 0,
  },
  unitNode: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitEmoji: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  unitLabel: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  connector: {
    width: 3,
    height: 24,
  },
  placeholder: {
    textAlign: 'center',
    padding: 24,
    opacity: 0.5,
  },
});

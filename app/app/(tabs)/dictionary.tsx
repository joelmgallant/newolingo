import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Dictionary tab — searchable Mi'kmaw word bank */
export default function DictionaryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Dictionary</ThemedText>
      <ThemedText style={styles.subtitle}>{"Mi'kmaw word bank"}</ThemedText>

      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Search Mi'kmaw or English..."
        placeholderTextColor={colors.icon}
      />

      <View style={styles.emptyState}>
        <ThemedText style={styles.emptyText}>
          Words you learn will appear here. Each entry includes pronunciation audio, animacy tags,
          and cultural context.
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
    marginBottom: 16,
  },
  searchInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
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

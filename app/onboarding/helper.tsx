import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { baseTheme } from '../../src/theme';

const options = [
  'Cars / fixing things',
  'Games',
  'Music / art',
  'Sports',
  'Cooking / fitness',
  'Business / money',
  'A niche rabbit hole',
  'Something I am obsessed with but do not talk about much',
];

export default function HomeTurfHelperScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What could you talk about for 10 minutes without notes</Text>
        <Text style={styles.body}>Pick anything. We can translate it into school topics later.</Text>

        <View style={styles.grid}>
          {options.map((option) => {
            const isActive = option === selected;
            return (
              <Pressable
                key={option}
                style={[
                  styles.chip,
                  isActive && styles.chipActive,
                ]}
                onPress={() => setSelected(option)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={[styles.primaryButton, !selected && styles.primaryButtonDisabled]}
          onPress={() =>
            router.push({
              pathname: '/onboarding/deep-dive',
              params: selected ? { homeTurf: selected } : {},
            })
          }
          disabled={!selected}
        >
          <Text
            style={[
              styles.primaryButtonText,
              !selected && styles.primaryButtonTextDisabled,
            ]}
          >
            Continue
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: baseTheme.colors.paper,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
    marginBottom: 10,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: baseTheme.radii.card,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    backgroundColor: baseTheme.colors.white,
  },
  chipActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#fff1d6',
  },
  chipText: {
    fontSize: 14,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  chipTextActive: {
    color: '#b45309',
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: baseTheme.radii.pill,
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    ...baseTheme.shadowSoft,
  },
  primaryButtonDisabled: {
    backgroundColor: '#ecdcc5',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: baseTheme.fonts.bodySemibold,
    letterSpacing: 0.2,
  },
  primaryButtonTextDisabled: {
    color: '#a08a6f',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
});

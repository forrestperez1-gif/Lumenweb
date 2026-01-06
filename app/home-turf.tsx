// app/home-turf.tsx
// Optional helper for users who don't know what to talk about.

import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanionStore } from '../src/stores/companionStore';
import { baseTheme } from '../src/theme';

type HomeTurf = {
  id: string;
  label: string;
  hint: string;
};

const homeTurfOptions: HomeTurf[] = [
  { id: 'cars', label: 'Cars / Fixing things', hint: 'Engines, builds, repairs, track days' },
  { id: 'games', label: 'Games', hint: 'Mechanics, strategy, competitive play' },
  { id: 'music', label: 'Music / Art', hint: 'Production, theory, technique, gear' },
  { id: 'sports', label: 'Sports', hint: 'Training, strategy, film study' },
  { id: 'cooking', label: 'Cooking / Fitness', hint: 'Technique, nutrition, programming' },
  { id: 'business', label: 'Business / Money', hint: 'Operations, growth, markets' },
  { id: 'rabbit-hole', label: 'A niche rabbit hole', hint: 'Something most people never think about' },
  { id: 'obsession', label: 'Something I obsess over', hint: 'The thing you research at 2am' },
];

export default function HomeTurfScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  // Animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeIn, slideUp]);

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleContinue = () => {
    // Pass the selected home turf to the deep-dive screen
    router.push({
      pathname: '/deep-dive' as any,
      params: { homeTurf: selected || '' },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            What could you talk about for 10 minutes without notes?
          </Text>
          <Text style={styles.subtitle}>
            Pick anything. We can translate it into "school topics" later.
          </Text>
        </View>

        <View style={styles.optionsGrid}>
          {homeTurfOptions.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.optionCard,
                selected === option.id && styles.optionCardSelected,
              ]}
              onPress={() => handleSelect(option.id)}
            >
              <Text
                style={[
                  styles.optionLabel,
                  selected === option.id && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.optionHint,
                  selected === option.id && styles.optionHintSelected,
                ]}
              >
                {option.hint}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.primaryButton,
            !selected && styles.primaryButtonDisabled,
          ]}
          onPress={handleContinue}
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

        <Pressable
          style={styles.skipButton}
          onPress={() => router.push('/deep-dive' as any)}
        >
          <Text style={styles.skipButtonText}>
            Skip, I'll figure it out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: baseTheme.colors.paper,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    lineHeight: 34,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '47%',
    backgroundColor: baseTheme.colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: baseTheme.colors.line,
  },
  optionCardSelected: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbf2',
  },
  optionLabel: {
    fontSize: 15,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.bodySemibold,
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#b45309',
  },
  optionHint: {
    fontSize: 13,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.body,
    lineHeight: 18,
  },
  optionHintSelected: {
    color: '#92400e',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: baseTheme.colors.line,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 16,
    borderRadius: baseTheme.radii.pill,
    alignItems: 'center',
    ...baseTheme.shadowSoft,
  },
  primaryButtonDisabled: {
    backgroundColor: baseTheme.colors.line,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: baseTheme.colors.white,
    fontSize: 17,
    fontFamily: baseTheme.fonts.bodySemibold,
  },
  primaryButtonTextDisabled: {
    color: baseTheme.colors.inkSoft,
  },
  skipButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: baseTheme.colors.inkSoft,
    fontSize: 15,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
});

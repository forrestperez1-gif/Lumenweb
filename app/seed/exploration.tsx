// app/seed/exploration.tsx
// Question 1: How do you like to explore ideas?

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useCompanionStore,
  ExplorationStyle,
  explorationResponses,
} from '../../src/stores/companionStore';
import { baseTheme } from '../../src/theme';

const options: { id: ExplorationStyle; label: string; hint: string }[] = [
  {
    id: 'wandering',
    label: 'Wandering',
    hint: 'I like to follow what catches my attention, even if it goes sideways.',
  },
  {
    id: 'building',
    label: 'Building',
    hint: 'I want to construct something step by step, from the ground up.',
  },
  {
    id: 'connecting',
    label: 'Connecting',
    hint: "I'm always looking for how things link to other things I know.",
  },
  {
    id: 'depends',
    label: 'Depends on the day',
    hint: 'Different moods, different approaches. I like flexibility.',
  },
];

export default function ExplorationQuestion() {
  const router = useRouter();
  const { setExplorationStyle, setOnboardingStep } = useCompanionStore();

  const [selected, setSelected] = useState<ExplorationStyle | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  // Animations
  const questionFade = useRef(new Animated.Value(0)).current;
  const questionSlide = useRef(new Animated.Value(20)).current;
  const optionsFade = useRef(new Animated.Value(0)).current;
  const responseFade = useRef(new Animated.Value(0)).current;
  const responseSlide = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(questionFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(questionSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.timing(optionsFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [questionFade, questionSlide, optionsFade]);

  const handleSelect = (option: ExplorationStyle) => {
    setSelected(option);
    setExplorationStyle(option);
    setShowResponse(true);

    // Animate the response
    Animated.parallel([
      Animated.timing(responseFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(responseSlide, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance after showing response
    setTimeout(() => {
      setOnboardingStep(2);
      router.push('/seed/learning' as any);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.background}>
        <View style={[styles.orb, styles.orbPrimary]} />
      </View>

      <View style={styles.shell}>
        <View style={styles.progress}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.questionBlock,
              {
                opacity: questionFade,
                transform: [{ translateY: questionSlide }],
              },
            ]}
          >
            <Text style={styles.stepLabel}>First</Text>
            <Text style={styles.question}>How do you like to explore ideas?</Text>
          </Animated.View>

          <Animated.View style={[styles.optionsBlock, { opacity: optionsFade }]}>
            {options.map((opt) => (
              <Pressable
                key={opt.id}
                style={[
                  styles.option,
                  selected === opt.id && styles.optionSelected,
                  selected && selected !== opt.id && styles.optionFaded,
                ]}
                onPress={() => !selected && handleSelect(opt.id)}
                disabled={!!selected}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    selected === opt.id && styles.optionLabelSelected,
                  ]}
                >
                  {opt.label}
                </Text>
                <Text
                  style={[
                    styles.optionHint,
                    selected === opt.id && styles.optionHintSelected,
                  ]}
                >
                  {opt.hint}
                </Text>
              </Pressable>
            ))}
          </Animated.View>

          {showResponse && selected && (
            <Animated.View
              style={[
                styles.responseBlock,
                {
                  opacity: responseFade,
                  transform: [{ translateY: responseSlide }],
                },
              ]}
            >
              <Text style={styles.responseText}>
                {explorationResponses[selected]}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: baseTheme.colors.paper,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbPrimary: {
    width: 300,
    height: 300,
    backgroundColor: '#ffecd0',
    opacity: 0.5,
    top: -120,
    right: -100,
  },
  shell: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 32,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: baseTheme.colors.line,
  },
  dotActive: {
    backgroundColor: '#f59e0b',
    width: 24,
  },
  content: {
    flex: 1,
    gap: 32,
  },
  questionBlock: {
    gap: 12,
  },
  stepLabel: {
    fontSize: 14,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodyMedium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  question: {
    fontSize: 28,
    lineHeight: 36,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
  },
  optionsBlock: {
    gap: 12,
  },
  option: {
    backgroundColor: baseTheme.colors.white,
    borderRadius: baseTheme.radii.card,
    padding: 18,
    borderWidth: 2,
    borderColor: baseTheme.colors.line,
    gap: 6,
  },
  optionSelected: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbf2',
  },
  optionFaded: {
    opacity: 0.4,
  },
  optionLabel: {
    fontSize: 17,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.bodySemibold,
  },
  optionLabelSelected: {
    color: '#b45309',
  },
  optionHint: {
    fontSize: 14,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
    lineHeight: 20,
  },
  optionHintSelected: {
    color: '#92400e',
  },
  responseBlock: {
    backgroundColor: '#fef7ed',
    borderRadius: baseTheme.radii.card,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
    fontStyle: 'italic',
  },
});

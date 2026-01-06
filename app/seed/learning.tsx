// app/seed/learning.tsx
// Question 2: What do you wish learning felt more like?

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
  LearningFeel,
  learningResponses,
} from '../../src/stores/companionStore';
import { baseTheme } from '../../src/theme';

const options: { id: LearningFeel; label: string; hint: string }[] = [
  {
    id: 'discovering',
    label: 'Discovering',
    hint: 'Finding something that was always there, hidden in plain sight.',
  },
  {
    id: 'creating',
    label: 'Building something mine',
    hint: 'Making something real that belongs to me, not just absorbing facts.',
  },
  {
    id: 'grounded',
    label: 'Connected to real life',
    hint: "I want to see how it matters in the actual world, not just theory.",
  },
  {
    id: 'unsure',
    label: "I'm not sure yet",
    hint: "I'll know it when I feel it. Let's find out together.",
  },
];

export default function LearningQuestion() {
  const router = useRouter();
  const { setLearningFeel, setOnboardingStep } = useCompanionStore();

  const [selected, setSelected] = useState<LearningFeel | null>(null);
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

  const handleSelect = (option: LearningFeel) => {
    setSelected(option);
    setLearningFeel(option);
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
      setOnboardingStep(3);
      router.push('/seed/relationship' as any);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.background}>
        <View style={[styles.orb, styles.orbPrimary]} />
      </View>

      <View style={styles.shell}>
        <View style={styles.progress}>
          <View style={[styles.dot, styles.dotComplete]} />
          <View style={[styles.dot, styles.dotActive]} />
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
            <Text style={styles.stepLabel}>Second</Text>
            <Text style={styles.question}>
              What do you wish learning felt more like?
            </Text>
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
                {learningResponses[selected]}
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
    width: 280,
    height: 280,
    backgroundColor: '#d0f0e8',
    opacity: 0.5,
    bottom: -100,
    left: -80,
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
    backgroundColor: '#10b981',
    width: 24,
  },
  dotComplete: {
    backgroundColor: '#f59e0b',
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
    borderColor: '#10b981',
    backgroundColor: '#f0fdf9',
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
    color: '#047857',
  },
  optionHint: {
    fontSize: 14,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
    lineHeight: 20,
  },
  optionHintSelected: {
    color: '#065f46',
  },
  responseBlock: {
    backgroundColor: '#ecfdf5',
    borderRadius: baseTheme.radii.card,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
    fontStyle: 'italic',
  },
});

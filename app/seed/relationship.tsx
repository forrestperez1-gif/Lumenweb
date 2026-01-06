// app/seed/relationship.tsx
// Question 3: How do you want me to treat you?

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
  RelationshipDynamic,
  relationshipResponses,
} from '../../src/stores/companionStore';
import { baseTheme } from '../../src/theme';

const options: { id: RelationshipDynamic; label: string; hint: string }[] = [
  {
    id: 'guide',
    label: 'Be my guide',
    hint: 'Light the way. I want direction when I need it.',
  },
  {
    id: 'coexplorer',
    label: 'Explore with me',
    hint: "Shoulder to shoulder. You don't have to have all the answers.",
  },
  {
    id: 'challenger',
    label: 'Push me',
    hint: "Treat me like your favorite student. High expectations, honest feedback.",
  },
  {
    id: 'real',
    label: 'Just be real',
    hint: 'No performance. Direct, honest, no hand-holding.',
  },
];

export default function RelationshipQuestion() {
  const router = useRouter();
  const { setRelationshipDynamic, setOnboardingStep } = useCompanionStore();

  const [selected, setSelected] = useState<RelationshipDynamic | null>(null);
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

  const handleSelect = (option: RelationshipDynamic) => {
    setSelected(option);
    setRelationshipDynamic(option);
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

    // Navigate to primer after showing response
    setTimeout(() => {
      setOnboardingStep(4);
      router.push('/seed/primer' as any);
    }, 2200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.background}>
        <View style={[styles.orb, styles.orbPrimary]} />
      </View>

      <View style={styles.shell}>
        <View style={styles.progress}>
          <View style={[styles.dot, styles.dotComplete]} />
          <View style={[styles.dot, styles.dotComplete2]} />
          <View style={[styles.dot, styles.dotActive]} />
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
            <Text style={styles.stepLabel}>Last one</Text>
            <Text style={styles.question}>How do you want me to treat you?</Text>
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
                {relationshipResponses[selected]}
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
    width: 320,
    height: 320,
    backgroundColor: '#e8e0f8',
    opacity: 0.5,
    top: -80,
    left: -100,
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
    backgroundColor: '#8b5cf6',
    width: 24,
  },
  dotComplete: {
    backgroundColor: '#f59e0b',
  },
  dotComplete2: {
    backgroundColor: '#10b981',
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
    borderColor: '#8b5cf6',
    backgroundColor: '#faf5ff',
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
    color: '#6d28d9',
  },
  optionHint: {
    fontSize: 14,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
    lineHeight: 20,
  },
  optionHintSelected: {
    color: '#5b21b6',
  },
  responseBlock: {
    backgroundColor: '#f5f3ff',
    borderRadius: baseTheme.radii.card,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
    fontStyle: 'italic',
  },
});

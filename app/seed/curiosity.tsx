// app/seed/curiosity.tsx
// The first real question: "What's something you've always been curious about?"

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanionStore } from '../../src/stores/companionStore';
import { baseTheme } from '../../src/theme';

// Placeholder prompts that cycle to help unstick thinking
const placeholders = [
  "Why do some songs get stuck in your head?",
  "How do people decide what to believe?",
  "Why does time feel different when you're bored?",
  "What makes some ideas spread and others die?",
  "How do cities grow the way they do?",
  "Why do we dream?",
  "What makes something beautiful?",
];

export default function CuriosityPrompt() {
  const router = useRouter();
  const { completeOnboarding, seedTraits } = useCompanionStore();

  const [input, setInput] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animations
  const questionFade = useRef(new Animated.Value(0)).current;
  const questionSlide = useRef(new Animated.Value(20)).current;
  const inputFade = useRef(new Animated.Value(0)).current;
  const inputSlide = useRef(new Animated.Value(16)).current;
  const helperFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(questionFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(questionSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(inputFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(inputSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(400),
      Animated.timing(helperFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [questionFade, questionSlide, inputFade, inputSlide, helperFade]);

  // Cycle placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    Keyboard.dismiss();

    // Complete onboarding with the first curiosity
    completeOnboarding(input.trim());

    // Navigate to chat with the curiosity as context
    router.replace({
      pathname: '/conversation' as any,
      params: { firstMessage: input.trim() },
    });
  };

  const canSubmit = input.trim().length > 0 && !isSubmitting;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.background}>
          <View style={[styles.orb, styles.orbWarm]} />
          <View style={[styles.orb, styles.orbCool]} />
        </View>

        <View style={styles.shell}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <View style={styles.brandCore} />
            </View>
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
              <Text style={styles.question}>
                What's something you've always been curious about?
              </Text>
              <Text style={styles.subtitle}>
                Even if you don't know how to ask it yet.
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.inputContainer,
                {
                  opacity: inputFade,
                  transform: [{ translateY: inputSlide }],
                },
                isFocused && styles.inputContainerFocused,
              ]}
            >
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder={placeholders[currentPlaceholder]}
                placeholderTextColor={baseTheme.colors.inkSoft}
                multiline
                maxLength={500}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                editable={!isSubmitting}
              />
            </Animated.View>

            <Animated.View style={[styles.helperBlock, { opacity: helperFade }]}>
              <Text style={styles.helperText}>
                There's no wrong answer here. Half-formed thoughts welcome.
              </Text>
            </Animated.View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={[
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  !canSubmit && styles.submitButtonTextDisabled,
                ]}
              >
                {isSubmitting ? "Starting..." : "Let's explore"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: baseTheme.colors.paper,
  },
  keyboardView: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.3,
  },
  orbWarm: {
    width: 300,
    height: 300,
    backgroundColor: '#ffe2b5',
    top: -140,
    right: -100,
  },
  orbCool: {
    width: 240,
    height: 240,
    backgroundColor: '#cfeee5',
    bottom: -100,
    left: -80,
  },
  shell: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 24,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  brandRow: {
    marginBottom: 24,
  },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff6e3',
  },
  brandCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f59e0b',
  },
  content: {
    flex: 1,
    gap: 24,
  },
  questionBlock: {
    gap: 12,
  },
  question: {
    fontSize: 28,
    lineHeight: 36,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
  },
  inputContainer: {
    backgroundColor: baseTheme.colors.white,
    borderRadius: baseTheme.radii.card,
    borderWidth: 2,
    borderColor: baseTheme.colors.line,
    minHeight: 140,
    padding: 16,
  },
  inputContainerFocused: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffcf7',
  },
  input: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
    textAlignVertical: 'top',
  },
  helperBlock: {
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 14,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.body,
    fontStyle: 'italic',
  },
  footer: {
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 17,
    paddingHorizontal: 28,
    borderRadius: baseTheme.radii.pill,
    alignItems: 'center',
    ...baseTheme.shadowSoft,
  },
  submitButtonDisabled: {
    backgroundColor: baseTheme.colors.line,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontFamily: baseTheme.fonts.bodySemibold,
    letterSpacing: 0.2,
  },
  submitButtonTextDisabled: {
    color: baseTheme.colors.inkSoft,
  },
});

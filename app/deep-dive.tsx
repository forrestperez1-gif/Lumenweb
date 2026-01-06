// app/deep-dive.tsx
// The "Do" phase - first real input from the user.

import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanionStore } from '../src/stores/companionStore';
import { baseTheme } from '../src/theme';

// Rotating placeholder prompts to scaffold thinking
const placeholderPrompts = [
  "Here's what I'm trying to do...",
  "Here's the part that doesn't make sense...",
  "I tried X and got Y. I expected Z.",
  "What am I missing?",
  "Here's what I know so far...",
  "This worked before, but now...",
];

// Nudge chips that help structure the input
const nudgeChips = [
  { label: 'Context:', insert: 'Context: ' },
  { label: 'Symptoms:', insert: 'Symptoms: ' },
  { label: "What I've tried:", insert: "What I've tried: " },
  { label: 'My guess:', insert: 'My guess: ' },
  { label: 'What I want:', insert: 'What I want: ' },
];

export default function DeepDiveScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ homeTurf?: string }>();
  const { completeOnboarding } = useCompanionStore();

  const [text, setText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<TextInput>(null);

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

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleNudgeChip = (insert: string) => {
    setText((prev) => {
      // Add to end with newline if there's existing text
      if (prev.trim()) {
        return prev + '\n' + insert;
      }
      return insert;
    });
    inputRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    Keyboard.dismiss();

    // Mark onboarding as complete with their first curiosity
    completeOnboarding(text.trim());

    // Navigate to conversation with the first message and home turf
    router.replace({
      pathname: '/conversation' as any,
      params: {
        firstMessage: text.trim(),
        homeTurf: params.homeTurf || '',
        showReflection: 'true', // Signal to show seed questions after first exchange
      },
    });
  };

  const canSubmit = text.trim().length > 0 && !isSubmitting;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeIn,
                transform: [{ translateY: slideUp }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                Talk to me like you're talking to someone who already gets it.
              </Text>
              <Text style={styles.subtitle}>
                Describe what you're trying to figure out, what feels weird, or what isn't working.
                In your own words.
              </Text>
            </View>

            {/* Input area */}
            <View
              style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused,
              ]}
            >
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder={placeholderPrompts[placeholderIndex]}
                placeholderTextColor={baseTheme.colors.inkSoft}
                multiline
                maxLength={2000}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                editable={!isSubmitting}
                textAlignVertical="top"
              />
            </View>

            {/* Nudge chips */}
            <View style={styles.nudgeContainer}>
              <Text style={styles.nudgeLabel}>Quick starters:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.nudgeChips}
              >
                {nudgeChips.map((chip) => (
                  <Pressable
                    key={chip.label}
                    style={styles.nudgeChip}
                    onPress={() => handleNudgeChip(chip.insert)}
                  >
                    <Text style={styles.nudgeChipText}>{chip.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Permission text */}
            <Text style={styles.permissionText}>
              Messy is good. Your own slang is good. You can swear.
            </Text>
          </Animated.View>
        </ScrollView>

        {/* Footer CTAs */}
        <View style={styles.footer}>
          <Pressable
            style={[
              styles.primaryButton,
              !canSubmit && styles.primaryButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text
              style={[
                styles.primaryButtonText,
                !canSubmit && styles.primaryButtonTextDisabled,
              ]}
            >
              {isSubmitting ? 'Sending...' : 'Talk to me'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/examples' as any)}
          >
            <Text style={styles.secondaryButtonText}>
              Show me another example
            </Text>
          </Pressable>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    flexGrow: 1,
  },
  content: {
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
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
  inputContainer: {
    backgroundColor: baseTheme.colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: baseTheme.colors.line,
    minHeight: 180,
    padding: 16,
    marginBottom: 16,
  },
  inputContainerFocused: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffcf7',
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
  },
  nudgeContainer: {
    marginBottom: 16,
  },
  nudgeLabel: {
    fontSize: 13,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodyMedium,
    marginBottom: 10,
  },
  nudgeChips: {
    flexDirection: 'row',
    gap: 8,
  },
  nudgeChip: {
    backgroundColor: baseTheme.colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
  },
  nudgeChipText: {
    fontSize: 14,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  permissionText: {
    fontSize: 13,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.body,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
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
  secondaryButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: baseTheme.colors.inkSoft,
    fontSize: 15,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
});

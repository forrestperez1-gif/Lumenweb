// app/seed/primer.tsx
// The pause before the first question. Frames the companion based on choices.

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanionStore, primerMessages } from '../../src/stores/companionStore';
import { baseTheme } from '../../src/theme';

export default function Primer() {
  const router = useRouter();
  const { seedTraits, setOnboardingStep } = useCompanionStore();

  // Get the primer message based on relationship dynamic (or default to 'real')
  const dynamic = seedTraits.relationshipDynamic || 'real';
  const primer = primerMessages[dynamic];

  // Animations
  const containerFade = useRef(new Animated.Value(0)).current;
  const messageFade = useRef(new Animated.Value(0)).current;
  const messageSlide = useRef(new Animated.Value(16)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Fade in container
      Animated.timing(containerFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(400),
      // Fade in message
      Animated.parallel([
        Animated.timing(messageFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(messageSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Hold for reading
      Animated.delay(2400),
      // Fade out everything
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to the first curiosity prompt
      setOnboardingStep(5);
      router.push('/seed/curiosity' as any);
    });
  }, [containerFade, messageFade, messageSlide, fadeOut, setOnboardingStep, router]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <Animated.View style={[styles.content, { opacity: containerFade }]}>
          <View style={styles.markContainer}>
            <View style={styles.mark}>
              <View style={styles.markCore} />
            </View>
          </View>

          <Animated.View
            style={[
              styles.messageBlock,
              {
                opacity: messageFade,
                transform: [{ translateY: messageSlide }],
              },
            ]}
          >
            <Text style={styles.message}>{primer.message}</Text>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: baseTheme.colors.ink,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  markContainer: {
    marginBottom: 40,
  },
  mark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  markCore: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#f59e0b',
  },
  messageBlock: {
    maxWidth: 400,
  },
  message: {
    fontSize: 22,
    lineHeight: 32,
    color: baseTheme.colors.paper,
    fontFamily: baseTheme.fonts.display,
    textAlign: 'center',
  },
});

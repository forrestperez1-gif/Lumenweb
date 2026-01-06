// app/welcome.tsx
// The soft entrance. Sets the metaphor, invites them in.

import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanionStore } from '../src/stores/companionStore';
import { baseTheme } from '../src/theme';

export default function Welcome() {
  const router = useRouter();
  const { hasCompletedOnboarding } = useCompanionStore();

  // Animation values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(24)).current;
  const ctaFade = useRef(new Animated.Value(0)).current;
  const ctaSlide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    // Staggered entrance
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(ctaFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(ctaSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeIn, slideUp, ctaFade, ctaSlide]);

  const handleStart = () => {
    router.push('/examples' as any);
  };

  const handleSkip = () => {
    // Skip straight to deep-dive input
    router.push('/deep-dive' as any);
  };

  // If they've already onboarded, show a different welcome
  if (hasCompletedOnboarding) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.background}>
          <View style={[styles.orb, styles.orbWarm]} />
          <View style={[styles.orb, styles.orbCool]} />
        </View>

        <View style={styles.shell}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <View style={styles.brandCore} />
            </View>
            <Text style={styles.brandText}>Lumen</Text>
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.title}>Welcome back.</Text>
            <Text style={styles.body}>
              Ready to pick up where we left off?
            </Text>
          </View>

          <View style={styles.ctaBlock}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push('/conversation' as any)}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.background}>
        <View style={[styles.orb, styles.orbWarm]} />
        <View style={[styles.orb, styles.orbCool]} />
        <View style={[styles.orb, styles.orbPeach]} />
      </View>

      <View style={styles.shell}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <View style={styles.brandCore} />
          </View>
          <Text style={styles.brandText}>Lumen</Text>
        </View>

        <Animated.View
          style={[
            styles.copyBlock,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          <Text style={styles.title}>
            Talk to me about the thing you know too much about
          </Text>
          <Text style={styles.body}>
            Use the same language you use with a friend who actually gets it.
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.ctaBlock,
            {
              opacity: ctaFade,
              transform: [{ translateY: ctaSlide }],
            },
          ]}
        >
          <Pressable style={styles.primaryButton} onPress={handleStart}>
            <Text style={styles.primaryButtonText}>Start</Text>
          </Pressable>

          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>

          <Text style={styles.footnote}>
            You don't need the right prompt. You just need your real question.
          </Text>
        </Animated.View>
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
    opacity: 0.35,
  },
  orbWarm: {
    width: 340,
    height: 340,
    backgroundColor: '#ffe2b5',
    top: -180,
    right: -140,
  },
  orbCool: {
    width: 280,
    height: 280,
    backgroundColor: '#cfeee5',
    bottom: -160,
    left: -100,
  },
  orbPeach: {
    width: 180,
    height: 180,
    backgroundColor: '#ffd6c2',
    top: 140,
    left: -60,
    opacity: 0.25,
  },
  shell: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff6e3',
  },
  brandCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f59e0b',
  },
  brandText: {
    fontSize: 20,
    color: '#d97706',
    fontFamily: baseTheme.fonts.bodyMedium,
    letterSpacing: 0.3,
  },
  copyBlock: {
    gap: 16,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
  },
  body: {
    fontSize: 17,
    lineHeight: 26,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
  },
  ctaBlock: {
    gap: 14,
    paddingBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 17,
    paddingHorizontal: 28,
    borderRadius: baseTheme.radii.pill,
    alignItems: 'center',
    ...baseTheme.shadowSoft,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontFamily: baseTheme.fonts.bodySemibold,
    letterSpacing: 0.2,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: baseTheme.colors.inkSoft,
    fontSize: 15,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  footnote: {
    textAlign: 'center',
    fontSize: 13,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.body,
  },
});

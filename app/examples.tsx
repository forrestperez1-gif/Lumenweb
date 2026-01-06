// app/examples.tsx
// The "Show" phase - demonstrate what good conversations look like.

import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseTheme } from '../src/theme';

type Category = 'cars' | 'games' | 'music' | 'work';

type ExampleExchange = {
  user: string;
  lumen: string;
};

const examples: Record<Category, ExampleExchange> = {
  cars: {
    user: "Launch is inconsistent when the track's cold. Same tire pressure, same RPM. Sometimes it hooks, sometimes it just spins. What am I missing?",
    lumen: "Let's treat this as a mix of weight transfer and surface temperature.\n\nBefore I guess, two quick checks:\n1. Are you staging the same way each time, or adjusting based on feel?\n2. What's the delta between your tire temp and track temp when it hooks vs. when it spins?\n\nI'll suggest two experiments you can try on your next run.",
  },
  games: {
    user: "On this map it feels like shots don't register when I hold tight angles. I feel like I shoot first and still lose.",
    lumen: "That's usually a mix of latency, peeker's advantage, and server tick rate.\n\nQuick checks:\n1. What's your average ping on these servers?\n2. Are you pre-aiming head level or adjusting on the peek?\n\nI'll explain it in game terms first, then show you what's happening under the hood if you want.",
  },
  music: {
    user: "I've been trying to get this vocal to sit in the mix but it either sounds buried or too forward. Compression isn't helping the way I thought it would.",
    lumen: "This is usually about frequency carving more than dynamics.\n\nBefore we dive in:\n1. What's fighting with the vocal in that 2-4k range?\n2. Are you compressing before or after EQ?\n\nLet's figure out what's masking what, then decide if it's a level problem or a space problem.",
  },
  work: {
    user: "Our funnel drop-off only happens on mobile Safari after step two. Nothing else changed. I can't isolate why.",
    lumen: "Let's brainstorm failure modes: tracking, layout regressions, caching, and cohort changes.\n\nQuick checks:\n1. Did you deploy anything to that page in the last week?\n2. Is the drop-off on all iOS versions or specific ones?\n\nI'll walk through a clean debug path once I understand the scope.",
  },
};

const categoryLabels: Record<Category, string> = {
  cars: 'Cars / Fixing things',
  games: 'Games',
  music: 'Music / Art',
  work: 'Work / Business',
};

const categoryColors: Record<Category, string> = {
  cars: '#f59e0b',
  games: '#8b5cf6',
  music: '#ec4899',
  work: '#10b981',
};

export default function ExamplesScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>('cars');

  // Animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;
  const exampleFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeIn, slideUp]);

  const handleCategoryChange = (category: Category) => {
    // Fade out, change, fade in
    Animated.timing(exampleFade, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveCategory(category);
      Animated.timing(exampleFade, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const currentExample = examples[activeCategory];
  const accentColor = categoryColors[activeCategory];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
              This is what a good conversation with me looks like.
            </Text>
            <View style={styles.principles}>
              <Text style={styles.principle}>
                You talk about your thing the way you really talk about it.
              </Text>
              <Text style={styles.principle}>
                Use your jargon. Use half-finished thoughts. Don't simplify for school.
              </Text>
              <Text style={styles.principle}>
                Ask the question you wouldn't even know how to search for.
              </Text>
            </View>
          </View>

          {/* Category tabs */}
          <View style={styles.categoryTabs}>
            {(Object.keys(examples) as Category[]).map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryTab,
                  activeCategory === cat && {
                    backgroundColor: categoryColors[cat],
                    borderColor: categoryColors[cat],
                  },
                ]}
                onPress={() => handleCategoryChange(cat)}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    activeCategory === cat && styles.categoryTabTextActive,
                  ]}
                >
                  {categoryLabels[cat]}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Example exchange */}
          <Animated.View style={[styles.exchangeContainer, { opacity: exampleFade }]}>
            {/* User message */}
            <View style={styles.messageRow}>
              <View style={styles.messageLabel}>
                <Text style={styles.messageLabelText}>You</Text>
              </View>
              <View style={[styles.userBubble, { borderColor: accentColor }]}>
                <Text style={styles.userBubbleText}>{currentExample.user}</Text>
              </View>
            </View>

            {/* Lumen response */}
            <View style={styles.messageRow}>
              <View style={styles.messageLabel}>
                <View style={[styles.lumenMark, { borderColor: accentColor }]}>
                  <View style={[styles.lumenMarkCore, { backgroundColor: accentColor }]} />
                </View>
              </View>
              <View style={styles.lumenBubble}>
                <Text style={styles.lumenBubbleText}>{currentExample.lumen}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Pattern explanation */}
          <View style={styles.patternBox}>
            <Text style={styles.patternTitle}>Notice the pattern</Text>
            <Text style={styles.patternText}>
              I mirror what you said in your language. I ask 1-2 quick checks before guessing.
              Then I explain in terms you already understand.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* CTAs */}
      <View style={styles.ctaContainer}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/deep-dive' as any)}
        >
          <Text style={styles.primaryButtonText}>Your turn</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/home-turf' as any)}
        >
          <Text style={styles.secondaryButtonText}>
            Not sure what to talk about?
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  content: {
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    lineHeight: 34,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
    marginBottom: 20,
  },
  principles: {
    gap: 8,
  },
  principle: {
    fontSize: 15,
    lineHeight: 22,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
  },
  categoryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: baseTheme.colors.line,
    backgroundColor: baseTheme.colors.white,
  },
  categoryTabText: {
    fontSize: 14,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  categoryTabTextActive: {
    color: baseTheme.colors.white,
  },
  exchangeContainer: {
    gap: 16,
    marginBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  messageLabel: {
    width: 36,
    alignItems: 'center',
    paddingTop: 12,
  },
  messageLabelText: {
    fontSize: 12,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  lumenMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: baseTheme.colors.white,
  },
  lumenMarkCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  userBubble: {
    flex: 1,
    backgroundColor: baseTheme.colors.white,
    borderRadius: 16,
    borderWidth: 2,
    padding: 14,
    borderBottomLeftRadius: 4,
  },
  userBubbleText: {
    fontSize: 15,
    lineHeight: 22,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
    fontStyle: 'italic',
  },
  lumenBubble: {
    flex: 1,
    backgroundColor: baseTheme.colors.paperDeep,
    borderRadius: 16,
    padding: 14,
    borderBottomLeftRadius: 4,
  },
  lumenBubbleText: {
    fontSize: 15,
    lineHeight: 22,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
  },
  patternBox: {
    backgroundColor: baseTheme.colors.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: baseTheme.colors.inkSoft,
  },
  patternTitle: {
    fontSize: 14,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.bodySemibold,
    marginBottom: 6,
  },
  patternText: {
    fontSize: 14,
    lineHeight: 20,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
  },
  ctaContainer: {
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
  primaryButtonText: {
    color: baseTheme.colors.white,
    fontSize: 17,
    fontFamily: baseTheme.fonts.bodySemibold,
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

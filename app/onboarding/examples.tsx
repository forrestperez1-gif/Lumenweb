import React, { useMemo, useState } from 'react';
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

type DemoCategory = {
  id: string;
  label: string;
  accent: string;
  accentDeep: string;
  accentSoft: string;
  user: string;
  lumen: string;
};

const categories: DemoCategory[] = [
  {
    id: 'cars',
    label: 'Cars / fixing things',
    accent: '#f59e0b',
    accentDeep: '#b45309',
    accentSoft: '#ffe6bf',
    user:
      "Launch is inconsistent when the track is cold. Same tire pressure, same RPM. Sometimes it hooks, sometimes it just spins. What am I missing?",
    lumen:
      "Let's treat this as a mix of weight transfer and surface temperature. I'll ask a couple of quick checks, then suggest two experiments you can try on your next run.",
  },
  {
    id: 'games',
    label: 'Games',
    accent: '#3b82f6',
    accentDeep: '#1d4ed8',
    accentSoft: '#dbeafe',
    user:
      'On this map it feels like shots do not register when I hold tight angles. I feel like I shoot first and still lose.',
    lumen:
      "That's usually a mix of latency, peekers' advantage, and server tick rate. I'll explain it in game terms first, then show you what is happening under the hood.",
  },
  {
    id: 'music',
    label: 'Music / art',
    accent: '#8b5cf6',
    accentDeep: '#6d28d9',
    accentSoft: '#ede9fe',
    user:
      'My mix feels flat even when the levels look right. The hook loses energy after the first drop. Where should I look first?',
    lumen:
      'We can check arrangement density, transient contrast, and the midrange balance. I will map two quick experiments and show you what each one would change.',
  },
  {
    id: 'work',
    label: 'Business / work',
    accent: '#10b981',
    accentDeep: '#047857',
    accentSoft: '#d1fae5',
    user:
      'Our funnel drop off only happens on mobile Safari after step two. Nothing else changed. I cannot isolate why.',
    lumen:
      'Let us brainstorm failure modes: tracking, layout regressions, caching, and cohort changes. I will walk through a clean debug path.',
  },
];

export default function ExampleConversationsScreen() {
  const router = useRouter();
  const [activeId, setActiveId] = useState(categories[0].id);

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeId) || categories[0],
    [activeId]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.background} pointerEvents="none">
        <View
          style={[
            styles.orb,
            styles.orbTop,
            { backgroundColor: activeCategory.accentSoft },
          ]}
        />
        <View
          style={[
            styles.orb,
            styles.orbBottom,
            { backgroundColor: activeCategory.accentSoft },
          ]}
        />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          This is what a good conversation with me looks like
        </Text>
        <Text style={styles.body}>
          You talk about your thing the way you really talk about it.
        </Text>
        <Text style={styles.body}>
          Use your jargon. Use half finished thoughts. Do not simplify for school.
        </Text>
        <Text style={styles.body}>Ask the question you would not even know how to search for.</Text>

        <View style={styles.toggleRow}>
          {categories.map((category) => {
            const isActive = category.id === activeId;
            return (
              <Pressable
                key={category.id}
                onPress={() => setActiveId(category.id)}
                style={[
                  styles.toggleChip,
                  isActive && {
                    borderColor: category.accent,
                    backgroundColor: category.accentSoft,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isActive && { color: category.accentDeep },
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.threadCard}>
          <View
            style={[
              styles.userBubble,
              { backgroundColor: activeCategory.accent },
            ]}
          >
            <Text style={styles.userText}>{activeCategory.user}</Text>
          </View>
          <View style={styles.lumenBubble}>
            <Text style={styles.lumenText}>{activeCategory.lumen}</Text>
          </View>
        </View>

        <Pressable
          style={[styles.primaryButton, { backgroundColor: activeCategory.accent }]}
          onPress={() =>
            router.push({
              pathname: '/onboarding/deep-dive',
              params: { homeTurf: activeCategory.label },
            })
          }
        >
          <Text style={styles.primaryButtonText}>Your turn</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/onboarding/helper')}
        >
          <Text style={styles.secondaryButtonText}>Not sure what to talk about</Text>
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
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.4,
  },
  orbTop: {
    width: 260,
    height: 260,
    top: -120,
    right: -90,
  },
  orbBottom: {
    width: 220,
    height: 220,
    bottom: -130,
    left: -70,
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
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
    marginBottom: 20,
  },
  toggleChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: baseTheme.radii.pill,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  toggleText: {
    fontSize: 13,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  threadCard: {
    padding: 18,
    borderRadius: baseTheme.radii.card,
    backgroundColor: baseTheme.colors.white,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    marginBottom: 22,
    gap: 14,
    ...baseTheme.shadowSoft,
  },
  userBubble: {
    alignSelf: 'flex-end',
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '88%',
  },
  userText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  lumenBubble: {
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: '88%',
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    backgroundColor: baseTheme.colors.white,
  },
  lumenText: {
    color: baseTheme.colors.inkMuted,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: baseTheme.fonts.body,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: baseTheme.radii.pill,
    alignItems: 'center',
    marginBottom: 12,
    ...baseTheme.shadowSoft,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: baseTheme.fonts.bodySemibold,
    letterSpacing: 0.2,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: baseTheme.colors.inkSoft,
    fontSize: 14,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
});

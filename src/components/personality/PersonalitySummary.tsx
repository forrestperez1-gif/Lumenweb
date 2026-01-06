import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PersonalityTraitKey, PersonalityOption } from '../../stores/personalityStore';
import { AccentPalette, baseTheme } from '../../theme';

type PersonalitySummaryProps = {
  traits: Record<PersonalityTraitKey, PersonalityOption | null>;
  onConfirm: () => void;
  onBack: () => void;
  palette: AccentPalette;
};

function getTraitSummary(
  key: PersonalityTraitKey,
  option: PersonalityOption | null
): string | null {
  if (!option) return null;

  const summaries: Record<string, string> = {
    warmth_high: "I'll be warm and encouraging — like a friend who's excited to help.",
    warmth_medium: "I'll be friendly but focused — approachable without overdoing it.",
    warmth_low: "I'll keep things calm and let the ideas do the talking.",
    directness_high: "When you're off track, I'll tell you straight.",
    directness_medium: "I'll be honest, but I'll ease into it.",
    directness_low: "I'll ask questions to help you find the answer yourself.",
    depth_high: "I'll go deep by default — context, connections, the whole picture.",
    depth_medium: "I'll explain enough to understand without overwhelming you.",
    depth_low: "I'll keep it short — you can always ask for more.",
    challenge_high: "I'll push your thinking regularly. Expect follow-up questions.",
    challenge_medium: "I'll challenge you when it matters, but not every time.",
    challenge_low: "I'll support your exploration and let you lead.",
    pace_fast: "We'll move quickly — I'll give you options and we'll jump around.",
    pace_medium: "We'll go at your pace — sometimes fast, sometimes slow.",
    pace_slow: "We'll take our time with each idea before moving on.",
  };

  return summaries[option.id] || option.description;
}

export function PersonalitySummary({
  traits,
  onConfirm,
  onBack,
  palette,
}: PersonalitySummaryProps) {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslate]);

  const summaries = (Object.keys(traits) as PersonalityTraitKey[])
    .map((key) => getTraitSummary(key, traits[key]))
    .filter(Boolean) as string[];

  return (
    <View style={styles.page}>
      <View style={styles.atmosphere} pointerEvents="none">
        <View
          style={[
            styles.atmoOrb,
            styles.atmoOrbTop,
            { backgroundColor: palette.mist },
          ]}
        />
        <View
          style={[
            styles.atmoOrb,
            styles.atmoOrbBottom,
            { backgroundColor: palette.accentSoft },
          ]}
        />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslate }],
          }}
        >
          <Text style={styles.heading}>You + Lumen</Text>
          <Text style={styles.subheading}>
            Here's how I'll work with you based on what you told me.
          </Text>

          <View style={[styles.summaryCard, { borderColor: palette.accentSoft }]}>
            {summaries.length > 0 ? (
              summaries.map((summary, index) => (
                <View key={index} style={styles.summaryItem}>
                  <View
                    style={[styles.bullet, { backgroundColor: palette.accent }]}
                  />
                  <Text style={styles.summaryText}>{summary}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptySummary}>
                You skipped all the questions — I'll use balanced defaults for
                now. You can always come back and tune things later.
              </Text>
            )}
          </View>

          <Text style={styles.reassurance}>
            You can change any of this anytime in settings.
          </Text>

          <View style={styles.buttonRow}>
            <Pressable style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>Go back</Text>
            </Pressable>

            <Pressable
              style={[styles.confirmButton, { backgroundColor: palette.accent }]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>Looks good, let's start</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
  },
  atmoOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.35,
  },
  atmoOrbTop: {
    width: 260,
    height: 260,
    top: -120,
    right: -90,
  },
  atmoOrbBottom: {
    width: 220,
    height: 220,
    bottom: -130,
    left: -70,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 32,
    lineHeight: 38,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: baseTheme.colors.white,
    borderRadius: baseTheme.radii.card,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
    ...baseTheme.shadowSoft,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  summaryText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
  },
  emptySummary: {
    fontSize: 15,
    lineHeight: 22,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
    fontStyle: 'italic',
  },
  reassurance: {
    fontSize: 13,
    lineHeight: 20,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.body,
    textAlign: 'center',
    marginBottom: 28,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 15,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: baseTheme.radii.pill,
    alignItems: 'center',
    ...baseTheme.shadowSoft,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: baseTheme.fonts.bodySemibold,
    letterSpacing: 0.2,
  },
});

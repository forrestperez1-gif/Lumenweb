import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { baseTheme } from '../../src/theme';

const palette = {
  accent: '#14b8a6',
  accentDeep: '#0f766e',
  accentSoft: '#ccfbf1',
  wash: '#ecfeff',
  mist: '#baf1e5',
};

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.wash }]}>
      <View style={styles.background} pointerEvents="none">
        <View
          style={[
            styles.orb,
            styles.orbTop,
            { backgroundColor: palette.mist },
          ]}
        />
        <View
          style={[
            styles.orb,
            styles.orbBottom,
            { backgroundColor: palette.accentSoft },
          ]}
        />
        <View style={styles.ring} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.kicker}>Curiosity Engine</Text>
          <View style={[styles.topicPill, { backgroundColor: palette.accentSoft }]}
          >
            <Text style={[styles.topicText, { color: palette.accentDeep }]}
            >
              Money
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Here is the question Lumen built with you</Text>
        <Text style={styles.subtitle}>
          Your sharpened question, ready to explore.
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.cardLabel}>Your question</Text>
          <Text style={styles.cardText}>
            Imagine a world where almost everyone has a clear, practical
            understanding of basics like interest, debt, investing, and risk. How
            might that change people's life choices and how companies behave?
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Quick presets</Text>
        <View style={styles.chipRow}>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Understand deeply</Text>
          </Pressable>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Apply to life</Text>
          </Pressable>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Challenge me</Text>
          </Pressable>
        </View>

        <View style={styles.controlCard}>
          <View style={[styles.iconBubble, { backgroundColor: palette.accentSoft }]}
          >
            <Text style={[styles.iconText, { color: palette.accentDeep }]}>D</Text>
          </View>
          <View style={styles.controlCopy}>
            <Text style={styles.controlTitle}>Depth and structure</Text>
            <Text style={styles.controlSubtitle}>
              How deep and technical should we go?
            </Text>
          </View>
          <View style={styles.controlIndicator}>
            <View style={[styles.controlDot, { backgroundColor: palette.accent }]} />
          </View>
        </View>

        <View style={styles.controlCard}>
          <View style={[styles.iconBubble, { backgroundColor: '#fde7c3' }]}
          >
            <Text style={[styles.iconText, { color: '#b45309' }]}>R</Text>
          </View>
          <View style={styles.controlCopy}>
            <Text style={styles.controlTitle}>Real life examples</Text>
            <Text style={styles.controlSubtitle}>
              Ground the answer with practical scenarios.
            </Text>
          </View>
          <View style={styles.controlIndicator}>
            <View style={[styles.controlDot, { backgroundColor: '#f59e0b' }]} />
          </View>
        </View>

        <Pressable
          style={[styles.primaryButton, { backgroundColor: palette.accent }]}
          onPress={() => router.push('/personality')}
        >
          <Text style={styles.primaryButtonText}>Build my question</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    width: 280,
    height: 280,
    top: -140,
    right: -90,
  },
  orbBottom: {
    width: 240,
    height: 240,
    bottom: -140,
    left: -80,
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.25)',
    top: 90,
    right: 24,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodySemibold,
  },
  topicPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: baseTheme.radii.pill,
  },
  topicText: {
    fontSize: 13,
    fontFamily: baseTheme.fonts.bodySemibold,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: baseTheme.colors.white,
    borderRadius: baseTheme.radii.card,
    padding: 18,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    marginBottom: 20,
    ...baseTheme.shadowSoft,
  },
  cardLabel: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodySemibold,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
  },
  sectionLabel: {
    fontSize: 13,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodySemibold,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: baseTheme.radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
  },
  chipText: {
    fontSize: 13,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  controlCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: baseTheme.radii.card,
    backgroundColor: baseTheme.colors.white,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    marginBottom: 14,
    ...baseTheme.shadowSoft,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    fontFamily: baseTheme.fonts.bodySemibold,
  },
  controlCopy: {
    flex: 1,
  },
  controlTitle: {
    fontSize: 15,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.bodySemibold,
    marginBottom: 4,
  },
  controlSubtitle: {
    fontSize: 13,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
  },
  controlIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: baseTheme.colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  primaryButton: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: baseTheme.radii.pill,
    alignItems: 'center',
    ...baseTheme.shadowSoft,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: baseTheme.fonts.bodySemibold,
    letterSpacing: 0.2,
  },
});

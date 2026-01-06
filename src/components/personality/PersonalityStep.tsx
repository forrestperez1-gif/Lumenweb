import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PersonalityOption } from '../../stores/personalityStore';
import { AccentPalette, baseTheme } from '../../theme';
import { OptionCard } from './OptionCard';

type ExampleResponse = {
  optionId: string;
  text: string;
};

type PersonalityStepProps = {
  title: string;
  subtitle?: string;
  examplePrompt: {
    user: string;
    responses: ExampleResponse[];
  };
  options: PersonalityOption[];
  selectedOptionId?: string;
  onSelect: (option: PersonalityOption) => void;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  currentStep: number;
  totalSteps: number;
  palette: AccentPalette;
};

export function PersonalityStep({
  title,
  subtitle,
  examplePrompt,
  options,
  selectedOptionId,
  onSelect,
  onNext,
  onBack,
  onSkip,
  currentStep,
  totalSteps,
  palette,
}: PersonalityStepProps) {
  const [previewOptionId, setPreviewOptionId] = useState<string>(
    selectedOptionId || options[0]?.id
  );

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(12)).current;
  const optionAnimations = useMemo(
    () => options.map(() => new Animated.Value(0)),
    [options]
  );

  useEffect(() => {
    if (selectedOptionId) {
      setPreviewOptionId(selectedOptionId);
      return;
    }
    if (options[0]) {
      setPreviewOptionId(options[0].id);
    }
  }, [options, selectedOptionId]);

  useEffect(() => {
    contentOpacity.setValue(0);
    contentTranslate.setValue(12);
    optionAnimations.forEach((anim) => anim.setValue(0));

    Animated.sequence([
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslate, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(
        70,
        optionAnimations.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 240,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, [currentStep, contentOpacity, contentTranslate, optionAnimations]);

  const activeResponse = examplePrompt.responses.find(
    (response) => response.optionId === previewOptionId
  );

  const handleOptionPress = (option: PersonalityOption) => {
    setPreviewOptionId(option.id);
    onSelect(option);
  };

  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

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
          <View style={styles.progressRow}>
            <View
              style={[styles.progressPill, { backgroundColor: palette.accentSoft }]}
            >
              <View
                style={[styles.progressDot, { backgroundColor: palette.accent }]}
              />
              <Text
                style={[
                  styles.progressText,
                  { color: palette.accentDeep },
                ]}
              >
                Step {currentStep + 1} of {totalSteps}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%`, backgroundColor: palette.accent },
                ]}
              />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          <View style={[styles.exampleCard, { borderColor: palette.accentSoft }]}>
            <View style={styles.exampleHeader}>
              <View
                style={[
                  styles.exampleTag,
                  { backgroundColor: palette.accentSoft },
                ]}
              >
                <Text
                  style={[styles.exampleLabel, { color: palette.accentDeep }]}
                >
                  Example
                </Text>
              </View>
            </View>

            <View style={[styles.userBubble, { backgroundColor: palette.accent }]}
            >
              <Text style={styles.userBubbleText}>{examplePrompt.user}</Text>
            </View>

            {activeResponse && (
              <View style={styles.lumenBubble}>
                <Text style={styles.lumenBubbleText}>{activeResponse.text}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <Animated.View
              key={option.id}
              style={{
                opacity: optionAnimations[index],
                transform: [
                  {
                    translateY: optionAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              }}
            >
              <OptionCard
                label={option.label}
                description={option.description}
                isSelected={selectedOptionId === option.id}
                onPress={() => handleOptionPress(option)}
                accent={palette.accent}
                accentDeep={palette.accentDeep}
                accentSoft={palette.accentSoft}
              />
            </Animated.View>
          ))}
        </View>

        <View style={styles.buttonRow}>
          {onBack && (
            <Pressable style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          )}

          {onSkip && !selectedOptionId && (
            <Pressable style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.nextButton,
              { backgroundColor: palette.accent },
              !selectedOptionId && styles.nextButtonDisabled,
            ]}
            onPress={onNext}
            disabled={!selectedOptionId}
          >
            <Text
              style={[
                styles.nextButtonText,
                !selectedOptionId && styles.nextButtonTextDisabled,
              ]}
            >
              Next
            </Text>
          </Pressable>
        </View>
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
    maxWidth: 640,
    alignSelf: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: baseTheme.radii.pill,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  progressText: {
    fontSize: 13,
    fontFamily: baseTheme.fonts.bodySemibold,
    letterSpacing: 0.3,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: baseTheme.colors.line,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
    marginBottom: 18,
  },
  exampleCard: {
    backgroundColor: baseTheme.colors.white,
    borderRadius: baseTheme.radii.card,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
    ...baseTheme.shadowSoft,
  },
  exampleHeader: {
    marginBottom: 12,
  },
  exampleTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: baseTheme.radii.pill,
  },
  exampleLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: baseTheme.fonts.bodySemibold,
  },
  userBubble: {
    alignSelf: 'flex-end',
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '88%',
    marginBottom: 12,
  },
  userBubbleText: {
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
  lumenBubbleText: {
    color: baseTheme.colors.inkMuted,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: baseTheme.fonts.body,
  },
  optionsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 15,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 'auto',
  },
  skipButtonText: {
    fontSize: 14,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.body,
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: baseTheme.radii.pill,
    ...baseTheme.shadowSoft,
  },
  nextButtonDisabled: {
    backgroundColor: '#e7e0d2',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: baseTheme.fonts.bodySemibold,
    letterSpacing: 0.2,
  },
  nextButtonTextDisabled: {
    color: '#9a8d7f',
  },
});

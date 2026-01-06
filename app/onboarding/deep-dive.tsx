import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { baseTheme } from '../../src/theme';
import { usePersonalityStore } from '../../src/stores/personalityStore';
import { sendChat } from '../../src/lib/chatClient';

const placeholders = [
  'Here is what I am trying to do...',
  'Here is the part that does not make sense...',
  'I tried X and got Y. I expected Z.',
  'What am I missing?',
];

const nudgeChips = [
  'Context:',
  'Symptoms:',
  'What I have tried:',
  'My guess:',
  'What I want:',
  'Question: What am I missing?',
];

const styleOptions = [
  {
    id: 'co-driver',
    title: 'Co driver',
    description: 'Be direct and decisive; help me make choices.',
  },
  {
    id: 'pit-crew',
    title: 'Pit crew',
    description: 'Give me step by step checklists and sanity checks.',
  },
  {
    id: 'professor',
    title: 'Professor',
    description: 'Connect this to underlying concepts and teach as we go.',
  },
];

export default function DeepDiveInputScreen() {
  const router = useRouter();
  const { homeTurf } = useLocalSearchParams<{ homeTurf?: string | string[] }>();
  const { completeOnboarding } = usePersonalityStore();
  const [text, setText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const homeTurfLabel = Array.isArray(homeTurf) ? homeTurf[0] : homeTurf;
  const canSend = text.trim().length > 0;
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % placeholders.length);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const placeholder = useMemo(() => placeholders[placeholderIndex], [placeholderIndex]);

  const appendNudge = (label: string) => {
    setText((current) => {
      const trimmed = current.trim();
      if (!trimmed) {
        return `${label} `;
      }
      return `${current} ${label} `;
    });
  };

  const handleSend = async () => {
    if (!canSend) {
      return;
    }

    setSendError(null);
    setIsSending(true);

    try {
      const response = await sendChat({
        message: text.trim(),
        homeTurf: homeTurfLabel || null,
        style: selectedStyle,
      });

      // Mark onboarding complete and show the first exchange.
      completeOnboarding();
      router.replace({
        pathname: '/chat' as any,
        params: {
          message: text.trim(),
          reply: response.reply,
          homeTurf: homeTurfLabel || '',
          style: selectedStyle || '',
        },
      });
    } catch (err: any) {
      setSendError(err?.message || 'Failed to send. Try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleFinish = () => {
    completeOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            Talk to me like you are talking to someone who already gets it
          </Text>
          {homeTurfLabel && (
            <View style={styles.topicPill}>
              <Text style={styles.topicText}>{homeTurfLabel}</Text>
            </View>
          )}
        </View>

        <Text style={styles.body}>
          Describe what you are trying to figure out, what feels weird, or what is not working, in your own words.
        </Text>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor={baseTheme.colors.inkSoft}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.nudgeRow}>
          {nudgeChips.map((chip) => (
            <Pressable key={chip} style={styles.nudgeChip} onPress={() => appendNudge(chip)}>
              <Text style={styles.nudgeText}>{chip}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.permissionText}>
          Messy is good. Your own slang is good. You can swear.
        </Text>

        <Pressable
          style={[
            styles.primaryButton,
            (!canSend || isSending) && styles.primaryButtonDisabled,
          ]}
          onPress={() => setShowStylePicker(true)}
          disabled={!canSend || isSending}
        >
          <Text
            style={[
              styles.primaryButtonText,
              (!canSend || isSending) && styles.primaryButtonTextDisabled,
            ]}
          >
            {isSending ? 'Sending…' : 'Send'}
          </Text>
        </Pressable>

        {sendError ? <Text style={styles.errorText}>{sendError}</Text> : null}

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/onboarding/examples')}
        >
          <Text style={styles.secondaryButtonText}>Show me another example</Text>
        </Pressable>
      </ScrollView>

      <Modal
        transparent
        visible={showStylePicker}
        animationType="fade"
        onRequestClose={() => {
          setShowStylePicker(false);
          handleFinish();
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>How do you want me to ride along</Text>
            {styleOptions.map((option) => {
              const isActive = option.id === selectedStyle;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.modalOption, isActive && styles.modalOptionActive]}
                  onPress={() => setSelectedStyle(option.id)}
                >
                  <Text style={[styles.modalOptionTitle, isActive && styles.modalOptionTitleActive]}>
                    {option.title}
                  </Text>
                  <Text style={styles.modalOptionText}>{option.description}</Text>
                </Pressable>
              );
            })}

            <Text style={styles.modalFooter}>You can change this anytime in settings.</Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalSecondaryButton}
                onPress={() => {
                  setShowStylePicker(false);
                  handleFinish();
                }}
              >
                <Text style={styles.modalSecondaryText}>Skip</Text>
              </Pressable>
              <Pressable
                style={styles.modalPrimaryButton}
                onPress={async () => {
                  setShowStylePicker(false);
                  await handleSend();
                }}
              >
                <Text style={styles.modalPrimaryText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: baseTheme.colors.paper,
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
    marginBottom: 14,
    gap: 10,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
  },
  topicPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: baseTheme.radii.pill,
    backgroundColor: '#fff1d6',
  },
  topicText: {
    fontSize: 13,
    color: '#b45309',
    fontFamily: baseTheme.fonts.bodySemibold,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
    marginBottom: 16,
  },
  inputCard: {
    borderRadius: baseTheme.radii.card,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    backgroundColor: baseTheme.colors.white,
    minHeight: 200,
    padding: 16,
    ...baseTheme.shadowSoft,
  },
  input: {
    fontSize: 15,
    lineHeight: 22,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
    minHeight: 160,
  },
  nudgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
    marginBottom: 12,
  },
  nudgeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: baseTheme.radii.pill,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  nudgeText: {
    fontSize: 12,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  permissionText: {
    fontSize: 12,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.body,
    marginBottom: 18,
  },
  errorText: {
    marginTop: 8,
    color: '#b45309',
    fontSize: 13,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: baseTheme.radii.pill,
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    ...baseTheme.shadowSoft,
  },
  primaryButtonDisabled: {
    backgroundColor: '#ecdcc5',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: baseTheme.fonts.bodySemibold,
    letterSpacing: 0.2,
  },
  primaryButtonTextDisabled: {
    color: '#a08a6f',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 16, 10, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: baseTheme.colors.white,
    borderRadius: baseTheme.radii.card,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
  },
  modalOption: {
    padding: 14,
    borderRadius: baseTheme.radii.card,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    backgroundColor: baseTheme.colors.paper,
  },
  modalOptionActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#fff1d6',
  },
  modalOptionTitle: {
    fontSize: 15,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.bodySemibold,
    marginBottom: 6,
  },
  modalOptionTitleActive: {
    color: '#b45309',
  },
  modalOptionText: {
    fontSize: 13,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
  },
  modalFooter: {
    fontSize: 12,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.body,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 6,
  },
  modalSecondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: baseTheme.radii.pill,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    alignItems: 'center',
  },
  modalSecondaryText: {
    fontSize: 14,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  modalPrimaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: baseTheme.radii.pill,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
  },
  modalPrimaryText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: baseTheme.fonts.bodySemibold,
  },
});

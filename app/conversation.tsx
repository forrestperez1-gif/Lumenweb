// app/conversation.tsx
// The conversation screen - where curiosity meets thinking partner.
// After the first exchange, shows reflection questions to shape the relationship.

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useCompanionStore,
  RelationshipDynamic,
  relationshipResponses,
} from '../src/stores/companionStore';
import { sendChat } from '../src/lib/chatClient';
import { baseTheme } from '../src/theme';

type Message = {
  id: string;
  role: 'user' | 'companion';
  content: string;
};

// Relationship options for the post-exchange reflection
const relationshipOptions: {
  id: RelationshipDynamic;
  label: string;
  description: string;
}[] = [
  {
    id: 'guide',
    label: 'Be my guide',
    description: 'Light the path. Help me find direction when I need it.',
  },
  {
    id: 'coexplorer',
    label: 'Explore with me',
    description: "Shoulder to shoulder. You don't have to have all the answers.",
  },
  {
    id: 'challenger',
    label: 'Push me',
    description: 'High expectations. Honest feedback. Make me think harder.',
  },
  {
    id: 'real',
    label: 'Just be real',
    description: 'No performance. Direct and honest, no hand-holding.',
  },
];

export default function Conversation() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    firstMessage?: string;
    homeTurf?: string;
    showReflection?: string;
  }>();
  const {
    seedTraits,
    firstCuriosity,
    setRelationshipDynamic,
    hasCompletedOnboarding,
  } = useCompanionStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Reflection modal state
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [hasShownReflection, setHasShownReflection] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Animations
  const containerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(containerFade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [containerFade]);

  // Handle initial message (from onboarding or stored)
  useEffect(() => {
    const initialMessage = params.firstMessage || firstCuriosity;

    if (initialMessage && !isInitialized) {
      setIsInitialized(true);
      handleInitialMessage(initialMessage);
    }
  }, [params.firstMessage, firstCuriosity, isInitialized]);

  const handleInitialMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    };

    setMessages([userMessage]);
    setIsLoading(true);

    try {
      const response = await sendChat({
        message,
        seedTraits,
        homeTurf: params.homeTurf || null,
      });

      const companionMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'companion',
        content: response.reply,
      };

      setMessages((prev) => [...prev, companionMessage]);

      // Show reflection modal after first exchange if flagged
      if (params.showReflection === 'true' && !hasShownReflection) {
        setTimeout(() => {
          setShowReflectionModal(true);
          setHasShownReflection(true);
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'companion',
        content: "Something went wrong on my end. Let's try that again?",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    Keyboard.dismiss();

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await sendChat({
        message: input.trim(),
        seedTraits,
      });

      const companionMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'companion',
        content: response.reply,
      };

      setMessages((prev) => [...prev, companionMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'companion',
        content: "Something went wrong on my end. Let's try that again?",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSelectRelationship = (dynamic: RelationshipDynamic) => {
    setRelationshipDynamic(dynamic);
    setShowReflectionModal(false);
  };

  const handleSkipReflection = () => {
    setShowReflectionModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View style={[styles.container, { opacity: containerFade }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <View style={styles.brandCore} />
              </View>
              <Text style={styles.brandText}>Lumen</Text>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  message.role === 'user' && styles.messageRowUser,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.role === 'user'
                      ? styles.messageBubbleUser
                      : styles.messageBubbleCompanion,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.role === 'user' && styles.messageTextUser,
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
              </View>
            ))}

            {isLoading && (
              <View style={styles.messageRow}>
                <View style={[styles.messageBubble, styles.messageBubbleCompanion]}>
                  <View style={styles.loadingDots}>
                    <View style={styles.loadingDot} />
                    <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
                    <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Continue the conversation..."
                placeholderTextColor={baseTheme.colors.inkSoft}
                multiline
                maxLength={2000}
                editable={!isLoading}
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
              <Pressable
                style={[
                  styles.sendButton,
                  (!input.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Text
                  style={[
                    styles.sendButtonText,
                    (!input.trim() || isLoading) && styles.sendButtonTextDisabled,
                  ]}
                >
                  Send
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Reflection Modal */}
      <Modal
        visible={showReflectionModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleSkipReflection}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                How do you want me to ride along?
              </Text>
              <Text style={styles.modalSubtitle}>
                Now that you've felt what this is like, how should we work together?
              </Text>
            </View>

            <View style={styles.modalOptions}>
              {relationshipOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={styles.modalOption}
                  onPress={() => handleSelectRelationship(option.id)}
                >
                  <Text style={styles.modalOptionLabel}>{option.label}</Text>
                  <Text style={styles.modalOptionDescription}>
                    {option.description}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <Pressable style={styles.skipButton} onPress={handleSkipReflection}>
                <Text style={styles.skipButtonText}>
                  Skip, we can figure it out as we go
                </Text>
              </Pressable>
              <Text style={styles.modalFootnote}>
                You can change this anytime in settings.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: baseTheme.colors.line,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff6e3',
  },
  brandCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
  },
  brandText: {
    fontSize: 18,
    color: '#d97706',
    fontFamily: baseTheme.fonts.bodyMedium,
    letterSpacing: 0.3,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubbleUser: {
    backgroundColor: '#f59e0b',
    borderBottomRightRadius: 4,
  },
  messageBubbleCompanion: {
    backgroundColor: baseTheme.colors.white,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
  },
  messageTextUser: {
    color: '#ffffff',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: baseTheme.colors.inkSoft,
    opacity: 0.4,
  },
  loadingDotDelay1: {
    opacity: 0.6,
  },
  loadingDotDelay2: {
    opacity: 0.8,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: baseTheme.colors.line,
    backgroundColor: baseTheme.colors.paper,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    backgroundColor: baseTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.body,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
  },
  sendButtonDisabled: {
    backgroundColor: baseTheme.colors.line,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: baseTheme.fonts.bodySemibold,
  },
  sendButtonTextDisabled: {
    color: baseTheme.colors.inkSoft,
  },
  // Modal styles
  modalSafeArea: {
    flex: 1,
    backgroundColor: baseTheme.colors.paper,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  modalHeader: {
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 28,
    lineHeight: 36,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
  },
  modalOptions: {
    gap: 12,
    flex: 1,
  },
  modalOption: {
    backgroundColor: baseTheme.colors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: baseTheme.colors.line,
  },
  modalOptionLabel: {
    fontSize: 17,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.bodySemibold,
    marginBottom: 4,
  },
  modalOptionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: baseTheme.colors.inkMuted,
    fontFamily: baseTheme.fonts.body,
  },
  modalFooter: {
    paddingTop: 24,
    gap: 12,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  modalFootnote: {
    fontSize: 13,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.body,
    textAlign: 'center',
  },
});

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { baseTheme } from '../src/theme';

export default function ChatScreen() {
  const router = useRouter();
  const { message, reply, homeTurf, style } = useLocalSearchParams<{
    message?: string;
    reply?: string;
    homeTurf?: string;
    style?: string;
  }>();

  const userMessage = Array.isArray(message) ? message[0] : message;
  const assistantReply = Array.isArray(reply) ? reply[0] : reply;
  const homeTurfLabel = Array.isArray(homeTurf) ? homeTurf[0] : homeTurf;
  const styleLabel = Array.isArray(style) ? style[0] : style;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Your conversation</Text>
          <View style={styles.metaRow}>
            {homeTurfLabel ? (
              <View style={styles.metaPill}>
                <Text style={styles.metaText}>{homeTurfLabel}</Text>
              </View>
            ) : null}
            {styleLabel ? (
              <View style={styles.metaPill}>
                <Text style={styles.metaText}>{styleLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.threadCard}>
          {userMessage ? (
            <View style={[styles.bubble, styles.userBubble]}>
              <Text style={styles.userText}>{userMessage}</Text>
            </View>
          ) : null}
          {assistantReply ? (
            <View style={[styles.bubble, styles.lumenBubble]}>
              <Text style={styles.lumenText}>{assistantReply}</Text>
            </View>
          ) : (
            <Text style={styles.placeholder}>No reply yet. Wire your API to see responses.</Text>
          )}
        </View>

        <Pressable style={styles.primaryButton} onPress={() => router.replace('/') }>
          <Text style={styles.primaryButtonText}>Back home</Text>
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
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    color: baseTheme.colors.ink,
    fontFamily: baseTheme.fonts.display,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: baseTheme.radii.pill,
    backgroundColor: '#fff1d6',
  },
  metaText: {
    fontSize: 12,
    color: '#b45309',
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  threadCard: {
    padding: 18,
    borderRadius: baseTheme.radii.card,
    backgroundColor: baseTheme.colors.white,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    gap: 14,
    ...baseTheme.shadowSoft,
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#f59e0b',
    borderBottomRightRadius: 4,
  },
  lumenBubble: {
    alignSelf: 'flex-start',
    backgroundColor: baseTheme.colors.white,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: baseTheme.fonts.bodyMedium,
  },
  lumenText: {
    color: baseTheme.colors.inkMuted,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: baseTheme.fonts.body,
  },
  placeholder: {
    fontSize: 14,
    color: baseTheme.colors.inkSoft,
    fontFamily: baseTheme.fonts.body,
  },
  primaryButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: baseTheme.radii.pill,
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    ...baseTheme.shadowSoft,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: baseTheme.fonts.bodySemibold,
    letterSpacing: 0.2,
  },
});

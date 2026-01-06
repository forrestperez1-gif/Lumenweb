import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { baseTheme } from '../../theme';

type OptionCardProps = {
  label: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
  accent: string;
  accentDeep: string;
  accentSoft: string;
  style?: ViewStyle;
};

export function OptionCard({
  label,
  description,
  isSelected,
  onPress,
  accent,
  accentDeep,
  accentSoft,
  style,
}: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isSelected && { borderColor: accent, backgroundColor: accentSoft },
        pressed && styles.cardPressed,
        style,
      ]}
    >
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.label,
            isSelected && { color: accentDeep },
          ]}
        >
          {label}
        </Text>
        <View
          style={[
            styles.selectionMark,
            {
              borderColor: isSelected ? accent : baseTheme.colors.line,
              backgroundColor: isSelected ? accent : 'transparent',
            },
          ]}
        >
          {isSelected && <View style={styles.selectionDot} />}
        </View>
      </View>
      <Text
        style={[
          styles.description,
          isSelected && { color: accentDeep },
        ]}
      >
        {description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: baseTheme.radii.card,
    borderWidth: 1,
    borderColor: baseTheme.colors.line,
    backgroundColor: baseTheme.colors.white,
    ...baseTheme.shadowSoft,
  },
  cardPressed: {
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },
  label: {
    fontSize: 17,
    fontFamily: baseTheme.fonts.bodySemibold,
    color: baseTheme.colors.ink,
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontFamily: baseTheme.fonts.body,
    color: baseTheme.colors.inkMuted,
    lineHeight: 20,
  },
  selectionMark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
});

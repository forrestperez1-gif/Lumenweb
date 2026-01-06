import { Platform } from 'react-native';
import type { PersonalityTraitKey } from './stores/personalityStore';

export const baseTheme = {
  colors: {
    ink: '#1f1a12',
    inkMuted: '#6f6254',
    inkSoft: '#9a8d7f',
    paper: '#fff8ec',
    paperDeep: '#f8ecd6',
    line: '#eadcc6',
    white: '#ffffff',
  },
  radii: {
    card: 18,
    pill: 999,
    button: 22,
  },
  fonts: {
    display: Platform.select({
      default: 'DMSerifDisplay-Regular',
    }),
    body: Platform.select({
      default: 'DMSans-Regular',
    }),
    bodyMedium: Platform.select({
      default: 'DMSans-Medium',
    }),
    bodySemibold: Platform.select({
      default: 'DMSans-SemiBold',
    }),
  },
  shadowSoft: Platform.select({
    ios: {
      shadowColor: '#1c140a',
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    android: {
      elevation: 3,
    },
    default: {
      shadowColor: '#1c140a',
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
  }),
};

export type AccentPalette = {
  accent: string;
  accentDeep: string;
  accentSoft: string;
  wash: string;
  mist: string;
};

const personalityPalettes: Record<PersonalityTraitKey, AccentPalette> = {
  warmth: {
    accent: '#f59e0b',
    accentDeep: '#b45309',
    accentSoft: '#ffe6b8',
    wash: '#fff3dc',
    mist: '#ffdca8',
  },
  directness: {
    accent: '#10b981',
    accentDeep: '#047857',
    accentSoft: '#cffaea',
    wash: '#e9fbf4',
    mist: '#b9efdd',
  },
  depth: {
    accent: '#3b82f6',
    accentDeep: '#1d4ed8',
    accentSoft: '#dbeafe',
    wash: '#eef5ff',
    mist: '#c8dcff',
  },
  challengeLevel: {
    accent: '#8b5cf6',
    accentDeep: '#6d28d9',
    accentSoft: '#efe7ff',
    wash: '#f6f1ff',
    mist: '#d8c8ff',
  },
  pace: {
    accent: '#f97316',
    accentDeep: '#c2410c',
    accentSoft: '#ffe2cc',
    wash: '#fff1e6',
    mist: '#f9d1b0',
  },
};

export function getPersonalityPalette(
  traitKey?: PersonalityTraitKey
): AccentPalette {
  if (traitKey && personalityPalettes[traitKey]) {
    return personalityPalettes[traitKey];
  }
  return personalityPalettes.warmth;
}

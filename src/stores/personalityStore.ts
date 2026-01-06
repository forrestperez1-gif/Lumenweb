// src/stores/personalityStore.ts
// Zustand store for managing companion personality traits.
// These settings control how Lumen responds to the student.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Platform } from 'react-native';

// The five core personality dimensions
export type PersonalityTraitKey =
  | 'warmth'
  | 'directness'
  | 'depth'
  | 'challengeLevel'
  | 'pace';

// Each option the student can pick for a trait
export type PersonalityOption = {
  id: string;           // e.g. "warmth_high"
  label: string;        // e.g. "Very warm"
  description: string;  // one-line explanation shown in UI
};

// The store shape
type PersonalityState = {
  // Current trait selections (null if not yet chosen)
  traits: Record<PersonalityTraitKey, PersonalityOption | null>;

  // Whether the user has completed the personality builder at least once
  hasCompletedOnboarding: boolean;

  // Actions
  setTrait: (key: PersonalityTraitKey, option: PersonalityOption) => void;
  resetTraits: () => void;
  completeOnboarding: () => void;
};

// Default state — all traits unset
const initialTraits: Record<PersonalityTraitKey, PersonalityOption | null> = {
  warmth: null,
  directness: null,
  depth: null,
  challengeLevel: null,
  pace: null,
};

// Simple localStorage-based storage for web
const webStorage = {
  getItem: (name: string): string | null => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(name);
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(name);
    }
  },
};

export const usePersonalityStore = create<PersonalityState>()(
  persist(
    (set) => ({
      traits: { ...initialTraits },
      hasCompletedOnboarding: false,

      setTrait: (key, option) =>
        set((state) => ({
          traits: { ...state.traits, [key]: option },
        })),

      resetTraits: () =>
        set({
          traits: { ...initialTraits },
          hasCompletedOnboarding: false,
        }),

      completeOnboarding: () =>
        set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'lumen-personality',
      storage: webStorage as any,
    }
  )
);

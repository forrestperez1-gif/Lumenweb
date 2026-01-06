// src/stores/companionStore.ts
// Zustand store for the Curiosity Engine companion.
// These are the "seed traits" that shape how the companion relates to the student.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────────
// The three seed traits from onboarding
// ─────────────────────────────────────────────────────────────────────────────

export type ExplorationStyle = 'wandering' | 'building' | 'connecting' | 'depends';
export type LearningFeel = 'discovering' | 'creating' | 'grounded' | 'unsure';
export type RelationshipDynamic = 'guide' | 'coexplorer' | 'challenger' | 'real';

// Human responses for each selection
export const explorationResponses: Record<ExplorationStyle, string> = {
  wandering: "Then we'll let curiosity lead. No agenda, just following what pulls you.",
  building: "One brick at a time, then. We'll work from the ground up.",
  connecting: "We'll weave threads together. Everything connects to something.",
  depends: "Good. Flexibility matters. We'll read the room as we go.",
};

export const learningResponses: Record<LearningFeel, string> = {
  discovering: "Like finding something that was always there, waiting. I like that.",
  creating: "Making something that's yours. That's where the real learning lives.",
  grounded: "Anchored in the real stuff. No abstractions for their own sake.",
  unsure: "That's honest. We'll figure out what fits as we go.",
};

export const relationshipResponses: Record<RelationshipDynamic, string> = {
  guide: "I'll light the path. You decide how far to walk.",
  coexplorer: "Shoulder to shoulder, then. I don't have all the answers either.",
  challenger: "You want me to push. I can do that. Don't expect me to go easy.",
  real: "No performance. Just two minds trying to make sense of things.",
};

// Primer messages based on relationship dynamic
export const primerMessages: Record<RelationshipDynamic, { tone: string; message: string }> = {
  guide: {
    tone: 'supportive',
    message: "I'm here to help you find your way. Ask anything—there are no wrong questions here.",
  },
  coexplorer: {
    tone: 'collaborative',
    message: "Let's think through this together. I'm curious too.",
  },
  challenger: {
    tone: 'demanding',
    message: "Show me what you've got. I'll help you sharpen it.",
  },
  real: {
    tone: 'direct',
    message: "No scripts. What's actually on your mind?",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Store shape
// ─────────────────────────────────────────────────────────────────────────────

export type SeedTraits = {
  explorationStyle: ExplorationStyle | null;
  learningFeel: LearningFeel | null;
  relationshipDynamic: RelationshipDynamic | null;
};

type CompanionState = {
  // The three seed traits chosen during onboarding
  seedTraits: SeedTraits;

  // Onboarding progress
  onboardingStep: number; // 0 = not started, 1-3 = questions, 4 = primer, 5 = first prompt
  hasCompletedOnboarding: boolean;

  // The student's first curiosity (stored for companion memory)
  firstCuriosity: string | null;

  // Actions
  setExplorationStyle: (style: ExplorationStyle) => void;
  setLearningFeel: (feel: LearningFeel) => void;
  setRelationshipDynamic: (dynamic: RelationshipDynamic) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: (firstCuriosity: string) => void;
  reset: () => void;
};

const initialSeedTraits: SeedTraits = {
  explorationStyle: null,
  learningFeel: null,
  relationshipDynamic: null,
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

export const useCompanionStore = create<CompanionState>()(
  persist(
    (set) => ({
      seedTraits: { ...initialSeedTraits },
      onboardingStep: 0,
      hasCompletedOnboarding: false,
      firstCuriosity: null,

      setExplorationStyle: (style) =>
        set((state) => ({
          seedTraits: { ...state.seedTraits, explorationStyle: style },
        })),

      setLearningFeel: (feel) =>
        set((state) => ({
          seedTraits: { ...state.seedTraits, learningFeel: feel },
        })),

      setRelationshipDynamic: (dynamic) =>
        set((state) => ({
          seedTraits: { ...state.seedTraits, relationshipDynamic: dynamic },
        })),

      setOnboardingStep: (step) =>
        set({ onboardingStep: step }),

      completeOnboarding: (firstCuriosity) =>
        set({
          hasCompletedOnboarding: true,
          onboardingStep: 5,
          firstCuriosity,
        }),

      reset: () =>
        set({
          seedTraits: { ...initialSeedTraits },
          onboardingStep: 0,
          hasCompletedOnboarding: false,
          firstCuriosity: null,
        }),
    }),
    {
      name: 'lumen-companion',
      storage: webStorage as any,
    }
  )
);

// app/personality/index.tsx
// The Personality Builder flow — walks students through setting their companion's style.

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PersonalityStep } from '../../src/components/personality/PersonalityStep';
import { PersonalitySummary } from '../../src/components/personality/PersonalitySummary';
import { personalityQuestions } from '../../src/data/personalityQuestions';
import { getPersonalityPalette } from '../../src/theme';
import {
  usePersonalityStore,
  PersonalityTraitKey,
  PersonalityOption,
} from '../../src/stores/personalityStore';

export default function PersonalityFlowScreen() {
  const router = useRouter();

  // Current step in the flow (0 to questions.length, where last is summary)
  const [currentStep, setCurrentStep] = useState(0);

  // Pull state and actions from the store
  const { traits, setTrait, completeOnboarding } = usePersonalityStore();

  const totalQuestionSteps = personalityQuestions.length;
  const isOnSummary = currentStep >= totalQuestionSteps;

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < totalQuestionSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Move to next without setting a value
    handleNext();
  };

  const handleSelect = (traitKey: PersonalityTraitKey, option: PersonalityOption) => {
    setTrait(traitKey, option);
  };

  const handleConfirm = () => {
    // Mark onboarding complete and navigate to home
    completeOnboarding();
    router.replace('/');
  };

  // Render summary screen
  if (isOnSummary) {
    const summaryPalette = getPersonalityPalette('warmth');
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: summaryPalette.wash }]}
        edges={['top', 'bottom']}
      >
        <PersonalitySummary
          traits={traits}
          onConfirm={handleConfirm}
          onBack={handleBack}
          palette={summaryPalette}
        />
      </SafeAreaView>
    );
  }

  // Render current question step
  const question = personalityQuestions[currentStep];
  const selectedOption = traits[question.traitKey];
  const palette = getPersonalityPalette(question.traitKey);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.wash }]}
      edges={['top', 'bottom']}
    >
      <PersonalityStep
        title={question.title}
        subtitle={question.subtitle}
        examplePrompt={question.examplePrompt}
        options={question.options}
        selectedOptionId={selectedOption?.id}
        onSelect={(option) => handleSelect(question.traitKey, option)}
        onNext={handleNext}
        onBack={currentStep > 0 ? handleBack : undefined}
        onSkip={handleSkip}
        currentStep={currentStep}
        totalSteps={totalQuestionSteps}
        palette={palette}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

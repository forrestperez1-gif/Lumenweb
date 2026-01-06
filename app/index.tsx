// app/index.tsx
// Root redirect - sends users to the appropriate starting point.

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useCompanionStore } from '../src/stores/companionStore';
import { baseTheme } from '../src/theme';

export default function Index() {
  const router = useRouter();
  const { hasCompletedOnboarding } = useCompanionStore();

  useEffect(() => {
    // Small delay to prevent flash
    const timer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        router.replace('/conversation' as any);
      } else {
        router.replace('/welcome' as any);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, router]);

  // Show blank screen with matching background during redirect
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: baseTheme.colors.paper,
  },
});

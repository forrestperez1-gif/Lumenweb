// app/index.tsx

import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

// This component is the home screen for the app on web.
export default function Index() {
  // STATE: has the user tapped the button yet?
  const [hasStarted, setHasStarted] = useState(false);

  // EVENT HANDLER: runs when the button is pressed
  const handleStartPress = () => {
    setHasStarted(true); // triggers a re-render with hasStarted = true
  };

  // JSX: what the UI should look like *right now* given the state.
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          marginBottom: 16,
        }}
      >
        {hasStarted ? 'Welcome back to Lumen.' : 'Hey. This is Lumen.'}
      </Text>

      <Text
        style={{
          fontSize: 16,
          marginBottom: 24,
        }}
      >
        {hasStarted
          ? 'We’ll pick up from wherever your questions left off last time.'
          : 'This is where your questions start getting turned into something real.'}
      </Text>

      {/* Only show the button until the user has started */}
      {!hasStarted && (
        <Button title="Start exploring" onPress={handleStartPress} />
      )}
    </View>
  );
}

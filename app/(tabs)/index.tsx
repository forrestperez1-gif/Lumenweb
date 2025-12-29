import { Text, View } from 'react-native';

export default function Index() {
  console.log('Web index rendered');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Lumen is alive on web</Text>
    </View>
  );
}
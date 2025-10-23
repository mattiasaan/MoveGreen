import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
      <View>
        <Text>Welcome to the home screen</Text>
        <StatusBar style='auto' />
      </View>
  );
}

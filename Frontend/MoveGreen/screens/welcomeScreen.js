import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View>
      <Text>Welcome to our app...</Text>
      <StatusBar style='auto' />
    </View>
  );
}

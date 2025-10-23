import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';

import HomeScreen from './screens/homeScreen';
import LeaderBoard from './screens/leaderBoard';
import ProfileScreen from './screens/profileScreen';
import TrackingScreen from './screens/trackingScreen';
import WelcomeScreen from './screens/welcomeScreen';

const Stack = createNativeStackNavigator();

const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContente: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default function App() {
  //Parte per il controllo nuovi utenti
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      const firstTime = await AsyncStorage.getItem('firstTime');
      if(firstTime === null) {
        await AsyncStorage.setItem('firstTime', 'no');
        setInitialRoute('welcomeScreen');
      } else {
        setInitialRoute('homeScreen');
      }
    }; 

    checkFirstTime();
  }, []);

  if (!initialRoute) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="welcomeScreen" component={WelcomeScreen}/>
        <Stack.Screen name="homeScreen" component={HomeScreen}/>
        <Stack.Screen name="leaderBoard" component={LeaderBoard}/>
        <Stack.Screen name="profileScreen" component={ProfileScreen}/>
        <Stack.Screen name="trackingScreen" component={TrackingScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

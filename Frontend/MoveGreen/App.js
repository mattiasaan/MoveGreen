import * as React from 'react';
import { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from './WelcomeScreen';
import HomeScreen from './HomeScreen';
import TrackingScreen from './TrackingScreen';
import LeaderBoardScreen from './LeaderBoardScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#000',
          borderColor: 'black',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Dashboard', tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{ title: 'Traccia Attività', tabBarLabel: 'Tracking' }}
      />
      <Tab.Screen
        name="LeaderBoard"
        component={LeaderBoardScreen}
        options={{ title: 'Classifica', tabBarLabel: 'Classifica' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profilo', tabBarLabel: 'Profilo' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        const userName = await AsyncStorage.getItem('userName');
        setIsFirstLaunch(!userName);
      } catch (error) {
        console.log(error);
        setIsFirstLaunch(true);
      }
    }
    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isFirstLaunch && (
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
          )}
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

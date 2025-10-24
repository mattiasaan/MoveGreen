import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


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
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="HomeTab"
        component={HomeScreen} 
        options={{ 
          title: 'Dashboard',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Tracking" 
        component={TrackingScreen} 
        options={{ title: 'Traccia Attività' }}
      />
      <Tab.Screen 
        name="LeaderBoard" 
        component={LeaderBoardScreen} 
        options={{ title: 'Classifica' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profilo' }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }} 
      >

        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
        />
        
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

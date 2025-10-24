import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa tutti i componenti delle schermate
import WelcomeScreen from './WelcomeScreen';
import HomeScreen from './HomeScreen';
import TrackingScreen from './TrackingScreen';
import LeaderBoardScreen from './LeaderBoardScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome" 
        screenOptions={{
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Dashboard', headerBackVisible: false }}
        />
        
        <Stack.Screen 
          name="Tracking" 
          component={TrackingScreen} 
          options={{ title: 'Traccia Attività' }}
        />
        
        <Stack.Screen 
          name="LeaderBoard" 
          component={LeaderBoardScreen} 
          options={{ title: 'Classifica' }}
        />
        
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Il Mio Profilo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
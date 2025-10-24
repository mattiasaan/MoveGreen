import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Benvenuto!</Text>
      <Text style={styles.text}>La tua app è pronta.</Text>
      <Button
        title="Inizia (Vai alle Schede Principali)"
        onPress={() => navigation.navigate('Main')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
});

export default WelcomeScreen;
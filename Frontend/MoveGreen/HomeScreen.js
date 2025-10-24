import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.buttonGroup}>
        <Button 
          title="Vai al Tracking" 
          onPress={() => navigation.navigate('Tracking')} 
        />
        <Button 
          title="Classifica" 
          onPress={() => navigation.navigate('LeaderBoard')} 
        />
        <Button 
          title="Profilo Utente" 
          onPress={() => navigation.navigate('Profile')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonGroup: {
    width: '80%',
    gap: 15,
  },
});

export default HomeScreen;
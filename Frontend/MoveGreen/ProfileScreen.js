import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilo Utente</Text>
      <Text style={styles.text}>Visualizza e modifica le tue informazioni personali.</Text>
      <Button 
        title="Torna alla Home" 
        onPress={() => navigation.navigate('HomeTab')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  text: {
    marginBottom: 20,
  },
});

export default ProfileScreen;
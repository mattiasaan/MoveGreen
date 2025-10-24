import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Button rimosso

function HomeScreen() { // navigation rimosso dai props
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text>Usa la barra di navigazione inferiore per navigare tra le sezioni principali.</Text>
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
});

export default HomeScreen;
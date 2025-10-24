import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function TrackingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoraggio Attività</Text>
      <Text>Qui puoi avviare, mettere in pausa o visualizzare la tua attività corrente.</Text>
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
    marginBottom: 10,
  },
});

export default TrackingScreen;
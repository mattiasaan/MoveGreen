import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function LeaderBoardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classifica</Text>
      <Text>Visualizza i migliori punteggi e le classifiche globali qui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e6f0ff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0056b3',
  },
});

export default LeaderBoardScreen;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Button rimosso

function HomeScreen() { // navigation rimosso dai props
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MoveGreen</Text>
      <Text>Buongiorno, User!!!</Text>

      <View style={styles.box}>
        <Text>Chilometri sostenibili</Text>
        <Text style={{ fontSize: 24, fontStyle: 'bold' }}>---</Text>
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
});

export default HomeScreen;
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function DetailsScreen({ route, navigation }) {
  // route.params contiene i parametri ricevuti
  const { itemId, otherParam } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schermata Dettagli</Text>
      <Text style={styles.paramText}>ID Articolo: {JSON.stringify(itemId)}</Text>
      <Text style={styles.paramText}>Parametro Extra: {JSON.stringify(otherParam)}</Text>
      
      <Button
        title="Torna indietro"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  paramText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'gray'
  }
});

export default DetailsScreen;
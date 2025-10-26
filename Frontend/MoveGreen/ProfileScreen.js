import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProfileScreen({ navigation }) {

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Conferma cancellazione",
      "Sei sicuro di voler cancellare il tuo account? Tutti i dati verranno persi",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Cancella", 
          style: "destructive", 
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Account cancellato", "Tutti i dati sono stati rimossi.");
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              Alert.alert("Errore", "Impossibile cancellare i dati");
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilo Utente</Text>
      <Text style={styles.subtitle}>
        Visualizza e modifica le tue informazioni personali.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Nome</Text>
        <Text style={styles.infoText}>Mario Rossi</Text>

        <Text style={[styles.infoTitle, { marginTop: 10 }]}>Email</Text>
        <Text style={styles.infoText}>mario.rossi@email.com</Text>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDeleteAccount}
      >
        <Text style={styles.buttonText}>Cancella Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    color: '#CCCCCC',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoTitle: {
    color: '#BBBBBB',
    fontWeight: '300',
    marginBottom: 5,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#0C8024',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProfileScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userQuartiere, setUserQuartiere] = useState('');
  const [userId, setUserId] = useState(null);

  const API_URL = "http://192.168.1.5:8001/users";

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem("userName");
      const email = await AsyncStorage.getItem("userEmail");
      const quartiere = await AsyncStorage.getItem("userQuartiere");
      const id = await AsyncStorage.getItem("userId");

      if (name) setUserName(name);
      if (email) setUserEmail(email);
      if (id) setUserId(id);
    } catch (error) {
      console.log("Errore recupero dati:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

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
              if (!userId) {
                Alert.alert("Errore", "ID utente non trovato");
                return;
              }

              const response = await fetch(`${API_URL}/${userId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (!response.ok) {
                Alert.alert("Errore", "Errore durante la cancellazione sul server");
                return;
              }

              await AsyncStorage.clear();
              Alert.alert("Account cancellato", "Tutti i dati sono stati rimossi");
              navigation.replace("Welcome");

            } catch (error) {
              Alert.alert("Errore", "Impossibile cancellare i dati");
              console.log(error);
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
        <Text style={styles.infoText}>{userName || "Non disponibile"}</Text>

        <Text style={[styles.infoTitle, { marginTop: 10 }]}>Email</Text>
        <Text style={styles.infoText}>{userEmail || "Non disponibile"}</Text>
        <Text style={[styles.infoTitle, { marginTop: 10 }]}>Quartiere</Text>
        <Text style={styles.infoText}>{userQuartiere || "Non disponibile"}</Text>
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

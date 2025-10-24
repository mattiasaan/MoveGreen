import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function WelcomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handlePress = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('inserire un email');
      return;
    }

    try {
      await AsyncStorage.setItem('userName', name.trim());
      await AsyncStorage.setItem('userEmail', email.trim());

      navigation.replace('Main');
    } catch (error) {
      console.log(error);
      Alert.alert('Errore', 'Impossibile salvare i dati');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Benvenuto su MoveGreen!</Text>
      <Text style={styles.text}>Inserisci nome e email per continuare</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        style={styles.button}
        title="Iniziamo"
        onPress={handlePress}
        disabled={!name.trim() || !email.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#f0f0f0',
    padding:20,
  },
  title: {
    fontSize:24,
    fontWeight:'bold',
    marginBottom:20,
    color:'#333',
    textAlign:'center',
  },
  text: {
    fontSize:18,
    marginBottom:20,
    color:'#666',
    textAlign:'center',
  },
  input: {
    width:'80%',
    height:50,
    borderColor:'#ccc',
    borderWidth:1,
    borderRadius:8,
    marginBottom:15,
    paddingHorizontal:10,
    backgroundColor:'#fff',
  },
  button: {
    
  }
});

export default WelcomeScreen;

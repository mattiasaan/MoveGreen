import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from "./config";

function WelcomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quartiere, setQuartiere] = useState('');

  const handlePress = async () => {
    if (!name.trim() || !email.trim() || !quartiere.trim()) {
      Alert.alert('Inserisci nome, email e quartiere');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          quartiere: quartiere.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Errore", errorData.detail || "Errore nella creazione utente");
        return;
      }

      const data = await response.json();

      await AsyncStorage.setItem("userId", data.id.toString());
      await AsyncStorage.setItem("userName", data.name);
      await AsyncStorage.setItem("userEmail", data.email);
      await AsyncStorage.setItem("userQuartiere", data.quartiere);

      navigation.replace("Main");

    } catch (error) {
      console.log(error);
      Alert.alert("Errore", "Impossibile collegarsi al server");
    }
  };

  return (
    <LinearGradient
      colors={["#0C8024", "#1d251eff","#1d251eff", "#0C8024"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.2, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>Benvenuto su MoveGreen!</Text>
      <Text style={styles.text}>Inserisci nickname, email e quartiere per continuare</Text>

      <TextInput
        style={styles.input}
        placeholder="nickname"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={quartiere}
          onValueChange={(value) => setQuartiere(value)}
          style={styles.picker}
          dropdownIconColor="#e5e5e5"
        >
          <Picker.Item label="Seleziona quartiere" value="" />
          <Picker.Item label="Gries-San Quirino" value="Gries-San Quirino" />
          <Picker.Item label="Don Bosco" value="Don Bosco" />
          <Picker.Item label="Oltrisarco-Aslago" value="Oltrisarco" />
          <Picker.Item label="Europa Novacella" value="Europa Novacella" />
          <Picker.Item label="Centro Piani Rencio" value="Centro Piani Rencio" />
          
        </Picker>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!name.trim() || !email.trim() || !quartiere.trim()) && styles.buttonDisabled
        ]}
        onPress={handlePress}
        disabled={!name.trim() || !email.trim() || !quartiere.trim()}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#0C8024", "#78a96e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Iniziamo</Text>
        </LinearGradient>
      </TouchableOpacity>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    padding:20,
  },
  title: {
    fontSize:30,
    fontWeight:'bold',
    marginBottom:15,
    color:'#e5e5e5',
    textAlign:'center',
  },
  text: {
    fontSize:18,
    marginBottom:25,
    color:'#cfcfcf',
    textAlign:'center',
  },
  input: {
    width:'80%',
    height:50,
    borderRadius:12,
    marginBottom:15,
    paddingHorizontal:12,
    backgroundColor:'#2a2a2a',
    color:'#e5e5e5',
    borderWidth:1,
    borderColor:'#0C8024',
  },
  pickerContainer: {
    width:'80%',
    height:50,
    borderRadius:12,
    marginBottom:15,
    backgroundColor:'#2a2a2a',
    borderWidth:1,
    borderColor:'#0C8024',
    justifyContent:'center'
  },
  picker: {
    color:'#e5e5e5',
    width:'100%',
  },
  button: {
    width:'80%',
    borderRadius:14,
    marginTop:10,
    elevation:5,
    shadowColor:'#0C8024',
    shadowOpacity:0.4,
    shadowRadius:10,
    shadowOffset:{ width:0, height:4 },
    overflow:'hidden',
  },
  buttonGradient: {
    paddingVertical:15,
    alignItems:'center',
    borderRadius:14,
  },
  buttonDisabled: {
    opacity:0.5,
  },
  buttonText: {
    color:'#121212',
    fontSize:18,
    fontWeight:'bold',
  }
});

export default WelcomeScreen;

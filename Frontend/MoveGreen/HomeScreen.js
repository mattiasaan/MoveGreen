import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation}) {
  const userId = 1;

  const [userName, setUserName] = useState('');

  const [data, setData] = useState({
    km_sostenibili: '---',
    co2_risparmiata: '---',
    punti_totali: '---',
  });

  useEffect(() => {
    loadUserName();
    fetchData();
  }, []);


  const loadUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) setUserName(storedName);
    } catch (error) {
      console.log('Errore AsyncStorage:', error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`http://192.168.1.5:8001/dashboard/${userId}`);
      const json = await res.json();

      setData({
        km_sostenibili: json.total_distance_km ?? '---',
        co2_risparmiata: json.total_co2_saved ?? '---',
        punti_totali: json.total_points ?? '---',
      });

    } catch (error) {
      console.log("Errore nel fetch:", error);
    }
  };

  const renderAction = (title, points, date) => (
  <View style={styles.actionCard}>
    <Text style={styles.actionTitle}>{title}</Text>
    <Text style={styles.actionSubtitle}>{points}</Text>
    <Text style={styles.actionTime}>{date}</Text>
  </View>
);

  return (
    <>
      {/* StatusBar bianca su tema scuro */}
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Ciao {userName}</Text>

        <View style={styles.row}>
          <View style={styles.widget}>
            <Text style={styles.widgetTitle}>Km Sostenibili</Text>
            <Text style={styles.widgetValue}>{data.km_sostenibili}</Text>
          </View>

          <View style={styles.widget}>
            <Text style={styles.widgetTitle}>CO₂ Risparmiata</Text>
            <Text style={styles.widgetValue}>{data.co2_risparmiata} kg</Text>
          </View>
        </View>

        <View style={styles.largeWidget}>
          <Text style={styles.widgetTitle}>GreenPoints</Text>
          <Text style={styles.widgetValue}>{data.punti_totali}</Text>
        </View>

        <Text style={styles.sectionTitle}>Ultime registrazioni</Text>

        {renderAction("Corsa - 5 km", "25 GreenPoints", "10:30 AM")}
        {renderAction("Bici - 10 km", "50 GreenPoints", "Ieri")}
        {renderAction("creazione account", "100 GreenPoints", "2 giorni fa")}

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Tracking')}>
          <Text style={styles.primaryButtonText}>Registra attività</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Aggiungi Segnalazione</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>La tua Posizione in Classifica</Text>

        <View style={styles.rankBox}>
          <Text style={styles.rankSmall}>Sei quasi nella Top 100!</Text>
          <Text style={styles.rankValue}>#125</Text>
          <Text style={styles.rankLink}>Vedi Classifica Completa</Text>
        </View>

        <Text style={styles.sectionTitle}>Sfide attive</Text>

        <View style={styles.challengeBox}>
          <Text style={styles.challengeText}>Sfida del mese: 100km in bici</Text>
          <Text style={styles.challengeTextSmall}>67/100 km</Text>

          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: "67%" }]} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: '#FFFFFF',
    marginTop: Platform.OS === "ios" ? 60 : 35,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  widget: {
    backgroundColor: '#1E1E1E',
    width: '48%',
    borderRadius: 20,
    padding: 18,
  },
  largeWidget: {
    backgroundColor: '#1E1E1E',
    width: '100%',
    borderRadius: 20,
    padding: 22,
    marginBottom: 22,
  },
  widgetTitle: {
    color: '#BBBBBB',
    fontSize: 14,
    marginBottom: 10,
  },
  widgetValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
  },
  actionCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600",
  },
  actionSubtitle: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  actionTime: {
    color: '#666666',
    fontSize: 12,
    marginTop: 5,
  },
  primaryButton: {
    backgroundColor: '#0C8024',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#15D32F',
    fontSize: 16,
    fontWeight: "700",
  },
  rankBox: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  rankSmall: { color: '#CCCCCC' },
  rankValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 6,
  },
  rankLink: {
    color: '#15D32F',
    fontWeight: "600",
  },
  challengeBox: {
    backgroundColor: '#1E1E1E',
    padding: 18,
    borderRadius: 20,
  },

  challengeText: { color: '#FFFFFF', fontSize: 16, marginBottom: 4 },

  challengeTextSmall: { color: '#BBBBBB', fontSize: 14 },
  
  progressBackground: {
    backgroundColor: '#666666',
    height: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  progressFill: {
    backgroundColor: '#15D32F',
    height: '100%',
    borderRadius: 8,
  }
});

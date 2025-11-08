import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "./config"

export default function HomeScreen({ navigation}) {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [rank, setRank] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [data, setData] = useState({
    km_sostenibili: '---',
    co2_risparmiata: '---',
    punti_totali: '---',
  });

  const [activityData, setActivityData] = useState([])

  //refresh dati pagina
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchDataDashboard(userId),
      fetchDataActivity(userId)
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedId = await AsyncStorage.getItem("userId");
        const storedName = await AsyncStorage.getItem("userName");

        if (storedId) setUserId(Number(storedId));
        if (storedName) setUserName(storedName);
      } catch (error) {
        console.log("Errore caricando dati utente:", error);
      }
    };

    initialize();
  }, []);

  // quando id cambia carica dati
  useEffect(() => {
    if (userId !== null) {
      fetchDataDashboard(userId);
      fetchDataActivity(userId);
      fetchRank(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (userId === null) return;

    const interval = setInterval(() => {
      console.log("Aggiornamento automatico dati...");
      fetchDataDashboard(userId);
      fetchDataActivity(userId);
      fetchRank(userId);
    }, 60000); // ogni 60 sec

    return () => clearInterval(interval);
  }, [userId]);


  const fetchRank = async (uid) => {
    try {
      const res = await fetch(`${API_URL}/leaderboard/position/${uid}`);
      if (!res.ok) throw new Error('Errore fetch rank');
      const data = await res.json();
      setRank(data.rank);
    } catch (err) {
      console.log('Errore fetch rank:', err);
      setRank(null);
    }
  };

  const fetchDataDashboard = async (uid) => {
    try {
      const res = await fetch(`${API_URL}/dashboard/${uid}`);
      const json = await res.json();

      setData({
        km_sostenibili: json.total_distance_km ?? '---',
        co2_risparmiata: json.total_co2_saved != null ? Number(json.total_co2_saved).toFixed(1) : '---',
        punti_totali: json.total_points ?? '---',
      });
    } catch (error) {
      console.log("Errore fetch dashboard:", error);
    }
  };

  const fetchDataActivity = async (uid) => {
    try {
      const res = await fetch(`${API_URL}/traking/user/activity/${uid}`);
      const json = await res.json();

      setActivityData(Array.isArray(json) ? json : []);
    } catch (error) {
      console.log("Errore fetch activity:", error);
      setActivityData([]);
    }
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      if (isNaN(d)) return ts;
      // data semplificata
      return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return ts;
    }
  };

  const formatDistance = (distance) => {
    if (distance == null) return '—';
    return Number(distance).toFixed(0);
  };

  const renderAction = (title, data, date, key) => (
    <View key={key} style={styles.actionCard}>
      <View style={styles.actionRow}>
        <View style={styles.actionLeft}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{data}</Text>
        </View>
        <View style={styles.actionRight}>
          <Text style={styles.actionTime}>{date}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <ScrollView contentContainerStyle={styles.container} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#15D32F" />
      }>
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

        {activityData.length === 0 ? (
          renderAction("Nessuna attività", "Registra la tua prima attività", "", "empty-1")
        ) : (
          activityData.slice(0, 3).map((act, idx) =>
            renderAction(
              `${act.mode ?? 'Attività'}`,
              `${formatDistance(act.distance)} km  •  ${act.co2_saved.toFixed(2)} kg CO₂`,
              formatDate(act.timestamp),
              `act-${idx}`
            )
          )
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Tracking')}>
          <Text style={styles.primaryButtonText}>Registra attività</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Report')}>
          <Text style={styles.secondaryButtonText}>Aggiungi Segnalazione</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>La tua Posizione in Classifica</Text>

        <View style={styles.rankBox}>
          <Text style={styles.rankSmall}>
            {rank == null
              ? 'Caricamento...'
              : rank <= 3
              ? 'Sei nella Top 3!'
              : rank <= 10
              ? 'Sei nella Top 10!'
              : rank <= 20
              ? 'Sei nella Top 20!'
              : rank <= 50
              ? 'Sei nella Top 50!'
              : rank <= 75
              ? 'Sei nella Top 75!'
              : rank <= 100
              ? 'Sei nella Top 100!'
              : 'Sei quasi nella Top 100!'}
          </Text>

          <Text style={styles.rankValue}>#{rank ?? '—'}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LeaderBoard')}>
            <Text style={styles.rankLink}>Vedi Classifica Completa</Text>
          </TouchableOpacity>
        </View>
        {/*
        <Text style={styles.sectionTitle}>Sfide attive</Text>

        <View style={styles.challengeBox}>
          <Text style={styles.challengeText}>Sfida del mese: 100km in bici</Text>
          <Text style={styles.challengeTextSmall}>67/100 km</Text>

          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: "67%" }]} />
          </View>
        </View>
        */}
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionLeft: {
    paddingRight: 8,
    flex: 1,
  },
  actionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
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
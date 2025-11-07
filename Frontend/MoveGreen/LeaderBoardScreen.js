import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LeaderBoardScreen() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quartiere, setQuartiere] = useState(""); // per filtro
  const [userName, setUserName] = useState('');
  const [userQuartiere, setUserQuartiere] = useState('');

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem("userName");
      const quartiere = await AsyncStorage.getItem("userQuartiere");

      if (name) setUserName(name);
      if (quartiere) setUserQuartiere(quartiere);
    } catch (error) {
      console.log("Errore recupero dati:", error);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      let url = 'http://192.168.1.16:8001/leaderboard';
      if (quartiere) {
        url += `?quartiere=${encodeURIComponent(quartiere)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error("Errore nel fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [quartiere]);

  const currentUser = leaderboardData.find(item => item.name === userName);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Filtro */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={quartiere}
            onValueChange={(value) => setQuartiere(value)}
            style={styles.picker}
            dropdownIconColor="#e5e5e5"
          >
            <Picker.Item label="Filtra per quartiere" value="" />
            <Picker.Item label="Gries-San Quirino" value="Gries-San Quirino" />
            <Picker.Item label="Don Bosco" value="Don Bosco" />
            <Picker.Item label="Oltrisarco-Aslago" value="Oltrisarco" />
            <Picker.Item label="Europa Novacella" value="Europa Novacella" />
            <Picker.Item label="Centro Piani Rencio" value="Centro Piani Rencio" />
            
          </Picker>
        </View>

        {/* Highlight Primo Classificato */}
        {!loading && leaderboardData.length > 0 && (
          <View style={styles.highlightContainer}>
            <FontAwesome5 name="crown" size={40} color="#15D32F" />
            <Text style={styles.highlightName}>{leaderboardData[0].name}</Text>
            <Text style={styles.highlightPt}>{leaderboardData[0].total_points} pt</Text>
          </View>
        )}

        {/* Lista Classifica */}
        <View style={styles.listContainer}>
          {loading ? (
              <Text style={{ color: '#FFFFFF' }}>Caricamento...</Text>
            ) : (
              leaderboardData.map((item, index) => (
                <View key={index} style={styles.rowCard}>
                  <Text style={styles.position}>{index + 1}</Text>
                  <View style={styles.infoContainer}>
                    <Text style={styles.username}>{item.name}</Text>
                    <Text style={styles.quartiere}>{item.quartiere}</Text>
                  </View>
                  <View style={styles.dataContainer}>
                    <Text style={styles.pt}>{item.total_points} pt</Text>
                  </View>
                </View>
              ))
            )}
        </View>

        {/* Padding extra per la riga sticky */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {!loading && (
        <View style={styles.userFixedRow}>
          <Text style={styles.position}>
            {currentUser ? leaderboardData.indexOf(currentUser) + 1 : "-"}
          </Text>
          <View style={styles.infoContainer}>
            <Text style={styles.username}>{userName}</Text>
            <Text style={styles.quartiere}>{currentUser ? currentUser.quartiere : userQuartiere}</Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.pt}>{currentUser ? currentUser.total_points : 0} pt</Text>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#121212'
  },
  container: {
    padding: 20,
    paddingBottom: 0,
    backgroundColor: '#121212'
  },


  pickerContainer: {
    width:'100%',
    height:50,
    borderRadius:12,
    marginBottom:15,
    backgroundColor:'#1E1E1E',
    borderWidth:1,
    borderColor:'#0C8024',
    justifyContent:'center'
  },
  picker: {
    color:'#e5e5e5',
    width:'100%',
  },

  //Highlight Primo classificato
  highlightContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  highlightName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 4
  },
  highlightPt: {
    color: '#15D32F',
    fontSize: 18
  },

  //Lista
  listContainer: {
    marginBottom: 20
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginBottom: 12
  },
  position: {
    width: 28,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10
  },
  username: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  quartiere: {
    color: '#BBBBBB',
    fontSize: 12
  },
  dataContainer: {
    width: 90,
    alignItems: 'flex-end'
  },
  pt: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  co2: {
    color: '#BBBBBB',
    fontSize: 12
  },

  //Riga utente sticky bottom
  userFixedRow: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    borderWidth:1,
    borderColor:'#0C8024',
    zIndex: 10
  }
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';

export default function LeaderBoardScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Filtro */}
        <View style={styles.pickerContainer}>
          <Picker
            //selectedValue={quartiere}
            //onValueChange={(value) => setQuartiere(value)}
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
        <View style={styles.highlightContainer}>
          <FontAwesome5 name="crown" size={40} color="#15D32F" />
          <Text style={styles.highlightName}>mattiasan</Text>
          <Text style={styles.highlightPt}>4000pt</Text>
        </View>

        {/* Lista Classifica */}
        <View style={styles.listContainer}>
          {leaderboardData.map((item, index) => (
            <View key={index} style={styles.rowCard}>
              <Text style={styles.position}>{item.pos}</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.username}>{item.name}</Text>
                <Text style={styles.quartiere}>{item.quartiere}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.pt}>{item.points} pt</Text>
                <Text style={styles.co2}>{item.savedKg} kg</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Padding extra per la riga sticky */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Riga fissa utente in basso */}
      <View style={styles.userFixedRow}>
        <Text style={styles.position}>56</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.username}>Tu</Text>
          <Text style={styles.quartiere}>gries</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.pt}>980 pt</Text>
          <Text style={styles.co2}>84 kg</Text>
        </View>
      </View>

    </SafeAreaView>
  );
}

const leaderboardData = [
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
    {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
  {
    pos: 3,
    name: "t",
    quartiere: "t",
    points: 2150,
    savedKg: 179
  },
];

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

import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, StatusBar } from 'react-native';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();

  const widgets = [
    { title: 'Chilometri sostenibili', value: '---' },
    { title: 'CO₂ risparmiata', value: '---' },
    { title: 'Punti totali', value: '---' },
    { title: 'Missioni completate', value: '---' },
    { title: 'Missioni extra', value: '---' },
    { title: 'Statistiche bonus', value: '---' },
  ];

  return (
    <>
      {/* StatusBar bianca su tema scuro */}
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Titolo */}
        <Text style={[styles.title, { fontSize: width * 0.06, marginTop: height * 0.05 }]}>
          MoveGreen
        </Text>
        <Text style={{ color: '#fff', fontSize: width * 0.045, marginBottom: height * 0.03 }}>
          Buongiorno, User!!
        </Text>

        {/* Prime due box affiancate */}
        <View style={styles.row}>
          {widgets.slice(0, 2).map((item, i) => (
            <View key={i} style={[styles.box, { width: width * 0.42, height: height * 0.2 }]}>
              <Text style={styles.boxTitle}>{item.title}</Text>
              <Text style={styles.boxValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Box rimanenti uno sotto l’altro */}
        {widgets.slice(2).map((item, i) => (
          <View key={i + 2} style={[styles.box, { width: width * 0.85, height: height * 0.2 }]}>
            <Text style={styles.boxTitle}>{item.title}</Text>
            <Text style={styles.boxValue}>{item.value}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingBottom: 50,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  box: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  boxTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  boxValue: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

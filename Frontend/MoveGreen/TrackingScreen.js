import React from 'react';
import { StyleSheet, View, StatusBar, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

const MAP_HEIGHT_PERCENTAGE_INITIAL = 100;
const MAP_HEIGHT_PERCENTAGE_TRACKING = 70;

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />
  <style>
    html, body, #map, #infoPage {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    body {
      overflow: hidden;
      background: white;
      font-family: sans-serif;
    }

    #map {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 1;
    }

    #infoPage {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      display: none;
      background: #f7f7f7;
      padding: 20px;
      box-sizing: border-box;
      z-index: 10;
    }

    #backButton {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }

    a {
      color: blue;
      cursor: pointer;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <div id="infoPage">
    <h2>🚧 Viabilità limitata</h2>
    <p>Passaggio di mezzi pesanti in corso.</p>
    <p>Tempo di percorrenza: <b>12 minuti</b></p>
    <button id="backButton">← Torna alla mappa</button>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const tempoDiPercorrenza = 12;
    const motivazione = "Viabilità limitata a causa del passaggio di mezzi pesanti.";

    const map = L.map('map').setView([46.4983, 11.3548], 13);

    const LavoriInCorso = L.icon({
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Italian_traffic_signs_-_lavori.svg/1165px-Italian_traffic_signs_-_lavori.svg.png',
      iconSize: [45, 40],
      iconAnchor: [20, 40],
      popupAnchor: [3, -30]
    });

    const Traffico = L.icon({
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Italian_traffic_signs_-_Coda.svg/200px-Italian_traffic_signs_-_Coda.svg.png',
      iconSize: [40, 40],
      iconAnchor: [18, 40],
      popupAnchor: [3, -30]
    });

    // Aggiungi layer mappa
    L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      subdomains: ['a','b','c'],
      maxZoom: 19
    }).addTo(map);

    // Marker standard
    L.marker([46.4983, 11.3548])
      .addTo(map)
      .bindPopup('Centro Bolzano');

    L.marker([46.48890449054672, 11.336235278195057], { icon: LavoriInCorso })
      .addTo(map)
      .bindPopup('Pensilina in costruzione');

    // Marker traffico con link
    const trafficoMarker = L.marker([46.49203205246964, 11.341416969290785], { icon: Traffico })
      .addTo(map)
      .bindPopup(
        '<b>Code a tratti</b><br>' +
        '<b>Tempo di percorrenza:</b> ' + tempoDiPercorrenza + ' minuti.<br>' +
        '<a href="https://traffico.provincia.bz.it/#tab_map" id="causeLink"><b>Causa:</b></a> ' + motivazione
      );

    // ✅ Quando si apre un popup, attacca il listener
    map.on('popupopen', function(e) {
      const causeLink = document.getElementById('causeLink');
      if (causeLink) {
        causeLink.addEventListener('click', function(event) {
          event.preventDefault();
          // Nascondi mappa e mostra pagina info
          document.getElementById('map').style.display = 'none';
          document.getElementById('infoPage').style.display = 'block';
          map.closePopup();
        });
      }
    });

    // ✅ Gestione pulsante indietro
    document.getElementById('backButton').addEventListener('click', function() {
      document.getElementById('infoPage').style.display = 'none';
      document.getElementById('map').style.display = 'block';
    });
  </script>
</body>
</html>
`;
// Componente per le singole statistiche
const StatBox = ({ title, value, flex }) => (
  <View style={[styles.statBox, { flex }]}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();
  const [isTracking, setIsTracking] = React.useState(false);
  const [activeMode, setActiveMode] = React.useState('biking');

  const toggleTracking = () => setIsTracking(prev => !prev);

  const mapHeightPercentage = isTracking
    ? MAP_HEIGHT_PERCENTAGE_TRACKING
    : MAP_HEIGHT_PERCENTAGE_INITIAL;

  const modeOptions = [
    { key: 'walking', size: 16 },
    { key: 'biking', size: 20 },
    { key: 'bus', size: 16 }
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <SafeAreaView style={styles.contentWrapper} edges={['left', 'right']}>

        {/* mappa */}
        <View style={[styles.mapWebViewContainer, { height: `${mapHeightPercentage}%` }]}>
          
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
          />

          {/* per localizzazione (in futuro) */}
          <TouchableOpacity style={styles.targetIcon}>
            <FontAwesome5 name="crosshairs" size={18} color="#FFF" />
          </TouchableOpacity>

          {/* ui iniziale */}
          {!isTracking && (
            <View style={styles.bottomUIOverlay}>

              {/* mod trasporto */}
              <View style={styles.modeSelector}>
                {modeOptions.map(({ key, size }) => (
                  <TouchableOpacity key={key} onPress={() => setActiveMode(key)}>
                    <FontAwesome5
                      name={key}
                      size={size}
                      color={activeMode === key ? '#000' : '#888'}
                      style={activeMode === key ? styles.modeIconActive : styles.modeIcon}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* start traking */}
              <TouchableOpacity style={styles.startButton} onPress={toggleTracking}>
                <Text style={styles.stopButtonText}>Inizia a registrare</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

        {/* traking */}
        {isTracking && (
          <View style={styles.statsContainer}>
            
            <View style={styles.statsRow}>
              <StatBox title="Tempo" value="00:24:15" flex={1} />
              <View style={{ width: 8 }} />
              <StatBox title="Distanza" value="1.2 km" flex={1} />
            </View>

            <View style={styles.statsRow}>
              <StatBox title="CO₂ risparmiata" value="0.1 kg" flex={2} />
            </View>

            <TouchableOpacity style={styles.stopButton} onPress={toggleTracking}>
              <Text style={styles.stopButtonText}>☐ Ferma</Text>
            </TouchableOpacity>

          </View>
        )}
        {/* Spacer per evitare spazio vuoto */}
        <View style={{ flex: 1 }} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mapWebViewContainer: {
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  targetIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 2,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },

  // ui iniziale
  bottomUIOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 15,
    paddingBottom: 25,
    zIndex: 2,
    backgroundColor: 'rgba(18, 18, 18, 0.85)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  // mod trasposrto
  modeSelector: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-around',
    alignSelf: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  modeIcon: {
    color: '#BBBBBB',
    opacity: 0.6,
    padding: 5,
  },
  modeIconActive: {
    color: '#FFFFFF',
    backgroundColor: '#0C8024',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  // bottoni
  startButton: {
    backgroundColor: '#15D32F',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#15D32F',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  stopButtonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // stats
  statsContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statBox: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 70,
  },
  statTitle: {
    color: '#BBBBBB',
    fontSize: 12,
    marginBottom: 3,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

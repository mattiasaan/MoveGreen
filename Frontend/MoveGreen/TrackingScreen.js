import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="light-content"
        translucent={false}
        backgroundColor="#000000"
      />

      <SafeAreaView style={styles.webviewWrapper} edges={['left', 'right', 'bottom']}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webviewWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
});

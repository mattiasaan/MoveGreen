import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, StatusBar, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAP_HEIGHT_PERCENTAGE_INITIAL = 100;
const MAP_HEIGHT_PERCENTAGE_TRACKING = 70;

const CO2_FACTORS = {
  walking: 0.21,
  biking: 0.25,
  bus: 0.09
};

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
    #map {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map').setView([46.4983, 11.3548], 15);

    L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      subdomains: ['a','b','c'],
      maxZoom: 19
    }).addTo(map);

let userMarker = null;
let accuracyCircle = null;
let polyline = L.polyline([], { color: 'lime', weight: 5 }).addTo(map);

let markersLayer = L.layerGroup().addTo(map);

document.addEventListener("message", function(event) {
  const data = JSON.parse(event.data);

  if(data.type === "LOCATION"){
    const { latitude, longitude, accuracy } = data.coords;

    // Aggiorna linea del percorso
    polyline.addLatLng([latitude, longitude]);

    // Marker utente
    if (!userMarker) {
      userMarker = L.circleMarker([latitude, longitude], {
        radius: 10,
        color: 'white',
        weight: 3,
        fillColor: '#0078FF',
        fillOpacity: 1
      }).addTo(map);
    } else {
      userMarker.setLatLng([latitude, longitude]);
    }

    // Cerchio di accuratezza
    if (!accuracyCircle) {
      accuracyCircle = L.circle([latitude, longitude], {
        radius: accuracy,
        color: '#4DA3FF',
        fillColor: '#4DA3FF',
        fillOpacity: 0.15,
        weight: 1
      }).addTo(map);
    } else {
      accuracyCircle.setLatLng([latitude, longitude]);
      accuracyCircle.setRadius(accuracy);
    }

    map.setView([latitude, longitude]);
  }

  // RESET mappa
  if(data.type === "RESET"){
    if(polyline) {
      polyline.setLatLngs([]);
    }
    if(userMarker) {
      map.removeLayer(userMarker);
      userMarker = null;
    }
    if(accuracyCircle) {
      map.removeLayer(accuracyCircle);
      accuracyCircle = null;
    }
  }

  // Mostra marker
  if (data.type === "MARKERS" && Array.isArray(data.markers)) {
    markersLayer.clearLayers();
    data.markers.forEach((m) => {
      const iconColor =
        m.category === "traffico" ? "red" :
        m.category === "strada_chiusa" ? "orange" :
        "blue";
        
      const marker = L.circleMarker([m.lat, m.lon], {
        radius: 8,
        color: iconColor,
        fillColor: iconColor,
        fillOpacity: 0.8
      })
        .bindPopup('<b>' + m.title + '</b><br>' + m.description)
        .addTo(markersLayer);
    });
  }
});
  </script>
</body>
</html>
`;

const StatBox = ({ title, value, flex }) => (
  <View style={[styles.statBox, { flex }]}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export default function TrackingScreen() {
  const [userId, setUserId] = useState(null);

  const insets = useSafeAreaInsets();
  const [isTracking, setIsTracking] = useState(false);
  const [activeMode, setActiveMode] = useState('biking');

  const [coords, setCoords] = useState([]);
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const watchRef = useRef(null);
  const timerRef = useRef(null);
  const webviewRef = useRef(null);

  const mapHeightPercentage = isTracking
    ? MAP_HEIGHT_PERCENTAGE_TRACKING
    : MAP_HEIGHT_PERCENTAGE_INITIAL;

  const modeOptions = [
    { key: 'walking', size: 26 },
    { key: 'biking', size: 26 },
    { key: 'bus', size: 26 }
  ];

  const loadUserData = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(id);
    } catch (error) {
      console.log("Errore recupero dati:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const fetchMarkers = async () => {
    try {
      const res = await fetch("http://192.168.1.5:8001/report/");
      const data = await res.json();

      webviewRef.current?.postMessage(
        JSON.stringify({
          type: "MARKERS",
          markers: data
        })
      );
    } catch (err) {
      console.log("Errore fetch markers:", err);
    }
  };

  useEffect(() => {
    fetchMarkers(); // prima chiamata
    const interval = setInterval(fetchMarkers, 60000);
    return () => clearInterval(interval);
  }, []);

  const startTracking = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permesso posizione richiesto!');
    return;
  }

  setIsTracking(true);
  setCoords([]);
  setDistance(0);

  const initialTime = Date.now();
  setStartTime(initialTime);
  setElapsedTime(0);

  if (timerRef.current) clearInterval(timerRef.current);

  timerRef.current = setInterval(() => {
    setElapsedTime(Math.floor((Date.now() - initialTime) / 1000));
  }, 1000);

  watchRef.current = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 5,
    },
    (loc) => {
      setCoords((prev) => {
        if (prev.length > 0) {
          const newDist = getDistance(prev[prev.length - 1], loc.coords);
          setDistance((d) => d + newDist);
        }

        webviewRef.current?.postMessage(
          JSON.stringify({
            type: 'LOCATION',
            coords: loc.coords,
          })
        );

        return [...prev, loc.coords];
      });
    }
  );
};


  const stopTracking = () => {
  setIsTracking(false);

  if (watchRef.current) {
    watchRef.current.remove();
    watchRef.current = null;
  }

  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  // reset mappa
  webviewRef.current?.postMessage(JSON.stringify({ type: "RESET" }));

  // Dati per server
  const payload = {
    user_id: userId,
    mode: activeMode,
    distance: distance / 1000,
    time_seconds: elapsedTime,
    co2_saved: parseFloat(((distance / 1000) * CO2_FACTORS[activeMode]).toFixed(2)),
    timestamp: new Date().toISOString()
  };

  console.log("Invio dati tracking:", payload);

  fetch("http://192.168.1.5:8001/traking/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => console.log("risposta", data))
    .catch(err => console.log("Errore invio", err));
    console.log("print 2", payload);

  setElapsedTime(0);
  setStartTime(null);
  setDistance(0);
  setCoords([]);
};




  const co2Saved = ((distance / 1000) * CO2_FACTORS[activeMode]).toFixed(2);

  const formatTime = (sec) => {
  const h = Math.floor(sec / 3600).toString().padStart(2, '0');
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};


  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <SafeAreaView style={styles.contentWrapper} edges={['left', 'right']}>

        <View style={[styles.mapWebViewContainer, { height: mapHeightPercentage + '%' }]}>
          
          <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={{ html }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            onLoadEnd={() => {fetchMarkers()}}
          />

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

              <TouchableOpacity style={styles.startButton} onPress={startTracking}>
                <Text style={styles.stopButtonText}>Inizia a registrare</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

        {/* traking */}
        {isTracking && (
          <View style={styles.statsContainer}>
            
            <View style={styles.statsRow}>
              <StatBox title="Tempo" value={formatTime(elapsedTime)} flex={1} />
              <View style={{ width: 8 }} />
              <StatBox title="Distanza" value={(distance / 1000).toFixed(2) + ' km'} flex={1} />
            </View>

            <View style={styles.statsRow}>
              <StatBox title="CO₂ risparmiata" value={co2Saved + ' kg'} flex={2} />
            </View>

            <TouchableOpacity style={styles.stopButton} onPress={stopTracking}>
              <Text style={styles.stopButtonText}>Ferma</Text>
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

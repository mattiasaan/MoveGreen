import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, StatusBar, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


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

if (data.type === "MARKERS" && Array.isArray(data.markers)) {
  markersLayer.clearLayers();

  const svgs = {
    traffico: '<svg fill="#000000" viewBox="-3.2 -3.2 38.40 38.40" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-3.2, -3.2), scale(2.4)" fill="#fff700" d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.64"></g><g id="SVGRepo_iconCarrier"> <defs> <style> .cls-1 { fill: none; } </style> </defs> <rect x="11" y="21" width="6" height="2"></rect> <path d="M24.2456,8,25.96,14H30V12H27.4688l-1.3-4.5488A2.0077,2.0077,0,0,0,24.2456,6H22.8972l-.7287-2.5488A2.0077,2.0077,0,0,0,20.2456,2H7.7544A2.0078,2.0078,0,0,0,5.8315,3.4507L4.5312,8H2v2H6.04L7.7544,4H20.2456l.5715,2H11.7544A2.008,2.008,0,0,0,9.8315,7.45L8.8171,11H7.7144a1.9981,1.9981,0,0,0-1.8916,1.3516L4.5715,16H2v2H4v7a2.0025,2.0025,0,0,0,2,2v3H8V27H20v3h2V27a2.0025,2.0025,0,0,0,2-2V18h2V16H23.4287l-1.251-3.6475A1.9988,1.9988,0,0,0,20.2856,11H10.897l.8574-3ZM22,19v2H20v2h2v2H6V23H8V21H6V19Zm-.3429-2H6.3428l1.3716-4H20.2856Z" transform="translate(0 0)"></path> <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect> </g></svg>',
    strada_chiusa: '<svg fill="#000000" viewBox="-6.24 -6.24 36.48 36.48" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-6.24, -6.24), scale(2.28)" fill="#ff0000" d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.97,2.242l-5,20A1,1,0,0,1,2,23a1.025,1.025,0,0,1-.244-.03,1,1,0,0,1-.727-1.212l5-20a1,1,0,1,1,1.94.484Zm10-.484a1,1,0,1,0-1.94.484l5,20A1,1,0,0,0,22,23a1.017,1.017,0,0,0,.243-.03,1,1,0,0,0,.728-1.212ZM12,1a1,1,0,0,0-1,1V6a1,1,0,0,0,2,0V2A1,1,0,0,0,12,1Zm0,7.912a1,1,0,0,0-1,1v4.176a1,1,0,1,0,2,0V9.912A1,1,0,0,0,12,8.912ZM12,17a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V18A1,1,0,0,0,12,17Z"></path></g></svg>',
    incidente: '<svg fill="#000000" viewBox="-3.6 -3.6 31.20 31.20" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-3.6, -3.6), scale(1.9500000000000002)" fill="#ff0000" d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2.634 17.918a1.765 1.765 0 0 0 1.201 1.291l.18.791H4v2h16v-2H6.683a.84.84 0 0 0-.007-.278l-.196-.863 10.357-2.356.196.863a.886.886 0 0 0 1.06.667l.863-.197a.885.885 0 0 0 .667-1.06l-.251-1.103c.446-.416.67-1.046.525-1.683l-.59-2.59a1.76 1.76 0 0 0-1.262-1.307l-2.049-3.378a2.774 2.774 0 0 0-2.982-1.263l-7.868 1.79a2.769 2.769 0 0 0-2.144 2.43l-.387 3.932a1.76 1.76 0 0 0-.57 1.724l.589 2.59zm3.02-.688a1.327 1.327 0 1 1-.59-2.589 1.327 1.327 0 0 1 .59 2.589zm11.222-2.552a1.328 1.328 0 1 1-.59-2.587 1.328 1.328 0 0 1 .59 2.587zM5.589 9.192l7.869-1.791a.773.773 0 0 1 .83.351l1.585 2.613-.566.129-10.046 2.287-.568.129.299-3.042a.772.772 0 0 1 .597-.676zM18.405 4 17 2l-.5 3L19 9l3 1-2-2.539 2-.933-2-.933L22 2z"></path></g></svg>',
    lavori: '<svg viewBox="-6.48 -6.48 36.96 36.96" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-6.48, -6.48), scale(2.31)" fill="#fff700" d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-miterlimit:10;stroke-width:1.91px;}</style></defs><rect class="cls-1" x="6.6" y="9.98" width="10.8" height="4.05" transform="translate(-4.97 12) rotate(-45)"></rect><circle class="cls-1" cx="18.68" cy="5.32" r="3.82"></circle><circle class="cls-1" cx="5.32" cy="18.68" r="3.82"></circle><path class="cls-1" d="M12,9.14,9.14,12,6.27,9.14H4.36A2.87,2.87,0,0,1,1.5,6.27V4.36l.4.4A2.1,2.1,0,0,0,4.69,5a2,2,0,0,0,.15-3L4.36,1.5H6.27A2.87,2.87,0,0,1,9.14,4.36V6.27Z"></path><path class="cls-1" d="M19.64,14.86a2.87,2.87,0,0,1,2.86,2.87v1.91l-.4-.4A2.1,2.1,0,0,0,19.31,19a2,2,0,0,0-.15,3l.48.48H17.73a2.87,2.87,0,0,1-2.87-2.86V17.73L12,14.86,14.86,12l2.87,2.86Z"></path></g></svg>',
    generico: '<svg fill="#000000" viewBox="-2.4 -2.4 28.80 28.80" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-2.4, -2.4), scale(1.7999999999999998)" fill="#fff700" d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2,20H22L12,4Zm11-2.5a1,1,0,0,1-2,0V14a1,1,0,0,1,2,0Zm.5-8A1.5,1.5,0,1,1,12,8,1.5,1.5,0,0,1,13.5,9.5Z"></path></g></svg>'
  };

  function svgToDataUrl(svg) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  data.markers.forEach(function(m) {
    var chosenSvg = svgs[m.category] || svgs['generico'];
    var iconUrl = svgToDataUrl(chosenSvg);

    var customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
      className: 'custom-marker-icon'
    });

    var popupHtml =
      '<div style="font-family: sans-serif; min-width: 160px;">' +
        '<b>' + (m.title || 'Senza titolo') + '</b><br/>' +
        '<div style="margin-top:6px; font-size:13px; color:#222;">' + (m.description || '') + '</div>' +
        '<div style="margin-top:8px; font-size:11px; color:#666;"><i>Tipo: ' + (m.type || '-') + '</i></div>' +
      '</div>';

    var marker = L.marker([m.lat, m.lon], { icon: customIcon })
      .bindPopup(popupHtml)
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
      const res = await fetch("http://192.168.1.16:8001/report/");
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
    fetchMarkers();
    const interval = setInterval(fetchMarkers, 60000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
  React.useCallback(() => {
    fetchMarkers();
  }, [])
);

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

  fetch("http://192.168.1.16:8001/traking/", {
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

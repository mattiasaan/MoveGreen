import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

const { height } = Dimensions.get("window");

export default function ReportScreen() {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [marker, setMarker] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const webviewRef = useRef(null);

  // 🔹 Ottieni posizione attuale nativa
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permesso posizione non concesso");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
      });
    })();
  }, []);

  // 🔹 Invia posizione e tipo alla WebView
  useEffect(() => {
    if (mapVisible && userLocation) {
      setTimeout(() => {
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: "USER_POSITION",
            coords: userLocation,
          })
        );
      }, 1000);
    }
  }, [mapVisible, userLocation]);

  // 🔹 Invia tipo selezionato (per aggiornare marker)
  useEffect(() => {
    if (mapVisible && selectedType) {
      webviewRef.current?.postMessage(
        JSON.stringify({
          type: "SELECTED_TYPE",
          selectedType,
        })
      );
    }
  }, [selectedType, mapVisible]);

  const types = [
    { key: "traffico", icon: "car", color: "red", label: "Traffico" },
    { key: "strada_chiusa", icon: "road", color: "orange", label: "Strada chiusa" },
    { key: "incidenti", icon: "exclamation-triangle", color: "yellow", label: "Incidente" },
    { key: "lavori", icon: "tools", color: "#15D32F", label: "Lavori" },
  ];

  const categories = [
    { key: "leggera", label: "Leggera" },
    { key: "moderata", label: "Moderata" },
    { key: "grave", label: "Grave" },
  ];

  // 🔹 HTML WebView con marker personalizzati
  const htmlMap = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
      #map { height: 100%; width: 100%; }
      .pulse {
        background: #4285F4;
        border-radius: 50%;
        height: 16px;
        width: 16px;
        position: absolute;
        margin: -8px 0 0 -8px;
        box-shadow: 0 0 0 rgba(66,133,244, 0.4);
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(66,133,244, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(66,133,244, 0); }
        100% { box-shadow: 0 0 0 0 rgba(66,133,244, 0); }
      }
      .map-btn {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #15D32F;
        color: #121212;
        font-weight: bold;
        border: none;
        border-radius: 12px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        z-index: 999;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <button class="map-btn" id="locateBtn">Usa la mia posizione</button>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const map = L.map('map').setView([46.4983, 11.3548], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      let userMarker = null;
      let reportMarker = null;
      let selectedType = null;

      const markerIcons = {
        traffico: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
        lavori: 'https://cdn-icons-png.flaticon.com/512/2965/2965879.png',
        incidenti: 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
        strada_chiusa: 'https://cdn-icons-png.flaticon.com/512/854/854893.png',
        default: 'https://cdn-icons-png.flaticon.com/512/684/684908.png'
      };

      function getIcon(type) {
        return L.icon({
          iconUrl: markerIcons[type] || markerIcons.default,
          iconSize: [38, 38],
          iconAnchor: [19, 38],
        });
      }

      function showUserPosition(lat, lng) {
        if (userMarker) map.removeLayer(userMarker);
        const div = document.createElement('div');
        div.className = 'pulse';
        userMarker = L.marker([lat, lng], {
          icon: L.divIcon({ className: '', html: div.outerHTML }),
        }).addTo(map);
      }

      function showReportMarker(lat, lng, type = 'default') {
        if (reportMarker) map.removeLayer(reportMarker);
        const icon = getIcon(type);
        reportMarker = L.marker([lat, lng], { icon }).addTo(map);
      }

      map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        showReportMarker(lat, lon, selectedType);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'POSITION_SELECTED',
          coords: { lat, lon }
        }));
      });

      document.getElementById('locateBtn').addEventListener('click', () => {
        if (window.lastUserPosition) {
          const { lat, lon } = window.lastUserPosition;
          showReportMarker(lat, lon, selectedType);
          map.setView([lat, lon], 16);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'POSITION_SELECTED',
            coords: { lat, lon }
          }));
        }
      });

      document.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'USER_POSITION') {
            const { lat, lon } = data.coords;
            window.lastUserPosition = data.coords;
            showUserPosition(lat, lon);
            map.setView([lat, lon], 16);
          } else if (data.type === 'SELECTED_TYPE') {
            selectedType = data.selectedType;
          }
        } catch (err) {
          console.error('Errore messaggio:', err);
        }
      });
    </script>
  </body>
  </html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "POSITION_SELECTED") {
        setMarker(data.coords);
      }
    } catch (err) {
      console.log("Errore parsing messaggio WebView:", err);
    }
  };

  const handleConfirmPosition = () => {
    if (!marker) {
      alert("Tocca un punto o usa la tua posizione per selezionare il punto.");
      return;
    }
    console.log("Posizione selezionata:", marker);
    setMapVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.mapContainer}>
          <WebView
            originWhitelist={["*"]}
            source={{
              html: `
                <html><head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <style> html, body { margin: 0; height: 100%; } #map { height: 100%; } </style>
                </head><body><div id="map"></div>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <script>
                const map = L.map('map', { zoomControl: false, dragging: false }).setView([46.4983, 11.3548], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                ${marker ? `L.marker([${marker.lat}, ${marker.lon}]).addTo(map);` : ""}
                </script></body></html>
              `,
            }}
            style={styles.webview}
            scrollEnabled={false}
          />
        </View>

        <TouchableOpacity
          style={styles.locationSelectButton}
          onPress={() => setMapVisible(true)}
        >
          <Ionicons name="map-outline" size={22} color="#fff" />
          <Text style={styles.locationSelectText}>
            Seleziona posizione su mappa
          </Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Nuova segnalazione</Text>

          <Text style={styles.label}>Tipologia</Text>
          <View style={styles.selectorRow}>
            {types.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.selectorItem,
                  selectedType === t.key && styles.selectorActive,
                ]}
                onPress={() => setSelectedType(t.key)}
              >
                <FontAwesome5 name={t.icon} size={20} color={t.color} />
                <Text style={styles.selectorText}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.selectorRow}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c.key}
                style={[
                  styles.selectorItem,
                  selectedCategory === c.key && styles.selectorActive,
                ]}
                onPress={() => setSelectedCategory(c.key)}
              >
                <MaterialCommunityIcons
                  name="shape"
                  size={20}
                  color={selectedCategory === c.key ? "#15D32F" : "#999"}
                />
                <Text style={styles.selectorText}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Titolo</Text>
          <TextInput
            placeholder="Es: Lavori in corso"
            onChangeText={setTitle}
            value={title}
            style={styles.inputBar}
            placeholderTextColor="#555"
          />

          <Text style={styles.label}>Descrizione</Text>
          <TextInput
            placeholder="Inserisci una descrizione..."
            onChangeText={setDescription}
            value={description}
            style={[styles.inputBar, styles.textArea]}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#555"
          />
        </View>
      </ScrollView>

      {/* MAPPA FULLSCREEN */}
      <Modal visible={mapVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <WebView
            ref={webviewRef}
            originWhitelist={["*"]}
            source={{ html: htmlMap }}
            style={{ flex: 1 }}
            onMessage={handleMessage}
          />
          <View style={styles.mapButtons}>
            <TouchableOpacity
              style={[styles.mapButton, { backgroundColor: "#121212" }]}
              onPress={() => setMapVisible(false)}
            >
              <Text style={styles.mapButtonText}>Annulla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mapButton, { backgroundColor: "#15D32F" }]}
              onPress={handleConfirmPosition}
            >
              <Text style={[styles.mapButtonText, { color: "#121212" }]}>
                Conferma posizione
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#121212" },
  scrollContainer: { flex: 1, backgroundColor: "#121212" },
  mapContainer: {
    width: "100%",
    height: height * 0.25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  webview: { flex: 1 },
  locationSelectButton: {
    margin: 20,
    backgroundColor: "#15D32F",
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  locationSelectText: { color: "#121212", fontWeight: "bold", fontSize: 16 },
  formContainer: { padding: 20 },
  sectionTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: { color: "#fff", fontSize: 16, marginTop: 15, marginBottom: 6 },
  selectorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  selectorItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  selectorActive: { backgroundColor: "#0C8024" },
  selectorText: { color: "#fff", marginLeft: 8, fontSize: 14 },
  inputBar: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    minHeight: 50,
    color: "#000",
  },
  textArea: { minHeight: 120 },
  modalContainer: { flex: 1, backgroundColor: "#000" },
  mapButtons: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  mapButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  mapButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

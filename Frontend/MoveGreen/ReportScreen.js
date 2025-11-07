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
  StatusBar
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get("window");

export default function ReportScreen() {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [marker, setMarker] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userId, setUserId] = useState(null);

  const webviewRef = useRef(null);

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
    { key: "incidente", icon: "exclamation-triangle", color: "yellow", label: "Incidente" },
    { key: "lavori", icon: "tools", color: "#15D32F", label: "Lavori" },
    { key: "altro", icon: "info-circle", color: "#15D32F", label: "Altro" },
  ];

  const categories = [
    { key: "leggera", label: "Leggera" },
    { key: "moderata", label: "Moderata" },
    { key: "grave", label: "Grave" },
  ];

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
    <div id="map"></div>d
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

      const svgs = {
        traffico: '<svg fill="#000000" viewBox="-3.2 -3.2 38.40 38.40" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-3.2, -3.2), scale(2.4)" fill="#fff700" d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.64"></g><g id="SVGRepo_iconCarrier"> <defs> <style> .cls-1 { fill: none; } </style> </defs> <rect x="11" y="21" width="6" height="2"></rect> <path d="M24.2456,8,25.96,14H30V12H27.4688l-1.3-4.5488A2.0077,2.0077,0,0,0,24.2456,6H22.8972l-.7287-2.5488A2.0077,2.0077,0,0,0,20.2456,2H7.7544A2.0078,2.0078,0,0,0,5.8315,3.4507L4.5312,8H2v2H6.04L7.7544,4H20.2456l.5715,2H11.7544A2.008,2.008,0,0,0,9.8315,7.45L8.8171,11H7.7144a1.9981,1.9981,0,0,0-1.8916,1.3516L4.5715,16H2v2H4v7a2.0025,2.0025,0,0,0,2,2v3H8V27H20v3h2V27a2.0025,2.0025,0,0,0,2-2V18h2V16H23.4287l-1.251-3.6475A1.9988,1.9988,0,0,0,20.2856,11H10.897l.8574-3ZM22,19v2H20v2h2v2H6V23H8V21H6V19Zm-.3429-2H6.3428l1.3716-4H20.2856Z" transform="translate(0 0)"></path> <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect> </g></svg>',
        strada_chiusa: '<svg fill="#000000" viewBox="-6.24 -6.24 36.48 36.48" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-6.24, -6.24), scale(2.28)" fill="#ff0000" d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.97,2.242l-5,20A1,1,0,0,1,2,23a1.025,1.025,0,0,1-.244-.03,1,1,0,0,1-.727-1.212l5-20a1,1,0,1,1,1.94.484Zm10-.484a1,1,0,1,0-1.94.484l5,20A1,1,0,0,0,22,23a1.017,1.017,0,0,0,.243-.03,1,1,0,0,0,.728-1.212ZM12,1a1,1,0,0,0-1,1V6a1,1,0,0,0,2,0V2A1,1,0,0,0,12,1Zm0,7.912a1,1,0,0,0-1,1v4.176a1,1,0,1,0,2,0V9.912A1,1,0,0,0,12,8.912ZM12,17a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V18A1,1,0,0,0,12,17Z"></path></g></svg>',
        incidente: '<svg fill="#000000" viewBox="-3.6 -3.6 31.20 31.20" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-3.6, -3.6), scale(1.9500000000000002)" fill="#ff0000" d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2.634 17.918a1.765 1.765 0 0 0 1.201 1.291l.18.791H4v2h16v-2H6.683a.84.84 0 0 0-.007-.278l-.196-.863 10.357-2.356.196.863a.886.886 0 0 0 1.06.667l.863-.197a.885.885 0 0 0 .667-1.06l-.251-1.103c.446-.416.67-1.046.525-1.683l-.59-2.59a1.76 1.76 0 0 0-1.262-1.307l-2.049-3.378a2.774 2.774 0 0 0-2.982-1.263l-7.868 1.79a2.769 2.769 0 0 0-2.144 2.43l-.387 3.932a1.76 1.76 0 0 0-.57 1.724l.589 2.59zm3.02-.688a1.327 1.327 0 1 1-.59-2.589 1.327 1.327 0 0 1 .59 2.589zm11.222-2.552a1.328 1.328 0 1 1-.59-2.587 1.328 1.328 0 0 1 .59 2.587zM5.589 9.192l7.869-1.791a.773.773 0 0 1 .83.351l1.585 2.613-.566.129-10.046 2.287-.568.129.299-3.042a.772.772 0 0 1 .597-.676zM18.405 4 17 2l-.5 3L19 9l3 1-2-2.539 2-.933-2-.933L22 2z"></path></g></svg>',
        lavori: '<svg viewBox="-6.48 -6.48 36.96 36.96" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-6.48, -6.48), scale(2.31)" fill="#fff700" d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-miterlimit:10;stroke-width:1.91px;}</style></defs><rect class="cls-1" x="6.6" y="9.98" width="10.8" height="4.05" transform="translate(-4.97 12) rotate(-45)"></rect><circle class="cls-1" cx="18.68" cy="5.32" r="3.82"></circle><circle class="cls-1" cx="5.32" cy="18.68" r="3.82"></circle><path class="cls-1" d="M12,9.14,9.14,12,6.27,9.14H4.36A2.87,2.87,0,0,1,1.5,6.27V4.36l.4.4A2.1,2.1,0,0,0,4.69,5a2,2,0,0,0,.15-3L4.36,1.5H6.27A2.87,2.87,0,0,1,9.14,4.36V6.27Z"></path><path class="cls-1" d="M19.64,14.86a2.87,2.87,0,0,1,2.86,2.87v1.91l-.4-.4A2.1,2.1,0,0,0,19.31,19a2,2,0,0,0-.15,3l.48.48H17.73a2.87,2.87,0,0,1-2.87-2.86V17.73L12,14.86,14.86,12l2.87,2.86Z"></path></g></svg>',
        generico: '<svg fill="#000000" viewBox="-2.4 -2.4 28.80 28.80" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-2.4, -2.4), scale(1.7999999999999998)" fill="#fff700" d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2,20H22L12,4Zm11-2.5a1,1,0,0,1-2,0V14a1,1,0,0,1,2,0Zm.5-8A1.5,1.5,0,1,1,12,8,1.5,1.5,0,0,1,13.5,9.5Z"></path></g></svg>'
      };

      function getIcon(type) {
        const svg = svgs[type] || svgs.generico;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = svg.trim();
        wrapper.style.width = '38px';
        wrapper.style.height = '38px';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';

        return L.divIcon({
          className: '',
          html: wrapper.outerHTML,
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

      function showReportMarker(lat, lng) {
        if (reportMarker) map.removeLayer(reportMarker);

        const icon = L.icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

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


  const loadUserData = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(id);
    } catch(error) {
      console.log("Errore recupero dati:", error)
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSubmit = async () => {
  if (!selectedType || !selectedCategory || !title || !description || !marker) {
    alert("Compila tutti i campi e seleziona una posizione sulla mappa.");
    return;
  }


  const payload = {
    user_id: userId,
    title: title,
    description: description,
    category: selectedType,
    type: selectedCategory,
    lat: marker.lat,
    lon: marker.lon,
  };

  console.log(payload)

  try {
    const response = await fetch("http://192.168.1.5:8001/report/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      alert("Segnalazione inviata con successo!");
      console.log("Server response:", data);

      // Reset dei campi dopo invio
      setSelectedType(null);
      setSelectedCategory(null);
      setTitle("");
      setDescription("");
      setMarker(null);
    } else {
      const errorText = await response.text();
      console.error("Errore server:", errorText);
      alert("Errore durante l'invio della segnalazione");
    }
  } catch (error) {
    console.error("Errore di connessione:", error);
    alert("Impossibile connettersi al server");
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 80 }}
          enableOnAndroid={true}
          extraScrollHeight={80}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar barStyle="light-content" backgroundColor="#000000" />
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
            <TouchableOpacity
              style={[styles.submitButton]}
              onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Invia segnalazione</Text>
              </TouchableOpacity>
          </View>


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
      </KeyboardAwareScrollView>
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
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    minHeight: 50,
    color: "#fff",
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
  submitButton: {
  backgroundColor: "#15D32F",
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: "center",
  marginTop: 30,
  },
  submitButtonText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 18,
  },
});

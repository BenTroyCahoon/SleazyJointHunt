import React, { useState } from "react";
import { View, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ navigation, route }) => {
  const { huntName, estimatedTime, iconUri, description } = route.params;
  const [markers, setMarkers] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [step, setStep] = useState(0);

  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;

    if (step === 1) {
      setStartPoint(coordinate);
      setStep(2);
    } else if (step === 2) {
      setEndPoint(coordinate);
      setStep(3);
    } else if (step === 3) {
      setMarkers([...markers, coordinate]);
    }
  };

  const handleContinue = () => {
    if (!startPoint || !endPoint) {
      Alert.alert("Vänligen sätt ut både start- och slutpunkt.");
      return;
    }

    navigation.navigate("InvitePlayers", {
      huntName,
      estimatedTime,
      iconUri,
      description,
      startPoint,
      endPoint,
      markers,
    });
  };

  const startProcess = () => {
    if (step === 0) {
      Alert.alert(
        "Sätt ut dina markörer",
        "Tryck på kartan för att sätta ut startpunkt, slutpunkt och de där emellan.",
        [{ text: "OK", onPress: () => setStep(1) }]
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 57.7089, // Latitude för Göteborg
          longitude: 11.9746, // Longitude för Göteborg
          latitudeDelta: 0.0922, // Zoomnivå
          longitudeDelta: 0.0421, // Zoomnivå
        }}
        onMapReady={startProcess}
      >
        {startPoint && (
          <Marker coordinate={startPoint} pinColor="green" title="Start" />
        )}
        {endPoint && (
          <Marker coordinate={endPoint} pinColor="red" title="End" />
        )}
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} pinColor="blue" />
        ))}
      </MapView>
      <Button title="Fortsätt" onPress={handleContinue} />
    </View>
  );
};

export default MapScreen;

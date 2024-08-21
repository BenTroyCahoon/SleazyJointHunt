import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getHuntById } from "../util/http";
import { Camera } from "expo-camera";

const OnGoingHunt = ({ route, navigation }) => {
  const [huntDetails, setHuntDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  const { huntId } = route.params;

  useEffect(() => {
    const fetchHuntDetails = async () => {
      try {
        const details = await getHuntById(huntId);
        setHuntDetails(details);
      } catch (err) {
        setError("Kunde inte hämta jaktens detaljer.");
      } finally {
        setLoading(false);
      }
    };

    fetchHuntDetails();
  }, [huntId]);

  useEffect(() => {
    const requestCameraPermissions = async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestCameraPermissions();
  }, []);

  const handleMarkerPress = async (coordinate) => {
    if (!hasPermission) {
      Alert.alert("Ingen kameratillgång", "Tillåt kameran för att tilder.");
      return;
    }

    Alert.alert("Ta ett foto", "Vill du ta ett foto vid denna plats?", [
      {
        text: "Nej",
        style: "cancel",
      },
      {
        text: "Ja",
        onPress: async () => {
          // Förbered kamera för att ta ett foto
          if (camera) {
            const photo = await camera.takePictureAsync();
            console.log("Foto tagit:", photo.uri);
            // Här kan du spara bilden till databasen eller något annat
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Laddar jaktens detaljer...</Text>
      </View>
    );
  }

  if (error || !huntDetails) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Fel: {error || "Jaktens detaljer kunde inte laddas."}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: huntDetails.places.startPoint.latitude,
          longitude: huntDetails.places.startPoint.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={huntDetails.places.startPoint}
          pinColor="green"
          title="Start"
          onPress={() => handleMarkerPress(huntDetails.places.startPoint)}
        />
        <Marker
          coordinate={huntDetails.places.endPoint}
          pinColor="red"
          title="End"
          onPress={() => handleMarkerPress(huntDetails.places.endPoint)}
        />
        {huntDetails.places.markers &&
          huntDetails.places.markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              pinColor="blue"
              onPress={() => handleMarkerPress(marker)}
            />
          ))}
      </MapView>

      <Button
        title="Avbryt Jakt"
        onPress={() => {
          Alert.alert("Jakt Avbruten");
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default OnGoingHunt;

import React, { useEffect, useState } from "react";
import { View, Text, Alert, Button, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { getHuntById } from "../util/http";

const OnGoingHunts = ({ route, navigation }) => {
  const [huntDetails, setHuntDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedMarkers, setCompletedMarkers] = useState([]);

  const { huntId } = route.params;

  useEffect(() => {
    const fetchHuntDetails = async () => {
      try {
        const details = await getHuntById(huntId);
        setHuntDetails(details);
      } catch (err) {
        setError("Kunde inte hämta jaktens detaljer.");
        console.error("Error fetching hunt details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHuntDetails();
  }, [huntId]);

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
    return (
      cameraStatus.status === "granted" &&
      mediaLibraryStatus.status === "granted"
    );
  };

  const handleMarkerPress = async (index) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert("Behörighet", "Kameraåtkomst är inte tillåten.");
      return;
    }

    Alert.alert("Ta ett foto", "Vill du ta ett foto vid denna plats?", [
      { text: "Avbryt", style: "cancel" },
      { text: "Ja", onPress: async () => await takePicture(index) },
    ]);
  };

  const takePicture = async (index) => {
    const photo = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!photo.cancelled) {
      await MediaLibrary.createAssetAsync(photo.uri);
      Alert.alert("Foto tagits", "Bilden har sparats i din fotogalleri.");

      // Markera platsen som avklarad
      setCompletedMarkers([...completedMarkers, index]);
    }
  };

  const isMarkerCompleted = (index) => {
    return completedMarkers.includes(index);
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
        <Text>Fel: {error || "Jaktens detaljer kunde inte hämtas."}</Text>
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
        />
        <Marker
          coordinate={huntDetails.places.endPoint}
          pinColor="red"
          title="End"
        />
        {huntDetails.places.markers &&
          huntDetails.places.markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              pinColor={isMarkerCompleted(index) ? "gray" : "blue"}
              onPress={() => handleMarkerPress(index)}
              title={isMarkerCompleted(index) ? "Avklarad" : "Marker"}
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

export default OnGoingHunts;

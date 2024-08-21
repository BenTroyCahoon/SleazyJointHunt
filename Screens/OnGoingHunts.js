import React, { useEffect, useState } from "react";
import { View, Text, Alert, Button, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getHuntById } from "../util/http"; // Importera metoden för att hämta jaktens detaljer

const OnGoingHunt = ({ route, navigation }) => {
  const [huntDetails, setHuntDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { huntId } = route.params;

  useEffect(() => {
    console.log("huntID", huntId);
    const fetchHuntDetails = async () => {
      try {
        console.log("Fetching details for hunt ID:", huntId);
        const details = await getHuntById(huntId);
        setHuntDetails(details);
        console.log("Fetched hunt details:", details);
      } catch (err) {
        setError("Kunde inte hämta jaktens detaljer.");
        console.error("Error fetching hunt details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHuntDetails();
  }, [huntId]);

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
        <Text>Fel: {error || "Hunt details not found."}</Text>
      </View>
    );
  }
  console.log(huntDetails);
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
            <Marker key={index} coordinate={marker} pinColor="blue" />
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

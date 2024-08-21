import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getHuntById, getUserById } from "../util/http"; // Importera getUserById
import MapView, { Marker } from "react-native-maps";

const ConfirmHunt = ({ route }) => {
  const [huntDetails, setHuntDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const { huntId } = route.params;

  useEffect(() => {
    console.log('confirmGunt ')
    const loadHuntDetails = async () => {
      try {
        const { huntId } = route.params;

        const details = await getHuntById(huntId);
        setHuntDetails(details);

        // Hämta användare från invitedUsers som nu är objekt med id
        const participantData = await Promise.all(
          details.invitedUsers.map((user) => getUserById(user.id))
        );
        setParticipants(participantData);
      } catch (err) {
        setError("Kunde inte hämta jaktens detaljer.");
        console.error("Error fetching hunt details CH:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHuntDetails();
  }, [route.params]);

  const confirmParticipation = () => {
    Alert.alert(
      "Bekräfta deltagande",
      "Är du säker på att du vill delta i denna jakt?",
      [
        {
          text: "Avbryt",
          style: "cancel",
        },
        {
          text: "Ja",
          onPress: () => {
            Alert.alert("Du är nu registrerad för jakten!");
            navigation.navigate("OnGoingHunts", { huntId });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Laddar jaktens detaljer...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Fel: {error}</Text>
      </View>
    );
  }

  const { name, time, places } = huntDetails;
  const { startPoint, endPoint, markers } = places;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Bekräfta Hunt</Text>
      <View style={styles.itemContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.huntName}>{name}</Text>
          <Text style={styles.huntTime}>Uppskattad tid: </Text>
          <Text style={styles.huntTime}>{time} timmar</Text>
          <Text style={styles.participants}> Deltagare: </Text>
          <Text style={styles.participants}>
            {participants.map((user) => user.username).join(", ")}
          </Text>
        </View>
      </View>

      <Text style={styles.subHeader}>Här är pinsen du ska gå till:</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (startPoint.latitude + endPoint.latitude) / 2,
          longitude: (startPoint.longitude + endPoint.longitude) / 2,
          latitudeDelta: Math.abs(startPoint.latitude - endPoint.latitude) * 2,
          longitudeDelta:
            Math.abs(startPoint.longitude - endPoint.longitude) * 2,
        }}
      >
        <Marker coordinate={startPoint} title="Startpunkt" pinColor="green" />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            title={`Marker ${index + 1}`}
            pinColor="blue"
          />
        ))}
        {endPoint && (
          <Marker coordinate={endPoint} title="Slutpunkt" pinColor="red" />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button
          title="Bekräfta"
          onPress={confirmParticipation}
          color="#275829"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9bc39e",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#275829",
    textAlign: "center",
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#fbfbfbff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  huntName: {
    fontSize: 23,
    color: "#2C6B2F",
    fontWeight: "bold",
    paddingBottom: 5,
  },
  huntTime: {
    fontSize: 16,
    color: "#43A047",
  },
  participants: {
    fontSize: 16,
    color: "#853923",
    marginTop: 5,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#275829",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 475,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default ConfirmHunt;

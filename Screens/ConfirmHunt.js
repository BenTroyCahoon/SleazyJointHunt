import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getHuntById, getUserById } from "../util/http"; // Importera getUserById

const ConfirmHunt = ({ route }) => {
  const [huntDetails, setHuntDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadHuntDetails = async () => {
      try {
        const { huntId } = route.params;
        const details = await getHuntById(huntId);
        setHuntDetails(details);

        // Hämta information om alla deltagare
        const participantData = await Promise.all(
          details.invitedUsers.map((userId) => getUserById(userId))
        );
        setParticipants(participantData);
      } catch (err) {
        setError("Kunde inte hämta jaktens detaljer.");
        console.error(err);
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
            navigation.navigate("OnGoingHunts"); 
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Laddar jaktens detaljer...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Fel: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        {huntDetails.name}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Starttid: {huntDetails.time}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        Deltagare: {participants.map((user) => user.username).join(", ")}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        Beskrivning:{" "}
        {huntDetails.description || "Ingen beskrivning tillgänglig."}
      </Text>

      <Button title="Bekräfta" onPress={confirmParticipation} />
    </View>
  );
};

export default ConfirmHunt;

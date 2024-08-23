import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getHuntById, fetchAllUsers } from "../util/http";

const HuntDetails = ({ route }) => {
  const { huntId } = route.params;
  const [hunt, setHunt] = useState(null);
  const [huntCreator, setHuntCreator] = useState("Okänd skapare");
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHuntAndUsers = async () => {
      try {
        const huntData = await getHuntById(huntId);
        const allUsers = await fetchAllUsers();

        const usersMap = allUsers.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        const creator = usersMap[huntData.creator];
        setHuntCreator(creator ? creator.username : "Okänd skapare");

        if (Array.isArray(huntData.invitedUsers)) {
          const huntInvitedUsers = huntData.invitedUsers.map(
            (userObj) => usersMap[userObj.id]
          );
          setInvitedUsers(huntInvitedUsers.filter(user => user !== undefined));
        } else {
          setInvitedUsers([]);
        }

        setHunt(huntData);
      } catch (error) {
        console.error("Error fetching hunt details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHuntAndUsers();
  }, [huntId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!hunt) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Kunde inte hämta jaktinformation.</Text>
      </View>
    );
  }

  const { places, huntImageUrl, name, time, description
  } = hunt;
  const { startPoint, markers, endPoint } = places;

  const latitudeDelta = 0.0922;
  const longitudeDelta = 0.0421;
  const latitudeMid =
    (startPoint.latitude + (endPoint?.latitude || startPoint.latitude)) / 2;
  const longitudeMid =
    (startPoint.longitude + (endPoint?.longitude || startPoint.longitude)) / 2;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: huntImageUrl }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>Beskrivning: {description}</Text>
          <Text style={styles.time}>Tid: {time} timmar</Text>
          <Text style={styles.creator}>Skapad av: {huntCreator}</Text>
          <Text style={styles.subtitle}>Deltagare:</Text>
          {invitedUsers.length > 0 ? (
            invitedUsers.map((user, index) => (
              <Text key={index} style={styles.user}>
                {user.username}
              </Text>
            ))
          ) : (
            <Text style={styles.user}>Inga deltagare</Text>
          )}
        </View>
      </View>
      <Text style={styles.subtitle}>Karta:</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitudeMid,
          longitude: longitudeMid,
          latitudeDelta: latitudeDelta * 1.5,
          longitudeDelta: longitudeDelta * 1.5,
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9bc39e",
    padding: 20,
  },
  contentContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#275829",
    marginBottom: 10,
  }, description: {
    fontSize: 18,
    color: "#275829",
    marginBottom: 10,
  },
  time: {
    fontSize: 18,
    color: "#43A047",
    marginBottom: 10,
  },
  creator: {
    fontSize: 16,
    color: "#853923",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#275829",
    marginVertical: 10,
  },
  user: {
    fontSize: 16,
    color: "#43A047",
    marginBottom: 5,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginTop: 15,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
  },
});

export default HuntDetails;


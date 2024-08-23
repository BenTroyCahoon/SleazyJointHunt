import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchActiveHunts, getUser, fetchAllUsers } from "../util/http";
import { useNavigation } from "@react-navigation/native";

const ActiveHunts = () => {
  const [hunts, setHunts] = useState([]);
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const loadHunts = async () => {
      try {
        setLoading(true);

        const username = await AsyncStorage.getItem("username");
        if (!username) throw new Error("Ingen användare inloggad");

        const user = await getUser(username);
        if (!user) throw new Error("Kunde inte hämta användare");

        setCurrentUser(user);

        const userid = await AsyncStorage.getItem("userid");
        console.log('activehunt: ', userid)

        const userHunts = await fetchActiveHunts(user.id);
        const filteredHunts = userHunts.map(hunt => {
          // console.log(`Original Invited Users for Hunt ID ${hunt.id}:`, hunt.invitedUsers);

          // Filtrera användare som inte är kompletta
          const incompleteUsers = hunt.invitedUsers.filter(user => {
           console.log(`Checking user with ID ${user.id}, completed: ${user.completed}`);
            return user.completed === false;
          });

          return { ...hunt, invitedUsers: incompleteUsers };
        }).filter(hunt => hunt.invitedUsers.length > 0);

        // console.log('Filtered Hunts List:', filteredHunts);

        setHunts(filteredHunts);

        const allUsers = await fetchAllUsers();
        const userMap = allUsers.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        setUsers(userMap);
      } catch (error) {
        console.error(
          "Fel vid inläsning av jakter eller användare:",
          error.message
        );
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHunts();
  }, []);

  const renderItem = ({ item }) => {
    const participantIds = [item.creator, ...(item.invitedUsers.map(user => user.id) || [])];
    const participantNames = participantIds.map((id) =>
      users[id] ? users[id].username : "Okänd"
    );
    const userIds = item.invitedUsers.map(user => user.id);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ConfirmHunt", { huntId: item.id, huntName: item.name, invitedUsers: userIds })}
        style={styles.card}
      >
        <View style={styles.itemContainer}>
          {item.huntImageUrl ? (
            <Image source={{ uri: item.huntImageUrl }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.huntName}>{item.name}</Text>
            <Text style={styles.huntTime}>Tid: {item.time}</Text>
            <Text style={styles.huntParticipants}>Deltagare: {participantNames.join(", ")}</Text>
            {participantIds.length === 1 && participantIds[0] === currentUser.id ? (
              <Text style={styles.soloMessage}>
                Kör solo! ensamfest är bäst fest
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Laddar...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Fel: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Aktiva Jakter</Text>
      <FlatList
        data={hunts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#9bc39e",
  },
  header: {
    fontSize: 30,
    marginBottom: 20,
    color: "#275829",
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fbfbfbff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#e0e0e0",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  huntName: {
    fontSize: 21,
    color: "#2C6B2F",
    fontWeight: "bold",
    paddingBottom: 5,
  },
  huntTime: {
    fontSize: 16,
    color: "#43A047",
  },
  huntParticipants: {
    fontSize: 16,
    color: "#853923",
  },
  soloMessage: {
    fontSize: 16,
    color: "#275829",
    fontStyle: "italic",
    marginTop: 10,
  },
});

export default ActiveHunts;

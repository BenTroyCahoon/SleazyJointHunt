import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPlannedHunts, getUser, fetchAllUsers } from "../util/http";

const PlannedHunts = ({ navigation }) => {
  const [hunts, setHunts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userMap, setUserMap] = useState({});
  const [userName, setUserName] = useState({});

  useEffect(() => {
    const loadHunts = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        console.log('username: ', username )
        const fetchedUser = await getUser(username);
        setUserId(fetchedUser.id);
        setUserName(username);

        const allUsers = await fetchAllUsers();
        const usersMap = allUsers.reduce((map, user) => {
          map[user.id] = user.username;
          return map;
        }, {});
        setUserMap(usersMap);

        const userHunts = await fetchPlannedHunts(fetchedUser.id);
        setHunts(userHunts);
      } catch (error) {
        console.error("Error loading hunts:", error);
      }
    };

    loadHunts();
  }, []);

  const handleHuntPress = (hunt) => {
    navigation.navigate("HuntDetails", { huntId: hunt.id });
    console.log('huntId som skickas till HD: ', hunt.id)
  };

  const renderItem = ({ item }) => {
    const creatorName = userMap[item.creator] || "Okänd skapare"; // Hämta creator namn från userMap

    return (
      <TouchableOpacity
        onPress={() => handleHuntPress(item)}
        style={styles.card}
      >
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.huntImageUrl }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.huntName}>{item.name}</Text>
            <Text style={styles.huntTime}>Tid: {item.time} timmar</Text>
            <Text style={styles.huntCreator}>Skapad av: {creatorName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Planerade hunts</Text>
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
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
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
  huntCreator: {
    fontSize: 16,
    color: "#853923",
  },
});

export default PlannedHunts;

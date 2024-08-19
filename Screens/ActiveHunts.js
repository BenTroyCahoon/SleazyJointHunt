import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchActiveHunts, getUser, getHuntById, getUserById} from "../util/http";

const ActiveHunts = () => {
  const [hunts, setHunts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadHunts = async () => {
      // try {
      //   const username = await AsyncStorage.getItem("username");

      //   const user = await getUser(username);
      //   setUserId(user.id);

      //   const userHunts = await fetchActiveHunts(user.id);
      //   setHunts(userHunts);
      // } catch (error) {
      //   console.error("Error loading hunts:", error);
      // }
      try {
        // Hämta användarnamn från AsyncStorage
        const username = await AsyncStorage.getItem("username");
        console.log("Fetched username från activeHunts:", username); // Kontrollera att username hämtas korrekt
        const user = await getUser(username)
        console.log('user ID from activeHunts: ', user.id)
        setUserId(user.id)

        const userHunts = await fetchActiveHunts(user.username)
        const huntsWithUsernames = await Promise.all(
          userHunts.map(async (hunt) => {
            const invitedUsers = Object.values(hunt.invitedUsers || []);
            // console.log('invited users ', invitedUsers)
            
            const invitedUsernames = await Promise.all(
              invitedUsers.map(async (userId) => {
                const user = await getUserById(userId);
                // console.log("Fetched User:", user); 
                return user.username;
              })
            );
            return { ...hunt, invitedUsernames };
          })
        );

        setHunts(huntsWithUsernames)

        console.log('User Hunts:', userHunts);
console.log('Hunts with Usernames:', huntsWithUsernames);

        // // Hämta användarens data baserat på användarnamn
        // const fetchedUser = await getUser(username);
        // console.log("Fetched user:", fetchedUser); // Kontrollera att user-objektet hämtas korrekt
        // setUserId(fetchedUser.id);

        // // Hämta planerade hunts för den inloggade användaren
        // const userHunts = await fetchActiveHunts(fetchedUser.id);
        // console.log("Fetched user hunts:", userHunts); // Kontrollera att hunts hämtas korrekt
        // setHunts(userHunts);
      } catch (error) {
        console.error("Error loading hunts:", error);
      }
    };

    loadHunts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
      <Text style={{ fontSize: 20 }}>{item.name}</Text>
      <Text style={{ fontSize: 16, color: "gray" }}>Tid: {item.time}</Text>
      <Text style={{ fontSize: 16, color: "gray" }}>Inbjudna spelare: </Text>
      { item.invitedUsernames && item.invitedUsernames.length > 0 ? (
        item.invitedPlayers.map((username, index) => (
      <Text key={index} style={{ fontSize: 16, color: "gray" }}>
        {username}
      </Text>
    ))
    ) : (
      <Text > inga inbjudna </Text>
    )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Active Hunts för {userId}</Text>
      <FlatList
        data={hunts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ActiveHunts;

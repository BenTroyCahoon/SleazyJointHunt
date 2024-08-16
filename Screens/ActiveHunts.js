// import React, { useState } from "react";
// import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";
// import { getUser } from "../util/http";

// const ActiveHunts = ({ navigation }) => {

//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>ActiveHunts är här!</Text>
//       </View>
//     );
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: "center",
//       paddingHorizontal: 20,
//     },
//     title: {
//       fontSize: 24,
//       marginBottom: 20,
//       textAlign: "center",
//     },
//   });

// export default ActiveHunts;

// screens/ActiveHunts.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserHunts, getUser } from "../util/http";

const ActiveHunts = () => {
  const [hunts, setHunts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadHunts = async () => {
      try {
        // Hämta användarnamn från AsyncStorage
        const username = await AsyncStorage.getItem("username");

        // Hämta användarinfo och ID från Firebase baserat på användarnamn
        const user = await getUser(username);
        setUserId(user.id);

        // Hämta alla hunts där användaren deltar
        const userHunts = await fetchUserHunts(user.id);
        console.log("userHunts", userHunts);
        setHunts(userHunts);
      } catch (error) {
        console.error("Error loading hunts:", error);
      }
    };

    loadHunts();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
    >
      <Text style={{ fontSize: 20 }}>{item.name}</Text>
      <Text style={{ fontSize: 16, color: "gray" }}>Tid: {item.time}</Text>
      <Text style={{ fontSize: 16, color: "gray" }}>
        Skapad av: {item.creator}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Active Hunts</Text>
      <FlatList
        data={hunts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ActiveHunts;

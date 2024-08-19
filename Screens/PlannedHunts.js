// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { fetchPlannedHunts, getUser } from "../util/http";

// const PlannedHunts = () => {
//   const [hunts, setHunts] = useState([]);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const loadHunts = async () => {
//       try {
//         const username = await AsyncStorage.getItem("username");

//         const user = await getUser(username);
//         setUserId(user.id);

//         const userHunts = await fetchPlannedHunts(user.id);
//         setHunts(userHunts);
//       } catch (error) {
//         console.error("Error loading hunts:", error);
//       }
//     };

//     loadHunts();
//   }, []);

//   const renderItem = ({ item }) => (
//     <View
//       style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
//     >
//       <Text style={{ fontSize: 20 }}>{item.name}</Text>
//       <Text style={{ fontSize: 16, color: "gray" }}>Tid: {item.time}</Text>
//       <Text style={{ fontSize: 16, color: "gray" }}>
//         Skapad av: {item.creator}
//       </Text>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Text style={{ fontSize: 30, marginBottom: 20 }}>Planerade Hunts</Text>
//       <FlatList
//         data={hunts}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//       />
//     </View>
//   );
// };

// export default PlannedHunts;

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPlannedHunts, getUser } from "../util/http";

const PlannedHunts = ({ navigation }) => {
  const [hunts, setHunts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadHunts = async () => {
      try {
        // Hämta användarnamn från AsyncStorage
        const username = await AsyncStorage.getItem("username");
        console.log("Fetched username:", username); // Kontrollera att username hämtas korrekt

        // Hämta användarens data baserat på användarnamn
        // const user = await getUser(username);
        // console.log("Fetched user:", user); // Kontrollera att user-objektet hämtas korrekt
        // setUserId(user.id);
        const fetchedUser = await getUser(username);
        // console.log("Fetched user:", fetchedUser);
        setUserId(fetchedUser.id);

        // Hämta planerade hunts för den inloggade användaren
        const userHunts = await fetchPlannedHunts(fetchedUser.id);
        // console.log("Fetched user hunts:", userHunts); // Kontrollera att hunts hämtas korrekt
        setHunts(userHunts);
      } catch (error) {
        console.error("Error loading hunts:", error);
      }
    };

    loadHunts();
  }, []);

  // Funktion för att hantera när en hunt trycks på
  const handleHuntPress = (hunt) => {
    // console.log("Navigating to HuntDetails with huntId:", hunt.id); // Kontrollera att rätt huntId skickas
    navigation.navigate("HuntDetails", { huntId: hunt.id });
  };

  // Renderingsfunktion för varje hunt i listan
  const renderItem = ({ item }) => {
    // console.log("Rendering hunt item:", item); // Kontrollera att varje item har korrekt data
    return (
      <TouchableOpacity onPress={() => handleHuntPress(item)}>
        <View
          style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 20 }}>{item.name}</Text>
          <Text style={{ fontSize: 16, color: "gray" }}>Tid: {item.time}</Text>
          <Text style={{ fontSize: 16, color: "gray" }}>
            Skapad av: {item.creator.username}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Planerade Hunts</Text>
      <FlatList
        data={hunts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default PlannedHunts;

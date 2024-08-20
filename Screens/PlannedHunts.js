// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { fetchPlannedHunts, getUser } from "../util/http";

// const PlannedHunts = ({ navigation }) => {
//   const [hunts, setHunts] = useState([]);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const loadHunts = async () => {
//       try {
//         // Hämta användarnamn från AsyncStorage
//         const username = await AsyncStorage.getItem("username");
//         console.log("Fetched username:", username); // Kontrollera att username hämtas korrekt

//         // Hämta användarens data baserat på användarnamn
//         const user = await getUser(username);
//         console.log("Fetched user:", user); // Kontrollera att user-objektet hämtas korrekt
//         setUserId(user.id);

//         // Hämta planerade hunts för den inloggade användaren
//         const userHunts = await fetchPlannedHunts(user.id);
//         console.log("Fetched user hunts:", userHunts); // Kontrollera att hunts hämtas korrekt
//         setHunts(userHunts);
//       } catch (error) {
//         console.error("Error loading hunts:", error);
//       }
//     };

//     loadHunts();
//   }, []);

//   // Funktion för att hantera när en hunt trycks på
//   const handleHuntPress = (hunt) => {
//     console.log("Navigating to HuntDetails with huntId:", hunt.id); // Kontrollera att rätt huntId skickas
//     navigation.navigate("HuntDetails", { huntId: hunt.id });
//   };

//   // Renderingsfunktion för varje hunt i listan
//   const renderItem = ({ item }) => {
//     console.log("Rendering hunt item:", item); // Kontrollera att varje item har korrekt data
//     return (
//       <TouchableOpacity onPress={() => handleHuntPress(item)}>
//         <View
//           style={{
//             padding: 20,
//             borderBottomWidth: 1,
//             borderBottomColor: "#ccc",
//           }}
//         >
//           <Text style={{ fontSize: 20 }}>{item.name}</Text>
//           <Text style={{ fontSize: 16, color: "gray" }}>Tid: {item.time}</Text>
//           <Text style={{ fontSize: 16, color: "gray" }}>
//             Skapad av: {item.creator}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Text style={{ fontSize: 30, marginBottom: 20 }}>Planerade Hunts</Text>
//       <FlatList
//         data={hunts}
//         keyExtractor={(item) => item.creator}
//         renderItem={renderItem}
//       />
//     </View>
//   );
// };

// export default PlannedHunts;

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPlannedHunts, getUser, fetchAllUsers } from "../util/http";

const PlannedHunts = ({ navigation }) => {
  const [hunts, setHunts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userMap, setUserMap] = useState({}); // För att lagra användardata för creators

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

        // Hämta alla användare för att kunna mappa creator ID till namn
        const allUsers = await fetchAllUsers();
        const usersMap = allUsers.reduce((map, user) => {
          map[user.id] = user.username; // Mappa användarens ID till användarnamn
          return map;
        }, {});
        setUserMap(usersMap);

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
    const creatorName = userMap[item.creator] || "Okänd skapare"; // Hämta creator namn från userMap

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
            Skapad av: {creatorName} {/* Visa creator namn istället för ID */}
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
        keyExtractor={(item) => item.id.toString()} // Använd item.id som unik nyckel
        renderItem={renderItem}
      />
    </View>
  );
};

export default PlannedHunts;

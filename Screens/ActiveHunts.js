// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { fetchActiveHunts, getUser } from "../util/http";

// const ActiveHunts = () => {
//   const [hunts, setHunts] = useState([]);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const loadHunts = async () => {
//       try {
//         const username = await AsyncStorage.getItem("username");

//         const user = await getUser(username);
//         setUserId(user.id);

//         const userHunts = await fetchActiveHunts(user.id);
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
//       <Text style={{ fontSize: 30, marginBottom: 20 }}>
//         Active Hunts fast fel
//       </Text>
//       <FlatList
//         data={hunts}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//       />
//     </View>
//   );
// };

// export default ActiveHunts;

import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchActiveHunts,
  getUser,
  getUserById,
  fetchAllUsers,
} from "../util/http";

const ActiveHunts = () => {
  const [hunts, setHunts] = useState([]);
  const [users, setUsers] = useState({}); // State för att lagra användardata
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Lägg till en loader state
  const [error, setError] = useState(null); // Lägg till en error state

  useEffect(() => {
    const loadHunts = async () => {
      try {
        setLoading(true); // Sätt loading till true innan vi börjar hämta data

        const username = await AsyncStorage.getItem("username");
        if (!username) throw new Error("Ingen användare inloggad");

        // Hämta användaren baserat på användarnamn
        const user = await getUser(username);
        if (!user) throw new Error("Kunde inte hämta användare");

        setCurrentUser(user); // Spara den inloggade användaren

        // Hämta aktiva jakter för den inloggade användaren
        const userHunts = await fetchActiveHunts(user.id);
        setHunts(userHunts);

        // Hämta alla användare
        const allUsers = await fetchAllUsers();
        const userMap = allUsers.reduce((acc, user) => {
          acc[user.id] = user; // Mappar användar-ID till användardata
          return acc;
        }, {});

        setUsers(userMap);
      } catch (error) {
        console.error(
          "Fel vid inläsning av jakter eller användare:",
          error.message
        );
        setError(error.message); // Sätt felmeddelande
      } finally {
        setLoading(false); // Sätt loading till false efter att datan har hämtats
      }
    };

    loadHunts();
  }, []);

  const renderItem = ({ item }) => {
    // Hämta deltagare, inklusive skaparen
    const participantIds = [item.creator, ...(item.invitedUsers || [])];

    // Hämta deltagarnas namn
    const participantNames = participantIds.map((id) =>
      users[id] ? users[id].username : "Okänd"
    );

    return (
      <View
        style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
      >
        <Text style={{ fontSize: 20 }}>{item.name}</Text>
        <Text style={{ fontSize: 16, color: "gray" }}>Tid: {item.time}</Text>
        <Text style={{ fontSize: 16, color: "gray" }}>
          Deltagare: {participantNames.join(", ")}
        </Text>
        {participantIds.length === 1 && participantIds[0] === currentUser.id ? (
          <Text style={{ fontSize: 16, color: "gray" }}>
            Kör solo! ensamfest är bäst fest
          </Text>
        ) : null}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Laddar...</Text>
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
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Aktiva Jakter</Text>
      <FlatList
        data={hunts}
        keyExtractor={(item) => item.id.toString()} // Använd huntens ID som nyckel
        renderItem={renderItem}
      />
    </View>
  );
};

export default ActiveHunts;

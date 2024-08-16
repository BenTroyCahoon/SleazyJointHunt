import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { fetchAllUsers, storeHunt } from "../util/http";

const InvitePlayers = ({ navigation, route }) => {
  // Hämta huntName, huntTime och huntImage från navigationsrutan
  const { huntName, estimatedTime, iconUri } = route.params;

  const [users, setUsers] = useState([]); // Håller reda på användardata
  const [selectedUsers, setSelectedUsers] = useState({}); // Håller reda på valda användare

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await fetchAllUsers();
      if (usersData) {
        // Filtrera bort användare utan username och se till att varje användare har ett unikt ID
        const filteredUsers = usersData.filter((user) => user.username); // Filtrera bort användare utan användarnamn

        setUsers(filteredUsers);
      } else {
        console.log("No users found");
      }
    };

    fetchUsers();
  }, []);

  const toggleSelection = (username) => {
    setSelectedUsers((prevState) => ({
      ...prevState,
      [username]: !prevState[username],
    }));
  };

  const handleInvite = async () => {
    const invitedUsers = Object.keys(selectedUsers).filter(
      (username) => selectedUsers[username]
    );

    // Bygg huntData från parametrarna och de valda användarna
    const huntData = {
      name: huntName, // Namnet på jakten
      time: estimatedTime, // Estimerad tid för jakten
      invitedUsers: invitedUsers, // Lista över inbjudna användare
    };

    try {
      // Skicka huntData och huntImage till backend för att spara
      await storeHunt(huntData, iconUri);
      console.log("Hunt created and saved successfully!");
      // Navigera användaren till en annan sida om du vill, t.ex. hem
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to create and save hunt:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 35, marginBottom: 20 }}>Invite Players</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <CheckBox
              checked={!!selectedUsers[item.username]} // Ändra till item.username
              onPress={() => toggleSelection(item.username)} // Ändra till item.username
            />
            <Text style={{ fontSize: 22 }}>{item.username}</Text>
          </View>
        )}
      />
      <TouchableOpacity onPress={handleInvite} style={{ marginTop: 20 }}>
        <View style={{ backgroundColor: "blue", padding: 15, borderRadius: 5 }}>
          <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
            Invite Selected Users
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default InvitePlayers;

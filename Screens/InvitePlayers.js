import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchAllUsers, getUser, storeHunt } from "../util/http";

const InvitePlayers = ({ navigation, route }) => {
  const {
    huntName,
    estimatedTime,
    iconUri,
    description,
    startPoint,
    endPoint,
    markers,
  } = route.params;

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await fetchAllUsers();
      if (usersData) {
        const filteredUsers = usersData.filter((user) => user.username);
        setUsers(filteredUsers);
      } else {
        console.log("No users found");
      }
    };

    fetchUsers();
  }, []);

  const toggleSelection = (userId) => {
    setSelectedUsers((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  const handleInvite = async () => {
    const allUsers = await fetchAllUsers();
    const usersID = allUsers.map((user) => user.id);

    const username = await AsyncStorage.getItem("username");
    const user = await getUser(username);
    const ID = user.id;

    const sendInviteTo = Object.keys(selectedUsers);

    const huntData = {
      creator: ID,
      name: huntName,
      description: description,
      time: estimatedTime,
      invitedUsers: sendInviteTo.map((userid) => ({ id: userid, completed: false })),
      places: { startPoint, endPoint, markers },
    };
    try {
      await storeHunt(huntData, iconUri);
      console.log("Hunt created and saved successfully!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to create and save hunt:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bjud in spelare</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <CheckBox
              checked={!!selectedUsers[item.id]}
              onPress={() => toggleSelection(item.id)}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
              style={styles.checkbox}
            />
            <Text style={styles.username}>{item.username}</Text>
          </View>
        )}
      />
      <TouchableOpacity onPress={handleInvite} style={styles.inviteButton}>
        <View style={styles.inviteButtonContent}>
          <Text style={styles.inviteButtonText}>Skapa Hunt</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#9bc39e",
  },
  title: {
    fontSize: 35,
    marginBottom: 20,
    color: "#275829",
    fontWeight: "bold",
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  // checkbox: {
  //   marginRight: 10,
  // },
  checkboxContainer: {
    marginRight: 10,
    padding: 0,
  },
  checkboxText: {
    color: "#275829",
  },

  username: {
    fontSize: 22,
    color: "#275829",
  },
  inviteButton: {
    marginTop: 20,
    backgroundColor: "#2C6B2F",
    borderRadius: 8,
    overflow: "hidden",
  },
  inviteButtonContent: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  inviteButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default InvitePlayers;
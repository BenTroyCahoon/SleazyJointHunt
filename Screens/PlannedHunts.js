
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPlannedHunts, getUser } from "../util/http";

const PlannedHunts = () => {
  const [hunts, setHunts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadHunts = async () => {
      try {
        const username = await AsyncStorage.getItem("username");

        const user = await getUser(username);
        setUserId(user.id);

        const userHunts = await fetchPlannedHunts(user.id);
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

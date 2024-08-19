import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getHuntById } from "../util/http";

const HuntDetails = ({ route }) => {
  const { huntId } = route.params;
  const [hunt, setHunt] = useState(null);

  useEffect(() => {
    const loadHuntDetails = async () => {
      try {
        const huntData = await getHuntById(huntId);
        setHunt(huntData);
      } catch (error) {
        console.error("Error loading hunt details:", error);
      }
    };

    loadHuntDetails();
  }, [huntId]);

  if (!hunt) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 30 }}>{hunt.name}</Text>
      <Text style={{ fontSize: 20, marginVertical: 10 }}>Tid: {hunt.time}</Text>
      <Text style={{ fontSize: 20, marginVertical: 10 }}>
        Skapad av: {hunt.creator}
      </Text>
      <Text style={{ fontSize: 18, marginVertical: 10 }}>Deltagare:</Text>
      {hunt.invitedUsers.map((user, index) => (
        <Text key={index} style={{ fontSize: 16, color: "gray" }}>
          {user}
        </Text>
      ))}
    </View>
  );
};

export default HuntDetails;
